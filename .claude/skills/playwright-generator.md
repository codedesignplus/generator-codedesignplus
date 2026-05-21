# Playwright Test Project Generator

## Overview

This skill describes how to use the `yo codedesignplus:playwright` Yeoman generator to scaffold Playwright E2E test projects for CodeDesignPlus .NET microservices, and how to write tests using the `@codedesignplus/playwright-microservice` shared package.

## Installation

```bash
# Install Yeoman and the generator globally
npm install -g yo generator-codedesignplus

# Or link locally for development
cd generator-codedesignplus
npm link
```

## Generating a New Playwright Project

### Command Syntax

```bash
yo codedesignplus:playwright --name <service> [--grpc] [--resources "name:path,..."] [--aggregates "Agg1,Agg2"]
```

### Parameters

- `--name, -n` (required): The microservice name in kebab-case (e.g., `invoicing`, `common-areas`, `front-desk`)
- `--grpc, -g` (optional): Adds gRPC client, proto file, and gRPC fixture
- `--resources, -r` (optional): Comma-separated `name:deletePath` pairs for API-based cleanup
- `--aggregates, -a` (optional): Comma-separated MongoDB collection names for global-teardown cleanup

### Decision Guide: Which flags to use

1. **Does the microservice have DELETE endpoints?**
   - YES → use `--resources "resourceName:api/Endpoint/{id}"`
   - NO → use `--aggregates "AggregateNameAggregate"`

2. **Does the microservice expose gRPC?**
   - YES → add `--grpc`
   - Copy the `.proto` file from the microservice's `src/entrypoints/*/Protos/` directory

3. **Convention for aggregate names**: MongoDB collections are named `{AggregateName}Aggregate` (PascalCase)

4. **Convention for database names**: `db-ms-{servicename}` where servicename has no hyphens (e.g., `commonareas`, `leaseagreements`)

### Examples

```bash
# Service with only MongoDB cleanup (no DELETE endpoints)
yo codedesignplus:playwright --name invoicing --aggregates "FinancialDocumentAggregate,NumberSequenceAggregate,OrganizationAggregate"

# Service with API cleanup
yo codedesignplus:playwright --name phases --resources "phases:api/phases/{id},states:api/constructionstate/{id},types:api/constructiontype/{id}"

# Service with gRPC + API cleanup
yo codedesignplus:playwright --name tenants --grpc --resources "tenants:api/Tenant/{id}"

# Service with both strategies
yo codedesignplus:playwright --name accounting --resources "journals:api/Journal/{id}" --aggregates "AccountingRuleAggregate"
```

## Writing Tests After Generation

### Project Structure

```
ms-{name}-playwright/
├── src/
│   ├── config/environments.ts      # Edit: staging/local URLs
│   ├── fixtures/index.ts           # Edit: add service-specific fixtures
│   ├── helpers/
│   │   ├── cleanup-tracker.ts      # Edit: add tracked resources
│   │   └── test-data.ts            # Edit: add generators per endpoint
│   ├── types/index.ts              # Edit: add DTOs
│   └── tests/
│       ├── suites/*.spec.ts        # Full CRUD tests
│       ├── smoke/*.smoke.ts        # Quick health checks
│       └── flows/*.flow.ts         # Multi-step E2E workflows
├── global-setup.ts                 # Usually no edits needed
├── global-teardown.ts              # Edit: configure MongoDB filter
└── .env.staging                    # Edit: add credentials
```

### Test Categories

#### Smoke Tests (`tests/smoke/*.smoke.ts`)
- Fast, minimal tests that verify the service is alive
- Only test auth (401/200) and basic connectivity
- Run in CI as a quick health check
- One file per domain area

#### Suite Tests (`tests/suites/*.spec.ts`)
- Full CRUD coverage per endpoint
- Validation tests (400 responses)
- Field existence checks
- One `test.describe` block per endpoint/resource

#### Flow Tests (`tests/flows/*.flow.ts`)
- Multi-step business workflows
- Cross-service integrations (multiple API contexts)
- State machine transitions
- Uses `actionTimeout: 25_000` and polling for async events

### Writing Test Data Generators

