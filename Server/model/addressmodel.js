import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label:{type:String ,reqired:true},
  userId:{type:String, required:true},
  name:{type:String, required:true},
  email:{type:String, required:true,unique:true},
  city:{type:String,required:true},
  state:{type:String,required:true},
  pin:{type:Number,required:true},
  address:{type:String,required:true},
  alternatephone:{type:Number},
  phone:{type:Number,required:true}
  
})

const addressmodel = mongoose.models.address || mongoose.model('address',addressSchema)

export {addressmodel}