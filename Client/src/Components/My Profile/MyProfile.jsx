import React, { useContext, useState,useEffect} from "react";
import axios from "axios"
import {toast} from "react-toastify"
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import TextField from "@mui/material/TextField";

import { Button } from "@mui/material";
import { AppContext } from "../context/Appcontext";

function MyProfile() {

  const [isOpenSummary, setOpenSummary] = useState(0);

  const [edit,setedit] =useState(false)
  const [Email, setEmail] = useState(localStorage.getItem("email") || "");

  const toggleSummaryPanel = (index) => {

    setOpenSummary(isOpenSummary === index ? null : index);

  };

  const {backendurl,userData} =useContext(AppContext)



  const [userprofile, setuserprofile] = useState({
    name: "",
    phone: "",
    Address: "",
    city: "",
    state: "",
    pin: "",
    alternatephone: "",
    email: "",
  });
   
   const loaduserprofile = async () =>{
    console.log("userData:", userData);
    console.log("Authorization Header:", `Bearer ${userData}`);
      try{
           
          const {data} = await axios.get(backendurl + "/api/user/get-profile"
          
      )  
          
          if(data.success){
            console.log("data",data)
            setuserprofile({
              name: data.userdata?.name ,
              phone: data.userdata?.phone ,
              Address: data.userdata?.Address,
              city: data.userdata?.city ,
              state: data.userdata?.state ,
              pin: data.userdata?.pin ,
              alternatephone: data.userdata?.alternatephone ,
              email: data.userdata?.email 
            });
            
          }

          else{
            toast.error(data.message)
            console.log(data.message)
          }
          
      }
      
      catch(e){

        console.log(e)
        toast.error(e.message)

      }
      
   }

   const uploaduserprofile = async () => {
    try {
      const missingFields = Object.entries(userprofile).filter(([key, value]) => !value.trim());

      if (missingFields.length > 0) {
        toast.error("Data Missing: Please fill all required fields before saving!");
        return;
      }
        const { data } = await axios.post(backendurl + "/api/user/update-profile", userprofile,
          
        );
        if (data.success) {
            toast.success(data.message);
            await loaduserprofile();
            setedit(false);
        } else {
            toast.error(data.message);
        }
    } catch (e) {
        console.log(e);
        toast.error(e.message);
    }
 };

  useEffect(()=>{
    if(!userData){
      setuserprofile({

       

       
    });
    return
    }
     
  
    else{

      loaduserprofile()
      
    }
   
  },[userData])
 
    return (
    <div className="container !my-2 lg:w-[80%] lg:mx-w-[80%] w-full lg:flex gap-4">
      <div className="leftPart lg:w-[70%] w-full">
        {/* Billing Details */}
        <Accordion className="m-2" expanded={isOpenSummary === 0} onChange={() => toggleSummaryPanel(0)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h1 className="text-[16px] pl-1">Billing Details</h1>
           
          </AccordionSummary>
         
          <AccordionDetails>
            <div  className="w-full">
              <h6 className="pt-3 mb-2 px-1 text-[13px] font-[500]">Name and Phone *</h6>
              <div className="lg:flex items-center gap-3">
                <TextField className="w-full lg:w-[50%]" label="Full Name" size="small" disabled={!edit} variant="filled" value={userprofile.name} onChange={(e) => setuserprofile({ ...userprofile, name: e.target.value })}  />
                 <TextField className="w-full lg:w-[50%] lg:mt-0 mt-3" label="Phone Number" size="small" disabled={!edit} variant="filled"  value={userprofile.phone}  onChange={(e) => {
                    const inputValue = e.target.value; // Define the input value
                    if (/^\d{0,15}$/.test(inputValue)) { // Allow only numbers
                      setuserprofile({ ...userprofile, phone: inputValue });
                    }
                }} />
               
              </div>
              <h6 className="pt-3 mb-2 px-1 text-[13px] font-[500]">Street Address *</h6>
               <TextField className="w-full" label="Address (Area and Street)" size="small" variant="filled" disabled={!edit} value={userprofile.Address} onChange={(e) => setuserprofile({ ...userprofile, Address: e.target.value })} />
             
              <h6 className="pt-3 mb-2 px-1 text-[13px] font-[500]">City and State *</h6>
              <div className="lg:flex items-center gap-3">
                <TextField className="w-full lg:w-[50%]" label="City/District/Town" size="small" variant="filled" disabled={!edit}  value={userprofile.city}  onChange={(e) => setuserprofile({ ...userprofile, city: e.target.value })} />
                
                <TextField className="w-full lg:w-[50%] lg:mt-0 mt-3" label="State" size="small" variant="filled" disabled={!edit}  value={userprofile.state} onChange={(e) => setuserprofile({ ...userprofile, state: e.target.value })} />
                
              </div>
              <h6 className="pt-3 mb-2 px-1 text-[13px] font-[500]">Pincode and Alternate Phone *</h6>
              <div className="lg:flex items-center gap-3">
                <TextField className="w-full lg:w-[50%]" label="Pincode" size="small" variant="filled" disabled={!edit}  value={userprofile.pin}  onChange={(e) => {
                    const inputValue = e.target.value; // Define the input value
                    if (/^\d{0,6}$/.test(inputValue)) { // Allow only numbers
                      setuserprofile({ ...userprofile, pin: inputValue });
                    }
                }} />
                
                <TextField className="w-full lg:w-[50%] lg:mt-0 mt-3" label="Alternate Number" size="small" variant="filled"
                  value={userprofile.alternatephone} disabled={!edit} onChange={(e) => {
                    const inputValue = e.target.value; // Define the input value
                    if (/^\d*$/.test(inputValue)) { // Allow only numbers
                      setuserprofile({ ...userprofile, alternatephone: inputValue });
                    }
                }} />
                
              </div>
              <h6 className="pt-3 mb-2 px-1 text-[13px] font-[500]">Email Address *</h6>
            
              <TextField className="w-full" label="Email Address" size="small" variant="filled" disabled={true} value={userprofile.email}/>
              <div className="btns flex justify-end mx-1 mt-4 w-full gap-3">
                <Button variant="contained" className="w-full !bg-[#fb541b] !h-[45px]">
                  Deliver Here
                </Button>
                {
                !edit?
                <Button onClick={()=>(setedit(true))} variant="contained" className="w-full !bg-[#fb541b] !h-[45px]">
                 Edit Details
                </Button> :<Button onClick={()=>uploaduserprofile()} variant="contained" className="w-full !bg-[#311bfb] !h-[45px]">
                 Save Details
                </Button>
                }
                
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
        {/* Order Summary */}
        <Accordion className="m-2" expanded={isOpenSummary === 1} onChange={() => toggleSummaryPanel(1)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h1 className="text-[16px] pl-1">Order Summary</h1>
          </AccordionSummary>
          <AccordionDetails>
          <div className="shadow-md rounded-md bg-white reviewScroll w-full border-b border-gray-200  !max-h-[450px] overflow-y-scroll overflow-x-hidden">
                
                </div>
                <div className="btn mt-4 flex justify-end">
                    <Button variant='contained' className='!bg-[#fb541b] !h-[50%] w-[40%] !rounded-none !p-3'>Continue</Button>
                  </div>
          </AccordionDetails>
        </Accordion>

        {/* Payment Options */}
        <Accordion className="m-2" expanded={isOpenSummary === 2} onChange={() => toggleSummaryPanel(2)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h1 className="text-[16px] pl-1">Payment Options</h1>
          </AccordionSummary>
          <AccordionDetails>
            Payment details
          </AccordionDetails>
        </Accordion>
      </div>

      {/* Right Part - Total Price */}
      <div className="rightPart w-full lg:!m-0 mt-4 lg:w-[30%]">
   
      </div>
    </div>
  );
}

export default MyProfile;