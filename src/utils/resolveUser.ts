import { UserRequestType } from "../core/schema";
import { FastifyRequest } from "fastify";

const resolveUser = (req: FastifyRequest, throwError: boolean = true): UserRequestType => {
  const user = req.user as UserRequestType;

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export default resolveUser