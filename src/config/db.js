import mongoose from "mongoose";
import dotenv from dotenv;
import logger from "../utils/logger.js";

dotenv.config();
const connectDb =async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        logger.info("Connect to DB");
    }
    catch(err){
        logger.error("Error during connection",err.message);
        process.exit(1);
    }
}

export default connectDb;