import express from 'express';
import customerRoutes from './coustomer.routes.js';
import tellerRoutes from './teller.routes.js';

const router =express.Router();

router.use('/admin',(req,res)=>{
    res.send('Admin Dashboard')
});

router.use('/customer',customerRoutes);
router.use('/teller',tellerRoutes);

export default router;