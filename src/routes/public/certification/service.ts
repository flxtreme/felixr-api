import { Prisma } from '@prisma/client';
import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';
import { GetPublicCertificationsQuery, GetPublicCertificationsResponse, PublicCertification } from './schema';

const publicCertificationSelect = {
  id: true,
  title: true,
  issuer: true,
  issuedAt: true,
  description: true,
  credentialId: true,
  credentialUrl: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CertificationSelect;

const toPublicCertification = (record: any): PublicCertification => {
  const { credentialId, credentialUrl, ...certification } = record;
  return {
    ...certification,
    ...(credentialId == null ? {} : { credentialId }),
    ...(credentialUrl == null ? {} : { credentialUrl }),
  };
};

export const getCertifications = async (query: GetPublicCertificationsQuery): Promise<GetPublicCertificationsResponse> => {
  const { offset = 0, limit = 10, search } = query;
  const where: Prisma.CertificationWhereInput = { isDeleted: false };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { issuer: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [records, total] = await Promise.all([
    prisma.certification.findMany({ where, select: publicCertificationSelect, orderBy: { createdAt: 'desc' }, take: limit, skip: offset }),
    prisma.certification.count({ where }),
  ]);

  return {
    data: records.map(toPublicCertification),
    meta: resolveMeta(total, offset, limit),
  };
};

export const getCertification = async (id: string): Promise<PublicCertification | null> => {
  const record = await prisma.certification.findFirst({
    where: { id, isDeleted: false },
    select: publicCertificationSelect,
  });
  return record ? toPublicCertification(record) : null;
};
