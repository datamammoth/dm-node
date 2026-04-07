/**
 * DataMammoth Node.js / TypeScript SDK
 *
 * Official client for the DataMammoth API v2.
 * Requires Node.js 18+ (uses native fetch).
 *
 * @example
 * ```ts
 * import { DataMammoth } from '@datamammoth/sdk';
 *
 * const dm = new DataMammoth({ apiKey: 'dm_your_key_here' });
 *
 * const servers = await dm.servers.list({ status: 'active' });
 * for (const server of servers.data) {
 *   console.log(`${server.hostname} - ${server.ip_address}`);
 * }
 * ```
 *
 * @packageDocumentation
 */

import { HttpClient, type HttpClientOptions } from './client.js';
import type { HealthResponse } from './types/common.js';

// API modules
import { ServersAPI } from './api/servers.js';
import { ProductsAPI } from './api/products.js';
import { BillingAPI } from './api/billing.js';
import { SupportAPI } from './api/support.js';
import { AccountAPI } from './api/account.js';
import { AdminAPI } from './api/admin.js';
import { AffiliateAPI } from './api/affiliate.js';
import { WebhooksAPI } from './api/webhooks.js';
import { TasksAPI } from './api/tasks.js';
import { ZonesAPI } from './api/zones.js';

// ── Constructor options ─────────────────────────────────────────

export interface DataMammothOptions {
  /** API key (required). Starts with `dm_`. */
  apiKey: string;
  /** Base URL override (default: https://data-mammoth.com/api/v2). */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 30000). */
  timeout?: number;
  /** Maximum number of automatic retries for 429/5xx (default: 3). */
  maxRetries?: number;
  /** Additional headers to send with every request. */
  headers?: Record<string, string>;
}

// ── Main SDK class ──────────────────────────────────────────────

export class DataMammoth {
  readonly #client: HttpClient;

  /** Server management — CRUD, power actions, snapshots, metrics, firewall. */
  readonly servers: ServersAPI;
  /** Product catalog — list, options, addons, pricing, categories. */
  readonly products: ProductsAPI;
  /** Billing — invoices, subscriptions, balance, orders, payment methods. */
  readonly billing: BillingAPI;
  /** Support — tickets, replies, departments, knowledge base. */
  readonly support: SupportAPI;
  /** Account — profile, API keys, sessions, 2FA, notifications. */
  readonly account: AccountAPI;
  /** Admin — users, roles, tenants, leads, audit log, dashboard. */
  readonly admin: AdminAPI;
  /** Affiliate — commissions, referrals, payouts, materials. */
  readonly affiliate: AffiliateAPI;
  /** Webhooks — subscriptions, deliveries, test, event types. */
  readonly webhooks: WebhooksAPI;
  /** Tasks — async task tracking and polling. */
  readonly tasks: TasksAPI;
  /** Zones — hosting zones and OS images. */
  readonly zones: ZonesAPI;

  constructor(options: DataMammothOptions) {
    const clientOptions: HttpClientOptions = {
      apiKey: options.apiKey,
      baseUrl: options.baseUrl,
      timeout: options.timeout,
      maxRetries: options.maxRetries,
      headers: options.headers,
    };

    this.#client = new HttpClient(clientOptions);

    this.servers = new ServersAPI(this.#client);
    this.products = new ProductsAPI(this.#client);
    this.billing = new BillingAPI(this.#client);
    this.support = new SupportAPI(this.#client);
    this.account = new AccountAPI(this.#client);
    this.admin = new AdminAPI(this.#client);
    this.affiliate = new AffiliateAPI(this.#client);
    this.webhooks = new WebhooksAPI(this.#client);
    this.tasks = new TasksAPI(this.#client);
    this.zones = new ZonesAPI(this.#client);
  }

  /** Health check — returns service status (no auth required on server side). */
  async health(): Promise<HealthResponse> {
    return this.#client.getData<HealthResponse>('/health');
  }
}

// ── Re-exports ──────────────────────────────────────────────────

// Main class
export { DataMammoth as default };

// HTTP client (for advanced usage)
export { HttpClient, type HttpClientOptions } from './client.js';

// Pagination helpers
export { paginate, collectAll, type PaginateOptions } from './pagination.js';

// All errors
export {
  DataMammothError,
  ApiError,
  AuthenticationError,
  PermissionError,
  NotFoundError,
  ValidationError,
  ConflictError,
  RateLimitError,
  InternalServerError,
  UpstreamError,
  TimeoutError,
  ConnectionError,
  type ApiErrorBody,
  type FieldError,
} from './errors.js';

// All types
export * from './types/index.js';

// API classes (for typing / extension)
export { ServersAPI } from './api/servers.js';
export { ProductsAPI } from './api/products.js';
export { BillingAPI } from './api/billing.js';
export { SupportAPI } from './api/support.js';
export { AccountAPI } from './api/account.js';
export { AdminAPI } from './api/admin.js';
export { AffiliateAPI } from './api/affiliate.js';
export { WebhooksAPI } from './api/webhooks.js';
export { TasksAPI, type ListTasksOptions } from './api/tasks.js';
export { ZonesAPI, type ListZonesOptions } from './api/zones.js';
