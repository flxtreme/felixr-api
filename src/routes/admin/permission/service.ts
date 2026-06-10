import { PaginatedResponseType } from '../../../core/schema';
import {
  CreatePermissionBody,
  UpdatePermissionBody,
  DeletePermissionBody,
  GetPermissionsQuery,
  GetPermissionsResponse,
  Permission,
} from './schema';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';

export const getPermissions = async (query: GetPermissionsQuery) : Promise<GetPermissionsResponse> => {
  const { offset, limit, search } = query;

  const where: Prisma.PermissionWhereInput = {};

  if (search) {
    where.OR = [
      { id: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  };

  const [
    permissions,
    total
  ] = await Promise.all([
    prisma.permission.findMany({
      where,
      take: limit,
      skip: offset,
    }),
    prisma.permission.count({ where })
  ]);

  return {
    data: permissions,
    meta: resolveMeta(total, offset, limit)
  }
};

export const getPermission = async (id: string): Promise<Permission | null> => {
  const permission = await prisma.permission.findUnique({
    where: { id }
  });

  return permission;
};

export const createPermission = async (body: CreatePermissionBody, userId: string) : Promise<Permission | null> => {
  const { name, description } = body;

  const permission = await prisma.permission.create({
    data: {
      id: name,
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      updatedBy: userId,
    }
  });

  return permission;
};

export const updatePermission = async (id: string, body: UpdatePermissionBody, userId: string) : Promise<Permission | null>=> {
  const { name, description } = body;

  const permission = await prisma.permission.update({
    where: { id },
    data: {
      id: name,
      name,
      description,
      updatedAt: new Date(),
      updatedBy: userId,
    }
  });

  return permission;
};

export const softDeletePermission = async (id: string, userId: string): Promise<Permission | null> => {
  const permission = await prisma.permission.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId,
    }
  });

  return permission;
};


export const deletePermission = async (id: string, userId: string): Promise<Permission | null> => {

  const permission = await softDeletePermission(id, userId);

  await prisma.permission.delete({
    where: { id }
  });

  return permission;
};

