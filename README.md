# DataMammoth Node.js / TypeScript SDK

Official Node.js and TypeScript client for the [DataMammoth API v2](https://data-mammoth.com/api-docs/reference).

> **Status**: Under development. Not yet published to npm.

## Installation

```bash
npm install @datamammoth/sdk
# or
yarn add @datamammoth/sdk
# or
pnpm add @datamammoth/sdk
```

## Quick Start

```typescript
import { DataMammoth } from "@datamammoth/sdk";

const dm = new DataMammoth({ apiKey: "dm_your_key_here" });

// List active servers
const servers = await dm.servers.list({ status: "active" });
for (const server of servers.data) {
  console.log(`${server.hostname} — ${server.ipAddress}`);
}

// Create a server
const task = await dm.servers.create({
  productId: "prod_abc",
  imageId: "img_ubuntu2204",
  hostname: "web-01",
});
const server = await task.wait();
```

## Features

- All 105 API v2 endpoints
- Full TypeScript type definitions
- Promise-based with async/await
- Automatic pagination helpers
- Rate limit handling with retry
- API key authentication
- Works in Node.js 18+, Bun, and Deno

## Documentation

- [API Reference](https://data-mammoth.com/api-docs/reference)
- [Getting Started Guide](https://data-mammoth.com/api-docs/guides)
- [Authentication](https://data-mammoth.com/api-docs/guides/authentication)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
