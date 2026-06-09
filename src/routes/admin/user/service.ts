import { resolveMeta } from '@/utils';
import {
  CreateUserBody,
  UpdateUserBody,
  GetUsersQuery,
  GetUsersResponse,
  User,
} from './schema';
import { Prisma } from '@prisma/client';
import { isBoolean, isEmpty } from 'lodash';
import { prisma } from '@/core/prisma';
import * as helper from './helper';
import * as pw from '@/core/password';



export const USER_ROLES_INCLUDE = {
  userRoles: {
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true
            }
          }
        }
      }
    }
  }
}

export const getUsers = async (query: GetUsersQuery): Promise<GetUsersResponse> => {
  const { offset, limit, search, isActive } = query;

  const where: Prisma.UserWhereInput = {};

  if ( !isEmpty(search) ) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { username: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } }
    ]
  }

  if ( isBoolean(isActive) && isActive === true ) {
    where.isActive = true;
    where.isDeleted = false;
  } else if ( isBoolean(isActive) && isActive === false ) {
    where.OR = [
      { isActive: false },
      { isDeleted: true },
    ];
  }

  const [
    users,
    total
  ] = await Promise.all([
    prisma.user.findMany({
      where,
      include: USER_ROLES_INCLUDE,
      take: limit,
      skip: offset,
    }),
    prisma.user.count({ where })
  ]);

  return {
    data: helper.parseUsers(users),
    meta: resolveMeta(total, offset, limit)
  }
};

export const getUser = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { id, isDeleted: false },
    include: USER_ROLES_INCLUDE
  });
  
  return helper.parseUser(user);
};

export const createUser = async (body: CreateUserBody, userId: string): Promise<User | null> => {
  const { roles = [], password: passwordRaw, ...rest } = body;

  const password = await pw.hash(passwordRaw);

  const user = await prisma.user.create({
    include: USER_ROLES_INCLUDE,
    data: {
      ...rest,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      updatedBy: userId,
      userRoles: {
        create: roles.map((roleId) => ({
          role: { connect: { id: roleId } }
        }))
      }
    }
  });

  return helper.parseUser(user);
};

export const updateUser = async (id: string, body: UpdateUserBody, userId: string): Promise<User | null> => {
  const { roles, password: passwordRaw, ...rest } = body;

  const user = await getUser(id);

  const password = passwordRaw ? await pw.hash(passwordRaw) : null;

  const _roles = roles ?? user?.roles ?? [];

  const userUpdate = await prisma.user.update({
    include: USER_ROLES_INCLUDE,
    where: { id },
    data: {
      ...rest,
      ...( password ? { password } : {}),
      updatedAt: new Date(),
      updatedBy: userId,
      userRoles: {
        deleteMany: { userId: id },
        create: _roles.map((roleId) => ({
          role: { connect: { id: roleId } },
        })),
      },
    },
  });

  return helper.parseUser(userUpdate);
};


export const softDeleteUser = async (id: string, userId: string): Promise<Omit<User, 'roles' | 'permissions'> | null> => {
  const user = await prisma.user.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId,
    },
  });

  return user;
};

export const deleteUser = async (id: string, userId: string): Promise<Omit<User, 'roles' | 'permissions'> | null> => {
  const user = await softDeleteUser(id, userId);

  await prisma.user.delete({
    where: { id }
  });

  return user;
};

