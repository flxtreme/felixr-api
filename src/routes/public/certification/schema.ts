import { Static, Type } from '@sinclair/typebox';
import { DateFieldSchema, ListQuerySchema, PaginatedResponseSchema } from '../../../core/schema';

export const PublicCertificationSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  issuer: Type.String(),
  issuedAt: Type.String(),
  description: Type.String(),
  credentialId: Type.Optional(Type.String()),
  credentialUrl: Type.Optional(Type.String()),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
});
export type PublicCertification = Static<typeof PublicCertificationSchema>;
export const GetPublicCertificationsQuerySchema = ListQuerySchema;
export type GetPublicCertificationsQuery = Static<typeof GetPublicCertificationsQuerySchema>;
export const GetPublicCertificationsResponseSchema = PaginatedResponseSchema(PublicCertificationSchema);
export type GetPublicCertificationsResponse = Static<typeof GetPublicCertificationsResponseSchema>;
export const GetPublicCertificationParamsSchema = Type.Object({ id: Type.String() });
export type GetPublicCertificationParams = Static<typeof GetPublicCertificationParamsSchema>;
