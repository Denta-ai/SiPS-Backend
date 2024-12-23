import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { GenerateResponse } from '../utils/GenerateResponse';
import bcrypt from 'bcryptjs';
import { SALT } from '../env';
import httpStatusCode from '../utils/HttpStatusCode';
import { UserWithoutPassword } from '../utils/SelectCondition';
import { CustomRequest } from '../middleware/jwt';
import { generateJwtToken } from '../utils/GenerateJwtToken';

export const register = async (req: Request, res: Response) => {
  const { username, email, password, phoneNumber } = req.body;

  try {
    let user = await prisma.user.findUnique({
      where: { email },
    });

    const hashedPassword = await bcrypt.hash(password, SALT);

    if (user && user.isDeleted === true) {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { phoneNumber, username, password: hashedPassword, isDeleted: false },
        select: UserWithoutPassword,
      });

      GenerateResponse(res, httpStatusCode.OK, 'User reactivated successfully', {
        UserWithoutPassword,
      });
      return;
    }

    if (user) {
      GenerateResponse(res, httpStatusCode.BAD_REQUEST, 'User already exist please login', null);
      return;
    }

    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword, phoneNumber },
      select: UserWithoutPassword,
    });

    GenerateResponse(res, httpStatusCode.CREATED, 'User registered successfully', newUser);
  } catch (error) {
    console.log(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      GenerateResponse(res, httpStatusCode.BAD_REQUEST, 'Invalid credentials', null);
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      GenerateResponse(res, httpStatusCode.BAD_REQUEST, 'Invalid credentials', null);
      return;
    }

    const token = generateJwtToken(user);
    GenerateResponse(res, httpStatusCode.OK, 'Login successful', { ...user, token });
  } catch (error) {
    console.log(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};
export const forgotPassword = (req: Request, res: Response) => {};
export const resetPassword = (req: Request, res: Response) => {};

export const oauthGoogleLogin = (req: Request, res: Response) => {
  const { user } = req as CustomRequest;

  const token = generateJwtToken(user);
  GenerateResponse(res, httpStatusCode.OK, 'Login successful', {
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    token,
  });
};
