/**
 * Base HTTP client with authentication, retry, rate-limit handling, and timeout.
 *
 * Uses native `fetch` (Node 18+). No external dependencies.
 */

import {
  createApiError,
  RateLimitError,
  TimeoutError,
  ConnectionError,
  type ApiErrorBody,
} from './errors.js';
import type { PaginatedResponse, V2Response } from './types/common.js';

// ── Options ─────────────────────────────────────────────────────

export interface HttpClientOptions {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
  headers?: Record<string, string>;
}

// ── Query params helper ─────────────────────────────────────────

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

function buildQuery(params?: QueryParams): string {
  if (!params) return '';
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  return entries.length > 0 ? `?${entries.join('&')}` : '';
}

// ── HTTP Client ─────────────────────────────────────────────────

export class HttpClient {
  readonly #apiKey: string;
  readonly #baseUrl: string;
  readonly #timeout: number;
  readonly #maxRetries: number;
  readonly #headers: Record<string, string>;

  constructor(options: HttpClientOptions) {
    if (!options.apiKey) {
      throw new Error('apiKey is required');
    }
    this.#apiKey = options.apiKey;
    this.#baseUrl = (options.baseUrl ?? 'https://data-mammoth.com/api/v2').replace(/\/+$/, '');
    this.#timeout = options.timeout ?? 30_000;
    this.#maxRetries = options.maxRetries ?? 3;
    this.#headers = options.headers ?? {};
  }

  // ── Public API ──────────────────────────────────────────────

  async get<T>(path: string, query?: QueryParams): Promise<T> {
    return this.#request<T>('GET', path, query);
  }

  async post<T>(path: string, body?: unknown, query?: QueryParams): Promise<T> {
    return this.#request<T>('POST', path, query, body);
  }

  async patch<T>(path: string, body?: unknown, query?: QueryParams): Promise<T> {
    return this.#request<T>('PATCH', path, query, body);
  }

  async put<T>(path: string, body?: unknown, query?: QueryParams): Promise<T> {
    return this.#request<T>('PUT', path, query, body);
  }

  async delete<T>(path: string, query?: QueryParams): Promise<T> {
    return this.#request<T>('DELETE', path, query);
  }

  // Convenience: GET that expects a paginated envelope
  async getPaginated<T>(path: string, query?: QueryParams): Promise<PaginatedResponse<T>> {
    return this.#request<PaginatedResponse<T>>('GET', path, query);
  }

  // Convenience: GET that expects a { data } envelope, returns data
  async getData<T>(path: string, query?: QueryParams): Promise<T> {
    const res = await this.#request<V2Response<T>>('GET', path, query);
    return res.data;
  }

  // ── Internal ────────────────────────────────────────────────

  async #request<T>(
    method: string,
    path: string,
    query?: QueryParams,
    body?: unknown,
  ): Promise<T> {
    const url = `${this.#baseUrl}${path}${buildQuery(query)}`;

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.#apiKey}`,
      'Accept': 'application/json',
      'User-Agent': '@datamammoth/sdk/0.1.0 node',
      ...this.#headers,
    };

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.#maxRetries; attempt++) {
      // Exponential backoff on retries
      if (attempt > 0) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 30_000);
        await sleep(delay);
      }

      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.#timeout);

        let response: Response;
        try {
          response = await fetch(url, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timer);
        }

        // 2xx — success
        if (response.ok) {
          // 204 No Content
          if (response.status === 204) {
            return undefined as T;
          }
          const json = await response.json();
          return json as T;
        }

        // Parse error body
        let errorBody: ApiErrorBody;
        try {
          errorBody = await response.json() as ApiErrorBody;
        } catch {
          errorBody = {
            error: {
              code: 'UNKNOWN',
              message: `HTTP ${response.status} ${response.statusText}`,
            },
          };
        }

        // 429 Rate Limited — retry with backoff
        if (response.status === 429) {
          const rateLimitError = new RateLimitError(errorBody, response.headers);
          if (attempt < this.#maxRetries) {
            const retryDelay = rateLimitError.retryAfter * 1000;
            await sleep(retryDelay);
            lastError = rateLimitError;
            continue;
          }
          throw rateLimitError;
        }

        // 5xx — retry
        if (response.status >= 500 && attempt < this.#maxRetries) {
          lastError = createApiError(response.status, errorBody, response.headers);
          continue;
        }

        // 4xx (except 429) — do not retry
        throw createApiError(response.status, errorBody, response.headers);
      } catch (err) {
        if (
          err instanceof RateLimitError ||
          err instanceof TimeoutError ||
          err instanceof ConnectionError
        ) {
          throw err;
        }

        // Already an ApiError — re-throw
        if (err && typeof err === 'object' && 'status' in err) {
          throw err;
        }

        // AbortError = timeout
        if (err instanceof DOMException && err.name === 'AbortError') {
          throw new TimeoutError(this.#timeout);
        }

        // Network errors — retry
        if (err instanceof TypeError && attempt < this.#maxRetries) {
          lastError = new ConnectionError(
            (err as TypeError).message,
            err as Error,
          );
          continue;
        }

        if (err instanceof TypeError) {
          throw new ConnectionError(
            (err as TypeError).message,
            err as Error,
          );
        }

        throw err;
      }
    }

    // Should not reach here, but just in case
    throw lastError ?? new Error('Request failed after retries');
  }
}

// ── Helpers ─────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
