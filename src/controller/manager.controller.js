import Manager from "../model/manager.modal.js";
import bcrytp from 'bcrypt';
import logger from "../utils/logger.js";
import {generateToken} from '../utils/jwt.js';
import { customerLoginValidator, customerRegistrationValidator } from "../validator/customer.validator.js";
import { validationResult } from "express-validator";
import LoanApplication from "../model/loan.modal.js";
import Customer from "../model/customer.model.js";
import { v4 as uuidv4 } from 'uuid';
import mongoose from "mongoose";

function generateEmpId() {
    const uuid = uuidv4();
    const numericPart = uuid.replace(/[^0-9]/g, '').substring(0, 12); 
    const letterPart = uuid.replace(/[^a-z]/g, '').charAt(0);
    return `${numericPart.substring(0, 3)}-${numericPart.substring(3)}${letterPart}`;
}
export const  register =async(req,res)=>{
    await Promise.all(customerRegistrationValidator.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, errors: errors.array() });
    }
    try{
        const {fname , lname , email ,phone,address,password}=req.body;
        const uemail = await Manager.findOne({email});
        if(uemail){
            return res.status(409).json({message:`Manager already exist with this ${email}! Try to Login`});
        }
        const hasedpassword = await bcrytp.hash(password,10);
        const customer = new Manager({
            fname,
            lname,
            email,
            phone,
            address,
            employeeId:generateEmpId(),
            password:hasedpassword
        });
        await customer.save();
        res.status(201).json({message:`Manager created successfully`});
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
        const manager = await Manager.findOne({ email });
        if (!manager) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrytp.compare(password, manager.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = generateToken(manager);
        return res.status(200).json({
            message: 'Login successful',
            token,
            data: {
                username:manager.fname,
                email: manager.email,
                EmployeeId:manager.employeeId,
            }
        });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getAllloans =async (req,res) =>{ 
    try{
        const loans = await LoanApplication.find({applicationStatus:'Pending'});
        if(loans.length ===0){
            return res.status(404).json({message:'No loans Application Found'});
        }
        return res.status(200).json(loans);
    }
    catch(err){
        logger.error(err);
        return res.status(500).json({message:"Server Error", error:err.message});
    }

}

export const approveLoan =async (req,res)=>{
    try {
        const {loanId} = req.params; 
        const { managerId } = req.user.userId;
        console.log(loanId)

        if (!loanId || !mongoose.Types.ObjectId.isValid(loanId)) {
            return res.status(400).json({ message: "Invalid Loan ID." });
        }

        const loan = await LoanApplication.findById(loanId);
        //console.log(loan)

        if (!loan) {
            return res.status(404).json({ message: "Loan not found." });
        }

        // Check if the loan is already approved
        if (loan.status === "Approved") {
            return res.status(400).json({ message: "Loan is already approved." });
        }

        // Update the loan status to "Approved"
        loan.applicationStatus = "Approved";
        loan.approvedBy = managerId;
        loan.approvedAt = new Date();

        await loan.save();

        return res.status(200).json({
            message: "Loan approved successfully.",
            loan,
        });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    }
}