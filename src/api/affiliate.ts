import type { HttpClient, QueryParams } from '../client.js';
import { paginate, type PaginateOptions } from '../pagination.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  Affiliate,
  Commission,
  ListCommissionsOptions,
  Referral,
  ListReferralsOptions,
  PayoutRequest,
  CreatePayoutRequestParams,
  AffiliateMaterial,
} from '../types/affiliate.js';

export class AffiliateAPI {
  readonly #client: HttpClient;

  constructor(client: HttpClient) {
    this.#client = client;
  }

  // ── Dashboard ───────────────────────────────────────────────

  /** Get the authenticated user's affiliate dashboard. */
  async getMe(): Promise<Affiliate> {
    return this.#client.getData<Affiliate>('/affiliate/me');
  }

  // ── Commissions ─────────────────────────────────────────────

  /** List commissions. */
  async listCommissions(
    options?: ListCommissionsOptions,
  ): Promise<PaginatedResponse<Commission>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.status) query['filter[status]'] = options.status;
    return this.#client.getPaginated<Commission>('/affiliate/commissions', query);
  }

  /** Async iterator that auto-paginates through all commissions. */
  async *listAllCommissions(
    options?: ListCommissionsOptions,
    paginateOptions?: PaginateOptions,
  ): AsyncGenerator<Commission, void, undefined> {
    const query: QueryParams = {};
    if (options?.status) query['filter[status]'] = options.status;
    yield* paginate<Commission>(this.#client, '/affiliate/commissions', query, paginateOptions);
  }

  // ── Referrals ───────────────────────────────────────────────

  /** List referrals. */
  async listReferrals(options?: ListReferralsOptions): Promise<PaginatedResponse<Referral>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.converted) query['filter[converted]'] = options.converted;
    return this.#client.getPaginated<Referral>('/affiliate/referrals', query);
  }

  /** Async iterator that auto-paginates through all referrals. */
  async *listAllReferrals(
    options?: ListReferralsOptions,
    paginateOptions?: PaginateOptions,
  ): AsyncGenerator<Referral, void, undefined> {
    const query: QueryParams = {};
    if (options?.converted) query['filter[converted]'] = options.converted;
    yield* paginate<Referral>(this.#client, '/affiliate/referrals', query, paginateOptions);
  }

  // ── Payout Requests ─────────────────────────────────────────

  /** Request a payout. */
  async requestPayout(params: CreatePayoutRequestParams): Promise<PayoutRequest> {
    return this.#client.post<PayoutRequest>('/affiliate/payout-request', params);
  }

  // ── Marketing Materials ─────────────────────────────────────

  /** List available marketing materials (banners, links, etc.). */
  async listMaterials(): Promise<AffiliateMaterial[]> {
    return this.#client.getData<AffiliateMaterial[]>('/affiliate/materials');
  }
}
