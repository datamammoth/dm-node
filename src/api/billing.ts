import type { HttpClient, QueryParams } from '../client.js';
import { paginate, type PaginateOptions } from '../pagination.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  Invoice,
  ListInvoicesOptions,
  Subscription,
  SubscriptionDetail,
  ListSubscriptionsOptions,
  CancelSubscriptionParams,
  Balance,
  TopUpParams,
  TopUpResult,
  BalanceTransaction,
  ListTransactionsOptions,
  Order,
  OrderItem,
  ListOrdersOptions,
  CreateOrderParams,
  PaymentMethod,
  PromoValidation,
} from '../types/billing.js';

export class BillingAPI {
  readonly #client: HttpClient;

  constructor(client: HttpClient) {
    this.#client = client;
  }

  // ── Invoices ────────────────────────────────────────────────

  /** List invoices for the authenticated user. */
  async listInvoices(options?: ListInvoicesOptions): Promise<PaginatedResponse<Invoice>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.sort) query.sort = options.sort;
    if (options?.status) query['filter[status]'] = options.status;
    return this.#client.getPaginated<Invoice>('/invoices', query);
  }

  /** Async iterator that auto-paginates through all invoices. */
  async *listAllInvoices(
    options?: ListInvoicesOptions,
    paginateOptions?: PaginateOptions,
  ): AsyncGenerator<Invoice, void, undefined> {
    const query: QueryParams = {};
    if (options?.sort) query.sort = options.sort;
    if (options?.status) query['filter[status]'] = options.status;
    yield* paginate<Invoice>(this.#client, '/invoices', query, paginateOptions);
  }

  /** Get a single invoice by ID. */
  async getInvoice(id: string): Promise<Invoice> {
    return this.#client.getData<Invoice>(`/invoices/${enc(id)}`);
  }

  /** Pay an invoice. */
  async payInvoice(id: string, paymentMethodId?: string): Promise<Invoice> {
    return this.#client.post<Invoice>(
      `/invoices/${enc(id)}/pay`,
      paymentMethodId ? { payment_method_id: paymentMethodId } : undefined,
    );
  }

  // ── Subscriptions ───────────────────────────────────────────

  /** List subscriptions. */
  async listSubscriptions(
    options?: ListSubscriptionsOptions,
  ): Promise<PaginatedResponse<Subscription>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.sort) query.sort = options.sort;
    if (options?.status) query['filter[status]'] = options.status;
    return this.#client.getPaginated<Subscription>('/subscriptions', query);
  }

  /** Async iterator that auto-paginates through all subscriptions. */
  async *listAllSubscriptions(
    options?: ListSubscriptionsOptions,
    paginateOptions?: PaginateOptions,
  ): AsyncGenerator<Subscription, void, undefined> {
    const query: QueryParams = {};
    if (options?.sort) query.sort = options.sort;
    if (options?.status) query['filter[status]'] = options.status;
    yield* paginate<Subscription>(this.#client, '/subscriptions', query, paginateOptions);
  }

  /** Get a single subscription by ID. */
  async getSubscription(id: string): Promise<SubscriptionDetail> {
    return this.#client.getData<SubscriptionDetail>(`/subscriptions/${enc(id)}`);
  }

  /** Cancel a subscription. */
  async cancelSubscription(
    id: string,
    params?: CancelSubscriptionParams,
  ): Promise<SubscriptionDetail> {
    return this.#client.post<SubscriptionDetail>(`/subscriptions/${enc(id)}/cancel`, params);
  }

  // ── Balance ─────────────────────────────────────────────────

  /** Get prepaid balance. */
  async getBalance(): Promise<Balance> {
    return this.#client.getData<Balance>('/balance');
  }

  /** Initiate a balance top-up. */
  async topUp(params: TopUpParams): Promise<TopUpResult> {
    const res = await this.#client.post<{ data: TopUpResult }>('/balance', params);
    return res.data;
  }

  /** List balance transactions. */
  async listTransactions(
    options?: ListTransactionsOptions,
  ): Promise<PaginatedResponse<BalanceTransaction>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.type) query['filter[type]'] = options.type;
    return this.#client.getPaginated<BalanceTransaction>('/balance/transactions', query);
  }

  // ── Orders ──────────────────────────────────────────────────

  /** List orders. */
  async listOrders(options?: ListOrdersOptions): Promise<PaginatedResponse<Order>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.sort) query.sort = options.sort;
    if (options?.status) query['filter[status]'] = options.status;
    return this.#client.getPaginated<Order>('/orders', query);
  }

  /** Async iterator that auto-paginates through all orders. */
  async *listAllOrders(
    options?: ListOrdersOptions,
    paginateOptions?: PaginateOptions,
  ): AsyncGenerator<Order, void, undefined> {
    const query: QueryParams = {};
    if (options?.sort) query.sort = options.sort;
    if (options?.status) query['filter[status]'] = options.status;
    yield* paginate<Order>(this.#client, '/orders', query, paginateOptions);
  }

  /** Get a single order by ID. */
  async getOrder(id: string): Promise<Order> {
    return this.#client.getData<Order>(`/orders/${enc(id)}`);
  }

  /** Place a new order. */
  async createOrder(params: CreateOrderParams): Promise<Order> {
    const res = await this.#client.post<{ data: Order }>('/orders', params);
    return res.data;
  }

  // ── Payment Methods ─────────────────────────────────────────

  /** List payment methods. */
  async listPaymentMethods(): Promise<PaymentMethod[]> {
    return this.#client.getData<PaymentMethod[]>('/payment-methods');
  }

  // ── Promo Codes ─────────────────────────────────────────────

  /** Validate a promo code. */
  async validatePromo(code: string): Promise<PromoValidation> {
    return this.#client.post<PromoValidation>('/promo/validate', { code });
  }
}

function enc(s: string): string {
  return encodeURIComponent(s);
}
