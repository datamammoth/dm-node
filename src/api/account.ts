import type { HttpClient, QueryParams } from '../client.js';
import { paginate, type PaginateOptions } from '../pagination.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  UserProfile,
  UpdateProfileParams,
  ChangePasswordParams,
  ApiKey,
  CreateApiKeyParams,
  Session,
  TwoFactorSetup,
  Enable2FAParams,
  Disable2FAParams,
  NotificationPreferences,
  UpdateNotificationParams,
  ActivityEntry,
  ListActivityOptions,
} from '../types/account.js';

export class AccountAPI {
  readonly #client: HttpClient;

  constructor(client: HttpClient) {
    this.#client = client;
  }

  // ── Profile ─────────────────────────────────────────────────

  /** Get the authenticated user's profile. */
  async getProfile(): Promise<UserProfile> {
    return this.#client.getData<UserProfile>('/me');
  }

  /** Update the authenticated user's profile. */
  async updateProfile(params: UpdateProfileParams): Promise<UserProfile> {
    const res = await this.#client.patch<{ data: UserProfile }>('/me', params);
    return res.data;
  }

  /** Change password. */
  async changePassword(params: ChangePasswordParams): Promise<void> {
    await this.#client.post('/me/change-password', params);
  }

  // ── API Keys ────────────────────────────────────────────────

  /** List API keys for the authenticated user. */
  async listApiKeys(): Promise<ApiKey[]> {
    return this.#client.getData<ApiKey[]>('/me/api-keys');
  }

  /**
   * Create a new API key.
   * The raw key is only returned once in the response's `key` field.
   */
  async createApiKey(params: CreateApiKeyParams): Promise<ApiKey> {
    const res = await this.#client.post<{ data: ApiKey }>('/me/api-keys', params);
    return res.data;
  }

  /** Revoke (delete) an API key. */
  async deleteApiKey(id: string): Promise<void> {
    await this.#client.delete(`/me/api-keys/${enc(id)}`);
  }

  // ── Sessions ────────────────────────────────────────────────

  /** List active sessions. */
  async listSessions(): Promise<Session[]> {
    return this.#client.getData<Session[]>('/me/sessions');
  }

  /** Revoke a session. */
  async revokeSession(id: string): Promise<void> {
    await this.#client.delete(`/me/sessions/${enc(id)}`);
  }

  // ── Two-Factor Auth ─────────────────────────────────────────

  /** Begin 2FA setup — returns secret, QR code URL, and backup codes. */
  async setup2FA(): Promise<TwoFactorSetup> {
    return this.#client.post<TwoFactorSetup>('/me/2fa');
  }

  /** Confirm and enable 2FA. */
  async enable2FA(params: Enable2FAParams): Promise<void> {
    await this.#client.put('/me/2fa', params);
  }

  /** Disable 2FA. */
  async disable2FA(params: Disable2FAParams): Promise<void> {
    await this.#client.delete('/me/2fa');
  }

  // ── Notifications ───────────────────────────────────────────

  /** Get notification preferences. */
  async getNotifications(): Promise<NotificationPreferences> {
    return this.#client.getData<NotificationPreferences>('/me/notifications');
  }

  /** Update notification preferences. */
  async updateNotifications(params: UpdateNotificationParams): Promise<NotificationPreferences> {
    const res = await this.#client.patch<{ data: NotificationPreferences }>('/me/notifications', params);
    return res.data;
  }

  // ── Activity ────────────────────────────────────────────────

  /** List recent account activity. */
  async listActivity(options?: ListActivityOptions): Promise<PaginatedResponse<ActivityEntry>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.action) query['filter[action]'] = options.action;
    if (options?.entity) query['filter[entity]'] = options.entity;
    return this.#client.getPaginated<ActivityEntry>('/me/activity', query);
  }

  /** Async iterator that auto-paginates through all activity. */
  async *listAllActivity(
    options?: ListActivityOptions,
    paginateOptions?: PaginateOptions,
  ): AsyncGenerator<ActivityEntry, void, undefined> {
    const query: QueryParams = {};
    if (options?.action) query['filter[action]'] = options.action;
    if (options?.entity) query['filter[entity]'] = options.entity;
    yield* paginate<ActivityEntry>(this.#client, '/me/activity', query, paginateOptions);
  }
}

function enc(s: string): string {
  return encodeURIComponent(s);
}
