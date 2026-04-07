import type { HttpClient, QueryParams } from '../client.js';
import type { Zone, Image } from '../types/common.js';

export interface ListZonesOptions {
  search?: string;
  continent?: string;
  country?: string;
  provider?: string;
}

export class ZonesAPI {
  readonly #client: HttpClient;

  constructor(client: HttpClient) {
    this.#client = client;
  }

  /** List hosting zones. */
  async list(options?: ListZonesOptions): Promise<Zone[]> {
    const query: QueryParams = {};
    if (options?.search) query.search = options.search;
    if (options?.continent) query['filter[continent]'] = options.continent;
    if (options?.country) query['filter[country]'] = options.country;
    if (options?.provider) query['filter[provider]'] = options.provider;
    return this.#client.getData<Zone[]>('/zones', query);
  }

  /** List available OS images for a zone. */
  async listImages(zoneId: string): Promise<Image[]> {
    return this.#client.getData<Image[]>(`/zones/${enc(zoneId)}/images`);
  }
}

function enc(s: string): string {
  return encodeURIComponent(s);
}
