import type { WebhookEventType } from './enums.js';
import type { ListOptions } from './common.js';

// ── Webhook Subscription ────────────────────────────────────────

export interface Webhook {
  id: string;
  url: string;
  events: WebhookEventType[];
  secret: string;
  is_active: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateWebhookParams {
  url: string;
  events: WebhookEventType[];
  description?: string;
  is_active?: boolean;
}

export interface UpdateWebhookParams {
  url?: string;
  events?: WebhookEventType[];
  description?: string;
  is_active?: boolean;
}

// ── Delivery ────────────────────────────────────────────────────

export interface WebhookDelivery {
  id: string;
  event_type: WebhookEventType;
  status_code: number | null;
  success: boolean;
  request_headers: Record<string, string> | null;
  request_body: string | null;
  response_headers: Record<string, string> | null;
  response_body: string | null;
  duration_ms: number | null;
  error: string | null;
  delivered_at: string;
}

export interface ListDeliveriesOptions extends ListOptions {
  // No additional filters beyond base ListOptions
}

// ── Event Type Catalog ──────────────────────────────────────────

export interface EventTypeInfo {
  event: WebhookEventType;
  description: string;
  category: string;
}

// ── Test Delivery ───────────────────────────────────────────────

export interface TestDeliveryResult {
  delivery_id: string;
  success: boolean;
  status_code: number | null;
  duration_ms: number | null;
  error: string | null;
}
