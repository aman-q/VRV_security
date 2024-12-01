import mongoose  from "mongoose";

const customerSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type: String,
        enum: ["Customer", "Admin", "Manager","Teller"],
        default: "Customer",
      },
    balance:{
        type:Number,
        default:0,
        min:0
    },
    transactions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Transaction"

    }],
    loanApplied:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"LoanApplication"
    }]
    
},{timestamps:true});
const Customer = mongoose.model('Customer',customerSchema);
export default Customer;
