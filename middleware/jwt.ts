import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../env';
import { GenerateResponse } from '../utils/GenerateResponse';
import httpStatusCode from '../utils/HttpStatusCode';

export type JWTPayload = {
  username: string;
  email: string;
  phoneNumber: string;
  role: 'admin' | 'customer';
};

export interface CustomRequest extends Request {
  user: JWTPayload;
}

export const restrict = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    GenerateResponse(
      res,
      httpStatusCode.UNAUTHORIZED,
      'Unauthorized. Invalid token, please login again.',
      null
    );
    return;
  }
  const token = authorization.split(' ')[1];
  console.log('Verifying token:', token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    (req as CustomRequest).user = decoded;
    next();
  } catch (error) {
    console.log(error);
    GenerateResponse(
      res,
      httpStatusCode.UNAUTHORIZED,
      'Unauthorized. Invalid token, please login again.',
      null
    );
  }
};
