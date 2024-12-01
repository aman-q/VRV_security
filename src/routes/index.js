import express from 'express';
import customerRoutes from './coustomer.routes.js';
import tellerRoutes from './teller.routes.js';
import managerRoutes from './manager.middleware.js';

const router =express.Router();


router.use('/customer',customerRoutes);
router.use('/teller',tellerRoutes);
router.use('/manger',managerRoutes)

export default router;