import { describe, it, expect } from 'vitest';
import {
  createApiError,
  AuthenticationError,
  PermissionError,
  NotFoundError,
  ConflictError,
  ValidationError,
  RateLimitError,
  InternalServerError,
  UpstreamError,
  ApiError,
} from '../errors.js';

function makeBody(code: string, message: string) {
  return { error: { code, message } };
}

describe('createApiError', () => {
  const headers = new Headers();

  it('returns AuthenticationError for 401', () => {
    const err = createApiError(401, makeBody('UNAUTHORIZED', 'Bad key'), headers);
    expect(err).toBeInstanceOf(AuthenticationError);
    expect(err.status).toBe(401);
    expect(err.code).toBe('UNAUTHORIZED');
  });

  it('returns PermissionError for 403', () => {
    const err = createApiError(403, makeBody('FORBIDDEN', 'No access'), headers);
    expect(err).toBeInstanceOf(PermissionError);
    expect(err.status).toBe(403);
  });

  it('returns NotFoundError for 404', () => {
    const err = createApiError(404, makeBody('NOT_FOUND', 'Not found'), headers);
    expect(err).toBeInstanceOf(NotFoundError);
  });

  it('returns ConflictError for 409', () => {
    const err = createApiError(409, makeBody('CONFLICT', 'Exists'), headers);
    expect(err).toBeInstanceOf(ConflictError);
  });

  it('returns ValidationError for 422', () => {
    const err = createApiError(422, makeBody('VALIDATION_FAILED', 'Bad input'), headers);
    expect(err).toBeInstanceOf(ValidationError);
  });

  it('returns RateLimitError for 429', () => {
    const h = new Headers({ 'retry-after': '10' });
    const err = createApiError(429, makeBody('RATE_LIMIT', 'Slow down'), h);
    expect(err).toBeInstanceOf(RateLimitError);
    expect((err as RateLimitError).retryAfter).toBe(10);
  });

  it('returns InternalServerError for 500', () => {
    const err = createApiError(500, makeBody('INTERNAL_ERROR', 'Oops'), headers);
    expect(err).toBeInstanceOf(InternalServerError);
  });

  it('returns UpstreamError when code is UPSTREAM_ERROR', () => {
    const err = createApiError(502, makeBody('UPSTREAM_ERROR', 'Provider down'), headers);
    expect(err).toBeInstanceOf(UpstreamError);
  });

  it('returns generic ApiError for unknown status', () => {
    const err = createApiError(418, makeBody('TEAPOT', 'I am a teapot'), headers);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(418);
  });

  it('preserves request_id and field_errors', () => {
    const body = {
      error: {
        code: 'VALIDATION_FAILED',
        message: 'Bad',
        request_id: 'req_123',
        field_errors: [{ field: 'email', message: 'invalid' }],
      },
    };
    const err = createApiError(422, body, headers);
    expect(err.requestId).toBe('req_123');
    expect(err.fieldErrors).toEqual([{ field: 'email', message: 'invalid' }]);
  });
});
