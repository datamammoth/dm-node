import type { HttpClient, QueryParams } from '../client.js';
import { paginate, type PaginateOptions } from '../pagination.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  Webhook,
  CreateWebhookParams,
  UpdateWebhookParams,
  WebhookDelivery,
  ListDeliveriesOptions,
  EventTypeInfo,
  TestDeliveryResult,
} from '../types/webhook.js';

export class WebhooksAPI {
  readonly #client: HttpClient;

  constructor(client: HttpClient) {
    this.#client = client;
  }

  // ── Subscriptions ───────────────────────────────────────────

  /** List webhook subscriptions. */
  async list(): Promise<Webhook[]> {
    return this.#client.getData<Webhook[]>('/webhooks');
  }

  /** Get a webhook subscription by ID. */
  async get(id: string): Promise<Webhook> {
    return this.#client.getData<Webhook>(`/webhooks/${enc(id)}`);
  }

  /** Create a new webhook subscription. */
  async create(params: CreateWebhookParams): Promise<Webhook> {
    const res = await this.#client.post<{ data: Webhook }>('/webhooks', params);
    return res.data;
  }

  /** Update a webhook subscription. */
  async update(id: string, params: UpdateWebhookParams): Promise<Webhook> {
    const res = await this.#client.patch<{ data: Webhook }>(`/webhooks/${enc(id)}`, params);
    return res.data;
  }

  /** Delete a webhook subscription. */
  async delete(id: string): Promise<void> {
    await this.#client.delete(`/webhooks/${enc(id)}`);
  }

  // ── Deliveries ──────────────────────────────────────────────

  /** List delivery log for a webhook subscription. */
  async listDeliveries(
    webhookId: string,
    options?: ListDeliveriesOptions,
  ): Promise<PaginatedResponse<WebhookDelivery>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    return this.#client.getPaginated<WebhookDelivery>(
      `/webhooks/${enc(webhookId)}/deliveries`,
      query,
    );
  }

  /** Async iterator that auto-paginates through all deliveries. */
  async *listAllDeliveries(
    webhookId: string,
    options?: ListDeliveriesOptions,
    paginateOptions?: PaginateOptions,
  ): AsyncGenerator<WebhookDelivery, void, undefined> {
    yield* paginate<WebhookDelivery>(
      this.#client,
      `/webhooks/${enc(webhookId)}/deliveries`,
      {},
      paginateOptions,
    );
  }

  // ── Test ────────────────────────────────────────────────────

  /** Send a test delivery to a webhook. */
  async test(webhookId: string): Promise<TestDeliveryResult> {
    return this.#client.post<TestDeliveryResult>(`/webhooks/${enc(webhookId)}/test`);
  }

  // ── Event Types ─────────────────────────────────────────────

  /** List available webhook event types. */
  async listEventTypes(): Promise<EventTypeInfo[]> {
    return this.#client.getData<EventTypeInfo[]>('/webhooks/events');
  }
}

function enc(s: string): string {
  return encodeURIComponent(s);
}
