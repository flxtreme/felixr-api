import { Prisma } from '@prisma/client';
import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';
import { GetPublicTrainingsQuery, GetPublicTrainingsResponse, PublicTraining } from './schema';

const publicTrainingSelect = {
  id: true,
  title: true,
  provider: true,
  completedAt: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TrainingSelect;

export const getTrainings = async (query: GetPublicTrainingsQuery): Promise<GetPublicTrainingsResponse> => {
  const { offset = 0, limit = 10, search } = query;
  const where: Prisma.TrainingWhereInput = { isDeleted: false };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { provider: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.training.findMany({ where, select: publicTrainingSelect, orderBy: { createdAt: 'desc' }, take: limit, skip: offset }),
    prisma.training.count({ where }),
  ]);
  return { data, meta: resolveMeta(total, offset, limit) };
};

export const getTraining = (id: string): Promise<PublicTraining | null> => prisma.training.findFirst({
  where: { id, isDeleted: false },
  select: publicTrainingSelect,
});
