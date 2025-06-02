import dotenv from 'dotenv';
dotenv.config();

export const SALT = +(process.env.SALT || 10);
export const JWT_SECRET = process.env.JWT_SECRET || '';
export const CLIENT_SECRET = process.env.CLIENT_SECRET || '';
export const CLIENT_ID = process.env.CLIENT_ID || '';
export const BASE_URL = process.env.BASE_URL || '';
export const USER = process.env.USER || '';
export const PASS = process.env.PASS || '';
export const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || '';
export const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY || '';
export const IMAGEKIT_URL = process.env.IMAGEKIT_URL || '';
