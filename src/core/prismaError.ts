import { FastifyPluginAsync, FastifyError, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import { Prisma } from "@prisma/client";
import { getPrismaErrorMessage } from "../utils/prismaErrors";

const isFastifyError = (error: unknown): error is FastifyError =>
  typeof error === "object" &&
  error !== null &&
  "statusCode" in error &&
  "message" in error;

const prismaErrorHandler: FastifyPluginAsync = async (app) => {
  app.setErrorHandler((error: unknown, request: FastifyRequest, reply: FastifyReply) => {
    app.log.error(error);

    // PrismaClientKnownRequestError
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return reply.status(400).send({
        message: getPrismaErrorMessage(error.code),
        data: {
          code: error.code,
          meta: error.meta ?? null,
          clientVersion: error.clientVersion,
        },
      });
    }

    // PrismaClientUnknownRequestError
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return reply.status(400).send({
        message: "An unknown database request error occurred.",
        data: {
          clientVersion: error.clientVersion,
          detail: error.message,
        },
      });
    }

    // PrismaClientRustPanicError
    if (error instanceof Prisma.PrismaClientRustPanicError) {
      return reply.status(500).send({
        message: "A critical database engine error occurred. Please restart the server.",
        data: {
          clientVersion: error.clientVersion,
          detail: error.message,
        },
      });
    }

    // PrismaClientInitializationError
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return reply.status(503).send({
        message: "Failed to initialize database connection.",
        data: {
          errorCode: error.errorCode ?? null,
          clientVersion: error.clientVersion,
          detail: error.message,
        },
      });
    }

    // PrismaClientValidationError
    if (error instanceof Prisma.PrismaClientValidationError) {
      return reply.status(422).send({
        message: "Database validation error — invalid data supplied.",
        data: {
          clientVersion: error.clientVersion,
          detail: error.message,
        },
      });
    }

    // Fastify validation / HTTP errors
    if (isFastifyError(error)) {
      const fastifyError = error as FastifyError;

      if (fastifyError.validation) {
        return reply.status(422).send({
          message: "Request validation failed.",
          data: {
            validation: fastifyError.validation,
            detail: fastifyError.message,
          },
        });
      }

      return reply.status(fastifyError.statusCode ?? 500).send({
        message: fastifyError.message,
        data: null,
      });
    }

    // Generic Error
    if (error instanceof Error) {
      return reply.status(500).send({
        message: error.message,
        data: null,
      });
    }

    // Fallback
    return reply.status(500).send({
      message: "An unexpected error occurred.",
      data: null,
    });
  });
};

export default fp(prismaErrorHandler, {
  name: "prisma-error-handler",
});