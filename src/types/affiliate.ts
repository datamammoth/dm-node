import type {
  AffiliateStatus,
  PayoutMethod,
  CommissionStatus,
  CommissionType,
} from './enums.js';
import type { ListOptions } from './common.js';

// ── Affiliate ───────────────────────────────────────────────────

export interface Affiliate {
  id: string;
  status: AffiliateStatus;
  referral_code: string;
  custom_slug: string | null;
  payout_method: PayoutMethod;
  total_earnings: number;
  total_paid: number;
  pending_balance: number;
  available_balance: number;
  lifetime_referrals: number;
  lifetime_conversions: number;
  enrolled_at: string | null;
  created_at: string;
}

// ── Commission ──────────────────────────────────────────────────

export interface Commission {
  id: string;
  status: CommissionStatus;
  commission_type: CommissionType;
  commission_rate: number;
  order_amount: number;
  commission_amount: number;
  bonus_amount: number;
  currency: string;
  description: string | null;
  is_recurring: boolean;
  recurring_month: number | null;
  hold_until: string | null;
  approved_at: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface ListCommissionsOptions extends ListOptions {
  status?: CommissionStatus;
}

// ── Referral ────────────────────────────────────────────────────

export interface Referral {
  id: string;
  landing_page: string | null;
  ref_source: string | null;
  sub_id: string | null;
  signed_up_at: string | null;
  converted_at: string | null;
  is_converted: boolean;
  conversion_amount: number | null;
  created_at: string;
}

export interface ListReferralsOptions extends ListOptions {
  converted?: 'true' | 'false';
}

// ── Payout Request ──────────────────────────────────────────────

export interface PayoutRequest {
  id: string;
  amount: number;
  currency: string;
  status: string;
  payout_method: PayoutMethod;
  payout_details: Record<string, unknown> | null;
  requested_at: string;
  processed_at: string | null;
}

export interface CreatePayoutRequestParams {
  amount: number;
  payout_method?: PayoutMethod;
  payout_details?: Record<string, unknown>;
}

// ── Marketing Materials ─────────────────────────────────────────

export interface AffiliateMaterial {
  id: string;
  type: string;
  name: string;
  description: string | null;
  url: string;
  preview_url: string | null;
  dimensions: string | null;
  created_at: string;
}
