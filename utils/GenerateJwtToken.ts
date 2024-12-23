import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../env';
import { JWTPayload } from '../middleware/jwt';

export const generateJwtToken = (user: JWTPayload): string => {
  return jwt.sign(
    {
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    },
    JWT_SECRET
  );
};
