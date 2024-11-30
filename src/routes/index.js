import express from 'express';

const router =express.Router();

router.use('/admin',(req,res)=>{
    res.send('Admin Dashboard')
});

export default router;