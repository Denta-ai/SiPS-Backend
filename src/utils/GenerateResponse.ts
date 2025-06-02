import { Response } from 'express';

export const GenerateResponse = <T>(
  res: Response,
  status: number,
  message: string,
  data: T | null
) => {
  return res.status(status).json({
    status,
    message,
    data,
  });
};
