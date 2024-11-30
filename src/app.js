import express from  'express';

const app = express();

app.get("/",(req,res)=>{
    res.send("VRV_Security Backing is running");
});

export default app;