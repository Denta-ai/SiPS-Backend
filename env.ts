import dotenv from 'dotenv';
dotenv.config();

export const SALT = +(process.env.SALT || 10);
