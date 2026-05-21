# CodeDesignPlus Playwright Generator

Yeoman sub-generator that scaffolds a complete Playwright E2E test project for a CodeDesignPlus .NET microservice.

## Prerequisites

```bash
npm install -g yo generator-codedesignplus
```

## Usage

```bash
yo codedesignplus:playwright --name <service-name> [options]
```

### Options

| Option | Alias | Required | Description |
|--------|-------|----------|-------------|
| `--name` | `-n` | Yes | Microservice name (e.g., `invoicing`, `tenants`) |
| `--grpc` | `-g` | No | Include gRPC testing support |
| `--resources` | `-r` | No | Resources with DELETE endpoints for API cleanup |
| `--aggregates` | `-a` | No | Aggregates for MongoDB cleanup in global-teardown |

### Examples

**Basic service (no DELETE endpoints, uses MongoDB cleanup):**
```bash
yo codedesignplus:playwright --name invoicing --aggregates "FinancialDocumentAggregate,NumberSequenceAggregate"
```

**Service with DELETE endpoints:**
```bash
yo codedesignplus:playwright --name phases --resources "phases:api/phases/{id},states:api/constructionstate/{id},types:api/constructiontype/{id}"
```

**Service with gRPC:**
```bash
yo codedesignplus:playwright --name tenants --grpc --resources "tenants:api/Tenant/{id}"
```

**Mixed cleanup (API + MongoDB fallback):**
```bash
yo codedesignplus:playwright --name accounting --resources "journals:api/Journal/{id}" --aggregates "AccountingRuleAggregate"
```

## Generated Structure

```
ms-{name}-playwright/
├── src/
│   ├── config/
│   │   └── environments.ts        # Staging/local/production config
│   ├── fixtures/
│   │   └── index.ts               # Playwright fixtures (api, anonApi, env)
│   ├── helpers/
│   │   ├── api-paths.ts           # URL path helper
│   │   ├── cleanup-tracker.ts     # Resource cleanup via API
│   │   ├── settings-cache.ts      # Token cache utility
│   │   └── test-data.ts           # Test data generators
│   ├── proto/                     # (only with --grpc)
│   │   └── {name}.proto
│   ├── types/
│   │   └── index.ts               # Service DTOs
│   └── tests/
│       ├── suites/                 # Full test suites (*.spec.ts)
│       │   └── {name}.spec.ts
│       ├── smoke/                  # Quick health checks (*.smoke.ts)
│       │   └── {name}.smoke.ts
│       └── flows/                  # Multi-step E2E workflows (*.flow.ts)
├── global-setup.ts                 # Auth token acquisition
├── global-teardown.ts              # MongoDB cleanup fallback
├── playwright.config.ts            # Projects: suites, smoke, flows
├── .env.local                      # Local environment vars
├── .env.staging                    # Staging environment vars
├── tsconfig.json
└── package.json
```

## After Generation

1. Navigate to the project:
   ```bash
   cd ms-{name}-playwright
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env.staging`:
   ```env
   TOKEN_URL=https://your-tenant.ciamlogin.com/.../token
   CLIENT_SECRET=your-secret
   TEST_USER=test-user@example.com
   TEST_PASSWORD=password
   TENANT_ID=your-tenant-uuid
   MONGO_URI=mongodb://your-staging-uri
   ```

4. Run smoke tests:
   ```bash
   npm run test:smoke:staging
   ```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests |
| `npm run test:suites` | Run suite tests only |
| `npm run test:smoke` | Run smoke tests only |
| `npm run test:flows` | Run flow tests only |
| `npm run test:staging` | Run all against staging |
| `npm run test:local` | Run all against local |
| `npm run test:smoke:staging` | Smoke tests against staging |
| `npm run test:ui:staging` | Interactive UI mode (staging) |
| `npm run test:ci` | CI mode with JUnit reporter |
| `npm run report` | Open HTML report |

## Cleanup Strategies

### API-based (via `--resources`)
Resources are tracked during tests and deleted via REST API after each test.

### MongoDB-based (via `--aggregates`)
Documents matching `playwright-test-*` pattern are deleted in global-teardown after all tests complete.

### Best Practice
- Use API cleanup for resources with DELETE endpoints (faster, more reliable)
- Use MongoDB cleanup as fallback for services without DELETE endpoints
- Always prefix test data names with `playwright-test-` for identification

## Dependencies

- `@codedesignplus/playwright-microservice` — shared utilities
- `@playwright/test` — test framework
- `cross-env` — cross-platform env vars
- `@grpc/grpc-js` + `@grpc/proto-loader` — (optional, with `--grpc`)
