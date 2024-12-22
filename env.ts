import dotenv from 'dotenv';
dotenv.config();

export const SALT = +(process.env.SALT || 10);
export const JWT_SECRET = process.env.JWT_SECRET || '';
