import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import Fastify, { type FastifyInstance, type RouteOptions } from 'fastify';
import multipart from '@fastify/multipart';
import jwt from 'jsonwebtoken';
import { Value } from '@sinclair/typebox/value';
import type { TSchema } from '@sinclair/typebox';
import { config } from '../src/core/config';

const fixedDate = new Date('2025-01-01T00:00:00.000Z');
const row: Record<string, unknown> = {
  id: 'test-id', slug: 'test-slug', title: 'Test title', name: 'Test name',
  username: 'tester', email: 'test@example.com', password: 'hashed',
  description: 'Test description', content: 'Test content', excerpt: 'Test excerpt',
  phone: null, avatar: null, picture: null, emailVerified: false, emailVerifiedAt: null,
  phoneVerified: false, phoneVerifiedAt: null, isActive: true, isPinned: false, isDeleted: false,
  deletedBy: null, deletedAt: null, createdAt: fixedDate, updatedAt: fixedDate,
  createdBy: null, updatedBy: null, userId: 'test-id', pageId: 'test-id', publishedAt: fixedDate, postType: 'PAGE', status: 'PUBLISHED',
  roles: [], permissions: [], userRoles: [], rolePermissions: [],
  tags: [], featureImages: [], images: [], metadata: {}, views: 1, action: 'view',
  visitorId: 'visitor', path: [], currentUrl: '/', parameters: {}, from: {}, visitor: {},
  location: {}, changes: null, ip: null, timestamp: fixedDate,
  price: 10, value: 'test', key: 'test', url: 'https://example.test', link: 'https://example.test', image: 'https://example.test/image.png', category: 'test', actionType: 'redirect', actionLabel: 'View', _count: { posts: 1 },
  links: [], excludeFromPages: false, bucket: 'media', alt: 'Example image',
  role: 'Engineer', company: 'Example Co', start: 'Jan 2024', end: 'Present', responsibilities: [], details: [], linkLabel: 'Visit', external: false, label: 'Example', color: '#123456', issuer: 'Example Issuer', issuedAt: fixedDate, provider: 'Example Provider', completedAt: fixedDate,
};

const prismaMock = new Proxy<Record<string, unknown>>({}, {
  get(_target, model: string) {
    if (model.startsWith('$')) {
      if (model === '$transaction') return async (arg: unknown) => {
        if (typeof arg === 'function') return arg(prismaMock);
        if (Array.isArray(arg)) return Promise.all(arg);
        return arg;
      };
      if (model === '$queryRaw') return async () => [];
      return async () => undefined;
    }
    return new Proxy({}, {
      get(_delegate, method: string) {
        if (method === 'findMany') return async () => [row];
        if (method === 'count') return async () => 1;
        if (method === 'findUnique' || method === 'findFirst') return async () => ({ ...row, userRoles: [] });
        if (method === 'deleteMany' || method === 'createMany') return async () => ({ count: 1 });
        if (method === 'upsert' || method === 'create' || method === 'update' || method === 'delete') return async ({ data }: { data?: Record<string, unknown> } = {}) => ({ ...row, ...Object.fromEntries(Object.entries(data ?? {}).filter(([, value]) => value !== undefined)), userRoles: [] });
        return async () => row;
      },
    });
  },
});

vi.mock('../src/core/prisma', () => ({ prisma: prismaMock }));
vi.mock('../src/core/password', () => ({ hash: vi.fn(async () => 'hashed'), verify: vi.fn(async () => true) }));
vi.mock('../src/core/storage', () => ({
  BUCKETS: { CONTENT: 'content', MEDIA: 'media', FILES: 'files' },
  uploadFile: vi.fn(async (_bucket: string, path: string) => path),
  downloadText: vi.fn(async () => 'Test content'),
  downloadBuffer: vi.fn(async () => Buffer.from('file')),
  getPublicUrl: vi.fn((_bucket: string, path: string) => `https://example.test/${path}`),
  getSignedUrl: vi.fn(async () => 'https://example.test/signed'),
  deleteFiles: vi.fn(async () => undefined),
  deleteFolder: vi.fn(async () => undefined),
  listFiles: vi.fn(async () => []),
}));

type RegisteredRoute = Pick<RouteOptions, 'method' | 'url' | 'schema' | 'config'>;
type InjectMethod = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';
const injectMethods: readonly InjectMethod[] = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'];
function isInjectMethod(method: string): method is InjectMethod {
  return injectMethods.includes(method as InjectMethod);
}

let app: FastifyInstance;
const routes: RegisteredRoute[] = [];
const token = jwt.sign({ id: 'test-id' }, config.jwtSecret);

