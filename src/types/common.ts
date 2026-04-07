import type { HealthStatus, CheckStatus, TaskStatus, TaskType } from './enums.js';

// ── Standard API response envelope ──────────────────────────────

export interface V2Response<T> {
  data: T;
  meta?: V2Meta;
  _links?: Record<string, string>;
}

export interface V2Meta {
  request_id?: string;
  rate_limit?: RateLimitInfo;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

// ── Pagination ──────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  _links?: PaginationLinks;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  request_id?: string;
  rate_limit?: RateLimitInfo;
}

export interface PaginationLinks {
  self?: string;
  first?: string;
  last?: string;
  prev?: string | null;
  next?: string | null;
  [key: string]: string | null | undefined;
}

// ── List options (shared query parameters) ──────────────────────

export interface ListOptions {
  page?: number;
  per_page?: number;
  sort?: string;
  search?: string;
}

// ── Task ────────────────────────────────────────────────────────

export interface Task {
  id: string;
  type: TaskType;
  status: TaskStatus;
  resource_id: string | null;
  resource_type: string | null;
  progress: number | null;
  result: Record<string, unknown> | null;
  error: string | null;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  completed_at: string | null;
  _links?: Record<string, string>;
}

// ── Zone ────────────────────────────────────────────────────────

export interface Zone {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  country: string;
  city: string | null;
  continent: string;
  flag_emoji: string | null;
  sort_order: number;
  latency_endpoint: string | null;
  /** Only visible to root admins */
  provider_slug?: string;
  /** Only visible to root admins */
  provider_region?: string;
  _links?: Record<string, string>;
}

// ── Image (OS) ──────────────────────────────────────────────────

export interface Image {
  id: string;
  name: string;
  slug: string;
  os_family: string;
  version: string | null;
  is_default: boolean;
}

// ── Health ──────────────────────────────────────────────────────

export interface HealthResponse {
  status: HealthStatus;
  version: string;
  uptime: number;
  checks: {
    database: HealthCheck;
    redis: HealthCheck;
  };
}

export interface HealthCheck {
  status: CheckStatus;
  latency_ms: number;
}

// ── Action result ───────────────────────────────────────────────

export interface ActionResult {
  action: string;
  server_id: string;
  status: string;
  message: string;
}

// ── Delete result ───────────────────────────────────────────────

export interface DeleteResult {
  deleted: boolean;
  [key: string]: unknown;
}
