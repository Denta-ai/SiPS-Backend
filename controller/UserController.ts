import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { GenerateResponse } from '../utils/GenerateResponse';
import httpStatusCode from '../utils/HttpStatusCode';
import { UserWithoutPassword } from '../utils/SelectCondition';
import bcrypt from 'bcryptjs';
import { SALT } from '../env';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      select: UserWithoutPassword,
    });

    GenerateResponse(res, httpStatusCode.OK, 'Users retrieved successfully', users);
  } catch (error) {
    console.error(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: Number(id),
        isDeleted: false,
      },
      select: UserWithoutPassword,
    });

    if (!user) {
      GenerateResponse(res, httpStatusCode.NOT_FOUND, 'User not found', null);
      return;
    }

    GenerateResponse(res, httpStatusCode.OK, 'User retrieved successfully', user);
  } catch (error) {
    console.error(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, password, phoneNumber } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: Number(id),
        isDeleted: false,
      },
    });

    if (!user) {
      GenerateResponse(res, httpStatusCode.NOT_FOUND, 'User not found', null);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT);

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        username,
        email,
        password: hashedPassword,
        phoneNumber,
      },
      select: UserWithoutPassword,
    });

    GenerateResponse(res, httpStatusCode.OK, 'User updated successfully', updatedUser);
  } catch (error) {
    console.error(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: Number(id),
        isDeleted: false,
      },
    });

    if (!user) {
      GenerateResponse(res, httpStatusCode.NOT_FOUND, 'User not found', null);
      return;
    }

    await prisma.user.update({
      where: { id: Number(id) },
      data: { isDeleted: true },
    });

    GenerateResponse(res, httpStatusCode.OK, 'User deleted successfully', null);
  } catch (error) {
    console.error(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};
