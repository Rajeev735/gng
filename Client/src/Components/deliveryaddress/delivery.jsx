
import React, { useContext, useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { AppContext } from "../context/Appcontext";
import  axios  from "axios";
import { toast } from "react-toastify";

function Delivery() {
  const [addresses, setaddresses] = useState([]);

  const {backendurl,userData}=useContext(AppContext)
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newAddress, setNewAddress] = useState({
 
    name: "",
    address: "",
    pin: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    alternatephone: "",
    label:""
  });
    const getaddresses = async () =>{
        console.log("userData:", userData);
        console.log("Authorization Header:", `Bearer ${userData}`);
          try{
               
              const {data} = await axios.get(backendurl + "/api/user/address/fetch"
              
          )  
              
              if(data.success){
                console.log("data",data)
              
                if (Array.isArray(data.address)) {  // Ensure it's an array
                  setaddresses(data.address);
                } else {
                  console.error("Expected an array, but got:", data.addresses);
                  setaddresses([]); // Set to an empty array to prevent errors
                }
              }
              else {
                toast.error(data.message);
              } 
    
    } 
              
          
          
          catch(e){
    
            console.log(e)
            toast.error(e.message)
    
          }
          
       }

       const uploadaddress = async () => {
        if (!backendurl) {
          toast.error("Backend URL is missing");
          return;
        }
      
        try {
          const { data } = await axios.post(`${backendurl}/api/user/address`, newAddress);
      
          if (data.success) {
            await getaddresses(); 
            toast.success(data.message);
           // Refresh address list
            setNewAddress({ name: "", address: "", pin: "", phone: "", email: "", city: "", state: "", alternatephone: "", label: "" });
          
          }
        } catch (e) {
          console.log(e);
          toast.error(e.message);
        }
      };
      

    useEffect(()=>{
      if(!userData){
     return;
      
      }
       else{
        getaddresses()
       }
    
     
    },[userData]) 

    const handleEdit = (address) => {
      setNewAddress({ ...address }); // Load selected address
      setEditId(address._id);
      setEditMode(true);
      console.log("new Address",newAddress);
      console.log("editid",editId);
      console.log("editmode",editMode);
    };

    console.log("addresses:",addresses)
  
    const handleDelete = async (id) => {
      try {
        const { data } = await axios.delete(`${backendurl}/api/user/address/delete/${id}`);
        if (data.success) {
          toast.success("Address deleted successfully!");
          await getaddresses(); // Refresh the list after deletion
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error deleting address:", error);
        toast.error("Failed to delete address");
      }
    };
    const handleUpdate = async (editId) => {
  
      if (!editId) {
        toast.error("No address selected for update.");
        return;
      }
    
      try {
        console.log("newAddress",newAddress);
       
        const { data } = await axios.put(`${backendurl}/api/user/address/update/${editId}`, newAddress);
        
        if (data.success) {
          toast.success("Address updated successfully!");
          await getaddresses();  // Refresh address list
          setEditMode(false);
          setEditId(null);
          setNewAddress({ name: "", address: "", pin: "", phone: "", email: "", city: "", state: "", alternatephone: "", label: "" });
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error updating address:", error);
        toast.error("Failed to update address");
      }
    };
    
  return (
    <div className="container mx-auto p-5 flex gap-4">
      <div className="w-2/3 flex flex-col gap-6">
        <h2 className="text-xl font-semibold">Select Shipping Address</h2>
        { addresses && addresses.map((item,index) => (
          <div key={index} className="border p-3 rounded-lg my-2 flex justify-between items-center">
            <div>
            <h1 className="font-extrabold text-2xl text-black">{item.label}</h1>
              <h3 className="font-bold">{item.name}</h3>
              <p>{item.city}</p>
              <p>{item.state}</p>
              <p>{item.address}, {item.pin}</p>
             
              <p>{item.phone} | {item.email}</p>
              <p>{item.alternatephone}</p>
              
            </div>
            <div className="flex gap-2">
              <Edit onClick={()=>handleEdit(item)} className="cursor-pointer text-blue-500" />
              <Delete onClick={()=>handleDelete(item._id)} className="cursor-pointer text-red-500" />
            </div>
          </div>
        ))}
        
        <h3 className="text-lg font-semibold mt-4">Add New Address</h3>
        <div className="grid grid-cols-2 gap-3">
        <TextField label="Label *" variant="outlined" fullWidth size="small" 
            value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} />
          <TextField label="Full Name *" variant="outlined" fullWidth size="small" 
            value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} />
             <TextField label="Phone *" variant="outlined" fullWidth size="small" 
            value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
           <TextField label="Email *" variant="outlined" fullWidth size="small" 
            value={newAddress.email} onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })} />
            <TextField label="State *" variant="outlined" fullWidth size="small" 
            value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
            <TextField label="City *" variant="outlined" fullWidth size="small" 
            value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
            <TextField label="PIN CODE *" variant="outlined" fullWidth size="small" 
            value={newAddress.pin} onChange={(e) => setNewAddress({ ...newAddress, pin: e.target.value })} />
          <TextField label="Street Address *" variant="outlined" fullWidth size="small" 
            value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} />
         
          <TextField label="Alternate Phone" variant="outlined" fullWidth size="small" 
            value={newAddress.alternatephone} onChange={(e) => setNewAddress({ ...newAddress, alternatephone: e.target.value })} />
          
        </div>
        <Button onClick={()=>editMode?handleUpdate(editId):uploadaddress()}  variant="contained" color="primary" className="mt-3 w-full "> {editMode ? "Update Address" : "Save Address"}</Button>
        {editMode && (
          <Button onClick={() => { setEditMode(false); setEditId(null); }} variant="contained" color="secondary" className="mt-3 w-full ">
            Cancel
          </Button>
        )}
      </div>
      
      <div className="w-1/3 border p-4 rounded-lg bg-gray-100">
        <h2 className="text-lg font-bold">Payment</h2>
        <p>Here we can add a payment gateway after approval</p>
        <Button variant="contained" color="secondary" className="mt-3 w-full">Proceed to Payment</Button>
      </div>
    </div>
  );
};


export default Delivery

