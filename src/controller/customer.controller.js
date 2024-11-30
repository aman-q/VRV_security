import Customer from '../model/customer.model.js';
import bcrypt from 'bcrypt';
import { customerLoginValidator, customerRegistrationValidator } from '../validator/customer.validator.js';
import { validationResult } from "express-validator";
import { generateToken } from '../utils/jwt.js';
import logger from '../utils/logger.js';

export const  register =async(req,res)=>{
    await Promise.all(customerRegistrationValidator.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, errors: errors.array() });
    }
    try{
        const {fname , lname , email ,phone,address,password}=req.body;
        const uemail = await Customer.findOne({email});
        if(uemail){
            return res.status(409).json({message:`User already exist with this ${email}! Try to Login`});
        }
        const hasedpassword = await bcrypt.hash(password,10);
        const customer = new Customer({
            fname,
            lname,
            email,
            phone,
            address,
            password:hasedpassword
        });
        await customer.save();
        res.status(201).json({message:`User created successfully`});
    }
    catch(err){
        logger.error(err);
        res.status(500).json({message:"Server error",error:err.message});
    }
}

export const login = async (req, res) => {
    await Promise.all(customerLoginValidator.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            errors: errors.array(),
        });
    }

    try {
        const { email, password } = req.body;
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = generateToken(customer);
        return res.status(200).json({
            message: 'Login successful',
            token,
            data: {
                username: customer.fname,
                email: customer.email,
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};