beforeAll(async () => {
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
  const { routesPlugin } = await import('../src/routes');
  app = Fastify();
  app.addHook('onRoute', (route) => {
    routes.push(route as RegisteredRoute);
  });
  await app.register(multipart);
  await app.register(routesPlugin, { prefix: config.apiPrefix });
  await app.ready();
});

afterAll(async () => { await app.close(); vi.restoreAllMocks(); });

function urlFor(route: RegisteredRoute): string {
  return route.url.replace(/:([\w]+)/g, (_match, name: string) => {
    const params = route.schema?.params;
    const properties = params && typeof params === 'object'
      ? (params as { properties?: Record<string, { type?: string }> }).properties
      : undefined;
    const value = properties?.[name];
    return value?.type === 'number' ? '1' : 'test-id';
  });
}

function payloadFor(route: RegisteredRoute): Record<string, unknown> | undefined {
  const schema = route.schema?.body as TSchema | undefined;
  if (!schema) return undefined;
  let payload: Record<string, unknown>;
  try { payload = Value.Create(schema) as Record<string, unknown>; } catch { payload = {}; }
  if (route.url.startsWith('/api/admin/post/')) {
    payload = { slug: 'test-slug', content: 'Test content', status: 'DRAFT', postType: 'POST', metadata: {}, title: 'Test title', ...payload };
  }
  if (route.url.startsWith('/api/admin/upload/') && methodIsPut(route)) payload = { name: 'Updated file', ...payload };
  return payload;
}

function methodIsPut(route: RegisteredRoute): boolean {
  return (Array.isArray(route.method) ? route.method : [route.method]).includes('PUT');
}

function queryFor(route: RegisteredRoute): string {
  const schema = route.schema?.querystring as TSchema | undefined;
  if (!schema) return '';
  try {
    const query = Value.Create(schema) as Record<string, unknown>;
    const entries = Object.entries(query).filter(([, value]) => value !== undefined);
    return entries.length
      ? `?${new URLSearchParams(entries.map(([key, value]) => [key, String(value)] as [string, string]))}`
      : '';
  } catch { return ''; }
}

describe('registered API routes', () => {
  it('registers every route in auth, public, track, and admin modules', () => {
    const endpoints = new Set(routes.flatMap(({ method, url }) => (Array.isArray(method) ? method : [method]).filter(isInjectMethod).filter((verb) => verb !== 'HEAD').map((verb) => `${verb} ${url}`)));
    expect(endpoints.size).toBe(96);
    const groups = { auth: 2, public: 21, track: 4, admin: 69 };
    for (const [group, expectedCount] of Object.entries(groups)) {
      const count = [...endpoints].filter((endpoint) => endpoint.includes(`/api/${group}/`)).length;
      expect(count, `${group} endpoint count`).toBe(expectedCount);
    }
  });

  it('accepts representative requests for all 96 registered endpoints', async () => {
    const endpointMap = new Map<string, { route: RegisteredRoute; method: InjectMethod }>();
    for (const route of routes) {
      for (const method of (Array.isArray(route.method) ? route.method : [route.method]).filter(isInjectMethod)) {
        if (method === 'HEAD') continue;
        endpointMap.set(`${method} ${route.url}`, { route, method });
      }
    }
    expect(endpointMap.size).toBe(96);
    for (const [label, { route, method }] of endpointMap) {
      const path = `${urlFor(route)}${method === 'GET' ? queryFor(route) : ''}`;
      const security = (route.schema as { security?: unknown[] } | undefined)?.security;
      const isPublic = route.config?.public === true || security?.length === 0;
      const isUpload = method === 'POST' && route.url === '/api/admin/upload/';
      const boundary = 'vitest-route-boundary';
      const uploadPayload = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="sample.png"\r\nContent-Type: image/png\r\n\r\nimage-bytes\r\n--${boundary}--\r\n`;
      const response = await app.inject({
        method,
        url: path,
        payload: isUpload ? uploadPayload : method === 'GET' || method === 'HEAD' ? undefined : payloadFor(route),
        headers: {
          ...(isPublic ? {} : { authorization: `Bearer ${token}` }),
          ...(isUpload ? { 'content-type': `multipart/form-data; boundary=${boundary}` } : {}),
        },
      });
      expect(response.statusCode, `${label}: ${response.body}`).toBeLessThan(400);
    }
  });

  it('rejects invalid login bodies with a schema error', async () => {
    const response = await app.inject({ method: 'POST', url: '/api/auth/login', payload: { username: 'only-name' } });
    expect(response.statusCode).toBe(400);
  });

  it('rejects protected admin access without credentials', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/admin/user' });
    expect(response.statusCode).toBe(401);
  });
});
