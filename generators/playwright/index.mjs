import Generator from 'yeoman-generator';
import figlet from 'figlet';
import boxen from 'boxen';
import path from 'path';

export default class PlaywrightGenerator extends Generator {

  constructor(args, opts) {
    super(args, opts);

    this.option('name', {
      type: String,
      alias: 'n',
      required: true,
      description: 'The microservice name (e.g., "invoicing", "tenants", "phases")'
    });

    this.option('grpc', {
      type: Boolean,
      alias: 'g',
      default: false,
      description: 'Include gRPC testing support'
    });

    this.option('resources', {
      type: String,
      alias: 'r',
      default: '',
      description: 'Comma-separated resources with DELETE endpoints for cleanup (e.g., "phases:api/phases/{id},types:api/constructiontype/{id}")'
    });

    this.option('aggregates', {
      type: String,
      alias: 'a',
      default: '',
      description: 'Comma-separated aggregate names for MongoDB cleanup (e.g., "FinancialDocumentAggregate,NumberSequenceAggregate")'
    });

    this.option('help', {
      type: Boolean,
      alias: 'h',
      default: false,
      description: 'Show help'
    });
  }

  initializing() {
    console.log(figlet.textSync('CodeDesignPlus'));

    if (this.options.help) {
      console.log(boxen(
        'CodeDesignPlus Playwright Test Generator (v1.0)\n\n' +
        'Generates a complete Playwright E2E test project for a CodeDesignPlus microservice.\n\n' +
        'Usage:\n\n' +
        '  yo codedesignplus:playwright --name <service> [options]\n\n' +
        'Options:\n\n' +
        '  --name, -n        Microservice name (required)\n' +
        '  --grpc, -g        Include gRPC testing support\n' +
        '  --resources, -r   Resources with DELETE endpoints\n' +
        '                    Format: "name:path,name:path"\n' +
        '                    Example: "phases:api/phases/{id}"\n' +
        '  --aggregates, -a  Aggregates for MongoDB cleanup\n' +
        '                    Example: "PhaseAggregate,TypeAggregate"\n\n' +
        'Examples:\n\n' +
        '  yo codedesignplus:playwright --name invoicing --aggregates "FinancialDocumentAggregate,NumberSequenceAggregate"\n' +
        '  yo codedesignplus:playwright --name tenants --grpc --resources "tenants:api/Tenant/{id}"\n' +
        '  yo codedesignplus:playwright -n phases -r "phases:api/phases/{id},states:api/constructionstate/{id}"\n\n',
        { padding: 1, margin: 1, borderStyle: 'round' }
      ));
      return;
    }

    if (!this.options.name) {
      throw new Error('--name is required. Use --help for usage information.');
    }
  }

  writing() {
    if (this.options.help) return;

    const name = this.options.name.toLowerCase();
    const serviceName = name.replace(/-/g, '');
    const pascalName = this._toPascalCase(name);
    const hasGrpc = this.options.grpc;
    const resources = this._parseResources(this.options.resources);
    const aggregates = this.options.aggregates
      ? this.options.aggregates.split(',').map(a => a.trim()).filter(Boolean)
      : [];
    const hasMongoCleanup = aggregates.length > 0;
    const hasApiCleanup = resources.length > 0;

    const destRoot = `ms-${name}-playwright`;
    const dest = (p) => this.destinationPath(path.join(destRoot, p));

    const ctx = {
      name,
      serviceName,
      pascalName,
      hasGrpc,
      hasApiCleanup,
      hasMongoCleanup,
      resources,
      aggregates,
    };

    // package.json
    this.fs.writeJSON(dest('package.json'), this._generatePackageJson(ctx));

    // tsconfig.json
    this.fs.writeJSON(dest('tsconfig.json'), {
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'bundler',
        lib: ['ES2022'],
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        outDir: './dist',
        rootDir: '.',
      },
      include: ['src/**/*', 'global-setup.ts', 'global-teardown.ts', 'playwright.config.ts'],
      exclude: ['node_modules', 'dist', 'reports'],
    });

