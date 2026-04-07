import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpClient } from '../client.js';
import {
  ApiError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  ValidationError,
  TimeoutError,
} from '../errors.js';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function jsonResponse(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: new Headers(headers),
    json: () => Promise.resolve(data),
  } as Response);
}

describe('HttpClient', () => {
  let client: HttpClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new HttpClient({
      apiKey: 'dm_test_key_123',
      baseUrl: 'https://api.test.com/api/v2',
      maxRetries: 0,
    });
  });

  it('throws if apiKey is empty', () => {
    expect(() => new HttpClient({ apiKey: '' })).toThrow('apiKey is required');
  });

  it('sends GET with auth header', async () => {
    mockFetch.mockReturnValue(jsonResponse({ data: { id: '1' } }));

    const result = await client.get('/servers/1');

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.test.com/api/v2/servers/1');
    expect(opts.method).toBe('GET');
    expect(opts.headers.Authorization).toBe('Bearer dm_test_key_123');
    expect(opts.headers.Accept).toBe('application/json');
    expect(result).toEqual({ data: { id: '1' } });
  });

  it('sends POST with JSON body', async () => {
    mockFetch.mockReturnValue(jsonResponse({ id: 'task_1' }, 202));

    await client.post('/servers', { product_id: 'prod_1', image_id: 'img_1' });

    const [, opts] = mockFetch.mock.calls[0];
    expect(opts.method).toBe('POST');
    expect(opts.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(opts.body)).toEqual({ product_id: 'prod_1', image_id: 'img_1' });
  });

  it('appends query parameters', async () => {
    mockFetch.mockReturnValue(jsonResponse({ data: [] }));

    await client.get('/servers', { page: 2, per_page: 10, 'filter[status]': 'active' });

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain('page=2');
    expect(url).toContain('per_page=10');
    expect(url).toContain('filter%5Bstatus%5D=active');
  });

  it('skips undefined/null query params', async () => {
    mockFetch.mockReturnValue(jsonResponse({ data: [] }));

    await client.get('/servers', { page: 1, status: undefined, region: null });

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain('page=1');
    expect(url).not.toContain('status');
    expect(url).not.toContain('region');
  });

  it('unwraps data from response envelope via getData', async () => {
    mockFetch.mockReturnValue(jsonResponse({ data: { id: 's1', hostname: 'web-01' } }));

    const server = await client.getData<{ id: string; hostname: string }>('/servers/s1');

    expect(server).toEqual({ id: 's1', hostname: 'web-01' });
  });

  it('throws AuthenticationError on 401', async () => {
    mockFetch.mockReturnValue(
      jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Invalid API key' } }, 401),
    );

    await expect(client.get('/me')).rejects.toThrow(AuthenticationError);
  });

  it('throws NotFoundError on 404', async () => {
    mockFetch.mockReturnValue(
      jsonResponse({ error: { code: 'NOT_FOUND', message: 'Server not found' } }, 404),
    );

    await expect(client.get('/servers/999')).rejects.toThrow(NotFoundError);
  });

  it('throws ValidationError on 422', async () => {
    mockFetch.mockReturnValue(
      jsonResponse(
        {
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Validation failed',
            field_errors: [{ field: 'hostname', message: 'too long' }],
          },
        },
        422,
      ),
    );

    try {
      await client.patch('/servers/1', { hostname: 'x'.repeat(300) });
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).fieldErrors).toHaveLength(1);
      expect((err as ValidationError).fieldErrors[0].field).toBe('hostname');
    }
  });

  it('throws RateLimitError on 429 with retryAfter', async () => {
    mockFetch.mockReturnValue(
      jsonResponse(
        { error: { code: 'RATE_LIMIT', message: 'Too many requests' } },
        429,
        { 'retry-after': '5' },
      ),
    );

    try {
      await client.get('/servers');
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(RateLimitError);
      expect((err as RateLimitError).retryAfter).toBe(5);
    }
  });

  it('throws ApiError on generic 4xx', async () => {
    mockFetch.mockReturnValue(
      jsonResponse({ error: { code: 'ACTION_NOT_ALLOWED', message: 'Nope' } }, 403),
    );

    await expect(client.post('/servers/1/actions/power-on')).rejects.toThrow(ApiError);
  });
});

describe('HttpClient retry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retries on 5xx', async () => {
    const retryClient = new HttpClient({
      apiKey: 'dm_test',
      baseUrl: 'https://api.test.com/api/v2',
      maxRetries: 2,
    });

    mockFetch
      .mockReturnValueOnce(
        jsonResponse({ error: { code: 'INTERNAL_ERROR', message: 'oops' } }, 500),
      )
      .mockReturnValueOnce(
        jsonResponse({ error: { code: 'INTERNAL_ERROR', message: 'oops' } }, 500),
      )
      .mockReturnValueOnce(jsonResponse({ data: 'ok' }));

    const result = await retryClient.get('/health');
    expect(result).toEqual({ data: 'ok' });
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });
});
