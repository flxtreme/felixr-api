import { DateFieldSchema, ListQuerySchema, PaginatedResponseSchema } from '../../../core/schema';
import { Static, Type } from '@sinclair/typebox';

export const ProjectLinkSchema = Type.Object({
  label: Type.String(),
  href: Type.String(),
});

export const ProjectSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  pageId: Type.String(),
  links: Type.Array(ProjectLinkSchema),
  isDeleted: Type.Boolean(),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
  deletedAt: Type.Union([DateFieldSchema, Type.Null()]),
  createdBy: Type.Union([Type.String(), Type.Null()]),
  page: Type.Optional(Type.Any()),
});

export type GetProjectResponse = Static<typeof ProjectSchema>;

export const GetProjectsQuerySchema = ListQuerySchema;
export type GetProjectsQuery = Static<typeof GetProjectsQuerySchema>;

export const GetProjectsResponseSchema = PaginatedResponseSchema(ProjectSchema);
export type GetProjectsResponse = Static<typeof GetProjectsResponseSchema>;

export const CreateProjectBodySchema = Type.Object({
  title: Type.String(),
  description: Type.Union([Type.String(), Type.Null()], { default: null }),
  pageId: Type.String(),
  links: Type.Array(ProjectLinkSchema, { default: [] }),
});

export type CreateProjectBody = Static<typeof CreateProjectBodySchema>;

export const UpdateProjectBodySchema = Type.Partial(CreateProjectBodySchema);
export type UpdateProjectBody = Static<typeof UpdateProjectBodySchema>;

export const DeleteProjectBodySchema = Type.Object({
  isPermanent: Type.Boolean({ default: false }),
});

export type DeleteProjectBody = Static<typeof DeleteProjectBodySchema>;