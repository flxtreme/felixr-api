import { prisma } from '../../core/prisma';
import { TrackBody } from './schema';

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

  // 5. Save to database
  try {
    await prisma.track.create({
      data: {
        visitorId: parsedData.visitorId,
        path: parsedData.path || [],
        currentUrl: parsedData.currentUrl,
        parameters: parsedData.parameters || {},
        from: parsedData.from || {},
        visitor: parsedData.visitor || {},
        location: parsedData.location || {},
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