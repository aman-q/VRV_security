import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    transactionType: {
        type: String,
        required: true,
        enum: ['Deposit', 'Withdrawal', 'Transfer']
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    recipientAccount: {
        type: String,
        required: function () { return this.transactionType === 'Transfer'; },
    },
    senderAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Completed'],
        default: 'Pending',
    },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;