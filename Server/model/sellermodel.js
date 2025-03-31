import mongoose from 'mongoose';

const sellerschema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: true },

  about: { type: String, required: true},
  available: { type: Boolean,default:true },

  address: { type: Object, required: true },
  date: { type: Date, default: Date.now },  // Better type for date
 
}, { minimize: false });

const sellermodel = mongoose.models.seller || mongoose.model('seller', sellerschema);

export default sellermodel;
