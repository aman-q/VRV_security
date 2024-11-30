import { body } from 'express-validator';
export const customerRegistrationValidator = [
    body('fname')
        .notEmpty().withMessage('First name is required')
        .isLength({ max: 20 }).withMessage('First name should not exceed 20 characters'),
    
    body('lname')
        .notEmpty().withMessage('Last name is required')
        .isLength({ max: 20 }).withMessage('Last name should not exceed 20 characters'),
    
    body('email')
        .notEmpty().withMessage('Email is Required')
        .isEmail().withMessage('A valid email is required'),
    
    body('phone')
        .notEmpty().withMessage('Phone number is required') 
        .isNumeric().withMessage('Phone number must be numeric')
        .isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits'),
    
    body('adress')
        .isLength({ max: 100 }).withMessage('Address should not exceed 100 characters'),
    
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[A-Za-z]/).withMessage('Password must contain at least one letter'),
];

export const customerLoginValidator=[
    body('email').
    isEmail().withMessage('A valid email is required'),
    body('password')
    .notEmpty().withMessage('Password is required')
] 
