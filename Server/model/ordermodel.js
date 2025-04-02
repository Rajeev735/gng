import mongoose from 'mongoose';

const orderschema = new mongoose.Schema({

 
  sellerid:{type:String, required:true},

  items:[{
  productid:{type:String, required:true},
  quantity:{type:Number,required:true},
  price:{type:Number,required:true},
  title:{type:String,required:true}
  }],
  totalamount:{type:Number},
  payment:{type:String},
  status:{type:String,default:'Pending'},
  createdat:{type:Date, default:Date.now},
  address:{type:Object},
  pin:{type:Number}
})

const ordermodel = mongoose.models.order || mongoose.model('order',orderschema)

export default ordermodel