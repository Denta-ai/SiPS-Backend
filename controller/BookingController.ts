import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { GenerateResponse } from '../utils/GenerateResponse';
import httpStatusCode from '../utils/HttpStatusCode';
import { generateUniqueTransactionCode } from '../utils/GenerateRandomCode';
import { imageKit } from '../service/imageKit';

export const createBooking = async (req: Request, res: Response) => {
  const { userId, scheduleId, bandName, duration, totalPrice, notes } = req.body;

  console.log('Received scheduleId:', scheduleId, 'Type:', typeof scheduleId);

  const parsedScheduleId = parseInt(scheduleId);
  const parsedDuration = parseInt(duration);

  try {
    const stringFile = req.file?.buffer.toString('base64') as string;
    const data = await imageKit.upload({
      fileName: req.file?.originalname || 'image',
      file: stringFile,
    });
    const schedule = await prisma.schedule.findUnique({
      where: { id: parsedScheduleId },
    });

    if (!schedule) {
      GenerateResponse(res, httpStatusCode.NOT_FOUND, 'Schedule not found', null);
      return;
    }

    if (schedule.status === 'booked') {
      GenerateResponse(res, httpStatusCode.BAD_REQUEST, 'Schedule is already booked', null);
      return;
    }

    const newBooking = await prisma.transaction.create({
      data: {
        userId: Number(userId),
        bandName,
        duration: parsedDuration,
        paymentProof: data.url,
        totalPrice,
        notes,
        status: 'pending',
        transactionCode: await generateUniqueTransactionCode(prisma),
      },
    });

    await prisma.schedule.update({
      where: { id: parsedScheduleId },
      data: { status: 'booked' },
    });

    await prisma.transactionSchedule.create({
      data: {
        transactionId: newBooking.id,
        scheduleId: parsedScheduleId,
      },
    });

    GenerateResponse(res, httpStatusCode.CREATED, 'Booking created successfully', newBooking);
  } catch (error) {
    console.error(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.transaction.findMany({
      where: { isDeleted: false },
      include: {
        user: true,
        TransactionSchedule: {
          include: {
            schedule: true,
          },
        },
      },
    });

    GenerateResponse(res, httpStatusCode.OK, 'Bookings retrieved successfully', bookings);
  } catch (error) {
    console.error(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const booking = await prisma.transaction.findFirst({
      where: {
        id: Number(id),
        isDeleted: false,
      },
      include: {
        user: true,
        TransactionSchedule: {
          include: {
            schedule: true,
          },
        },
      },
    });

    if (!booking) {
      GenerateResponse(res, httpStatusCode.NOT_FOUND, 'Booking not found', null);
      return;
    }

    GenerateResponse(res, httpStatusCode.OK, 'Booking retrieved successfully', booking);
  } catch (error) {
    console.error(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};

export const getBookingByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const bookings = await prisma.transaction.findMany({
      where: {
        userId: Number(userId),
        isDeleted: false,
      },
      include: {
        user: true,
        TransactionSchedule: {
          include: {
            schedule: true,
          },
        },
      },
    });

    if (bookings.length === 0) {
      GenerateResponse(res, httpStatusCode.NOT_FOUND, 'No bookings found for this user', null);
      return;
    }

    GenerateResponse(res, httpStatusCode.OK, 'Bookings retrieved successfully', bookings);
  } catch (error) {
    console.error(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const booking = await prisma.transaction.findFirst({
      where: {
        id: Number(id),
        isDeleted: false,
      },
    });

    if (!booking) {
      GenerateResponse(res, httpStatusCode.NOT_FOUND, 'Booking not found', null);
      return;
    }

    const updatedBooking = await prisma.transaction.update({
      where: { id: Number(id) },
      data: { status },
    });

    GenerateResponse(res, httpStatusCode.OK, 'Booking status updated successfully', updatedBooking);
  } catch (error) {
    console.error(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const booking = await prisma.transaction.findFirst({
      where: {
        id: Number(id),
        isDeleted: false,
      },
    });

    if (!booking) {
      GenerateResponse(res, httpStatusCode.NOT_FOUND, 'Booking not found', null);
      return;
    }

    await prisma.transaction.update({
      where: { id: Number(id) },
      data: { isDeleted: true },
    });

    GenerateResponse(res, httpStatusCode.OK, 'Booking deleted successfully', null);
  } catch (error) {
    console.error(error);
    GenerateResponse(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Internal server error', null);
  }
};
