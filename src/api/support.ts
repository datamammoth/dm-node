import type { HttpClient, QueryParams } from '../client.js';
import { paginate, type PaginateOptions } from '../pagination.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  Ticket,
  TicketReply,
  ListTicketsOptions,
  CreateTicketParams,
  CreateReplyParams,
  TicketFeedback,
  CreateFeedbackParams,
  Department,
  KBArticle,
  ListKBArticlesOptions,
} from '../types/support.js';

export class SupportAPI {
  readonly #client: HttpClient;

  constructor(client: HttpClient) {
    this.#client = client;
  }

  // ── Tickets ─────────────────────────────────────────────────

  /** List tickets for the authenticated user. */
  async listTickets(options?: ListTicketsOptions): Promise<PaginatedResponse<Ticket>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.sort) query.sort = options.sort;
    if (options?.search) query.search = options.search;
    if (options?.status) query['filter[status]'] = options.status;
    return this.#client.getPaginated<Ticket>('/tickets', query);
  }

  /** Async iterator that auto-paginates through all tickets. */
  async *listAllTickets(
    options?: ListTicketsOptions,
    paginateOptions?: PaginateOptions,
  ): AsyncGenerator<Ticket, void, undefined> {
    const query: QueryParams = {};
    if (options?.sort) query.sort = options.sort;
    if (options?.search) query.search = options.search;
    if (options?.status) query['filter[status]'] = options.status;
    yield* paginate<Ticket>(this.#client, '/tickets', query, paginateOptions);
  }

  /** Get a single ticket by ID. */
  async getTicket(id: string): Promise<Ticket> {
    return this.#client.getData<Ticket>(`/tickets/${enc(id)}`);
  }

  /** Create a new ticket. */
  async createTicket(params: CreateTicketParams): Promise<Ticket> {
    const res = await this.#client.post<{ data: Ticket }>('/tickets', params);
    return res.data;
  }

  /** Update a ticket (e.g., change status, priority). */
  async updateTicket(
    id: string,
    params: Partial<Pick<Ticket, 'status' | 'priority'>>,
  ): Promise<Ticket> {
    const res = await this.#client.patch<{ data: Ticket }>(`/tickets/${enc(id)}`, params);
    return res.data;
  }

  // ── Replies ─────────────────────────────────────────────────

  /** List replies for a ticket. */
  async listReplies(ticketId: string): Promise<TicketReply[]> {
    return this.#client.getData<TicketReply[]>(`/tickets/${enc(ticketId)}/replies`);
  }

  /** Add a reply to a ticket. */
  async createReply(ticketId: string, params: CreateReplyParams): Promise<TicketReply> {
    const res = await this.#client.post<{ data: TicketReply }>(`/tickets/${enc(ticketId)}/replies`, params);
    return res.data;
  }

  // ── Feedback ────────────────────────────────────────────────

  /** Submit feedback for a closed ticket. */
  async submitFeedback(ticketId: string, params: CreateFeedbackParams): Promise<TicketFeedback> {
    return this.#client.post<TicketFeedback>(`/tickets/${enc(ticketId)}/feedback`, params);
  }

  // ── Departments ─────────────────────────────────────────────

  /** List support departments. */
  async listDepartments(): Promise<Department[]> {
    return this.#client.getData<Department[]>('/tickets/departments');
  }

  // ── Knowledge Base ──────────────────────────────────────────

  /** List knowledge base articles. */
  async listArticles(options?: ListKBArticlesOptions): Promise<PaginatedResponse<KBArticle>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.search) query.search = options.search;
    if (options?.category) query['filter[category]'] = options.category;
    if (options?.tag) query['filter[tag]'] = options.tag;
    return this.#client.getPaginated<KBArticle>('/kb/articles', query);
  }

  /** Get a knowledge base article by slug. */
  async getArticle(slug: string): Promise<KBArticle> {
    return this.#client.getData<KBArticle>(`/kb/articles/${enc(slug)}`);
  }
}

function enc(s: string): string {
  return encodeURIComponent(s);
}
