import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verifyotp: {
        type: String,
        default: ''
    },
    verifyotpexpAt: {
        type: Number,
        default: 0
    },
    isAccountVerify: {
        type: Boolean,
        default: false
    },
    resetotp: {
        type: String,
        default: ''
    },
    resetotpexpireAt: { 
        type: Number,
        default: 0
    },
    city:{
        type:String,
     
        default:""
      },
      Address:{
        type:String,
        
        default:""
      },
      pin:{
        type:String,

        default:""
      },
      phone:{
        type:String,
    
        default:""
      },
      alternatephone:{
        type:String,
      
        default:""
        
      },
      state:{
        type:String,
   
        default:""
        
      },
});

// Corrected model creation logic
const usermodel = mongoose.models.user || mongoose.model('user', userSchema);

export default usermodel;