    // playwright.config.ts
    this.fs.write(dest('playwright.config.ts'), this._generatePlaywrightConfig(ctx));

    // global-setup.ts
    this.fs.write(dest('global-setup.ts'), this._generateGlobalSetup(ctx));

    // global-teardown.ts
    this.fs.write(dest('global-teardown.ts'), this._generateGlobalTeardown(ctx));

    // .env.local
    this.fs.write(dest('.env.local'), this._generateEnvLocal(ctx));

    // .env.staging
    this.fs.write(dest('.env.staging'), this._generateEnvStaging(ctx));

    // .gitignore
    this.fs.write(dest('.gitignore'), [
      'node_modules/',
      'dist/',
      'reports/',
      '.settings-cache.json',
      '*.env',
      '!.env.local',
      '!.env.staging',
    ].join('\n'));

    // src/config/environments.ts
    this.fs.write(dest('src/config/environments.ts'), this._generateEnvironments(ctx));

    // src/fixtures/index.ts
    this.fs.write(dest('src/fixtures/index.ts'), this._generateFixtures(ctx));

    // src/helpers/api-paths.ts
    this.fs.write(dest('src/helpers/api-paths.ts'), `import { apiPath } from '@codedesignplus/playwright-microservice';\n\nexport { apiPath };\n`);

    // src/helpers/cleanup-tracker.ts
    this.fs.write(dest('src/helpers/cleanup-tracker.ts'), this._generateCleanupTracker(ctx));

    // src/helpers/settings-cache.ts
    this.fs.write(dest('src/helpers/settings-cache.ts'), `export { readSettingsCache, isTokenExpired } from '@codedesignplus/playwright-microservice';\n`);

    // src/helpers/test-data.ts
    this.fs.write(dest('src/helpers/test-data.ts'), this._generateTestData(ctx));

    // src/types/index.ts
    this.fs.write(dest('src/types/index.ts'), this._generateTypes(ctx));

    // src/tests/suites/example.spec.ts
    this.fs.write(dest(`src/tests/suites/${name}.spec.ts`), this._generateSuiteSpec(ctx));

    // src/tests/smoke/example.smoke.ts
    this.fs.write(dest(`src/tests/smoke/${name}.smoke.ts`), this._generateSmokeSpec(ctx));

    // src/tests/flows/.gitkeep
    this.fs.write(dest('src/tests/flows/.gitkeep'), '');

    // gRPC files
    if (hasGrpc) {
      this.fs.write(dest('src/helpers/grpc-client.ts'), this._generateGrpcHelper(ctx));
      this.fs.write(dest(`src/proto/${name}.proto`), this._generateProto(ctx));
    }

