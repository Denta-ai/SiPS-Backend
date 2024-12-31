import express, { Router } from 'express';
import {
  forgotPassword,
  login,
  oauthGoogleLogin,
  register,
  resetPassword,
  verifyOtp,
} from '../controller/AuthController';
import { restrict } from '../middleware/jwt';
import { deleteUser, getAllUsers, getUserById, updateUser } from '../controller/UserController';
import passport from '../service/passport';
const routes: Router = express.Router();

routes.post('/api/register', register);
routes.post('/api/login', login);
routes.post('/api/forgot-password', forgotPassword);
routes.post('/api/verify-otp', verifyOtp);
routes.post('/api/reset-password', resetPassword);
routes.get(
  '/api/google',
  passport.authenticate('google', { session: false, scope: ['email', 'profile'] })
);
routes.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  oauthGoogleLogin
);

routes.get('/api/users', restrict, getAllUsers);
routes.get('/api/users/:id', restrict, getUserById);
routes.put('/api/users/:id', restrict, updateUser);
routes.delete('/api/users/:id', restrict, deleteUser);

export default routes;
