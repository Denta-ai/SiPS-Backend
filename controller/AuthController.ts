import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { SALT } from '../env';
import prisma from '../lib/prisma';
import { CustomRequest } from '../middleware/jwt';
import { generateJwtToken } from '../utils/GenerateJwtToken';
import { GenerateResponse } from '../utils/GenerateResponse';
import httpStatusCode from '../utils/HttpStatusCode';
import { UserWithoutPassword } from '../utils/SelectCondition';
import crypto from 'node:crypto';
import { sendMail } from '../service/mail';

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

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      GenerateResponse(res, httpStatusCode.NOT_FOUND, 'User not found', 'null');
      return;
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = Date.now() + 1 * 60 * 1000;

    const token = generateJwtToken({ ...user, otp, otpExpiresAt });

    sendMail(email, 'OTP verification', `Your OTP is: ${otp}.`);

    GenerateResponse(res, 200, 'OTP sent', { token });
  } catch (error) {
    console.log(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};
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
