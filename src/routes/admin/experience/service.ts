import { Prisma } from '@prisma/client';
import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';
import { CreateExperienceBody, GetExperiencesQuery, GetExperiencesResponse, UpdateExperienceBody } from './schema';

const experienceStartTime = (start: string): number => {
  const match = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})$/i.exec(start.trim());
  if (!match) return 0;

  const month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    .indexOf(match[1].toLowerCase());
  return Date.UTC(Number(match[2]), month);
};

export const getExperiences = async (query: GetExperiencesQuery): Promise<GetExperiencesResponse> => {
  const { offset = 0, limit = 10, search, isActive } = query;
  const where: Prisma.ExperienceWhereInput = {};

  if (isActive === true) where.isDeleted = false;
  else if (isActive === false) where.isDeleted = true;
  if (search) {
    where.OR = [
      { role: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [experiences, total] = await Promise.all([
    prisma.experience.findMany({ where }),
    prisma.experience.count({ where }),
  ]);

  const data = experiences
    .sort((a, b) => experienceStartTime(b.start) - experienceStartTime(a.start)
      || b.createdAt.getTime() - a.createdAt.getTime())
    .slice(offset, offset + limit);

  return { data, meta: resolveMeta(total, offset, limit) };
};

export const getExperience = (id: string) => prisma.experience.findUnique({ where: { id } });

export const createExperience = (body: CreateExperienceBody, userId: string) => prisma.experience.create({
  data: { ...body, createdBy: userId },
});

export const updateExperience = async (id: string, body: UpdateExperienceBody, userId: string) => {
  const current = await prisma.experience.findUnique({ where: { id } });
  if (!current) throw Object.assign(new Error('Experience not found'), { statusCode: 404 });

  return prisma.experience.update({
    where: { id },
    data: { ...body, updatedBy: userId, updatedAt: new Date() },
  });
};

export const softDeleteExperience = (id: string, userId: string) => prisma.experience.update({
  where: { id },
  data: { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
});

export const deleteExperience = async (id: string, userId: string) => {
  const experience = await softDeleteExperience(id, userId);
  await prisma.experience.delete({ where: { id } });
  return experience;
};
