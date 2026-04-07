// ── Server ──────────────────────────────────────────────────────
export type ServerStatus =
  | 'provisioning'
  | 'active'
  | 'suspended'
  | 'terminated'
  | 'error';

export type ServerActionType =
  | 'power-on'
  | 'power-off'
  | 'reboot'
  | 'shutdown'
  | 'rebuild'
  | 'rescue';

export type MetricPeriod =
  | 'lastday'
  | 'lastweek'
  | 'lastmonth'
  | 'lastyear';

export type MetricSource = 'provider' | 'agent' | 'db';

export type FirewallDirection = 'inbound' | 'outbound';
export type FirewallProtocol = 'tcp' | 'udp' | 'icmp' | 'any';
export type FirewallAction = 'allow' | 'deny' | 'drop';
export type FirewallStatus = 'active' | 'disabled';

export type SnapshotStatus = 'creating' | 'available' | 'restoring' | 'deleting' | 'error';

// ── Product ─────────────────────────────────────────────────────
export type ProductType =
  | 'hosting'
  | 'vps'
  | 'gpu'
  | 'domain'
  | 'ssl'
  | 'addon'
  | 'service'
  | 'license';

export type ProductStatus = 'active' | 'inactive' | 'deprecated';

export type ProductOptionType = 'select' | 'text' | 'number' | 'toggle';

// ── Billing ─────────────────────────────────────────────────────
export type BillingCycle =
  | 'hourly'
  | 'monthly'
  | 'quarterly'
  | 'semi-annual'
  | 'annual'
  | 'biennial'
  | 'one-time';

export type InvoiceStatus =
  | 'draft'
  | 'unpaid'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'refunded';

export type SubscriptionStatus =
  | 'active'
  | 'pending'
  | 'suspended'
  | 'cancelled'
  | 'expired';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'fraud';

export type PaymentGateway = 'stripe' | 'paypal' | 'crypto_coingate';

// ── Support ─────────────────────────────────────────────────────
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketStatus =
  | 'open'
  | 'customer-reply'
  | 'answered'
  | 'on-hold'
  | 'in-progress'
  | 'closed';

export type TicketChannel = 'web' | 'email' | 'api' | 'system';

// ── Admin ───────────────────────────────────────────────────────
export type TenantType = 'root' | 'reseller' | 'standard';

export type RegistrationMode = 'open' | 'invite' | 'closed';

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'converted'
  | 'lost'
  | 'unsubscribed';

export type LeadSource =
  | 'organic'
  | 'paid'
  | 'referral'
  | 'social'
  | 'email'
  | 'import'
  | 'api'
  | 'other';

export type AuditStatus = 'success' | 'failure' | 'error';

// ── Affiliate ───────────────────────────────────────────────────
export type AffiliateStatus = 'active' | 'pending' | 'suspended' | 'terminated';

export type PayoutMethod = 'paypal' | 'bank_transfer' | 'credit' | 'crypto';

export type CommissionStatus = 'pending' | 'approved' | 'paid' | 'rejected' | 'reversed';

export type CommissionType = 'one_time' | 'recurring' | 'bonus';

// ── Tasks ───────────────────────────────────────────────────────
export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export type TaskType =
  | 'server.create'
  | 'server.terminate'
  | 'server.rebuild'
  | 'server.snapshot'
  | 'server.restore'
  | string; // Allow custom task types

// ── Webhook ─────────────────────────────────────────────────────
export type WebhookEventType =
  | 'server.created'
  | 'server.updated'
  | 'server.deleted'
  | 'server.power_on'
  | 'server.power_off'
  | 'server.suspended'
  | 'invoice.created'
  | 'invoice.paid'
  | 'invoice.overdue'
  | 'ticket.created'
  | 'ticket.replied'
  | 'ticket.closed'
  | 'order.created'
  | 'order.completed'
  | 'subscription.created'
  | 'subscription.cancelled'
  | 'subscription.renewed'
  | string; // Allow future event types

// ── Health ──────────────────────────────────────────────────────
export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';
export type CheckStatus = 'ok' | 'error';
