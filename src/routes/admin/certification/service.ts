import { Prisma } from '@prisma/client';
import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';
import { Certification, CreateCertificationBody, GetCertificationsQuery, GetCertificationsResponse, UpdateCertificationBody } from './schema';

const toCertification = (record: any): Certification => {
  const { credentialId, credentialUrl, ...certification } = record;
  return {
    ...certification,
    ...(credentialId == null ? {} : { credentialId }),
    ...(credentialUrl == null ? {} : { credentialUrl }),
  };
};

export const getCertifications = async (query: GetCertificationsQuery): Promise<GetCertificationsResponse> => {
  const { offset = 0, limit = 10, search, isActive } = query;
  const where: Prisma.CertificationWhereInput = {};

  if (isActive === true) where.isDeleted = false;
  else if (isActive === false) where.isDeleted = true;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { issuer: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [records, total] = await Promise.all([
    prisma.certification.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit, skip: offset }),
    prisma.certification.count({ where }),
  ]);

  return {
    data: records.map(toCertification),
    meta: resolveMeta(total, offset, limit),
  };
};

export const getCertification = async (id: string): Promise<Certification | null> => {
  const record = await prisma.certification.findUnique({ where: { id } });
  return record ? toCertification(record) : null;
};

export const createCertification = async (body: CreateCertificationBody, userId: string): Promise<Certification> => {
  const record = await prisma.certification.create({
    data: { ...body, createdBy: userId },
  });
  return toCertification(record);
};

export const updateCertification = async (id: string, body: UpdateCertificationBody, userId: string): Promise<Certification> => {
  const current = await prisma.certification.findUnique({ where: { id } });
  if (!current) throw Object.assign(new Error('Certification not found'), { statusCode: 404 });

  const record = await prisma.certification.update({
    where: { id },
    data: { ...body, updatedBy: userId, updatedAt: new Date() },
  });
  return toCertification(record);
};

export const softDeleteCertification = async (id: string, userId: string): Promise<Certification> => {
  const record = await prisma.certification.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
  });
  return toCertification(record);
};

export const deleteCertification = async (id: string, userId: string): Promise<Certification> => {
  const certification = await softDeleteCertification(id, userId);
  await prisma.certification.delete({ where: { id } });
  return certification;
};
