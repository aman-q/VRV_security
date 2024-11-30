import mongoose from "mongoose";

const transactionSchma = mongoose.Schema({
    transactionType:{
        type:String,
        required:true,
        enum:['Deposit', 'Withdrawal', 'Transfer']
    },
    amount:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    recipientAccount: {
        type: String,
        required: function () { return this.transactionType === 'Transfer'; },
    },
})
const Transaction = mongoose.model("Transaction", transactionSchma);

export default Transaction;