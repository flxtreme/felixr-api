import { Prisma } from '@prisma/client';
import { config } from '../../../core/config';
import { prisma } from '../../../core/prisma';
import { BUCKETS, deleteFiles, getPublicUrl, getSignedUrl, uploadFile } from '../../../core/storage';
import { resolveMeta } from '../../../utils';
import { UpdateUploadBody, UploadQuery } from './schema';
import { basename, extname } from 'node:path';
import { randomUUID } from 'node:crypto';

const configuredBuckets = () => Object.values(config.supabase.buckets).filter(Boolean);

const withPublicPath = <T extends { bucket: string; path: string }>(upload: T) => ({
  ...upload,
  publicPath: getPublicUrl(upload.bucket as Parameters<typeof getPublicUrl>[0], upload.path),
});

export const listUploads = async ({ offset = 0, limit = 10, search }: UploadQuery) => {
  const where: Prisma.UploadWhereInput = search
    ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { path: { contains: search, mode: 'insensitive' } }] }
    : {};
  const [uploads, total] = await Promise.all([
    prisma.upload.findMany({ where, orderBy: { createdAt: 'desc' }, skip: offset, take: limit }),
    prisma.upload.count({ where }),
  ]);
  return { data: uploads.map(withPublicPath), meta: resolveMeta(total, offset, limit) };
};

export const getUpload = async (id: string) => {
  const upload = await prisma.upload.findUnique({ where: { id } });
  return upload && withPublicPath(upload);
};

export const getSignedUploadUrl = async (id: string, download: boolean) => {
  const upload = await prisma.upload.findUnique({ where: { id } });
  if (!upload) return null;

  const expiresIn = 3600;
  const url = await getSignedUrl(
    upload.bucket as Parameters<typeof getSignedUrl>[0],
    upload.path,
    expiresIn,
    download,
  );
  return { url, expiresIn };
};

export const deleteUpload = async (id: string) => {
  const upload = await prisma.upload.findUnique({ where: { id } });
  if (!upload) return null;

  await deleteFiles(upload.bucket as Parameters<typeof deleteFiles>[0], [upload.path]);
  await prisma.upload.delete({ where: { id } });
  return { id, deleted: true };
};

export const updateUpload = async (id: string, body: UpdateUploadBody) => {
  const current = await prisma.upload.findUnique({ where: { id } });
  if (!current) return null;

  const upload = await prisma.upload.update({
    where: { id },
    data: {
      ...body,
      metadata: body.metadata === undefined
        ? undefined
        : body.metadata === null ? Prisma.JsonNull : body.metadata as Prisma.InputJsonValue,
    },
  });
  return withPublicPath(upload);
};

const MEDIA_EXTENSIONS = new Set([
  '.avif', '.gif', '.heic', '.heif', '.jpeg', '.jpg', '.png', '.svg', '.webp', '.bmp', '.ico',
  '.mp3', '.m4a', '.ogg', '.wav', '.flac', '.aac', '.mp4', '.m4v', '.mov', '.mpeg', '.mpg', '.webm', '.avi',
]);

export const createUpload = async (input: {
  buffer: Buffer;
  filename: string;
  mimetype: string;
  alt?: string | null;
  metadata?: Prisma.JsonValue;
}) => {
  const filename = basename(input.filename.replace(/\\/g, '/'))
    // eslint-disable-next-line no-control-regex -- sanitize control characters in user-supplied filenames
    .replace(/[\u0000-\u001f\u007f]/g, '') || 'upload';
  const safeFilename = filename === '.' || filename === '..' ? 'upload' : filename;
  const extension = extname(safeFilename).toLowerCase();
  const bucket = MEDIA_EXTENSIONS.has(extension) ? BUCKETS.MEDIA : BUCKETS.FILES;
  if (!bucket || !configuredBuckets().includes(bucket)) {
    throw Object.assign(new Error('The destination storage bucket is not configured'), { statusCode: 500 });
  }

  const id = randomUUID();
  const path = `uploads/${id}/${safeFilename}`;
  await uploadFile(bucket, path, input.buffer, input.mimetype || 'application/octet-stream');

  try {
    const upload = await prisma.upload.create({
      data: {
        id,
        bucket,
        path,
        name: safeFilename,
        alt: input.alt,
        metadata: input.metadata === undefined
          ? undefined
          : input.metadata === null ? Prisma.JsonNull : input.metadata as Prisma.InputJsonValue,
      },
    });
    return withPublicPath(upload);
  } catch (error) {
    await deleteFiles(bucket, [path]);
    throw error;
  }
};
