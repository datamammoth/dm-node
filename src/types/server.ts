import type {
  ServerStatus,
  SnapshotStatus,
  MetricSource,
  FirewallDirection,
  FirewallProtocol,
  FirewallAction,
  FirewallStatus,
} from './enums.js';
import type { ListOptions } from './common.js';

// ── Server ──────────────────────────────────────────────────────

export interface Server {
  id: string;
  hostname: string | null;
  label: string | null;
  status: ServerStatus;
  ip_address: string | null;
  ipv6_address: string | null;
  region: string | null;
  os_image: string | null;
  plan: string | null;
  specs: ServerSpecs | null;
  provisioned_at: string | null;
  created_at: string;
  updated_at: string;
  permissions?: ServerPermissions;
  _links?: Record<string, string>;
}

export interface ServerSpecs {
  cpu: number | null;
  ram_mb: number | null;
  disk_gb: number | null;
  bandwidth_tb: number | null;
}

export interface ServerPermissions {
  can_power: boolean;
  can_console: boolean;
  can_snapshot: boolean;
  can_firewall: boolean;
  can_delete: boolean;
}

// ── Server list/filter options ──────────────────────────────────

export interface ListServersOptions extends ListOptions {
  status?: ServerStatus;
  provider?: string;
  region?: string;
  owner_id?: string;
}

// ── Create / Update ─────────────────────────────────────────────

export interface CreateServerParams {
  product_id: string;
  image_id: string;
  zone_id?: string;
  region?: string;
  hostname?: string;
  label?: string;
  password?: string;
  ssh_key_ids?: string[];
}

export interface UpdateServerParams {
  hostname?: string;
  label?: string;
}

// ── Snapshot ────────────────────────────────────────────────────

export interface Snapshot {
  id: string;
  name: string;
  description: string | null;
  size_gb: number | null;
  status: SnapshotStatus;
  created_at: string;
  _links?: Record<string, string>;
}

export interface CreateSnapshotParams {
  name: string;
  description?: string;
}

// ── Metrics ─────────────────────────────────────────────────────

export interface MetricPoint {
  id: string;
  timestamp: string;
  cpu_percent: number | null;
  memory_percent: number | null;
  disk_percent: number | null;
  network_in_mbps: number | null;
  network_out_mbps: number | null;
  is_online: boolean;
  source: MetricSource;
}

export interface MetricsResponse {
  source: MetricSource;
  period: string;
  count?: number;
  metrics?: MetricPoint[];
  points?: unknown[];
  summary?: unknown;
  status?: string;
}

export interface ListMetricsOptions {
  period?: 'lastday' | 'lastweek' | 'lastmonth' | 'lastyear';
  source?: MetricSource;
  limit?: number;
}

// ── Events ──────────────────────────────────────────────────────

export interface ServerEvent {
  action: string;
  timestamp: string;
  changed_by: string | null;
  request_id: string | null;
  changes: unknown;
  category: string | null;
}

export interface ListEventsOptions extends ListOptions {
  start_date?: string;
  end_date?: string;
  action?: string;
  sort_order?: 'asc' | 'desc';
}

// ── Console ─────────────────────────────────────────────────────

export interface ConsoleAccess {
  type: string;
  url: string;
  password: string | null;
  expires_at: string | null;
  server_id: string;
}

// ── Firewall ────────────────────────────────────────────────────

export interface FirewallRule {
  direction: FirewallDirection;
  protocol: FirewallProtocol;
  port?: string;
  source_ip?: string;
  dest_ip?: string;
  action: FirewallAction;
  description?: string;
}

export interface FirewallConfig {
  id: string | null;
  server_id: string;
  rules: FirewallRule[];
  status: FirewallStatus;
  updated_at: string | null;
}

export interface UpdateFirewallParams {
  rules: FirewallRule[];
  status?: FirewallStatus;
}

// ── Rebuild ─────────────────────────────────────────────────────

export interface RebuildParams {
  image_id: string;
  root_password?: string;
  default_user?: string;
}

// ── Rescue ──────────────────────────────────────────────────────

export interface RescueParams {
  root_password: string;
}
