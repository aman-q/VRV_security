import mongoose from "mongoose";

const managerSchema = new mongoose.Schema({
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
    phone: {
        type: String,
        required: true,
    },
    password:{
        type:String,
        required:true  
    },
    employeeId: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["Customer", "Manager","Teller"],
        default: "Manager",
      },
    address: {
        type: String,
        required: true,
    },
    approvedLoans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loan',
    }],
}, { timestamps: true });

const Manager= mongoose.model("Manager", managerSchema);
export default Manager;
