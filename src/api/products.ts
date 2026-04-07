import type { HttpClient, QueryParams } from '../client.js';
import { paginate, type PaginateOptions } from '../pagination.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  Product,
  ProductOption,
  ProductAddon,
  TenantProductPricing,
  Category,
  ListProductsOptions,
  CreateProductParams,
} from '../types/product.js';

export class ProductsAPI {
  readonly #client: HttpClient;

  constructor(client: HttpClient) {
    this.#client = client;
  }

  // ── Products ────────────────────────────────────────────────

  /** List products (public storefront). */
  async list(options?: ListProductsOptions): Promise<PaginatedResponse<Product>> {
    const query: QueryParams = {};
    if (options?.page) query.page = options.page;
    if (options?.per_page) query.per_page = options.per_page;
    if (options?.sort) query.sort = options.sort;
    if (options?.search) query.search = options.search;
    if (options?.type) query['filter[type]'] = options.type;
    if (options?.status) query['filter[status]'] = options.status;
    if (options?.category) query['filter[category]'] = options.category;
    if (options?.tenant_id) query['filter[tenant_id]'] = options.tenant_id;
    return this.#client.getPaginated<Product>('/products', query);
  }

  /** Async iterator that auto-paginates through all products. */
  async *listAll(
    options?: ListProductsOptions,
    paginateOptions?: PaginateOptions,
  ): AsyncGenerator<Product, void, undefined> {
    const query: QueryParams = {};
    if (options?.sort) query.sort = options.sort;
    if (options?.search) query.search = options.search;
    if (options?.type) query['filter[type]'] = options.type;
    if (options?.status) query['filter[status]'] = options.status;
    if (options?.category) query['filter[category]'] = options.category;
    if (options?.tenant_id) query['filter[tenant_id]'] = options.tenant_id;
    yield* paginate<Product>(this.#client, '/products', query, paginateOptions);
  }

  /** Get a single product by ID. */
  async get(id: string): Promise<Product> {
    return this.#client.getData<Product>(`/products/${enc(id)}`);
  }

  /** Create a product (admin). */
  async create(params: CreateProductParams): Promise<Product> {
    const res = await this.#client.post<{ data: Product }>('/products', params);
    return res.data;
  }

  // ── Product Options ─────────────────────────────────────────

  /** List configurable options for a product. */
  async listOptions(productId: string): Promise<ProductOption[]> {
    return this.#client.getData<ProductOption[]>(`/products/${enc(productId)}/options`);
  }

  // ── Product Addons ──────────────────────────────────────────

  /** List addons available for a product. */
  async listAddons(productId: string): Promise<ProductAddon[]> {
    return this.#client.getData<ProductAddon[]>(`/products/${enc(productId)}/addons`);
  }

  // ── Product Pricing ─────────────────────────────────────────

  /** Get tenant-level pricing for a product. */
  async getPricing(productId: string): Promise<TenantProductPricing> {
    return this.#client.getData<TenantProductPricing>(`/products/${enc(productId)}/pricing`);
  }

  // ── Categories ──────────────────────────────────────────────

  /** List product categories. */
  async listCategories(): Promise<Category[]> {
    return this.#client.getData<Category[]>('/categories');
  }
}

function enc(s: string): string {
  return encodeURIComponent(s);
}
