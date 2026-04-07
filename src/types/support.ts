import type { TicketPriority, TicketStatus, TicketChannel } from './enums.js';
import type { ListOptions } from './common.js';

// ── Ticket ──────────────────────────────────────────────────────

export interface Ticket {
  id: string;
  ticket_number: string;
  subject: string;
  department: string;
  priority: TicketPriority;
  status: TicketStatus;
  channel: TicketChannel;
  category: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  replies: TicketReply[];
}

export interface TicketReply {
  id: string;
  message: string;
  is_staff: boolean;
  sender_type: string;
  is_internal_note: boolean;
  created_at: string;
}

export interface ListTicketsOptions extends ListOptions {
  status?: TicketStatus;
}

export interface CreateTicketParams {
  subject: string;
  department: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  message: string;
  category?: string;
}

export interface CreateReplyParams {
  message: string;
}

// ── Ticket Feedback ─────────────────────────────────────────────

export interface TicketFeedback {
  ticket_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface CreateFeedbackParams {
  rating: number;
  comment?: string;
}

// ── Department ──────────────────────────────────────────────────

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_public: boolean;
  sort_order: number;
}

// ── Knowledge Base ──────────────────────────────────────────────

export interface KBArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string | null;
  tags: string[];
  is_published: boolean;
  views: number;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface ListKBArticlesOptions extends ListOptions {
  category?: string;
  tag?: string;
}
