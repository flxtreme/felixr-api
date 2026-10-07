import { beforeEach, describe, expect, it, vi } from 'vitest';

const db = vi.hoisted(() => {
  const calls: { model: string; method: string; args: unknown }[] = [];
  const overrides: Record<string, unknown> = {};
  const methods = new Proxy<Record<string, unknown>>({}, {
    get(_target, model: string) {
      return new Proxy({}, {
        get(_delegate, method: string) {
          return async (args?: unknown) => {
            calls.push({ model, method, args });
            const key = `${model}.${method}`;
            if (Object.prototype.hasOwnProperty.call(overrides, key)) return overrides[key];
            if (method === 'findMany') return [];
            if (method === 'count') return 0;
            if (method === 'deleteMany' || method === 'createMany') return { count: 0 };
            if (method === '$queryRaw') return [];
            if (method === '$transaction') {
              if (typeof args === 'function') return args(prisma);
              if (Array.isArray(args)) return Promise.all(args);
              return args;
            }
            return null;
          };
        },
      });
    },
  });
  const prisma = new Proxy({}, {
    get: (_target, key: string) => {
      if (key === '$queryRaw') return async (strings: TemplateStringsArray, ...values: unknown[]) => {
        calls.push({ model: '$queryRaw', method: '$queryRaw', args: { strings: [...strings], values } });
        return overrides['$queryRaw.$queryRaw'] ?? [];
      };
      if (key === '$transaction') return async (action: unknown) => {
        calls.push({ model: '$transaction', method: '$transaction', args: action });
        if (typeof action === 'function') return action(prisma);
        if (Array.isArray(action)) return Promise.all(action);
        return action;
      };
      return methods[key];
    },
  });
  return { calls, overrides, prisma };
});

vi.mock('../src/core/prisma', () => ({ prisma: db.prisma }));
vi.mock('../src/core/config', () => ({ config: { jwtSecret: 'service-test-secret', supabase: { buckets: { content: 'content', media: 'media', files: 'files' } } } }));
vi.mock('../src/core/password', () => ({ hash: vi.fn(async () => 'hashed-password'), verify: vi.fn(async () => false) }));
vi.mock('../src/core/storage', () => ({
  BUCKETS: { CONTENT: 'content', MEDIA: 'media', FILES: 'files' },
  uploadFile: vi.fn(async (_bucket: string, path: string) => path),
  downloadText: vi.fn(async () => 'content'),
  downloadBuffer: vi.fn(async () => Buffer.from('file')),
  getPublicUrl: vi.fn((_bucket: string, path: string) => `https://example.test/${path}`),
  getSignedUrl: vi.fn(async () => 'https://example.test/signed'),
  deleteFiles: vi.fn(async () => undefined),
  deleteFolder: vi.fn(async () => undefined),
  listFiles: vi.fn(async () => []),
}));

import * as adminCertification from '../src/routes/admin/certification/service';
import * as adminExperience from '../src/routes/admin/experience/service';
import * as adminGig from '../src/routes/admin/gig/service';
import * as adminPermission from '../src/routes/admin/permission/service';
import * as adminPost from '../src/routes/admin/post/service';
import * as adminProduct from '../src/routes/admin/product/service';
import * as adminProject from '../src/routes/admin/project/service';
import * as adminRole from '../src/routes/admin/role/service';
import * as adminStack from '../src/routes/admin/stack/service';
import * as adminTag from '../src/routes/admin/tag/service';
import * as adminTraining from '../src/routes/admin/training/service';
import * as adminUpload from '../src/routes/admin/upload/service';
import * as adminUser from '../src/routes/admin/user/service';
import * as authServices from '../src/routes/auth/services';
import * as publicCertification from '../src/routes/public/certification/service';
import * as publicExperience from '../src/routes/public/experience/service';
import * as publicGig from '../src/routes/public/gig/service';
import * as publicPost from '../src/routes/public/post/service';
import * as publicProduct from '../src/routes/public/product/service';
import * as publicProject from '../src/routes/public/project/service';
import * as publicStack from '../src/routes/public/stack/service';
import * as publicTag from '../src/routes/public/tag/service';
import * as publicTraining from '../src/routes/public/training/service';
import * as track from '../src/routes/track/service';

