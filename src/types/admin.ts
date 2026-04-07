import type {
  TenantType,
  RegistrationMode,
  LeadStatus,
  LeadSource,
  AuditStatus,
} from './enums.js';
import type { ListOptions } from './common.js';

// ── Admin User ──────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean;
  status: string;
  last_login_at: string | null;
  created_at: string;
}

export interface ListUsersOptions extends ListOptions {
  status?: 'active' | 'inactive';
}

export interface CreateUserParams {
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  role_ids?: string[];
}

export interface UpdateUserParams {
  name?: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  role_ids?: string[];
}

// ── Role ────────────────────────────────────────────────────────

export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_system: boolean;
  priority: number;
  user_count: number;
  permissions: RolePermission[];
  created_at: string;
  updated_at: string;
}

export interface RolePermission {
  module: string;
  action: string;
}

export interface CreateRoleParams {
  name: string;
  slug: string;
  description?: string;
  priority?: number;
  permission_ids?: string[];
}

export interface UpdateRoleParams {
  name?: string;
  description?: string;
  priority?: number;
  permission_ids?: string[];
}

// ── Tenant ──────────────────────────────────────────────────────

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  logo_url: string | null;
  tenant_type: TenantType;
  company_name: string | null;
  company_email: string | null;
  timezone: string | null;
  default_locale: string | null;
  registration_mode: RegistrationMode;
  is_active: boolean;
  user_count: number;
  created_at: string;
  updated_at: string;
}

export interface ListTenantsOptions extends ListOptions {
  // No additional filters beyond base ListOptions
}

export interface CreateTenantParams {
  name: string;
  slug: string;
  domain?: string;
  company_name?: string;
  company_email?: string;
  timezone?: string;
  default_locale?: string;
  registration_mode?: RegistrationMode;
}

export interface UpdateTenantParams {
  name?: string;
  domain?: string;
  logo_url?: string;
  company_name?: string;
  company_email?: string;
  timezone?: string;
  default_locale?: string;
  registration_mode?: RegistrationMode;
  is_active?: boolean;
}

// ── Lead ────────────────────────────────────────────────────────

export interface Lead {
  id: string;
  email: string | null;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  job_title: string | null;
  source: LeadSource;
  source_detail: string | null;
  status: LeadStatus;
  score: number | null;
  industry: string | null;
  country: string | null;
  region: string | null;
  tags: string[];
  last_contacted_at: string | null;
  contact_count: number;
  converted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListLeadsOptions extends ListOptions {
  status?: LeadStatus;
  source?: LeadSource;
  country?: string;
}

export interface CreateLeadParams {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  job_title?: string;
  source: string;
  source_detail?: string;
  industry?: string;
  country?: string;
  region?: string;
  tags?: string[];
  notes?: string;
}

export interface UpdateLeadParams {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  job_title?: string;
  status?: LeadStatus;
  source?: string;
  source_detail?: string;
  industry?: string;
  country?: string;
  region?: string;
  tags?: string[];
  notes?: string;
  score?: number;
}

// ── Audit Log ───────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  status: AuditStatus;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface ListAuditLogOptions extends ListOptions {
  action?: string;
  user_id?: string;
  entity?: string;
  status?: AuditStatus;
}

// ── Dashboard Stats ─────────────────────────────────────────────

export interface DashboardStats {
  total_users: number;
  total_servers: number;
  active_servers: number;
  total_tickets: number;
  open_tickets: number;
  total_revenue: number;
  mrr: number;
  [key: string]: unknown;
}

// ── Masquerade ──────────────────────────────────────────────────

export interface MasqueradeResult {
  token: string;
  user_id: string;
  expires_at: string;
}
