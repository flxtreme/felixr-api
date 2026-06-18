import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';
import { CreateProjectBody, GetProjectResponse, GetProjectsQuery, GetProjectsResponse, UpdateProjectBody } from './schema';

const pageSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  status: true,
  postType: true,
  featureImages: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
};

const projectSelect = {
  id: true,
  title: true,
  description: true,
  pageId: true,
  links: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  createdBy: true,
  page: { select: pageSelect },
};

const assertPageExists = async (pageId: string) => {
  const page = await prisma.post.findUnique({ where: { id: pageId } });

  if (!page) {
    throw Object.assign(new Error('Page not found'), { statusCode: 404 });
  }

  if (page.postType !== 'PAGE') {
    throw Object.assign(new Error('Referenced post is not a PAGE'), { statusCode: 400 });
  }

  return page;
};

export const getProjects = async (query: GetProjectsQuery): Promise<GetProjectsResponse> => {
  const { offset, limit, search } = query;

  const where: any = { isDeleted: false };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      take: limit,
      skip: offset,
      select: projectSelect,
    }),
    prisma.project.count({ where }),
  ]);

  return {
    data: projects.map((p) => ({ ...p, links: p.links as any[] })),
    meta: resolveMeta(total, offset, limit),
  };
};

export const getProject = async (id: string): Promise<GetProjectResponse | null> => {
  const project = await prisma.project.findUnique({
    where: { id },
    select: projectSelect,
  });

  if (!project) return null;

  return { ...project, links: project.links as any[] };
};

export const createProject = async (body: CreateProjectBody, userId: string): Promise<GetProjectResponse> => {
  const { pageId, ...rest } = body;

  await assertPageExists(pageId);

  const project = await prisma.project.create({
    data: {
      ...rest,
      links: rest.links ?? [],
      createdBy: userId,
      page: { connect: { id: pageId } },
    },
    select: projectSelect,
  });

  return { ...project, links: project.links as any[] };
};

export const updateProject = async (id: string, body: UpdateProjectBody, userId: string): Promise<GetProjectResponse> => {
  const { pageId, ...rest } = body;

  const current = await getProject(id);
  if (!current) throw Object.assign(new Error('Project not found'), { statusCode: 404 });

  if (pageId && pageId !== current.pageId) {
    await assertPageExists(pageId);
  }

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...rest,
      ...(pageId ? { page: { connect: { id: pageId } } } : {}),
      updatedBy: userId,
      updatedAt: new Date(),
    },
    select: projectSelect,
  });

  return { ...project, links: project.links as any[] };
};

export const softDeleteProject = async (id: string, userId: string): Promise<GetProjectResponse> => {
  // Disconnect page before soft-delete to release the unique constraint
  const project = await prisma.project.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId,
    },
    select: projectSelect,
  });

  return { ...project, links: project.links as any[] };
};

export const deleteProject = async (id: string, userId: string): Promise<GetProjectResponse> => {
  const project = await softDeleteProject(id, userId);

  // Hard delete — page is NOT deleted (no cascade)
  await prisma.project.delete({ where: { id } });

  return project;
};