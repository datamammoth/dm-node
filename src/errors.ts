/**
 * Error classes for the DataMammoth SDK.
 *
 * Each error maps to an API v2 error code and carries the HTTP status,
 * machine-readable code, and optional field-level validation errors.
 */

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    request_id?: string;
    field_errors?: FieldError[];
  };
}

// ── Base error ──────────────────────────────────────────────────

export class DataMammothError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DataMammothError';
  }
}

// ── API error (server returned an error response) ───────────────

export class ApiError extends DataMammothError {
  public readonly status: number;
  public readonly code: string;
  public readonly requestId: string | undefined;
  public readonly fieldErrors: FieldError[];
  public readonly headers: Headers;

  constructor(
    status: number,
    body: ApiErrorBody,
    headers: Headers,
  ) {
    const msg = body?.error?.message ?? `API error ${status}`;
    super(msg);
    this.name = 'ApiError';
    this.status = status;
    this.code = body?.error?.code ?? 'UNKNOWN';
    this.requestId = body?.error?.request_id;
    this.fieldErrors = body?.error?.field_errors ?? [];
    this.headers = headers;
  }
}

// ── Specific error subclasses ───────────────────────────────────

export class AuthenticationError extends ApiError {
  constructor(body: ApiErrorBody, headers: Headers) {
    super(401, body, headers);
    this.name = 'AuthenticationError';
  }
}

export class PermissionError extends ApiError {
  constructor(body: ApiErrorBody, headers: Headers) {
    super(403, body, headers);
    this.name = 'PermissionError';
  }
}

export class NotFoundError extends ApiError {
  constructor(body: ApiErrorBody, headers: Headers) {
    super(404, body, headers);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends ApiError {
  constructor(body: ApiErrorBody, headers: Headers) {
    super(422, body, headers);
    this.name = 'ValidationError';
  }
}

export class ConflictError extends ApiError {
  constructor(body: ApiErrorBody, headers: Headers) {
    super(409, body, headers);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends ApiError {
  public readonly retryAfter: number;

  constructor(body: ApiErrorBody, headers: Headers) {
    super(429, body, headers);
    this.name = 'RateLimitError';
    this.retryAfter = parseInt(headers.get('retry-after') ?? '1', 10);
  }
}

export class InternalServerError extends ApiError {
  constructor(body: ApiErrorBody, headers: Headers) {
    super(500, body, headers);
    this.name = 'InternalServerError';
  }
}

export class UpstreamError extends ApiError {
  constructor(status: number, body: ApiErrorBody, headers: Headers) {
    super(status, body, headers);
    this.name = 'UpstreamError';
  }
}

// ── Network / timeout errors ────────────────────────────────────

export class TimeoutError extends DataMammothError {
  constructor(timeoutMs: number) {
    super(`Request timed out after ${timeoutMs}ms`);
    this.name = 'TimeoutError';
  }
}

export class ConnectionError extends DataMammothError {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'ConnectionError';
  }
}

// ── Factory: create the right error from an HTTP response ───────

export function createApiError(status: number, body: ApiErrorBody, headers: Headers): ApiError {
  const code = body?.error?.code ?? '';

  switch (status) {
    case 401:
      return new AuthenticationError(body, headers);
    case 403:
      return new PermissionError(body, headers);
    case 404:
      return new NotFoundError(body, headers);
    case 409:
      return new ConflictError(body, headers);
    case 422:
      return new ValidationError(body, headers);
    case 429:
      return new RateLimitError(body, headers);
    case 500:
      return new InternalServerError(body, headers);
    default:
      if (code === 'UPSTREAM_ERROR') {
        return new UpstreamError(status, body, headers);
      }
      return new ApiError(status, body, headers);
  }
}
