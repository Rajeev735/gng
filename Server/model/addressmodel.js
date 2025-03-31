import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:{type:String, required:true},
  email:{type:String, required:true,unique:true},
  city:{type:String,required:true},
  state:{type:String,required:true},
  pin:{type:Number,required:true},
  address:{type:String,required:true}

})

const addressmodel = mongoose.models.address || mongoose.model('address',addressSchema)

export default addressmodel