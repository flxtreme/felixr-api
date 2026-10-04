import { Prisma } from '@prisma/client';
import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';
import { CreateTrainingBody, GetTrainingsQuery, GetTrainingsResponse, UpdateTrainingBody } from './schema';

export const getTrainings = async (query: GetTrainingsQuery): Promise<GetTrainingsResponse> => {
  const { offset = 0, limit = 10, search, isActive } = query;
  const where: Prisma.TrainingWhereInput = {};

  if (isActive === true) where.isDeleted = false;
  else if (isActive === false) where.isDeleted = true;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { provider: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.training.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit, skip: offset }),
    prisma.training.count({ where }),
  ]);
  return { data, meta: resolveMeta(total, offset, limit) };
};

export const getTraining = (id: string) => prisma.training.findUnique({ where: { id } });

export const createTraining = (body: CreateTrainingBody, userId: string) => prisma.training.create({
  data: { ...body, createdBy: userId },
});

export const updateTraining = async (id: string, body: UpdateTrainingBody, userId: string) => {
  const current = await prisma.training.findUnique({ where: { id } });
  if (!current) throw Object.assign(new Error('Training not found'), { statusCode: 404 });

  return prisma.training.update({
    where: { id },
    data: { ...body, updatedBy: userId, updatedAt: new Date() },
  });
};

export const softDeleteTraining = (id: string, userId: string) => prisma.training.update({
  where: { id },
  data: { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
});

export const deleteTraining = async (id: string, userId: string) => {
  const training = await softDeleteTraining(id, userId);
  await prisma.training.delete({ where: { id } });
  return training;
};
