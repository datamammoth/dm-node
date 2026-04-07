/**
 * Auto-pagination helpers.
 *
 * Provides an async generator that automatically fetches all pages
 * from a paginated endpoint.
 */

import type { HttpClient, QueryParams } from './client.js';
import type { PaginatedResponse } from './types/common.js';

export interface PaginateOptions {
  /** Starting page (default: 1) */
  startPage?: number;
  /** Items per page (default: 20, max 100) */
  perPage?: number;
  /** Maximum total items to yield (default: Infinity) */
  maxItems?: number;
}

/**
 * Creates an async generator that iterates through all pages of a
 * paginated endpoint, yielding individual items.
 *
 * Usage:
 * ```ts
 * for await (const server of paginate<Server>(client, '/servers', { status: 'active' })) {
 *   console.log(server.hostname);
 * }
 * ```
 */
export async function* paginate<T>(
  client: HttpClient,
  path: string,
  query?: QueryParams,
  options?: PaginateOptions,
): AsyncGenerator<T, void, undefined> {
  const perPage = options?.perPage ?? 20;
  let page = options?.startPage ?? 1;
  const maxItems = options?.maxItems ?? Infinity;
  let yielded = 0;

  while (yielded < maxItems) {
    const params: QueryParams = {
      ...query,
      page,
      per_page: perPage,
    };

    const response = await client.getPaginated<T>(path, params);

    for (const item of response.data) {
      if (yielded >= maxItems) return;
      yield item;
      yielded++;
    }

    // No more pages
    const totalPages = response.meta?.total_pages ?? 1;
    if (page >= totalPages || response.data.length === 0) {
      return;
    }

    page++;
  }
}

/**
 * Collects all items from a paginated endpoint into an array.
 *
 * Usage:
 * ```ts
 * const allServers = await collectAll<Server>(client, '/servers');
 * ```
 */
export async function collectAll<T>(
  client: HttpClient,
  path: string,
  query?: QueryParams,
  options?: PaginateOptions,
): Promise<T[]> {
  const items: T[] = [];
  for await (const item of paginate<T>(client, path, query, options)) {
    items.push(item);
  }
  return items;
}
