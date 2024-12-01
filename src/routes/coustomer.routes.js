import express, { Router } from 'express';
import { register,login,getAccountInfo,applyLoan,performTransation } from '../controller/customer.controller.js';
import { customerMiddleware } from '../middleware/customer_auth.middleware.js';

// Customer Routes
const customerRoutes= express.Router();
// Login 
customerRoutes.post('/login-customer',login);
// Register
customerRoutes.post('/register-customer',register);
//Protected Route to Get Account Info
customerRoutes.get('/getInfo',customerMiddleware,getAccountInfo);
//Protected Route to Apply For Loan 
customerRoutes.post('/apply-loan',customerMiddleware,applyLoan);
//Protected Route to Perform Transaction
customerRoutes.post('/perform-transation',customerMiddleware,performTransation);

export default customerRoutes;
