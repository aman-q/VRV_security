import mongoose from "mongoose";

const loanApplicationSchema = new mongoose.Schema(
    {
        loanAmount: {
            type: Number,
            required: true,
        },
        loanType: {
            type: String,
            enum: ['Personal', 'Home', 'Auto', 'Business'],
            required: true,
        },
        applicationStatus: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
        },
        appliedOn: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const LoanApplication = mongoose.model("LoanApplication", loanApplicationSchema);
export default LoanApplication;
