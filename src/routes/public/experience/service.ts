import { Prisma } from '@prisma/client';
import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';
import { GetPublicExperiencesQuery, GetPublicExperiencesResponse, PublicExperience } from './schema';

const publicExperienceSelect = {
  id: true,
  role: true,
  company: true,
  start: true,
  end: true,
  responsibilities: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ExperienceSelect;

const experienceStartTime = (start: string): number => {
  const match = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})$/i.exec(start.trim());
  if (!match) return 0;

  const month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    .indexOf(match[1].toLowerCase());
  return Date.UTC(Number(match[2]), month);
};

const experienceEndTime = (end: string): number =>
  end.trim().toLowerCase() === 'present' ? Number.POSITIVE_INFINITY : experienceStartTime(end);

export const getExperiences = async (query: GetPublicExperiencesQuery): Promise<GetPublicExperiencesResponse> => {
  const { offset = 0, limit = 10, search } = query;
  const where: Prisma.ExperienceWhereInput = { isDeleted: false };
  if (search) {
    where.OR = [
      { role: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [experiences, total] = await Promise.all([
    prisma.experience.findMany({ where, select: publicExperienceSelect }),
    prisma.experience.count({ where }),
  ]);

  const data = experiences
    .sort((a, b) => experienceStartTime(b.start) - experienceStartTime(a.start)
      || experienceEndTime(b.end) - experienceEndTime(a.end)
      || b.createdAt.getTime() - a.createdAt.getTime())
    .slice(offset, offset + limit);

  return { data, meta: resolveMeta(total, offset, limit) };
};

export const getExperience = (id: string): Promise<PublicExperience | null> => prisma.experience.findFirst({
  where: { id, isDeleted: false },
  select: publicExperienceSelect,
});
