import { prisma } from '../../core/prisma';
import { TrackBody } from './schema';

export const trackAnalytics = async (data: TrackBody) => {
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
        currentUrl: parsedData.currentUrl,
        parameters: parsedData.parameters || {},
        from: parsedData.from || {},
        visitor: parsedData.visitor || {},
        location: parsedData.location || {},
        timestamp: new Date(parsedData.timestamp),
      },
    });
  } catch (err) {
    console.error('[trackAnalytics] Failed to save track data', err);
    return { success: false };
  }

  return { success: true };
};
