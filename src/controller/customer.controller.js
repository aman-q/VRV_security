import Customer from '../model/customer.model.js';
import bcrypt from 'bcrypt';
import { customerLoginValidator, customerRegistrationValidator } from '../validator/customer.validator.js';
import { validationResult } from "express-validator";
import { generateToken } from '../utils/jwt.js';
import logger from '../utils/logger.js';
import LoanApplication from '../model/loan.modal.js';
import Transaction from '../model/transaction.modal.js';
import mongoose, { Mongoose } from 'mongoose';

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
        logger.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getAccountInfo =async (req,res) =>{
    try{
        const customerID= req.user.userId;
        const user= await Customer.findById(customerID).select('fname lname email phone balance address');
        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        
        return res.status(200).json({message:"Account info",data:user});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }

}

export const performTransation = async (req, res) => {
    try {
        const { transactionType, amount, recipientAccount } = req.body;
        const customerID = req.user.userId;

        // Validate input
        if (!transactionType || amount <= 0) {
            return res.status(400).json({ message: "Invalid transaction type or amount." });
        }

        const customer = await Customer.findById(customerID);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found." });
        }

        let newTransaction;

        if (transactionType === 'Deposit') {
            customer.balance += amount;
            newTransaction = new Transaction({ transactionType, amount, transactionStatus: 'Completed' });

        } else if (transactionType === 'Withdrawal') {
            if (customer.balance < amount) {
                return res.status(400).json({ message: "Insufficient balance." });
            }
            customer.balance -= amount;
            newTransaction = new Transaction({ transactionType, amount, transactionStatus: 'Completed' });

        } else if (transactionType === 'Transfer') {
            if (!recipientAccount || !mongoose.Types.ObjectId.isValid(recipientAccount)) {
                return res.status(400).json({ message: "Recipient account is required for transfer." });
            }

            if (customer.balance < amount) {
                return res.status(400).json({ message: "Insufficient balance for transfer." });
            }

            // Deduct amount and create a pending transaction
            customer.balance -= amount;
            await customer.save();

            newTransaction = new Transaction({
                transactionType,
                amount,
                recipientAccount,
                senderAccount:customerID,
                transactionStatus: 'Pending', // Pending until Teller approves/rejects
            });
        } else {
            return res.status(400).json({ message: "Invalid transaction type." });
        }

        // Save transaction and update customer
        const savedTransaction = await newTransaction.save();
        customer.transactions.push(savedTransaction._id);
        await customer.save();

        return res.status(201).json({
            message: "Transaction initiated successfully",
            data: {
                transactionType: savedTransaction.transactionType,
                amount: savedTransaction.amount,
                recipientAccount: savedTransaction.recipientAccount || null,
                transactionStatus: savedTransaction.transactionStatus,
                balance: customer.balance,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const applyLoan = async(req,res)=>{
    try{
        const {loanType,loanAmount} =req.body;
        const customerID=req.user.userId;
        const customer= await Customer.findById(customerID);
        if(!customer){
            return res.status(404).json({message:'User not found'});
        }
        if (loanAmount <= 0) {
            return res.status(400).json({ message: 'Invalid loan amount. Must be greater than zero.' });
        }
        const loanApplication = new LoanApplication({
            loanAmount,
            loanType,
        });
        const savedLoan = await loanApplication.save();
        // Update the customer's loanApplied array
        customer.loanApplied.push(savedLoan._id);
        await customer.save();
        return res.status(201).json({
            message: "Loan application submitted successfully",
            data: {
                loanId: savedLoan._id,
                loanAmount: savedLoan.loanAmount,
                loanType: savedLoan.loanType,
                applicationStatus: savedLoan.applicationStatus,
                appliedOn: savedLoan.appliedOn,
            },
        });   
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });

    }
}