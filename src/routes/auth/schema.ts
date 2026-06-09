import { Static, Type } from '@sinclair/typebox';
import { CreateUserBodySchema } from '../admin/user/schema';

export const LoginSchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
});

export type LoginType = Static<typeof LoginSchema>;

export const JwtUserSchema = Type.Object({
  id: Type.String(),
  username: Type.String(),
  email: Type.String(),
  name: Type.Union([Type.String(), Type.Null()]),
  phone: Type.Union([Type.String(), Type.Null()]),
  avatar: Type.Union([Type.String(), Type.Null()]),
  picture: Type.Union([Type.String(), Type.Null()]),
  roles: Type.Array(Type.String()),
  permissions: Type.Array(Type.String())
});

export type JwtUser = Static<typeof JwtUserSchema>;

export const LoginResponseSchema = Type.Object({
  data: Type.Object({
    user: JwtUserSchema,
    token: Type.String(),
    expiry: Type.String(),
  }),
});

export type LoginResponseType = Static<typeof LoginResponseSchema>;


export const RegisterChema = CreateUserBodySchema;
export type RegisterType = Static<typeof RegisterChema>;