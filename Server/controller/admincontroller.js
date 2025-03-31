import validator from "validator"
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from "cloudinary"
import doctormodel from "../models/doctormodel.js"
import jwt from 'jsonwebtoken'
import 'dotenv/config';
import appointmentmodel from "../models/appointmentmodel.js"
import usermodel from "../models/usermodel.js"


const adddoctor = async ( req,res ) => {

  try {

    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imagefile = req.file 



    if (!imagefile || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {

      return res.status(400).json({ success:false, message:"Missing Details" });
    }

    if (!validator.isEmail(email)){
      return res.status(400).json({ success:false, message:"please enter a valid email" });
    }

    if(password.length<8){
      return res.status(400).json({ success:false, message:"please enter a strong password" });

    }

    const salt=await bcrypt.genSalt(10)
    const hashedPassword= await bcrypt.hash(password,salt)
    
    const imageupload =await cloudinary.uploader.upload(imagefile.path,{resource_type:"image"})
    const imageurl=imageupload.secure_url
    
    const docdata={
      name,
      email,
      image:imageurl,
      password:hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address:JSON.parse(address),
      date:Date.now()
    }

    const newDoctor=new doctormodel(docdata)
    await newDoctor.save()

    res.json({success:true,message:"Doctor Added"})

  } catch (error) {
    console.error("Error occurred:", error.message);
    console.error(error.stack); // Prints detailed error trace
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const loginadmin=async(req,res)=>{
  try{
    const {email,password}=req.body

    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

       
      const token =jwt.sign(email+password,process.env.JWT_SECRET)
      res.json({success:true,token})
    }

    else{
      res.json({success:false,message:"invalid credentials"})
    }
  }
  catch(error){
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

const alldoctors=async(req,res)=>{
  try{
    const doctors=await doctormodel.find({}).select('-password')
    res.json({success:true,doctors})
  }
  catch(e){
    console.log(e)
    res.json({success:false,message:error.message})
  }
}


const appointmentsadmin = async(req,res) =>{

  try{

    const appointments  = await appointmentmodel.find({})
    res.json({success:true,appointments})

  }
  catch(e){
    console.log(e)
    res.json({success:false,message:error.message})
  }

}

const appointmentcancel = async (req,res) =>{

  try{

    const {appointmentid} = req.body

    const appointmentdata = await appointmentmodel.findById(appointmentid)

 

    await appointmentmodel.findByIdAndUpdate(appointmentid,{cancelled:true})

    const {docid, slotdate, slottime} = appointmentdata
    const docdata = await doctormodel.findById(docid)

    let slots_booked=docdata.slots_booked

    slots_booked[slotdate] = slots_booked[slotdate].filter(e=>e!==slottime)

    await doctormodel.findByIdAndUpdate(docid,{slots_booked})

    res.json({success:true, message:"Appointment Cancelled"})

  }
  
  catch(error)

  {

    console.log(error)
    res.json({success:false,message:error.message})

  }
}

const admindashboard = async(req,res) =>{

  try{

    const doctors =await doctormodel.find({})
    const users = await usermodel.find({})
    const appointments = await appointmentmodel.find({})

    const dashdata={
      doctors:doctors.length,
      appointments:appointments.length,
      patients:users.length,
      latestAppointments:appointments.reverse().slice(0,5)
    }

    res.json({success:true ,dashdata})

  }

  catch(error)
 
  {

    console.log(error)
    res.json({success:false,message:error.message})

  }
}

export  {adddoctor,loginadmin,alldoctors,appointmentsadmin,appointmentcancel,admindashboard};