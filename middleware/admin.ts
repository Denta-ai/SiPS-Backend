import { Response, Request, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { GenerateResponse } from '../utils/GenerateResponse';
import httpStatusCode from '../utils/HttpStatusCode';
import { CustomRequest } from './jwt';

export const admin = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req as CustomRequest;
  if (!user) {
    GenerateResponse(res, httpStatusCode.UNAUTHORIZED, 'Unauthorized. Please login.', null);
    return;
  }

  try {
    const foundUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!foundUser || foundUser.role !== 'admin') {
      GenerateResponse(res, httpStatusCode.FORBIDDEN, 'Forbidden. Admin access required.', null);
      return;
    }

    next();
  } catch (error) {
    console.error(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
    return;
  }
};
