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
import multer from 'multer';
import {
  createSchedules,
  deleteSchedules,
  getAllSchedules,
  getScheduleById,
  updateSchedules,
} from '../controller/ScheduleController';
import { admin } from '../middleware/admin';
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
  getBookingByUserId,
  updateBookingStatus,
} from '../controller/BookingController';
const routes: Router = express.Router();
const upload = multer();

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
routes.put('/api/users/:id', restrict, upload.single('profilePicture'), updateUser);
routes.delete('/api/users/:id', restrict, deleteUser);

routes.get('/api/schedules', restrict, getAllSchedules);
routes.get('/api/schedules/:id', restrict, getScheduleById);
routes.post('/api/schedules', restrict, admin, createSchedules);
routes.put('/api/schedules/:id', restrict, admin, updateSchedules);
routes.delete('/api/schedules/:id', restrict, admin, deleteSchedules);

routes.post('/api/bookings', restrict, upload.single('paymentProof'), createBooking);
routes.get('/api/bookings', restrict, getAllBookings);
routes.get('/api/bookings/:id', restrict, getBookingById);
routes.get('/api/bookings/user/:userId', restrict, getBookingByUserId);
routes.put('/api/bookings/:id/status', restrict, admin, updateBookingStatus);
routes.delete('/api/bookings/:id', restrict, deleteBooking);

export default routes;
