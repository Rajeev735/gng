import sellermodel from "../models/sellermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ordermodel from "../model/ordermodel.js";

const sellerlist = async (req, res) => {
  try {
    const sellers = await sellermodel.find({}).select(["-password", -"email"]);
    res.json({ success: true, sellers });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

const Changeavailabilty = async (req, res) => {
  try {
    const { id } = req.body;
    const sellerdata = await sellermodel.findById(id);

    await sellermodel.findByIdAndUpdate(id, { available: !docdata.available });
    res.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginseller = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await doctormodel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const ismatch = await bcrypt.compare(password, doctor.password);

    if (ismatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const sellerorders = async (req, res) => {
  try {
    const { sellerid } = req.body;
    const orders = await sellermodel.find({ sellerid });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const ordercomplete = async (req, res) => {
  try {
    const { sellerid, orderid } = req.body;
    const orderdata = await appointmentmodel.findById(orderid);

    if (orderdata && orderdata.sellerid === sellerid) {
      await ordermodel.findByIdAndUpdate(orderid, {
        completed: true,
      });
      return res.json({ success: true, message: "Order Completed" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const ordercancel = async (req, res) => {

  try {
    const { orderid, sellerid } = req.body;
    const orderdata = await ordermodel.findById(orderid);

    if (orderdata && orderdata.sellerid === sellerid) {
      await sellermodel.findByIdAndUpdate(seller, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Order Cancelled" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const sellerdashboard = async (req, res) => {

  try {
    const { sellerid } = req.body;

    const appointments = await sellermodelmodel.find({ sellerid });

    let earnings = 0;
    appointments.map((item) => {
      if (item.completed || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];
    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });
    const dashdata = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestappointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashdata });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getdocprofile = async (req, res) => {
  try {
    const { docid } = req.body;
    const profile = await doctormodel.findById(docid).select("-password");
    res.json({ success: true, profile });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updatedocprofile = async (req, res) => {
  try {
    const { docid, fees, address, available } = req.body;

    await doctormodel.findByIdAndUpdate(docid, { fees, address, available });
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export {
  Changeavailabilty,
  doclist,
  logindoctor,
  doctorappointments,
  appointmentcancel,
  appointmentcomplete,
  doctordashboard,
  getdocprofile,
  updatedocprofile,
};