beforeEach(() => {
  db.calls.length = 0;
  for (const key of Object.keys(db.overrides)) delete db.overrides[key];
});

const argsOf = (call: { args: unknown } | undefined): Record<string, unknown> => {
  const args = call?.args;
  return args && typeof args === 'object' ? args as Record<string, unknown> : {};
};

type ListCase = { name: string; model: string; run: () => Promise<unknown>; where?: Record<string, unknown> };
const listCases: ListCase[] = [
  { name: 'admin certification', model: 'certification', run: () => adminCertification.getCertifications({ isActive: true }), where: { isDeleted: false } },
  { name: 'admin experience', model: 'experience', run: () => adminExperience.getExperiences({ isActive: true }), where: { isDeleted: false } },
  { name: 'admin gig', model: 'gig', run: () => adminGig.getGigs({ isActive: true }), where: { isDeleted: false } },
  { name: 'admin permission', model: 'permission', run: () => adminPermission.getPermissions({ search: 'reader' }), where: { OR: expect.any(Array) } },
  { name: 'admin post', model: 'post', run: () => adminPost.getPosts({ status: 'TRASHED' }), where: { status: 'TRASHED', isDeleted: true } },
  { name: 'admin product', model: 'product', run: () => adminProduct.getProducts({ isActive: true }), where: { isDeleted: false } },
  { name: 'admin project', model: 'project', run: () => adminProject.getProjects({ search: 'portfolio' }), where: { isDeleted: false, OR: expect.any(Array) } },
  { name: 'admin role', model: 'role', run: () => adminRole.getRoles({ search: 'editor' }), where: { AND: expect.any(Array) } },
  { name: 'admin stack', model: 'stack', run: () => adminStack.getStacks({ isActive: true }), where: { isDeleted: false } },
  { name: 'admin tag', model: 'tag', run: () => adminTag.getTags({ isActive: true }), where: { isDeleted: false } },
  { name: 'admin training', model: 'training', run: () => adminTraining.getTrainings({ isActive: true }), where: { isDeleted: false } },
  { name: 'admin upload', model: 'upload', run: () => adminUpload.listUploads({ search: 'report' }), where: { OR: expect.any(Array) } },
  { name: 'admin user', model: 'user', run: () => adminUser.getUsers({ isActive: true }), where: { isActive: true, isDeleted: false } },
  { name: 'public certification', model: 'certification', run: () => publicCertification.getCertifications({ search: 'AWS' }), where: { isDeleted: false, OR: expect.any(Array) } },
  { name: 'public experience', model: 'experience', run: () => publicExperience.getExperiences({ search: 'engineer' }), where: { isDeleted: false, OR: expect.any(Array) } },
  { name: 'public gig', model: 'gig', run: () => publicGig.getGigs({ search: 'design' }), where: { isDeleted: false, OR: expect.any(Array) } },
  { name: 'public post', model: 'post', run: () => publicPost.getPosts({ postType: 'PAGE', search: 'home' }), where: { postType: 'PAGE', isDeleted: false, status: 'PUBLISHED', OR: expect.any(Array) } },
  { name: 'public product', model: 'product', run: () => publicProduct.getProducts({ search: 'book' }), where: { isDeleted: false, OR: expect.any(Array) } },
  { name: 'public project', model: 'project', run: () => publicProject.getProjects({ search: 'portfolio' }), where: { isDeleted: false, page: { isDeleted: false, status: 'PUBLISHED' }, OR: expect.any(Array) } },
  { name: 'public stack', model: 'stack', run: () => publicStack.getStacks({ search: 'typescript' }), where: { isDeleted: false, OR: expect.any(Array) } },
  { name: 'public tag', model: 'tag', run: () => publicTag.getPublicTags({ isActive: true, search: 'news' }), where: { isDeleted: false, OR: expect.any(Array) } },
  { name: 'public training', model: 'training', run: () => publicTraining.getTrainings({ search: 'vitest' }), where: { isDeleted: false, OR: expect.any(Array) } },
  { name: 'track analytics', model: 'track', run: () => track.getTracks({ action: 'view', visitorId: 'visitor-1' }), where: { AND: [{ action: 'view' }, { visitorId: 'visitor-1' }] } },
];

