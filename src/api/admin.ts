import type { HttpClient, QueryParams } from '../client.js';
import { paginate, type PaginateOptions } from '../pagination.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  AdminUser,
  ListUsersOptions,
  CreateUserParams,
  UpdateUserParams,
  Role,
  CreateRoleParams,
  UpdateRoleParams,
  Tenant,
  ListTenantsOptions,
  CreateTenantParams,
  UpdateTenantParams,
  Lead,
  ListLeadsOptions,
  CreateLeadParams,
  UpdateLeadParams,
  AuditLog,
  ListAuditLogOptions,
  DashboardStats,
  MasqueradeResult,
} from '../types/admin.js';
import type { Ticket } from '../types/support.js';
import type { Invoice } from '../types/billing.js';
import type { Server } from '../types/server.js';

export class AdminAPI {
  readonly #client: HttpClient;

  constructor(client: HttpClient) {
    this.#client = client;
  }

  // ── Users ───────────────────────────────────────────────────

  /** List users (admin). */
  async listUsers(options?: ListUsersOptions): Promise<PaginatedResponse<AdminUser>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.sort) query.sort = options.sort;
    if (options?.search) query.search = options.search;
    if (options?.status) query['filter[status]'] = options.status;
    return this.#client.getPaginated<AdminUser>('/admin/users', query);
  }

  /** Async iterator that auto-paginates through all users. */
  async *listAllUsers(
    options?: ListUsersOptions,
    paginateOptions?: PaginateOptions,
  ): AsyncGenerator<AdminUser, void, undefined> {
    const query: QueryParams = {};
    if (options?.sort) query.sort = options.sort;
    if (options?.search) query.search = options.search;
    if (options?.status) query['filter[status]'] = options.status;
    yield* paginate<AdminUser>(this.#client, '/admin/users', query, paginateOptions);
  }

  /** Get a user by ID. */
  async getUser(id: string): Promise<AdminUser> {
    return this.#client.getData<AdminUser>(`/admin/users/${enc(id)}`);
  }

  /** Create a new user. */
  async createUser(params: CreateUserParams): Promise<AdminUser> {
    const res = await this.#client.post<{ data: AdminUser }>('/admin/users', params);
    return res.data;
  }

  /** Update a user. */
  async updateUser(id: string, params: UpdateUserParams): Promise<AdminUser> {
    const res = await this.#client.patch<{ data: AdminUser }>(`/admin/users/${enc(id)}`, params);
    return res.data;
  }

  /** Delete a user. */
  async deleteUser(id: string): Promise<void> {
    await this.#client.delete(`/admin/users/${enc(id)}`);
  }

  // ── Roles ───────────────────────────────────────────────────

  /** List roles with permission counts. */
  async listRoles(): Promise<Role[]> {
    return this.#client.getData<Role[]>('/admin/roles');
  }

  /** Get a role by ID. */
  async getRole(id: string): Promise<Role> {
    return this.#client.getData<Role>(`/admin/roles/${enc(id)}`);
  }

  /** Create a new role. */
  async createRole(params: CreateRoleParams): Promise<Role> {
    const res = await this.#client.post<{ data: Role }>('/admin/roles', params);
    return res.data;
  }

  /** Update a role. */
  async updateRole(id: string, params: UpdateRoleParams): Promise<Role> {
    const res = await this.#client.patch<{ data: Role }>(`/admin/roles/${enc(id)}`, params);
    return res.data;
  }

  /** Delete a role. */
  async deleteRole(id: string): Promise<void> {
    await this.#client.delete(`/admin/roles/${enc(id)}`);
  }

  // ── Tenants ─────────────────────────────────────────────────

  /** List tenants. */
  async listTenants(options?: ListTenantsOptions): Promise<PaginatedResponse<Tenant>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.sort) query.sort = options.sort;
    if (options?.search) query.search = options.search;
    return this.#client.getPaginated<Tenant>('/admin/tenants', query);
  }

  /** Async iterator that auto-paginates through all tenants. */
  async *listAllTenants(
    options?: ListTenantsOptions,
    paginateOptions?: PaginateOptions,
  ): AsyncGenerator<Tenant, void, undefined> {
    const query: QueryParams = {};
    if (options?.sort) query.sort = options.sort;
    if (options?.search) query.search = options.search;
    yield* paginate<Tenant>(this.#client, '/admin/tenants', query, paginateOptions);
  }

  /** Get a tenant by ID. */
  async getTenant(id: string): Promise<Tenant> {
    return this.#client.getData<Tenant>(`/admin/tenants/${enc(id)}`);
  }

  /** Create a new tenant. */
  async createTenant(params: CreateTenantParams): Promise<Tenant> {
    const res = await this.#client.post<{ data: Tenant }>('/admin/tenants', params);
    return res.data;
  }

  /** Update a tenant. */
  async updateTenant(id: string, params: UpdateTenantParams): Promise<Tenant> {
    const res = await this.#client.patch<{ data: Tenant }>(`/admin/tenants/${enc(id)}`, params);
    return res.data;
  }

  // ── Leads ───────────────────────────────────────────────────

  /** List leads. */
  async listLeads(options?: ListLeadsOptions): Promise<PaginatedResponse<Lead>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.sort) query.sort = options.sort;
    if (options?.search) query.search = options.search;
    if (options?.status) query['filter[status]'] = options.status;
    if (options?.source) query['filter[source]'] = options.source;
    if (options?.country) query['filter[country]'] = options.country;
    return this.#client.getPaginated<Lead>('/admin/leads', query);
  }

  /** Async iterator that auto-paginates through all leads. */
  async *listAllLeads(
    options?: ListLeadsOptions,
    paginateOptions?: PaginateOptions,
  ): AsyncGenerator<Lead, void, undefined> {
    const query: QueryParams = {};
    if (options?.sort) query.sort = options.sort;
    if (options?.search) query.search = options.search;
    if (options?.status) query['filter[status]'] = options.status;
    if (options?.source) query['filter[source]'] = options.source;
    if (options?.country) query['filter[country]'] = options.country;
    yield* paginate<Lead>(this.#client, '/admin/leads', query, paginateOptions);
  }

  /** Get a lead by ID. */
  async getLead(id: string): Promise<Lead> {
    return this.#client.getData<Lead>(`/admin/leads/${enc(id)}`);
  }

  /** Create a new lead. */
  async createLead(params: CreateLeadParams): Promise<Lead> {
    const res = await this.#client.post<{ data: Lead }>('/admin/leads', params);
    return res.data;
  }

  /** Update a lead. */
  async updateLead(id: string, params: UpdateLeadParams): Promise<Lead> {
    const res = await this.#client.patch<{ data: Lead }>(`/admin/leads/${enc(id)}`, params);
    return res.data;
  }

  // ── Audit Log ───────────────────────────────────────────────

  /** List audit log entries. */
  async listAuditLog(options?: ListAuditLogOptions): Promise<PaginatedResponse<AuditLog>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.search) query.search = options.search;
    if (options?.action) query['filter[action]'] = options.action;
    if (options?.user_id) query['filter[user_id]'] = options.user_id;
    if (options?.entity) query['filter[entity]'] = options.entity;
    if (options?.status) query['filter[status]'] = options.status;
    return this.#client.getPaginated<AuditLog>('/admin/audit-log', query);
  }

  /** Async iterator that auto-paginates through audit log entries. */
  async *listAllAuditLog(
    options?: ListAuditLogOptions,
    paginateOptions?: PaginateOptions,
  ): AsyncGenerator<AuditLog, void, undefined> {
    const query: QueryParams = {};
    if (options?.search) query.search = options.search;
    if (options?.action) query['filter[action]'] = options.action;
    if (options?.user_id) query['filter[user_id]'] = options.user_id;
    if (options?.entity) query['filter[entity]'] = options.entity;
    if (options?.status) query['filter[status]'] = options.status;
    yield* paginate<AuditLog>(this.#client, '/admin/audit-log', query, paginateOptions);
  }

  // ── Dashboard ───────────────────────────────────────────────

  /** Get admin dashboard stats. */
  async getDashboardStats(): Promise<DashboardStats> {
    return this.#client.getData<DashboardStats>('/admin/dashboard/stats');
  }

  // ── Admin views ─────────────────────────────────────────────

  /** List all invoices (admin). */
  async listAllInvoicesAdmin(options?: {
    page?: number;
    per_page?: number;
    sort?: string;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<Invoice>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.sort) query.sort = options.sort;
    if (options?.search) query.search = options.search;
    if (options?.status) query['filter[status]'] = options.status;
    return this.#client.getPaginated<Invoice>('/admin/invoices', query);
  }

  /** List all servers (admin). */
  async listAllServersAdmin(options?: {
    page?: number;
    per_page?: number;
    sort?: string;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<Server>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.sort) query.sort = options.sort;
    if (options?.search) query.search = options.search;
    if (options?.status) query['filter[status]'] = options.status;
    return this.#client.getPaginated<Server>('/admin/servers', query);
  }

  /** List all tickets (admin). */
  async listAllTicketsAdmin(options?: {
    page?: number;
    per_page?: number;
    sort?: string;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<Ticket>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.sort) query.sort = options.sort;
    if (options?.search) query.search = options.search;
    if (options?.status) query['filter[status]'] = options.status;
    return this.#client.getPaginated<Ticket>('/admin/tickets', query);
  }

  /** Get a ticket by ID (admin). */
  async getTicketAdmin(id: string): Promise<Ticket> {
    return this.#client.getData<Ticket>(`/admin/tickets/${enc(id)}`);
  }

  /** Update a ticket (admin). */
  async updateTicketAdmin(
    id: string,
    params: Partial<Pick<Ticket, 'status' | 'priority' | 'department'>>,
  ): Promise<Ticket> {
    const res = await this.#client.patch<{ data: Ticket }>(`/admin/tickets/${enc(id)}`, params);
    return res.data;
  }

  // ── Masquerade ──────────────────────────────────────────────

  /** Masquerade as another user (admin). */
  async masquerade(userId: string): Promise<MasqueradeResult> {
    return this.#client.post<MasqueradeResult>(`/admin/masquerade/${enc(userId)}`);
  }

  // ── API v1 Usage ────────────────────────────────────────────

  /** Get API v1 usage statistics (for deprecation tracking). */
  async getV1Usage(): Promise<Record<string, unknown>> {
    return this.#client.getData<Record<string, unknown>>('/admin/v1-usage');
  }
}

function enc(s: string): string {
  return encodeURIComponent(s);
}
