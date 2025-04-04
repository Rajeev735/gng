import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { addAddress,  deleteAddress,  fetchAddress,  fetchorder, getprofile, getuserdeta, orderdetails, placeorder, trackorder, updateaddress, updateprofile } from '../controller/user_details_controller.js';

const userouter = express.Router();

userouter.get('/data',userAuth,getuserdeta);
userouter.get('/get-profile',userAuth,getprofile);
userouter.post('/update-profile',userAuth,updateprofile);
userouter.post('/orders',userAuth,placeorder);
userouter.get('/orders/fetch',userAuth,fetchorder);
userouter.get('/orders/:orderId',userAuth,orderdetails);
userouter.get('/orders/track/:orderId',userAuth,trackorder);
userouter.post('/address',userAuth,addAddress);
userouter.get('/address/fetch',userAuth,fetchAddress);
userouter.delete('/address/delete/:addressId',userAuth,deleteAddress);
userouter.put('/address/update/:addressId',userAuth,updateaddress);
export default userouter;