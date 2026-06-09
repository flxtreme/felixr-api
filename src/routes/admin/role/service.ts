import { Prisma } from '@prisma/client';
import {
  CreateRoleBody,
  UpdateRoleBody,
  DeleteRoleBody,
  GetRolesQuery,
  GetRolesResponse,
  Role,
} from './schema';
import { isBoolean, isEmpty } from 'lodash';
import { prisma } from '@/core/prisma';
import { resolveMeta } from '@/utils';

export const getRoles = async (query: GetRolesQuery): Promise<GetRolesResponse | null> => {
  const { offset, limit, search, isActive } = query;

  const where: Prisma.RoleWhereInput = {};

  if (!isEmpty(search)) {
    where.OR = [
      { id: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  };

  if ( isBoolean(isActive) && isActive === true ) {
    where.isDeleted = false;
  } else if ( isBoolean(isActive) && isActive === false ) {
    where.OR = [
      { isDeleted: true },
    ];
  }

  const [
    roles,
    total
  ] = await Promise.all([
    prisma.role.findMany({
      where,
      take: limit,
      skip: offset,
    }),
    prisma.role.count({ where })
  ]);

  return {
    data: roles,
    meta: resolveMeta(total, offset, limit)
  }
};

export const getRole = async (id: string): Promise<Role | null> => {
  const role = await prisma.role.findUnique({
    where: { id }
  });

  return role;
};

export const createRole = async (body: CreateRoleBody, userId: string): Promise<Role | null> => {
  const { name, description } = body;

  const role = await prisma.role.create({
    data: {
      id: name,
      name,
      description,
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  });
  
  return role;
};

export const updateRole = async (id: string, body: UpdateRoleBody, userId: string): Promise<Role | null> => {
  const { name, description } = body;

  const role = await prisma.role.update({
    where: { id },
    data: {
      id: name,
      name,
      description,
      updatedAt: new Date(),
      updatedBy: userId,
    }
  });
  
  return role;
};

export const softDeleteRole = async (id: string, userId: string): Promise<Role | null> => {
  const role = await prisma.role.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId,
    }
  });
  
  return role;
};

export const deleteRole = async (id: string, userId: string): Promise<Role | null> => {
  const role = await softDeleteRole(id, userId);

  await prisma.role.delete({
    where: { id }
  });
  
  return role;
};

export const addPermission = async (roleId: string, permissionId: string, userId: string) => {
  const rolePermission = await prisma.rolePermission.create({
    data: {
      role: { connect: { id: roleId } },
      permission: { connect: { id: permissionId } }
    }
  });

  return rolePermission;
}

export const deletePermission = async (roleId: string, permissionId: string, userId: string) => {
  const rolePermission = await prisma.rolePermission.delete({
    where: {
      permissionId_roleId: {
        roleId,
        permissionId,
      }
    }
  });

  return rolePermission;
}


