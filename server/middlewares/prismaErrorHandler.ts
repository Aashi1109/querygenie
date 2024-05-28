import { NextFunction, Request, Response } from "express";
import { ClientError } from "@exceptions";
import { Prisma } from "@prisma/client";
import logger from "@logger";
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

const handlePrismaError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  logger.error(err.stack);

  if (!(err instanceof PrismaClientKnownRequestError)) return next(err);

  let clientError: ClientError;

  switch (err.code) {
    case "P2002":
      // handling duplicate key errors
      clientError = new ClientError(
        `Duplicate field value: ${err.meta?.field_name}`,
      );
      break;
    case "P2014":
      // handling invalid id errors
      clientError = new ClientError(`Invalid ID: ${err.meta?.field_name}`);
      break;
    case "P2003":
      // handling invalid data errors
      clientError = new ClientError(
        `Invalid input data or invalid foreign key provided: ${err.meta?.field_name}`,
      );
      break;
    default:
      return next(err);
  }

  return next(clientError);
};

export default handlePrismaError;
