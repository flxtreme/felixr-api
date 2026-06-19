import { DateFieldSchema, ListQuerySchema, PaginatedResponseSchema } from '../../../core/schema';
import { Static, Type } from '@sinclair/typebox';
import { PublicPostSchema } from '../post/schema';

export const ProjectLinkSchema = Type.Object({
  label: Type.String(),
  href: Type.String(),
});

export const PublicProjectSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  links: Type.Array(ProjectLinkSchema),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
  page: Type.Optional(PublicPostSchema),
});

export type PublicProject = Static<typeof PublicProjectSchema>;

// --- Get list query ---
export const GetPublicProjectsQuerySchema = ListQuerySchema;
export type GetPublicProjectsQuery = Static<typeof GetPublicProjectsQuerySchema>;

export const GetPublicProjectsResponseSchema = PaginatedResponseSchema(PublicProjectSchema);
export type GetPublicProjectsResponse = Static<typeof GetPublicProjectsResponseSchema>;

// --- Params ---
export const GetPublicProjectParamsSchema = Type.Object({
  slug: Type.String(),
});

export type GetPublicProjectParams = Static<typeof GetPublicProjectParamsSchema>;
