import express, { Router } from 'express';
import { forgotPassword, login, register, resetPassword } from '../controller/AuthController';
import { restrict } from '../middleware/jwt';
import { admin } from '../middleware/admin';
import { deleteUser, getAllUsers, getUserById, updateUser } from '../controller/UserController';
const routes: Router = express.Router();

routes.post('/api/register', register);
routes.post('/api/login', login);
routes.post('/api/reset-password', resetPassword);
routes.post('/api/forgot-password', forgotPassword);

routes.get('/api/users', restrict, getAllUsers);
routes.get('/api/users/:id', restrict, getUserById);
routes.put('/api/users/:id', restrict, updateUser);
routes.delete('/api/users/:id', restrict, deleteUser);

export default routes;
