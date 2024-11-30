import express, { Router } from 'express';
import { register,login } from '../controller/customer.controller.js';

const customerRoutes= express.Router();

customerRoutes.post('/login-customer',login);
customerRoutes.post('/register-customer',register);

export default customerRoutes;
