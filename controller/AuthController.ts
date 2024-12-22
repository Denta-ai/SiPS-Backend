import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { GenerateResponse } from '../utils/GenerateResponse';
import bcrypt from 'bcryptjs';
import { SALT } from '../env';

export const register = async (req: Request, res: Response) => {
  const { username, email, password, phoneNumber } = req.body;

  try {
    let user = await prisma.user.findUnique({
      where: { email },
    });

    const hashedPassword = await bcrypt.hash(password, SALT);

    if (user && user.isDeleted === true) {
      user = await prisma.user.update({
        where: { email },
        data: { phoneNumber, username, password: hashedPassword, isDeleted: false },
      });
    }

    if (user) {
      GenerateResponse(res, 400, 'User already exist please login', null, null);
      return;
    }

    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword, phoneNumber },
    });

    GenerateResponse(res, 201, 'User registered successfully', newUser, null);
    return;
  } catch (error) {
    console.log(error);
    GenerateResponse(res, 500, 'Internal server error', null, error);
    return;
  }
};

export const login = (req: Request, res: Response) => {
    

};
export const forgotPassword = (req: Request, res: Response) => {};
export const resetPassword = (req: Request, res: Response) => {};
