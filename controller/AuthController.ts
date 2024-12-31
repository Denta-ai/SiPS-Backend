import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import crypto from 'node:crypto';
import { JWT_SECRET, SALT } from '../env';
import prisma from '../lib/prisma';
import { CustomRequest, JWTPayload } from '../middleware/jwt';
import { sendMail } from '../service/mail';
import { generateJwtToken } from '../utils/GenerateJwtToken';
import { GenerateResponse } from '../utils/GenerateResponse';
import httpStatusCode from '../utils/HttpStatusCode';
import { UserWithoutPassword } from '../utils/SelectCondition';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  const { username, email, password, phoneNumber } = req.body;

  try {
    let user = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    const hashedPassword = await bcrypt.hash(password, SALT);

    if (user) {
      if (user?.username === username) {
        GenerateResponse(res, httpStatusCode.BAD_REQUEST, 'Usermame already exist', null);
        return;
      }

      if (user.isDeleted === true) {
        const updatedUser = await prisma.user.update({
          where: { email },
          data: { phoneNumber, username, password: hashedPassword, isDeleted: false },
          select: UserWithoutPassword,
        });

        GenerateResponse(res, httpStatusCode.OK, 'User reactivated successfully', updatedUser);
        return;
      }

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

    const newUser = await prisma.user.findUnique({
      where: {
        username,
      },
      select: UserWithoutPassword,
    });

    const token = generateJwtToken(newUser as JWTPayload);
    GenerateResponse(res, httpStatusCode.OK, 'Login successful', { ...newUser, token });
  } catch (error) {
    console.log(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email }, select: UserWithoutPassword });

    if (!user) {
      GenerateResponse(res, httpStatusCode.NOT_FOUND, 'User not found', 'null');
      return;
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = Date.now() + 1 * 60 * 5000;

    const token = generateJwtToken({ ...user, otp, otpExpiresAt });

    sendMail(email, 'OTP verification', `Your OTP is: ${otp}.`);

    GenerateResponse(res, 200, 'OTP sent', { token });
  } catch (error) {
    console.log(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { token } = req.query;
  const { otp } = req.body;

  if (!token || typeof token !== 'string') {
    GenerateResponse(res, httpStatusCode.UNAUTHORIZED, 'Unauthorized', null);
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      select: UserWithoutPassword,
    });

    if (decoded.otp !== otp) {
      GenerateResponse(res, httpStatusCode.BAD_REQUEST, 'Invalid OTP', null);
      return;
    }

    if (decoded.otpExpiresAt && Date.now() > decoded.otpExpiresAt) {
      GenerateResponse(res, httpStatusCode.BAD_REQUEST, 'OTP expired', null);
      return;
    }

    const newToken = generateJwtToken(user as JWTPayload);
    GenerateResponse(res, httpStatusCode.OK, 'OTP verified successfully', { ...user, newToken });
  } catch (error) {
    console.log(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.query;
  const { password, confirmPassword } = req.body;

  if (!token || typeof token !== 'string') {
    GenerateResponse(res, httpStatusCode.UNAUTHORIZED, 'Unauthorized', null);
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      GenerateResponse(res, httpStatusCode.NOT_FOUND, 'User not found', null);
      return;
    }

    if (password !== confirmPassword) {
      GenerateResponse(res, httpStatusCode.BAD_REQUEST, 'Password does not match', null);
    }

    const hashedPassword = await bcrypt.hash(password, SALT);

    const updatedUser = await prisma.user.update({
      where: { email: decoded.email },
      data: { password: hashedPassword },
      select: UserWithoutPassword,
    });

    GenerateResponse(res, 200, 'Password changed successfully', updatedUser);
  } catch (error) {
    console.log(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};

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
