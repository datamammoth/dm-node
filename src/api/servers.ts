import type { HttpClient, QueryParams } from '../client.js';
import { paginate, type PaginateOptions } from '../pagination.js';
import type { PaginatedResponse, V2Response, Task, ActionResult, DeleteResult } from '../types/common.js';
import type {
  Server,
  ListServersOptions,
  CreateServerParams,
  UpdateServerParams,
  Snapshot,
  CreateSnapshotParams,
  MetricsResponse,
  ListMetricsOptions,
  ServerEvent,
  ListEventsOptions,
  ConsoleAccess,
  FirewallConfig,
  UpdateFirewallParams,
  RebuildParams,
  RescueParams,
} from '../types/server.js';

export class ServersAPI {
  readonly #client: HttpClient;

  constructor(client: HttpClient) {
    this.#client = client;
  }

  // ── CRUD ────────────────────────────────────────────────────

  /** List servers with pagination and filtering. */
  async list(options?: ListServersOptions): Promise<PaginatedResponse<Server>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.sort) query.sort = options.sort;
    if (options?.search) query.search = options.search;
    if (options?.status) query['filter[status]'] = options.status;
    if (options?.provider) query['filter[provider]'] = options.provider;
    if (options?.region) query['filter[region]'] = options.region;
    if (options?.owner_id) query['filter[owner_id]'] = options.owner_id;
    return this.#client.getPaginated<Server>('/servers', query);
  }

  /** Async iterator that auto-paginates through all servers. */
  async *listAll(
    options?: ListServersOptions,
    paginateOptions?: PaginateOptions,
  ): AsyncGenerator<Server, void, undefined> {
    const query: QueryParams = {};
    if (options?.sort) query.sort = options.sort;
    if (options?.search) query.search = options.search;
    if (options?.status) query['filter[status]'] = options.status;
    if (options?.provider) query['filter[provider]'] = options.provider;
    if (options?.region) query['filter[region]'] = options.region;
    if (options?.owner_id) query['filter[owner_id]'] = options.owner_id;
    yield* paginate<Server>(this.#client, '/servers', query, paginateOptions);
  }

  /** Get a single server by ID. */
  async get(id: string): Promise<Server> {
    return this.#client.getData<Server>(`/servers/${enc(id)}`);
  }

  /** Create (provision) a new server. Returns an async task. */
  async create(params: CreateServerParams): Promise<Task> {
    return this.#client.post<Task>('/servers', params);
  }

  /** Update a server's hostname or label. */
  async update(id: string, params: UpdateServerParams): Promise<Server> {
    const res = await this.#client.patch<V2Response<Server>>(`/servers/${enc(id)}`, params);
    return res.data;
  }

  /** Terminate a server. Returns an async task. */
  async delete(id: string): Promise<Task> {
    return this.#client.delete<Task>(`/servers/${enc(id)}`);
  }

  // ── Power actions ───────────────────────────────────────────

  /** Power on a server. */
  async powerOn(id: string): Promise<ActionResult> {
    return this.#client.post<ActionResult>(`/servers/${enc(id)}/actions/power-on`);
  }

  /** Force power off a server. */
  async powerOff(id: string): Promise<ActionResult> {
    return this.#client.post<ActionResult>(`/servers/${enc(id)}/actions/power-off`);
  }

  /** Reboot a server. */
  async reboot(id: string): Promise<ActionResult> {
    return this.#client.post<ActionResult>(`/servers/${enc(id)}/actions/reboot`);
  }

  /** Gracefully shut down a server. */
  async shutdown(id: string): Promise<ActionResult> {
    return this.#client.post<ActionResult>(`/servers/${enc(id)}/actions/shutdown`);
  }

  /** Rebuild (reinstall) a server with a new image. */
  async rebuild(id: string, params: RebuildParams): Promise<ActionResult> {
    return this.#client.post<ActionResult>(`/servers/${enc(id)}/actions/rebuild`, params);
  }

  /** Boot into rescue mode. */
  async rescue(id: string, params: RescueParams): Promise<ActionResult> {
    return this.#client.post<ActionResult>(`/servers/${enc(id)}/actions/rescue`, params);
  }

  // ── Snapshots ───────────────────────────────────────────────

  /** List snapshots for a server. */
  async listSnapshots(serverId: string): Promise<Snapshot[]> {
    return this.#client.getData<Snapshot[]>(`/servers/${enc(serverId)}/snapshots`);
  }

  /** Create a snapshot. */
  async createSnapshot(serverId: string, params: CreateSnapshotParams): Promise<Snapshot> {
    const res = await this.#client.post<V2Response<Snapshot>>(`/servers/${enc(serverId)}/snapshots`, params);
    return res.data;
  }

  /** Delete a snapshot. */
  async deleteSnapshot(serverId: string, snapshotId: string): Promise<DeleteResult> {
    return this.#client.delete<DeleteResult>(
      `/servers/${enc(serverId)}/snapshots/${enc(snapshotId)}`,
    );
  }

  /** Restore (rollback) a snapshot. */
  async restoreSnapshot(serverId: string, snapshotId: string): Promise<ActionResult> {
    return this.#client.post<ActionResult>(
      `/servers/${enc(serverId)}/snapshots/${enc(snapshotId)}`,
    );
  }

  // ── Metrics ─────────────────────────────────────────────────

  /** Get server metrics / monitoring data. */
  async getMetrics(serverId: string, options?: ListMetricsOptions): Promise<MetricsResponse> {
    const query: QueryParams = {};
    if (options?.period) query.period = options.period;
    if (options?.source) query.source = options.source;
    if (options?.limit) query.limit = options.limit;
    return this.#client.getData<MetricsResponse>(`/servers/${enc(serverId)}/metrics`, query);
  }

  // ── Events ──────────────────────────────────────────────────

  /** List server audit events. */
  async listEvents(
    serverId: string,
    options?: ListEventsOptions,
  ): Promise<PaginatedResponse<ServerEvent>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.start_date) query.start_date = options.start_date;
    if (options?.end_date) query.end_date = options.end_date;
    if (options?.action) query.action = options.action;
    if (options?.sort_order) query.sort_order = options.sort_order;
    return this.#client.getPaginated<ServerEvent>(`/servers/${enc(serverId)}/events`, query);
  }

  // ── Console ─────────────────────────────────────────────────

  /** Get VNC/SSH console access URL. */
  async getConsole(serverId: string): Promise<ConsoleAccess> {
    return this.#client.getData<ConsoleAccess>(`/servers/${enc(serverId)}/console`);
  }

  // ── Firewall ────────────────────────────────────────────────

  /** Get current firewall configuration. */
  async getFirewall(serverId: string): Promise<FirewallConfig> {
    return this.#client.getData<FirewallConfig>(`/servers/${enc(serverId)}/firewall`);
  }

  /** Replace firewall rules. */
  async updateFirewall(serverId: string, params: UpdateFirewallParams): Promise<FirewallConfig> {
    const res = await this.#client.put<V2Response<FirewallConfig>>(`/servers/${enc(serverId)}/firewall`, params);
    return res.data;
  }
}

/** URI-encode a path segment. */
function enc(s: string): string {
  return encodeURIComponent(s);
}
