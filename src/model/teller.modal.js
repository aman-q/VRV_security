import mongoose from "mongoose";

// Teller Schema
const tellerSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required:true
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type:String,
        required: true,
    },
    employeeId: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["Customer", "Manager","Teller"],
        default: "Teller",
      },
    processedTransactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
    }],
}, { timestamps: true });

const Teller = mongoose.model('Teller', tellerSchema);
export default Teller;
