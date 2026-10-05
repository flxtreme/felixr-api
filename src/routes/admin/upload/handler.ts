import { FastifyReply, FastifyRequest } from 'fastify';
import { Prisma } from '@prisma/client';
import { SignedUploadUrlQuery, UpdateUploadBody, UploadParams, UploadQuery } from './schema';
import * as service from './service';

export const listUploads = async (req: FastifyRequest<{ Querystring: UploadQuery }>, reply: FastifyReply) =>
  reply.status(200).send(await service.listUploads(req.query));

export const getUpload = async (req: FastifyRequest<{ Params: UploadParams }>, reply: FastifyReply) => {
  const upload = await service.getUpload(req.params.id);
  if (!upload) return reply.status(404).send({ message: 'Upload not found' });
  return reply.status(200).send(upload);
};

export const getSignedUploadUrl = async (req: FastifyRequest<{ Params: UploadParams; Querystring: SignedUploadUrlQuery }>, reply: FastifyReply) => {
  const result = await service.getSignedUploadUrl(req.params.id, req.query.download === true);
  if (!result) return reply.status(404).send({ message: 'Upload not found' });
  return reply.status(200).send(result);
};

export const deleteUpload = async (req: FastifyRequest<{ Params: UploadParams }>, reply: FastifyReply) => {
  const result = await service.deleteUpload(req.params.id);
  if (!result) return reply.status(404).send({ message: 'Upload not found' });
  return reply.status(200).send(result);
};

export const updateUpload = async (req: FastifyRequest<{ Params: UploadParams; Body: UpdateUploadBody }>, reply: FastifyReply) => {
  const upload = await service.updateUpload(req.params.id, req.body);
  if (!upload) return reply.status(404).send({ message: 'Upload not found' });
  return reply.status(200).send(upload);
};

export const createUpload = async (req: FastifyRequest, reply: FastifyReply) => {
  const parts = req.parts({ limits: { files: 1, fields: 2, parts: 3 } });
  let file: { buffer: Buffer; filename: string; mimetype: string } | undefined;
  let alt: string | null | undefined;
  let metadata: Prisma.JsonValue | undefined;
  let multipartError: string | undefined;

  for await (const part of parts) {
    if (part.type === 'file') {
      if (part.fieldname !== 'file') {
        await part.toBuffer();
        multipartError = 'File field must be named "file"';
        continue;
      }
      file = { buffer: await part.toBuffer(), filename: part.filename, mimetype: part.mimetype };
    } else if (part.fieldname === 'alt') {
      alt = String(part.value);
    } else if (part.fieldname === 'metadata') {
      try {
        metadata = JSON.parse(String(part.value));
      } catch {
        multipartError = 'metadata must contain valid JSON';
      }
    }
  }

  if (multipartError) return reply.status(400).send({ message: multipartError });
  if (!file) return reply.status(400).send({ message: 'A file is required in the "file" field' });
  return reply.status(201).send(await service.createUpload({ ...file, alt, metadata }));
};
