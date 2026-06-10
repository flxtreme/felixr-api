import { User } from "../admin/user/schema";
import { JwtUser } from "./schema";

export const jwtUser = ( user: User ): JwtUser => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    phone: user.phone,
    avatar: user.avatar,
    picture: user.picture,
    roles: user.roles,
    permissions: user.permissions,
  };
}