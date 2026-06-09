import { User as UserPrisma, UserRole, Role, RolePermission, Permission } from "@prisma/client";
import { User } from "./schema";

type UserWithRoles = UserPrisma & {
  userRoles: (UserRole & {
    role: Role & {
      rolePermissions: (RolePermission & { permission: Permission })[];
    };
  })[];
};

export const parseUser = (user: UserWithRoles | null): User | null => {
  if (!user) return null;

  const roles = user.userRoles.map((userRole) => userRole.role.id);
  const permissions = user.userRoles.reduce((acc, userRole) => {
    userRole.role.rolePermissions.forEach((rolePermission) => {
      if (!acc.includes(rolePermission.permission.id)) {
        acc.push(rolePermission.permission.id);
      }
    });
    return acc;
  }, [] as string[]);

  return {
    ...user,
    roles,
    permissions,
  };
};

export const parseUsers = (users: UserWithRoles[]): User[] => {
  return users.map((user) => parseUser(user) as User);
};