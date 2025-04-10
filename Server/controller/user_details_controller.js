import {addressmodel} from "../model/addressmodel.js";
import {usermodel} from "../model/mongobd_usermodel.js";
import ordermodel from "../model/ordermodel.js";
import validator from "validator";

export const getuserdeta = async (req,res)=>{
    try {
        const {userId} = req.body;
        const user = await usermodel.findById(userId);
        if(!user) {
            return res.json({success:false, message : 'user not found'});
        }
        res.json({
            success:true,
            userData: {
                name : user.name,
                isAccountVerify : user.isAccountVerify
            }
        })

    } catch (error) {
        res.json({success: false, message: error.message});
    }

}



export const getprofile = async (req, res) => {
    try {
         // Debugging log
  
        const {userId} = req.body 
 // Get user ID from decoded token
  
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
  
        const userdata = await usermodel.findById(userId)
        
        console.log("User Data:", userdata);
        
        if (!userdata) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
  
        return res.status(200).json({ success: true, userdata });
  
    } catch (e) {
        console.error("Error in getprofile:", e);
        return res.status(500).json({ success: false, message: e.message });
    }
  };
  

  export const updateprofile = async (req, res) => {
    try {
      const {userId} = req.body; // ✅ Extract user ID from authenticated request
  
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized request" });
      }
  
      const { name, phone, alternatephone,email } = req.body;
     
      if (!name || !phone ||!email ) {
        return res.status(400).json({ success: false, message: "Data Missing" });
      }
      
      if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
      }
   
      

      const updatedUser = await usermodel.findByIdAndUpdate(
        userId,
        { name, phone, alternatephone,  },
        { new: true } // ✅ Returns the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      return res.status(200).json({ success: true, message: "Profile Updated", userdata: updatedUser });
  
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  };

  export const placeorder = async(req,res) =>{

    try {
      const { userId, items,sellerid } = req.body;
      
      if (!userId || !items || items.length === 0 || !sellerid) {
          return res.status(400).json({ message: 'Invalid order details' });
      }
      
      const newOrder = new ordermodel({ userId, items,sellerid });
      await newOrder.save();
      
      res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
  }

  export const fetchorder = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "userId required" });
        }

        // Fetch user orders
        const orders = await ordermodel.find({ userId });

        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: "Orders not found" });
        }

        // Update total amount for each order
        let updatedOrders = [];

        for (let i = 0; i < orders.length; i++) {
            const amount = orders[i].items.reduce((total, item) => total + item.quantity * item.price, 0);

            // Update order with total amount
            const updatedOrder = await ordermodel.findByIdAndUpdate(
                orders[i]._id,  // Correctly updating by order ID
                { totalamount: amount },
                { new: true } // Returns updated order
            );

            updatedOrders.push(updatedOrder);
        }

        return res.status(200).json({ success: true, orders: updatedOrders });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


  export const orderdetails=async(req,res)=>{
    try{
         const {orderid} = req.params;
         if(!orderid){
           return res.status(400).json({ message: 'Order ID required' });
         }
         const order= await ordermodel.findById(orderid);
         if(!order){

          return res.status(404).json({success:false,message:"Order not found"});

         }
         return res.status(200).json({ success: true, data: order });
    }
    catch(error){
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

export const trackorder =async(req,res)=>{
  try{
      const {orderid}=req.params;
      if(!orderid){
        return res.status(400).json({ message: 'Order ID required' });
      }
      const order=await ordermodel.findById(orderid,"status createdat");
      if(!order){
        return res.status(404).json({success:false,message:"Order not found"})
      }
      return res.status(200).json({success:true,status:order})
      }
  
  catch(error){
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const addAddress=async(req,res)=>{
  try{
      const {userId,city,state,name,email,pin,address,phone,label,alternatephone}=req.body;
      
      if (!userId || !city || !state || !name || !email || !pin || !address || !phone || !label) {
        return res.status(400).json({ success: false, message: "data missing" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    const existinglabel= await addressmodel.findOne({userId,label})

    if (existinglabel) {
      return res.status(400).json({ success: false, message: "Label already exists. Choose a different one." });
    }

    const existingemail= await addressmodel.findOne({userId,label})

    if (existingemail) {
      return res.status(400).json({ success: false, message: "email already exists. Choose a different one." });
    }
    const newaddress = new addressmodel({ userId,city,state,name,email,pin,address,phone ,alternatephone,label});
      await newaddress.save();
      return res.status(200).json({success:true,address:newaddress})
  }
  catch(error){
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const fetchAddress=async(req,res)=>{
  try{
      const {userId}=req.body;
      if (!userId) {
        return res.status(400).json({ success: false, message: "userId is required" });
    }
    const address = await addressmodel.find({userId});
    
        return res.status(200).json({success:true,address})
      
      
  }
  catch(error){
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}



export const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params; // Get the address ID from URL params

        if (!addressId) {
            return res.status(400).json({ success: false, message: "Address ID is required" });
        }

        const deletedAddress = await addressmodel.findByIdAndDelete(addressId);

        if (!deletedAddress) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        res.status(200).json({ success: true, message: "Address deleted successfully" });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const updateaddress = async (req, res) => {
  try {
    const {addressId} = req.params; // ✅ Extract user ID from authenticated request
   
    if (!addressId) {
      return res.status(401).json({ success: false, message: "Unauthorized request" });
    }
    const {userId}=req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
  }

    const { name, phone, alternatephone,email,city,state,address,pin,label } = req.body;

    if (!name || !phone ||!email || !city || !state || !address || !pin || !label) {
      return res.status(400).json({ success: false, message: "Data Missing" });
    }
    const existinglabel= await addressmodel.findOne({userId,label})

    if (existinglabel) {
      return res.status(400).json({ success: false, message: "Label already exists. Choose a different one." });
    }

    const existingemail= await addressmodel.findOne({userId,label})

    if (existingemail) {
      return res.status(400).json({ success: false, message: "email already exists. Choose a different one." });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }
  

    const updatedaddress = await addressmodel.findByIdAndUpdate(
      addressId,
      { name, phone, alternatephone,email,city,state,address,pin,label},
      { new: true } // ✅ Returns the updated document
    );

    if (!updatedaddress) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "Profile Updated", address: updatedaddress });

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
