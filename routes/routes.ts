import express, { Router } from 'express';
import { forgotPassword, login, register, resetPassword } from '../controller/AuthController';
const routes: Router = express.Router();

routes.post('/api/register', register);
routes.post('/api/login', login);
routes.post('/api/reset-password', resetPassword);
routes.post('/api/forgot-password', forgotPassword);

export default routes;