```typescript
// src/helpers/test-data.ts
import { cleanupTracker } from './cleanup-tracker';

export function generateInvoiceData(overrides = {}) {
  const id = crypto.randomUUID();
  return {
    id,
    name: `playwright-test-${Date.now()}`,
    // ... service-specific fields
    ...overrides,
  };
}

// For resources tracked via API cleanup:
export async function createTestInvoice(api, overrides = {}) {
  const data = generateInvoiceData(overrides);
  const res = await api.post(apiPath('api/FinancialDocument/CreateInvoice'), { data });
  if (res.status() === 204) {
    cleanupTracker.track('invoices', data.id);
  }
  return data;
}
```

### Critical Rules for Tests

1. **Always assert exact status codes** — never accept `[204, 400]` ranges
2. **Prefix test data names** with `playwright-test-` for MongoDB cleanup identification
3. **Use `crypto.randomUUID()`** for all IDs — never reuse between tests
4. **Track resources immediately** after successful creation (status 204)
5. **Never track failed creations** — only register after confirming success
6. **Workers must be 1** — sequential execution prevents race conditions
7. **NodaTime dates**: Remove milliseconds from ISO strings: `.replace(/\.\d{3}Z$/, 'Z')`
8. **X-Tenant header** is required for all authenticated requests in multi-tenant services

### Using the Shared Package

```typescript
import {
  apiPath,                    // Strip leading / from paths
  CleanupTracker,            // API-based resource cleanup
  MongoCleanup,              // MongoDB global teardown
  createGrpcClient,          // gRPC client factory
  promisifyGrpc,             // Convert gRPC callbacks to promises
  createAuthSetup,           // Global setup factory
  createApiFixtures,         // Fixture factory (alternative to manual)
  readSettingsCache,         // Read cached token
  loadEnvFile,               // Manual .env loader
} from '@codedesignplus/playwright-microservice';

// Types
import type {
  PaginationResponse,        // { data: T[], totalCount, skip, limit }
  ProblemDetails,            // RFC 7807 error response
  EnvName,                   // 'staging' | 'local' | 'production'
  CleanupEndpoint,           // { path: string, method?: 'DELETE' | 'PATCH' }
} from '@codedesignplus/playwright-microservice';
```

### Environment Configuration

The generated `environments.ts` handles URL resolution:

| Environment | REST URL | API Path | gRPC URL |
|-------------|----------|----------|----------|
| `local` | `http://localhost:5000` | (empty) | `localhost:5001` |
| `staging` | `https://services.kappali.com` | `/ms-{name}` | `ms-{name}-grpc.svc:5001` |
| `production` | (configure) | (configure) | (configure) |

### Running Tests

```bash
npm run test:smoke:staging    # Quick health check
npm run test:staging          # Full suite
npm run test:flows            # Business workflows only
npm run test:ui:staging       # Interactive Playwright UI
npm run test:ci               # CI mode with JUnit output
```

## Extending an Existing Project

### Adding a new endpoint to test

1. Add DTO to `src/types/index.ts`
2. Add data generator to `src/helpers/test-data.ts`
3. If it has DELETE, add to `cleanup-tracker.ts`
4. Create test file in `src/tests/suites/{endpoint}.spec.ts`
5. Add smoke test in `src/tests/smoke/{endpoint}.smoke.ts`

### Adding gRPC to an existing project

1. Copy `.proto` from the microservice
2. Install: `npm install @grpc/grpc-js @grpc/proto-loader`
3. Create `src/helpers/grpc-client.ts` using `createGrpcClient` from package
4. Add `grpcUrl` and `grpcSecure` to `environments.ts`
5. Add `grpc` fixture to `fixtures/index.ts`

### Adding a cross-service flow

1. Create a second API context in fixtures (e.g., `tenantsApi`)
2. Write test in `src/tests/flows/{flow-name}.flow.ts`
3. Use polling pattern for async event processing:
   ```typescript
   for (let i = 0; i < 12; i++) {
     await new Promise(r => setTimeout(r, 2500));
     const res = await api.get(apiPath(`api/Resource/${id}`));
     if (res.status() === 200) break;
   }
   ```
