import { validationResult } from "express-validator";
import Teller from "../model/teller.modal.js";
import Transaction from "../model/transaction.modal.js";
import { customerLoginValidator, customerRegistrationValidator } from "../validator/customer.validator.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import logger from "../utils/logger.js";
import { generateToken } from "../utils/jwt.js";
import Customer from "../model/customer.model.js";

function generateEmpId() {
    const uuid = uuidv4();
    const numericPart = uuid.replace(/[^0-9]/g, '').substring(0, 6); 
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
        const uemail = await Teller.findOne({email});
        if(uemail){
            return res.status(409).json({message:`User already exist with this ${email}! Try to Login`});
        }
        const hasedpassword = await bcrypt.hash(password,10);
        const customer = new Teller({
            fname,
            lname,
            email,
            phone,
            address,
            employeeId:generateEmpId(),
            password:hasedpassword
        });
        await customer.save();
        res.status(201).json({message:`Teller created successfully`});
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
        const teller = await Teller.findOne({ email });
        // console.log(teller)
        if (!teller) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, teller.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = generateToken(teller);
        return res.status(200).json({
            message: 'Login successful',
            token,
            data: {
                username: teller.fname,
                email: teller.email,
                EmployeeId:teller.employeeId,
            }
        });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};
export const getAllpendingtransaction =async(req,res)=>{
    try{
        const pendingTransaction = await Transaction.find({status:'Pending'});
        if(pendingTransaction.length===0){
            return res.status(200).json({message:'No pending transaction found'});
        }
        return res.status(200).json({message:'Pending transaction found',data:pendingTransaction});
    }
    catch(err){
        logger.error(err);
        return res.status(500).json({meassage:'Server Error',error:err.message});
    }

}
export const handleTransactionDecision = async (req, res) => {
    try {
        const { id } = req.params; 
        const { decision } = req.body; 
        

        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found." });
        }

        if (transaction.transactionType !== 'Transfer' || transaction.status !== 'Pending') {
            return res.status(400).json({ message: "Only pending transfer transactions can be processed." });
        }

        const sender = await Customer.findById(transaction.senderAccount);
        if (!sender) {
            return res.status(404).json({ message: "Sender not found." });
        }
        if (decision === 'approve') {
            const recipient = await Customer.findById(transaction.recipientAccount);
            recipient.balance += transaction.amount;
            await recipient.save();

            transaction.status = 'Completed';
            await transaction.save();

            return res.status(200).json({ message: "Transaction approved successfully." });
        } else if (decision === 'reject') {
            sender.balance += transaction.amount;
            await sender.save();

            transaction.status = 'Rejected';
            await transaction.save();

            return res.status(200).json({ message: "Transaction rejected. Funds rolled back to sender." });
        } else {
            return res.status(400).json({ message: "Invalid decision. Use 'approve' or 'reject'." });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};