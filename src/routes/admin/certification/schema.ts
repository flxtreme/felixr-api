import { Static, Type } from '@sinclair/typebox';
import { DateFieldSchema, DeleteItemBodySchema, GetByIdParamsSchema, ListQuerySchema, PaginatedResponseSchema } from '../../../core/schema';

export const CertificationSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  issuer: Type.String(),
  issuedAt: Type.String(),
  description: Type.String(),
  credentialId: Type.Optional(Type.String()),
  credentialUrl: Type.Optional(Type.String()),
  isDeleted: Type.Boolean(),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
  deletedAt: Type.Union([DateFieldSchema, Type.Null()]),
  createdBy: Type.Union([Type.String(), Type.Null()]),
  updatedBy: Type.Union([Type.String(), Type.Null()]),
  deletedBy: Type.Union([Type.String(), Type.Null()]),
});
export type Certification = Static<typeof CertificationSchema>;

export const GetCertificationsQuerySchema = ListQuerySchema;
export type GetCertificationsQuery = Static<typeof GetCertificationsQuerySchema>;
export const GetCertificationsResponseSchema = PaginatedResponseSchema(CertificationSchema);
export type GetCertificationsResponse = Static<typeof GetCertificationsResponseSchema>;
export const GetCertificationParamsSchema = GetByIdParamsSchema;
export type GetCertificationParams = Static<typeof GetCertificationParamsSchema>;

export const CreateCertificationBodySchema = Type.Object({
  title: Type.String(),
  issuer: Type.String(),
  issuedAt: Type.String(),
  description: Type.String(),
  credentialId: Type.Optional(Type.String()),
  credentialUrl: Type.Optional(Type.String()),
});
export type CreateCertificationBody = Static<typeof CreateCertificationBodySchema>;
export const UpdateCertificationBodySchema = Type.Partial(CreateCertificationBodySchema);
export type UpdateCertificationBody = Static<typeof UpdateCertificationBodySchema>;
export const DeleteCertificationBodySchema = DeleteItemBodySchema;
export type DeleteCertificationBody = Static<typeof DeleteCertificationBodySchema>;
