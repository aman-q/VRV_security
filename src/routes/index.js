import express from 'express';
import customerRoutes from './coustomer.routes.js';

const router =express.Router();

router.use('/admin',(req,res)=>{
    res.send('Admin Dashboard')
});

router.use('/customer',customerRoutes);

export default router;