import { Prisma } from '@prisma/client';
import { isEmpty } from 'lodash';
import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';
import { PUBLIC_POST_SELECT } from '../post/service';
import {
  GetPublicProjectsQuery,
  GetPublicProjectsResponse,
  PublicProject,
} from './schema';
import { getBatchViews } from '../../track/service';

const publicProjectSelect = {
  id: true,
  title: true,
  description: true,
  links: true,
  createdAt: true,
  updatedAt: true,
  page: { select: PUBLIC_POST_SELECT },
};

export const getProjects = async (
  query: GetPublicProjectsQuery
): Promise<GetPublicProjectsResponse> => {
  const { offset, limit, search } = query;

  const where: Prisma.ProjectWhereInput = {
    isDeleted: false,
    page: {
      isDeleted: false,
      status: 'PUBLISHED',
    }
  };

  if (!isEmpty(search)) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({ select: publicProjectSelect, where, take: limit, skip: offset, orderBy: { createdAt: 'desc' } }),
    prisma.project.count({ where })
  ]);

  const slugs = projects.map(p => p.page?.slug).filter(Boolean) as string[];
  const viewsMap = await getBatchViews(slugs);

  return {
    data: projects.map((project) => ({
      ...project,
      links: project.links as any[],
      page: project.page ? {
        ...project.page,
        tags: project.page.tags.map((tag) => tag.tag.slug),
        views: viewsMap[project.page.slug] || 0,
      } : undefined,
      views: project.page ? (viewsMap[project.page.slug] || 0) : 0,
    })),
    meta: resolveMeta(total, offset, limit)
  };
};

export const getProject = async (slug: string): Promise<PublicProject | null> => {
  const projectRaw = await prisma.project.findFirst({
    where: { 
      isDeleted: false, 
      page: {
        slug,
        isDeleted: false,
        status: 'PUBLISHED',
      }
    },
    select: publicProjectSelect,
  });

  if (!projectRaw) return null;

  const viewsMap = await getBatchViews([slug]);

  return {
    ...projectRaw,
    links: projectRaw.links as any[],
    page: projectRaw.page ? {
      ...projectRaw.page,
      tags: projectRaw.page.tags.map((tag) => tag.tag.slug),
      views: viewsMap[slug] || 0,
    } : undefined,
    views: viewsMap[slug] || 0,
  };
};
