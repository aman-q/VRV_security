import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET;

export const generateToken =(user)=>{
    return jwt.sign({ userId: user._id,role: user.role},secret,{expiresIn:'1h'})
};