describe('service module list behavior', () => {
  it.each(listCases)('$name applies filters through its Prisma model and returns an empty result', async ({ model, run, where }) => {
    const result = await run();
    const query = db.calls.find((call) => call.model === model && call.method === 'findMany');
    expect(query).toBeDefined();
    const queryArgs = argsOf(query);
    expect(queryArgs?.where).toMatchObject(where ?? {});
    const rows = Array.isArray(result)
      ? result
      : result && typeof result === 'object'
        ? (result as { data?: unknown }).data
        : undefined;
    expect(rows).toEqual([]);
  });

  it('auth service checks an account before comparing its password', async () => {
    const result = await authServices.loginUser({ username: 'missing', password: 'password' });
    expect(result).toBeNull();
    expect(db.calls).toContainEqual(expect.objectContaining({
      model: 'user', method: 'findUnique',
      args: expect.objectContaining({ where: { username: 'missing', isDeleted: false } }),
    }));
  });
});

describe('service transformations and external boundaries', () => {
  it('public post listing enforces published visibility and flattens tag slugs and view counts', async () => {
    db.overrides['post.findMany'] = [{
      slug: 'hello', title: 'Hello', excerpt: null, publishedAt: new Date('2025-01-01T00:00:00Z'),
      createdAt: new Date('2025-01-01T00:00:00Z'), updatedAt: new Date('2025-01-01T00:00:00Z'),
      featureImages: [], postType: 'PAGE', tags: [{ tag: { slug: 'news' } }],
    }];
    db.overrides['$queryRaw.$queryRaw'] = [{ slug: 'hello', views: 7n }];

    const result = await publicPost.getPosts({ postType: 'PAGE' });
    const findMany = db.calls.find((call) => call.model === 'post' && call.method === 'findMany');
    expect(argsOf(findMany).where).toMatchObject({ postType: 'PAGE', isDeleted: false, status: 'PUBLISHED' });
    expect(result.data[0]).toMatchObject({ slug: 'hello', tags: ['news'], views: 7 });
  });

  it('public post content returns null for a missing post and uses the associated content path otherwise', async () => {
    const storage = await import('../src/core/storage');
    db.overrides['post.findUnique'] = null;
    expect(await publicPost.getPostContent('missing')).toBeNull();

    db.overrides['post.findUnique'] = { id: 'post-1' };
    expect(await publicPost.getPostContent('hello')).toBe('content');
    expect(storage.downloadText).toHaveBeenCalledWith('content', 'posts/post-1/content.md');
  });

  it('track analytics decodes ordered payload chunks and persists the event with the request IP', async () => {
    const event = {
      visitorId: 'visitor-1', path: ['blog', 'hello'], currentUrl: '/blog/hello',
      parameters: {}, from: {}, visitor: {}, location: {}, timestamp: '2025-01-01T00:00:00.000Z',
    };
    const encodeChunk = (index: number, text: string) => Buffer.from(`${String(index).padStart(2, '0')}~~~${text}`).toString('base64');
    const result = await track.trackAnalytics({ payload: [encodeChunk(1, JSON.stringify(event))] }, '127.0.0.1');
    expect(result).toEqual({ success: true });
    expect(argsOf(db.calls.find((call) => call.model === 'track' && call.method === 'create')).data)
      .toMatchObject({ visitorId: 'visitor-1', action: 'view', path: ['blog', 'hello'], ip: '127.0.0.1' });
  });

  it('track analytics rejects malformed JSON without writing to the database', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const result = await track.trackAnalytics({ payload: [Buffer.from('00~~~not-json').toString('base64')] }, null);
    expect(result).toEqual({ success: false });
    expect(db.calls.some((call) => call.model === 'track' && call.method === 'create')).toBe(false);
    log.mockRestore();
  });

  it('track view counts use the last non-empty URL segment and return numeric counts', async () => {
    db.overrides['$queryRaw.$queryRaw'] = [{ views: 4n }];
    expect(await track.getViews('/blog/hello/')).toEqual({ views: 4 });
    expect(await track.getViews('/')).toEqual({ views: 0 });
  });

  it('upload service creates a storage object and persists its returned path', async () => {
    const storage = await import('../src/core/storage');
    db.overrides['upload.create'] = { id: 'upload-1', bucket: 'media', path: 'uploads/upload-1/photo.png', name: 'photo.png', alt: null, metadata: {}, createdAt: new Date(), updatedAt: new Date() };
    const result = await adminUpload.createUpload({ buffer: Buffer.from('image'), filename: 'photo.png', mimetype: 'image/png' });
    expect(storage.uploadFile).toHaveBeenCalledWith('media', expect.stringMatching(/^uploads\/.+\/photo\.png$/), expect.any(Buffer), 'image/png');
    expect(result).toMatchObject({ bucket: 'media', name: 'photo.png', publicPath: expect.stringContaining('photo.png') });
  });

  it('public product listing orders by pinned state first, then newest first', async () => {
    await publicProduct.getProducts({ limit: 12, offset: 24, search: 'theme' });
    const findMany = db.calls.find((call) => call.model === 'product' && call.method === 'findMany');
    expect(findMany).toBeDefined();
    expect(argsOf(findMany)).toMatchObject({
      where: {
        isDeleted: false,
        OR: [
          { title: { contains: 'theme', mode: 'insensitive' } },
          { description: { contains: 'theme', mode: 'insensitive' } },
          { category: { contains: 'theme', mode: 'insensitive' } },
        ],
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      take: 12,
      skip: 24,
    });
  });

  it('admin product update persists isPinned toggle and records audit info', async () => {
    db.overrides['product.findUnique'] = { id: 'prod-1', title: 'Product 1', isPinned: false };
    db.overrides['product.update'] = { id: 'prod-1', title: 'Product 1', isPinned: true, updatedBy: 'user-admin' };

    const result = await adminProduct.updateProduct('prod-1', { isPinned: true }, 'user-admin');
    expect(result).toMatchObject({ id: 'prod-1', isPinned: true, updatedBy: 'user-admin' });
    const updateCall = db.calls.find((call) => call.model === 'product' && call.method === 'update');
    expect(updateCall).toBeDefined();
    expect(argsOf(updateCall)).toMatchObject({
      where: { id: 'prod-1' },
      data: expect.objectContaining({ isPinned: true, updatedBy: 'user-admin' }),
    });
  });
});

describe('admin gig and product soft-delete filter', () => {
  it('getGigs excludes soft-deleted records when isActive is not provided', async () => {
    await adminGig.getGigs({});
    const findMany = db.calls.find((c) => c.model === 'gig' && c.method === 'findMany');
    expect(argsOf(findMany).where).toMatchObject({ isDeleted: false });
  });

  it('getGigs returns only soft-deleted records when isActive is false', async () => {
    await adminGig.getGigs({ isActive: false });
    const findMany = db.calls.find((c) => c.model === 'gig' && c.method === 'findMany');
    expect(argsOf(findMany).where).toMatchObject({ isDeleted: true });
  });

  it('getProducts excludes soft-deleted records when isActive is not provided', async () => {
    await adminProduct.getProducts({});
    const findMany = db.calls.find((c) => c.model === 'product' && c.method === 'findMany');
    expect(argsOf(findMany).where).toMatchObject({ isDeleted: false });
  });

  it('getProducts returns only soft-deleted records when isActive is false', async () => {
    await adminProduct.getProducts({ isActive: false });
    const findMany = db.calls.find((c) => c.model === 'product' && c.method === 'findMany');
    expect(argsOf(findMany).where).toMatchObject({ isDeleted: true });
  });
});

