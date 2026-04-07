import type {
  ProductType,
  ProductStatus,
  ProductOptionType,
  BillingCycle,
} from './enums.js';
import type { ListOptions } from './common.js';

// ── Product ─────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  type: ProductType;
  category: string;
  subcategory: string | null;
  status: ProductStatus;
  pricing: ProductPricing;
  specs: ProductSpecs;
  is_featured: boolean;
  badge: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductPricing {
  monthly: number | null;
  quarterly: number | null;
  annual: number | null;
  one_time: number | null;
  setup_fee: number;
  currency: string;
}

export interface ProductSpecs {
  cpu: number | null;
  ram_gb: number | null;
  disk_gb: number | null;
  disk_type: string | null;
  bandwidth: string | null;
}

// ── Product Options ─────────────────────────────────────────────

export interface ProductOption {
  id: string;
  name: string;
  label: string;
  type: ProductOptionType;
  required: boolean;
  choices: ProductOptionChoice[];
  sort_order: number;
}

export interface ProductOptionChoice {
  id: string;
  label: string;
  value: string;
  price_adjustment: number;
  is_default: boolean;
}

// ── Product Addon ───────────────────────────────────────────────

export interface ProductAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_cycle: BillingCycle;
  is_required: boolean;
}

// ── Category ────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  sort_order: number;
  product_count: number;
}

// ── List/Filter options ─────────────────────────────────────────

export interface ListProductsOptions extends ListOptions {
  type?: ProductType;
  status?: ProductStatus;
  category?: string;
  tenant_id?: string;
}

// ── Create Product ──────────────────────────────────────────────

export interface CreateProductParams {
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  type?: ProductType;
  category?: string;
  subcategory?: string | null;
  status?: ProductStatus;
  pricing?: {
    monthly?: number | null;
    quarterly?: number | null;
    annual?: number | null;
    one_time?: number | null;
    setup_fee?: number;
    currency?: string;
  };
  specs?: {
    cpu?: number | null;
    ram_gb?: number | null;
    disk_gb?: number | null;
    disk_type?: string | null;
    bandwidth?: string | null;
  };
  is_featured?: boolean;
  is_hidden?: boolean;
  badge?: string | null;
  sort_order?: number;
  features?: string[];
  options?: Array<{
    name: string;
    label: string;
    type: ProductOptionType;
    required?: boolean;
    choices?: Array<{
      label: string;
      value: string;
      price_adjustment?: number;
      is_default?: boolean;
    }>;
    sort_order?: number;
  }>;
  addons?: Array<{
    name: string;
    description?: string;
    price: number;
    billing_cycle?: BillingCycle;
    is_required?: boolean;
  }>;
}

// ── Product Pricing (tenant-level) ──────────────────────────────

export interface TenantProductPricing {
  product_id: string;
  monthly: number | null;
  quarterly: number | null;
  annual: number | null;
  one_time: number | null;
  setup_fee: number;
  currency: string;
  markup_type: 'percentage' | 'fixed' | null;
  markup_value: number | null;
  is_visible: boolean;
}
