import express from  'express';
import router from './routes/index.js';
import connectDb from './config/db.js';

const app = express();


app.get("/",(req,res)=>{
    res.send("VRV_Security Backing is running");
});
app.use('/api',router);
connectDb();

export default app;