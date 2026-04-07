import type {
  InvoiceStatus,
  SubscriptionStatus,
  OrderStatus,
  BillingCycle,
  PaymentGateway,
} from './enums.js';
import type { ListOptions } from './common.js';

// ── Invoice ─────────────────────────────────────────────────────

export interface Invoice {
  id: string;
  invoice_number: string;
  status: InvoiceStatus;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  due_date: string | null;
  paid_date: string | null;
  created_at: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface ListInvoicesOptions extends ListOptions {
  status?: InvoiceStatus;
}

// ── Subscription ────────────────────────────────────────────────

export interface Subscription {
  id: string;
  product_name: string;
  billing_cycle: BillingCycle;
  amount: number;
  currency: string;
  status: SubscriptionStatus;
  start_date: string | null;
  next_due_date: string | null;
  cancelled_at: string | null;
  created_at: string;
}

export interface ListSubscriptionsOptions extends ListOptions {
  status?: SubscriptionStatus;
}

// ── Subscription detail ─────────────────────────────────────────

export interface SubscriptionDetail extends Subscription {
  product_id: string;
  auto_renew: boolean;
  updated_at: string;
  _links?: Record<string, string>;
}

export interface CancelSubscriptionParams {
  reason?: string;
  cancel_at_end?: boolean;
}

// ── Balance ─────────────────────────────────────────────────────

export interface Balance {
  balance: number;
  currency: string;
  _links?: Record<string, string>;
}

export interface TopUpParams {
  amount: number;
  gateway?: PaymentGateway;
}

export interface TopUpResult {
  status: string;
  amount: number;
  gateway: string;
  transaction_id: string | null;
}

export interface BalanceTransaction {
  id: string;
  type: string;
  amount: number;
  balance_after: number;
  currency: string;
  description: string | null;
  reference_id: string | null;
  reference_type: string | null;
  created_at: string;
}

export interface ListTransactionsOptions extends ListOptions {
  type?: string;
}

// ── Order ───────────────────────────────────────────────────────

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total: number;
  billing_cycle: BillingCycle;
}

export interface ListOrdersOptions extends ListOptions {
  status?: OrderStatus;
}

export interface CreateOrderParams {
  items: Array<{
    product_id: string;
    quantity?: number;
    billing_cycle?: BillingCycle;
    options?: Record<string, unknown>;
    addons?: Array<{
      addon_id: string;
      quantity?: number;
    }>;
  }>;
  promo_code?: string;
  notes?: string;
  payment_method_id?: string;
}

// ── Payment Method ──────────────────────────────────────────────

export interface PaymentMethod {
  id: string;
  type: string;
  gateway: PaymentGateway;
  label: string;
  last_four: string | null;
  brand: string | null;
  exp_month: number | null;
  exp_year: number | null;
  is_default: boolean;
  created_at: string;
}

// ── Promo Code ──────────────────────────────────────────────────

export interface PromoValidation {
  valid: boolean;
  code: string;
  discount_type: 'percentage' | 'fixed' | null;
  discount_value: number | null;
  message: string | null;
}
