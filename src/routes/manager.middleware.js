import express from 'express';
import { approveLoan, getAllloans, login, register } from '../controller/manager.controller.js';
import { managerMiddleware } from '../middleware/manager_auth.middleware.js';

const managerRoutes = express.Router();

//Login
managerRoutes.post('/manger-login',login);
//Register 
managerRoutes.post('/manger-register',register);
// Perotected Route Get all Pending Loans
managerRoutes.get('/get-all-pending-loans',managerMiddleware,getAllloans);
// Perotected Route Approve loan by id
managerRoutes.post('/approve-loans/:loanId',managerMiddleware,approveLoan);

export default managerRoutes;