import { describe, it, expect, vi, beforeEach } from 'vitest';
import { paginate, collectAll } from '../pagination.js';
import type { HttpClient } from '../client.js';

function createMockClient(pages: Array<{ data: unknown[]; meta: { page: number; per_page: number; total: number; total_pages: number } }>) {
  let callCount = 0;
  return {
    getPaginated: vi.fn(async () => {
      const page = pages[callCount] ?? pages[pages.length - 1];
      callCount++;
      return page;
    }),
  } as unknown as HttpClient;
}

describe('paginate', () => {
  it('yields all items across pages', async () => {
    const client = createMockClient([
      { data: [{ id: 1 }, { id: 2 }], meta: { page: 1, per_page: 2, total: 5, total_pages: 3 } },
      { data: [{ id: 3 }, { id: 4 }], meta: { page: 2, per_page: 2, total: 5, total_pages: 3 } },
      { data: [{ id: 5 }], meta: { page: 3, per_page: 2, total: 5, total_pages: 3 } },
    ]);

    const items: unknown[] = [];
    for await (const item of paginate(client, '/servers')) {
      items.push(item);
    }

    expect(items).toHaveLength(5);
    expect(items[0]).toEqual({ id: 1 });
    expect(items[4]).toEqual({ id: 5 });
  });

  it('respects maxItems', async () => {
    const client = createMockClient([
      { data: [{ id: 1 }, { id: 2 }, { id: 3 }], meta: { page: 1, per_page: 3, total: 10, total_pages: 4 } },
    ]);

    const items: unknown[] = [];
    for await (const item of paginate(client, '/servers', {}, { maxItems: 2 })) {
      items.push(item);
    }

    expect(items).toHaveLength(2);
  });

  it('stops when server returns empty data', async () => {
    const client = createMockClient([
      { data: [{ id: 1 }], meta: { page: 1, per_page: 20, total: 1, total_pages: 1 } },
    ]);

    const items = await collectAll(client, '/test');
    expect(items).toHaveLength(1);
  });
});

describe('collectAll', () => {
  it('returns array of all items', async () => {
    const client = createMockClient([
      { data: ['a', 'b'], meta: { page: 1, per_page: 2, total: 3, total_pages: 2 } },
      { data: ['c'], meta: { page: 2, per_page: 2, total: 3, total_pages: 2 } },
    ]);

    const items = await collectAll<string>(client, '/test');
    expect(items).toEqual(['a', 'b', 'c']);
  });
});
