import type { ListOptions } from './common.js';

// ── User Profile ────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  locale: string | null;
  two_factor_enabled: boolean;
  email_verified: string | null;
  last_login_at: string | null;
  created_at: string;
}

export interface UpdateProfileParams {
  first_name?: string;
  last_name?: string;
  phone?: string;
  locale?: string;
  avatar_url?: string;
}

// ── Password ────────────────────────────────────────────────────

export interface ChangePasswordParams {
  current_password: string;
  new_password: string;
}

// ── API Key ─────────────────────────────────────────────────────

export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  allowed_ips: string[];
  rate_limit: number | null;
  expires_at: string | null;
  last_used_at: string | null;
  is_active: boolean;
  created_at: string;
  /** Only returned on creation */
  key?: string;
}

export interface CreateApiKeyParams {
  name: string;
  scopes?: string[];
  allowed_ips?: string[];
  expires_in_days?: number;
}

// ── Session ─────────────────────────────────────────────────────

export interface Session {
  id: string;
  ip_address: string;
  user_agent: string;
  is_current: boolean;
  last_active_at: string;
  created_at: string;
}

// ── 2FA ─────────────────────────────────────────────────────────

export interface TwoFactorSetup {
  secret: string;
  qr_code_url: string;
  backup_codes: string[];
}

export interface Enable2FAParams {
  code: string;
}

export interface Disable2FAParams {
  code: string;
}

// ── Notifications ───────────────────────────────────────────────

export interface NotificationPreferences {
  email_invoice: boolean;
  email_ticket: boolean;
  email_server: boolean;
  email_marketing: boolean;
  push_enabled: boolean;
}

export interface UpdateNotificationParams {
  email_invoice?: boolean;
  email_ticket?: boolean;
  email_server?: boolean;
  email_marketing?: boolean;
  push_enabled?: boolean;
}

// ── Activity ────────────────────────────────────────────────────

export interface ActivityEntry {
  id: string;
  action: string;
  entity: string;
  entity_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface ListActivityOptions extends ListOptions {
  action?: string;
  entity?: string;
}
