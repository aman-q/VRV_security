import express from 'express';
import { login ,register ,getAllpendingtransaction ,handleTransactionDecision } from '../controller/teller.controller.js';
import {tellerMiddleware} from '../middleware/teller_auth.middleware.js';

const tellerRoutes =express.Router();

// Teller Login
tellerRoutes.post('/teller-login',login);
// Teller Register
tellerRoutes.post('/teller-register',register);
// Protected Route To Get All Pending Trnasaction
tellerRoutes.get('/teller-get-all-pending-transaction',tellerMiddleware,getAllpendingtransaction);
// Protected Route To Handel Transaction by Id 
tellerRoutes.put('/handel-transaction/:id',tellerMiddleware,handleTransactionDecision);

export default tellerRoutes;