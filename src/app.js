import express from  'express';
import router from './routes/index.js';
import connectDb from './config/db.js';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());


app.get("/",(req,res)=>{
    res.send("VRV_Security Backing is running");
});
app.use('/api',router);
connectDb();

export default app;