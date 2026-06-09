import { prisma } from '@core/prisma';
import { verify } from '@core/password';
import { config } from '@core/config';
import jwt from 'jsonwebtoken';
import { LoginType, LoginResponseType, RegisterType } from './schema';
import * as userService from '@/routes/admin/user/service';
import * as helper from './helper';

export const loginUser = async (data: LoginType): Promise<LoginResponseType | null> => {
  const userSearch = await prisma.user.findUnique({
    select: {
      id: true,
      password: true,
      username: true,
    },
    where: { username: data.username, isDeleted: false },
  });

  if (!userSearch) {
    return null;
  }

  const { id, password, username } = userSearch;

  const [
    user,
    isValid
  ] = await Promise.all([
    userService.getUser(id),
    verify(data.password, password)
  ]);

  if (!user) {
    return null;
  }

  if (!isValid) {
    return null;
  }

  const jwtUser = helper.jwtUser(user);

  const expiry = '3h';
  const token = jwt.sign(jwtUser, config.jwtSecret, {
    expiresIn: expiry,
  });

  return {
    data: {
      user: jwtUser,
      token,
      expiry,
    },
  };
};

export const registerUser = async (data: RegisterType) => {

  const user = await userService.createUser({
    ...data,
    // make sure roles should be empty for security purposes
    roles: []
  }, 'registration');

  if (!user) return null;

  const jwtUser = helper.jwtUser(user);

  const expiry = '3h';
  const token = jwt.sign(jwtUser, config.jwtSecret, {
    expiresIn: expiry,
  });

  return {
    data: {
      user: jwtUser,
      token,
      expiry,
    },
  };
};