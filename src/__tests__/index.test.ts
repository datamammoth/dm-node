import { describe, it, expect } from 'vitest';
import { DataMammoth, ServersAPI, ProductsAPI, BillingAPI, SupportAPI, AccountAPI, AdminAPI, AffiliateAPI, WebhooksAPI, TasksAPI, ZonesAPI } from '../index.js';

describe('DataMammoth', () => {
  it('creates an instance with all API namespaces', () => {
    const dm = new DataMammoth({ apiKey: 'dm_test_key' });

    expect(dm.servers).toBeInstanceOf(ServersAPI);
    expect(dm.products).toBeInstanceOf(ProductsAPI);
    expect(dm.billing).toBeInstanceOf(BillingAPI);
    expect(dm.support).toBeInstanceOf(SupportAPI);
    expect(dm.account).toBeInstanceOf(AccountAPI);
    expect(dm.admin).toBeInstanceOf(AdminAPI);
    expect(dm.affiliate).toBeInstanceOf(AffiliateAPI);
    expect(dm.webhooks).toBeInstanceOf(WebhooksAPI);
    expect(dm.tasks).toBeInstanceOf(TasksAPI);
    expect(dm.zones).toBeInstanceOf(ZonesAPI);
  });

  it('throws when no apiKey provided', () => {
    expect(() => new DataMammoth({ apiKey: '' })).toThrow('apiKey is required');
  });

  it('has a health method', () => {
    const dm = new DataMammoth({ apiKey: 'dm_test' });
    expect(typeof dm.health).toBe('function');
  });
});
