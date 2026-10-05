import { Prisma } from '@prisma/client';
import { prisma } from '../../core/prisma';
import { resolveMeta } from '../../utils';
import { GetTracksQuery, GetTracksResponse, Track, TrackAction, TrackBody } from './schema';

export const getTracks = async (query: GetTracksQuery): Promise<GetTracksResponse> => {
  const {
    offset = 0,
    limit = 10,
    search,
    action,
    visitorId,
    path,
    currentUrl,
    ip,
    timestampFrom,
    timestampTo,
  } = query;

  const where: Prisma.TrackWhereInput = {};
  const filters: Prisma.TrackWhereInput[] = [];

  if (action) filters.push({ action });
  if (visitorId) filters.push({ visitorId });
  if (path) filters.push({ path: { has: path } });
  if (currentUrl) filters.push({ currentUrl: { contains: currentUrl, mode: 'insensitive' } });
  if (ip) filters.push({ ip });
  if (timestampFrom || timestampTo) {
    filters.push({
      timestamp: {
        ...(timestampFrom ? { gte: new Date(timestampFrom) } : {}),
        ...(timestampTo ? { lte: new Date(timestampTo) } : {}),
      },
    });
  }
  if (search) {
    filters.push({
      OR: [
        { visitorId: { contains: search, mode: 'insensitive' } },
        { currentUrl: { contains: search, mode: 'insensitive' } },
        { ip: { contains: search } },
        { path: { has: search } },
      ],
    });
  }
  if (filters.length > 0) where.AND = filters;

  const [data, total] = await Promise.all([
    prisma.track.findMany({
      where,
      orderBy: [{ timestamp: 'desc' }, { createdAt: 'desc' }],
      skip: offset,
      take: limit,
    }),
    prisma.track.count({ where }),
  ]);

  return {
    data: data.map((track) => ({
      ...track,
      action: track.action as TrackAction,
      changes: track.changes as unknown as Track['changes'],
    })),
    meta: resolveMeta(total, offset, limit),
  };
};

export const bulkDeleteTracks = async (ids: string[]) => {
  const result = await prisma.track.deleteMany({
    where: { id: { in: ids } },
  });
  return { deletedCount: result.count };
};

export const trackAnalytics = async (data: TrackBody, ip: string | null) => {
  const { payload } = data;

  // 1. Decode base64 chunks back to text
  const decodedChunks = payload.map((chunk) => {
    return Buffer.from(chunk, 'base64').toString('utf8');
  });

  // 2. Sort chunks by their zero-padded index (e.g. "00~~~...")
  decodedChunks.sort((a, b) => {
    const idxA = parseInt(a.split('~~~')[0], 10);
    const idxB = parseInt(b.split('~~~')[0], 10);
    return idxA - idxB;
  });

  // 3. Reconstruct JSON string by dropping the prefix
  const jsonString = decodedChunks
    .map((chunk) => {
      const idx = chunk.indexOf('~~~');
      if (idx === -1) return '';
      return chunk.slice(idx + 3);
    })
    .join('');

  if (!jsonString) {
    return { success: false };
  }

  // 4. Parse the JSON
  let parsedData: any;
  try {
    parsedData = JSON.parse(jsonString);
  } catch (err) {
    console.error('[trackAnalytics] Failed to parse JSON', err);
    return { success: false };
  }

  const validActions = ['view', 'insert', 'soft_delete', 'delete', 'update'];
  const action = parsedData.action ?? 'view';
  if (!validActions.includes(action)) {
    console.error('[trackAnalytics] Unsupported action', action);
    return { success: false };
  }

  const changes = parsedData.changes;
  if (
    changes != null &&
    (typeof changes !== 'object' || Array.isArray(changes) ||
      typeof changes.data !== 'object' || changes.data === null || Array.isArray(changes.data) ||
      typeof changes.update !== 'object' || changes.update === null || Array.isArray(changes.update))
  ) {
    console.error('[trackAnalytics] Invalid changes payload');
    return { success: false };
  }

  // 5. Save to database
  try {
    await prisma.track.create({
      data: {
        visitorId: parsedData.visitorId,
        action,
        path: parsedData.path || [],
        currentUrl: parsedData.currentUrl,
        parameters: parsedData.parameters || {},
        from: parsedData.from || {},
        visitor: parsedData.visitor || {},
        location: parsedData.location || {},
        ...(changes != null ? { changes } : {}),
        ip,
        timestamp: new Date(parsedData.timestamp),
      },
    });
  } catch (err) {
    console.error('[trackAnalytics] Failed to save track data', err);
    return { success: false };
  }

  return { success: true };
};

export const getViews = async (pathStr: string) => {
  const pathArr = pathStr.split('/').filter(Boolean);
  const slug = pathArr.pop();

  if (!slug) {
    return { views: 0 };
  }

  const result: any[] = await prisma.$queryRaw`
    SELECT COUNT(DISTINCT CONCAT(
      ip, 
      '-', 
      visitor->'screen'->>'width', 
      '-', 
      visitor->'screen'->>'height', 
      '-', 
      visitor->>'userAgent'
    )) as views
    FROM tracks, unnest(path) as segment
    WHERE segment = ${slug}
  `;

  return { views: Number(result[0]?.views || 0) };
};

export const getBatchViews = async (slugs: string[]) => {
  if (slugs.length === 0) return {};

  const result: any[] = await prisma.$queryRaw`
    SELECT
      segment as slug,
      COUNT(DISTINCT CONCAT(
        ip, 
        '-', 
        visitor->'screen'->>'width', 
        '-', 
        visitor->'screen'->>'height', 
        '-', 
        visitor->>'userAgent'
      )) as views
    FROM tracks, unnest(path) as segment
    WHERE segment = ANY(${slugs}::text[])
    GROUP BY segment
  `;

  const viewsMap: Record<string, number> = {};
  for (const row of result) {
    viewsMap[row.slug] = Number(row.views);
  }
  return viewsMap;
};