    console.log(`\n✅ Project ms-${name}-playwright generated successfully!`);
    console.log(`\nNext steps:`);
    console.log(`  cd ${destRoot}`);
    console.log(`  npm install`);
    console.log(`  # Configure .env.local and .env.staging`);
    console.log(`  npm run test:smoke:staging`);
  }

  // ─── Generators ──────────────────────────────────────────────────────────

  _generatePackageJson(ctx) {
    const deps = {
      '@codedesignplus/playwright-microservice': '^1.0.0',
    };

    if (ctx.hasGrpc) {
      deps['@grpc/grpc-js'] = '^1.10.0';
      deps['@grpc/proto-loader'] = '^0.7.0';
    }

    return {
      name: `ms-${ctx.name}-playwright`,
      version: '1.0.0',
      private: true,
      type: 'module',
      scripts: {
        test: 'playwright test',
        'test:ui': 'playwright test --ui',
        'test:ui:local': 'cross-env ENV=local playwright test --ui',
        'test:ui:staging': 'cross-env ENV=staging playwright test --ui',
        'test:debug': 'playwright test --debug',
        'test:suites': 'playwright test --project=suites',
        'test:smoke': 'playwright test --project=smoke',
        'test:flows': 'playwright test --project=flows',
        'test:staging': 'cross-env ENV=staging playwright test',
        'test:local': 'cross-env ENV=local playwright test',
        'test:smoke:staging': 'cross-env ENV=staging playwright test --project=smoke',
        'test:smoke:local': 'cross-env ENV=local playwright test --project=smoke',
        'test:ci': 'cross-env ENV=staging playwright test --reporter=junit',
        report: 'playwright show-report reports/html',
      },
      dependencies: deps,
      devDependencies: {
        '@playwright/test': '^1.44.0',
        '@types/node': '^20.0.0',
        'cross-env': '^7.0.3',
        typescript: '^5.4.0',
      },
    };
  }

  _generatePlaywrightConfig(ctx) {
    return `import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  testMatch: ['**/*.spec.ts', '**/*.flow.ts', '**/*.smoke.ts'],
  timeout: 45_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
  ],
  use: {
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'suites',
      testMatch: '**/suites/**/*.spec.ts',
    },
    {
      name: 'smoke',
      testMatch: '**/smoke/**/*.smoke.ts',
    },
    {
      name: 'flows',
      testMatch: '**/flows/**/*.flow.ts',
      use: { actionTimeout: 25_000 },
    },
  ],
});
`;
  }

  _generateGlobalSetup(ctx) {
    return `import { createAuthSetup } from '@codedesignplus/playwright-microservice';

export default createAuthSetup();
`;
  }

  _generateGlobalTeardown(ctx) {
    if (!ctx.hasMongoCleanup) {
      return `export default async function globalTeardown() {
  // No MongoDB cleanup configured.
  // Add MongoCleanup here if the service lacks DELETE endpoints.
}
`;
    }

    const collectionsArr = ctx.aggregates.map(a => `'${a}'`).join(', ');

    return `import { MongoCleanup } from '@codedesignplus/playwright-microservice';

export default async function globalTeardown() {
  const cleaner = MongoCleanup.fromEnv('${ctx.serviceName}');

  await cleaner.cleanupByPattern(
    [${collectionsArr}],
    'Name',
    /^playwright-test-/
  );
}
`;
  }

  _generateEnvLocal(ctx) {
    return `ENV=local
TOKEN_URL=
CLIENT_SECRET=
TEST_USER=
TEST_PASSWORD=
TENANT_ID=
MONGO_URI=mongodb://localhost:27017
`;
  }

  _generateEnvStaging(ctx) {
    return `ENV=staging
TOKEN_URL=
CLIENT_SECRET=
TEST_USER=
TEST_PASSWORD=
TENANT_ID=
MONGO_URI=
`;
  }

  _generateEnvironments(ctx) {
    let grpcFields = '';
    let grpcConfig = '';

    if (ctx.hasGrpc) {
      grpcFields = `\n  grpcUrl: string;\n  grpcSecure: boolean;`;
      grpcConfig = `
    grpcUrl: envName === 'staging'
      ? 'ms-${ctx.name}-grpc.kappali.svc.cluster.local:5001'
      : 'localhost:5001',
    grpcSecure: envName === 'staging',`;
    }

    return `import { readSettingsCache, EnvName } from '@codedesignplus/playwright-microservice';

export interface EnvConfig {
  name: EnvName;
  baseUrl: string;
  apiPath: string;
  authToken: string;
  tenantId: string;${grpcFields}
}

export function getConfig(): EnvConfig {
  const envName = (process.env.ENV ?? 'local') as EnvName;

  const baseUrl = envName === 'staging'
    ? 'https://services.kappali.com'
    : 'http://localhost:5000';

  const apiPath = envName === 'staging' ? '/ms-${ctx.name}' : '';

  return {
    name: envName,
    baseUrl,
    apiPath,
    authToken: readSettingsCache()?.accessToken ?? process.env.AUTH_TOKEN ?? '',
    tenantId: process.env.TENANT_ID ?? '',${grpcConfig}
  };
}
`;
  }

  _generateFixtures(ctx) {
    let imports = `import { test as base, APIRequestContext, request } from '@playwright/test';
import { getConfig, EnvConfig } from '../config/environments';
import { cleanupTracker } from '../helpers/cleanup-tracker';`;

    let grpcFixture = '';
    let grpcInterface = '';

    if (ctx.hasGrpc) {
      imports += `\nimport { createGrpcClient, GrpcClient } from '../helpers/grpc-client';`;
      grpcInterface = `\n  grpc: GrpcClient;`;
      grpcFixture = `
  grpc: async ({ env }, use) => {
    const client = createGrpcClient(env.authToken);
    await use(client);
  },
`;
    }

    return `${imports}

interface TestFixtures {
  env: EnvConfig;
  api: APIRequestContext;
  anonApi: APIRequestContext;${grpcInterface}
}

export const test = base.extend<TestFixtures>({
  env: async ({}, use) => {
    await use(getConfig());
  },

  api: async ({ env }, use) => {
    const ctx = await request.newContext({
      baseURL: \`\${env.baseUrl}\${env.apiPath}/\`,
      ignoreHTTPSErrors: true,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(env.authToken ? { Authorization: \`Bearer \${env.authToken}\` } : {}),
        ...(env.tenantId ? { 'X-Tenant': env.tenantId } : {}),
      },
    });

    await use(ctx);
    await cleanupTracker.cleanupAll(ctx);
    await ctx.dispose();
  },

  anonApi: async ({ env }, use) => {
    const ctx = await request.newContext({
      baseURL: \`\${env.baseUrl}\${env.apiPath}/\`,
      ignoreHTTPSErrors: true,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    await use(ctx);
    await ctx.dispose();
  },
${grpcFixture}});

export { expect } from '@playwright/test';
`;
  }

  _generateCleanupTracker(ctx) {
    if (ctx.hasApiCleanup) {
      const entries = ctx.resources
        .map(r => `  ${r.name}: { path: '${r.path}' }`)
        .join(',\n');

      return `import { CleanupTracker } from '@codedesignplus/playwright-microservice';

export const cleanupTracker = new CleanupTracker({
${entries},
});
`;
    }

    return `import { CleanupTracker } from '@codedesignplus/playwright-microservice';

// Define resources that have DELETE endpoints for API-based cleanup.
// Format: { resourceName: { path: 'api/Resource/{id}', method?: 'DELETE' | 'PATCH' } }
export const cleanupTracker = new CleanupTracker({});
`;
  }

  _generateTestData(ctx) {
    return `import { cleanupTracker } from './cleanup-tracker';

// Generate test data for ${ctx.pascalName} resources.
// Always prefix names with 'playwright-test-' for MongoDB cleanup identification.

export function generate${ctx.pascalName}Data(overrides: Record<string, unknown> = {}) {
  const id = crypto.randomUUID();
  const timestamp = Date.now();

  return {
    id,
    name: \`playwright-test-\${timestamp}\`,
    isActive: true,
    ...overrides,
  };
}
`;
  }

  _generateTypes(ctx) {
    return `export { PaginationResponse, ProblemDetails } from '@codedesignplus/playwright-microservice';

// Add your service-specific DTOs below:

export interface ${ctx.pascalName}Dto {
  id: string;
  name: string;
  isActive: boolean;
}
`;
  }

  _generateSuiteSpec(ctx) {
    return `import { test, expect } from '../../fixtures';
import { apiPath } from '../../helpers/api-paths';
import { generate${ctx.pascalName}Data } from '../../helpers/test-data';
import { PaginationResponse, ProblemDetails, ${ctx.pascalName}Dto } from '../../types';

test.describe('${ctx.pascalName} - REST API', () => {
  test('GET /api/${ctx.pascalName} -> 401 without auth', async ({ anonApi }) => {
    const res = await anonApi.get(apiPath('api/${ctx.pascalName}'));
    expect(res.status()).toBe(401);
  });

  test('GET /api/${ctx.pascalName} -> 200 with auth', async ({ api }) => {
    const res = await api.get(apiPath('api/${ctx.pascalName}'));
    expect(res.status()).toBe(200);

    const body: PaginationResponse<${ctx.pascalName}Dto> = await res.json();
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('totalCount');
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('GET /api/${ctx.pascalName}/{id} -> 401 without auth', async ({ anonApi }) => {
    const fakeId = crypto.randomUUID();
    const res = await anonApi.get(apiPath(\`api/${ctx.pascalName}/\${fakeId}\`));
    expect(res.status()).toBe(401);
  });

  test('GET /api/${ctx.pascalName}/{id} -> 400 when not found', async ({ api }) => {
    const fakeId = crypto.randomUUID();
    const res = await api.get(apiPath(\`api/${ctx.pascalName}/\${fakeId}\`));
    expect(res.status()).toBe(400);

    const problem: ProblemDetails = await res.json();
    expect(problem.status).toBe(400);
    expect(problem.title).toBeTruthy();
  });

  test('POST /api/${ctx.pascalName} -> 204 creates resource', async ({ api }) => {
    const data = generate${ctx.pascalName}Data();
    const res = await api.post(apiPath('api/${ctx.pascalName}'), { data });
    expect(res.status()).toBe(204);
  });

  test('POST /api/${ctx.pascalName} -> 401 without auth', async ({ anonApi }) => {
    const data = generate${ctx.pascalName}Data();
    const res = await anonApi.post(apiPath('api/${ctx.pascalName}'), { data });
    expect(res.status()).toBe(401);
  });
});
`;
  }

  _generateSmokeSpec(ctx) {
    return `import { test, expect } from '../../fixtures';
import { apiPath } from '../../helpers/api-paths';

test.describe('${ctx.pascalName} - Smoke Tests', () => {
  test('GET /api/${ctx.pascalName} -> 401 without auth', async ({ anonApi }) => {
    const res = await anonApi.get(apiPath('api/${ctx.pascalName}'));
    expect(res.status()).toBe(401);
  });

  test('GET /api/${ctx.pascalName} -> 200 with auth', async ({ api }) => {
    const res = await api.get(apiPath('api/${ctx.pascalName}'));
    expect(res.status()).toBe(200);
  });
});
`;
  }

  _generateGrpcHelper(ctx) {
    return `import { createGrpcClient as createClient, promisifyGrpc, GrpcClient } from '@codedesignplus/playwright-microservice';
import { join } from 'path';
import { getConfig } from '../config/environments';

const PROTO_PATH = join(__dirname, '../proto/${ctx.name}.proto');

export type { GrpcClient };

export function createGrpcClient(authToken: string): GrpcClient {
  const config = getConfig();

  return createClient({
    protoPath: PROTO_PATH,
    packageName: '${ctx.pascalName}',
    serviceName: '${ctx.pascalName}',
    url: config.grpcUrl!,
    secure: config.grpcSecure!,
    authToken,
  });
}

export { promisifyGrpc };
`;
  }

  _generateProto(ctx) {
    return `syntax = "proto3";

package ${ctx.pascalName};

option csharp_namespace = "CodeDesignPlus.Net.Microservice.${ctx.pascalName}.gRpc.Protos";

import "google/protobuf/empty.proto";
import "google/protobuf/wrappers.proto";

// TODO: Define your gRPC service and messages
service ${ctx.pascalName} {
  rpc Get${ctx.pascalName} (Get${ctx.pascalName}Request) returns (Get${ctx.pascalName}Response);
  rpc Create${ctx.pascalName} (Create${ctx.pascalName}Request) returns (google.protobuf.Empty);
}

message Get${ctx.pascalName}Request {
  string Id = 1;
}

message Get${ctx.pascalName}Response {
  string id = 1;
  string name = 2;
  bool isActive = 3;
}

message Create${ctx.pascalName}Request {
  string id = 1;
  string name = 2;
}
`;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  _parseResources(resourcesStr) {
    if (!resourcesStr) return [];
    return resourcesStr.split(',').map(r => {
      const [name, path] = r.trim().split(':');
      return { name: name.trim(), path: path.trim() };
    }).filter(r => r.name && r.path);
  }

  _toPascalCase(str) {
    return str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
      .join('');
  }
}
