import { Static, Type } from '@sinclair/typebox';
import { DateFieldSchema, JsonFieldSchema, ListQuerySchema, PaginatedResponseSchema } from '../../../core/schema';

export const UploadSchema = Type.Object({
  id: Type.String(),
  bucket: Type.String(),
  path: Type.String(),
  publicPath: Type.String(),
  name: Type.String(),
  alt: Type.Union([Type.String(), Type.Null()]),
  metadata: JsonFieldSchema,
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
});

export const UploadParamsSchema = Type.Object({ id: Type.String() });
export type UploadParams = Static<typeof UploadParamsSchema>;
export const DeleteUploadResponseSchema = Type.Object({
  id: Type.String(),
  deleted: Type.Boolean(),
});
export const SignedUploadUrlQuerySchema = Type.Object({
  download: Type.Optional(Type.Boolean()),
});
export type SignedUploadUrlQuery = Static<typeof SignedUploadUrlQuerySchema>;
export const SignedUploadUrlResponseSchema = Type.Object({
  url: Type.String({ format: 'uri' }),
  expiresIn: Type.Number(),
});
export const UpdateUploadBodySchema = Type.Object({
  name: Type.Optional(Type.String({ minLength: 1 })),
  alt: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  metadata: Type.Optional(JsonFieldSchema),
}, { minProperties: 1 });
export type UpdateUploadBody = Static<typeof UpdateUploadBodySchema>;
export const UploadQuerySchema = ListQuerySchema;
export type UploadQuery = Static<typeof UploadQuerySchema>;
export const UploadListResponseSchema = PaginatedResponseSchema(UploadSchema);
