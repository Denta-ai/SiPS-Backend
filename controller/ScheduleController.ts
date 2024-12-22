import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { GenerateResponse } from '../utils/GenerateResponse';
import httpStatusCode from '../utils/HttpStatusCode';

export const createSchedule = async (req: Request, res: Response) => {
  const { date, hour, price } = req.body;

  try {
    const newSchedule = await prisma.schedule.create({
      data: {
        date: new Date(date),
        hour,
        price,
        status: 'available',
      },
    });

    GenerateResponse(res, httpStatusCode.CREATED, 'Schedule created successfully', newSchedule);
  } catch (error) {
    console.error(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};

export const getAllSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await prisma.schedule.findMany({
      where: {
        isDeleted: false,
      },
    });

    GenerateResponse(res, httpStatusCode.OK, 'Schedules retrieved successfully', schedules);
  } catch (error) {
    console.error(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};

export const getScheduleById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const schedule = await prisma.schedule.findFirst({
      where: {
        id: Number(id),
        isDeleted: false,
      },
    });

    if (!schedule) {
      GenerateResponse(res, httpStatusCode.NOT_FOUND, 'Schedule not found', null);
      return;
    }

    GenerateResponse(res, httpStatusCode.OK, 'Schedule retrieved successfully', schedule);
  } catch (error) {
    console.error(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};

export const updateSchedule = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date, hour, price, status } = req.body;

  try {
    const schedule = await prisma.schedule.findFirst({
      where: {
        id: Number(id),
        isDeleted: false,
      },
    });

    if (!schedule) {
      GenerateResponse(res, httpStatusCode.NOT_FOUND, 'Schedule not found', null);
      return;
    }

    const updatedSchedule = await prisma.schedule.update({
      where: { id: Number(id) },
      data: {
        date: date ? new Date(date) : undefined,
        hour,
        price,
        status,
      },
    });

    GenerateResponse(res, httpStatusCode.OK, 'Schedule updated successfully', updatedSchedule);
  } catch (error) {
    console.error(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};

export const deleteSchedule = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const schedule = await prisma.schedule.findFirst({
      where: {
        id: Number(id),
        isDeleted: false,
      },
    });

    if (!schedule) {
      GenerateResponse(res, httpStatusCode.NOT_FOUND, 'Schedule not found', null);
      return;
    }

    await prisma.schedule.update({
      where: { id: Number(id) },
      data: { isDeleted: true },
    });

    GenerateResponse(res, httpStatusCode.OK, 'Schedule deleted successfully', null);
  } catch (error) {
    console.error(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};
