import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/Appcontext";

const Orders = () => {
  const [openOrderIndex, setOpenOrderIndex] = useState(null);
  const { backendurl, userData } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/api/user/orders/fetch`);
      console.log("Fetched Orders Data:", data);

      // Ensure `orders` is always an array
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (e) {
      console.error("Error fetching orders:", e.message);
    }
  };

  const getOrderDetails = async (orderId) => {
    try {
      const { data } = await axios.get(`${backendurl}/api/user/orders/${orderId}`); // Fixed URL
      if (data.success) {
        console.log("Order details", data);
        setOrderDetails(data);
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    if (userData) {
      getOrders();
    }
  }, [userData]);

  const toggleOrderDetails = (index) => {
    setOpenOrderIndex(openOrderIndex === index ? null : index);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
        <thead>
  <tr className="bg-gray-200">
    <th className="border p-2">Order ID</th>
    <th className="border p-2">Total Amount</th>
    <th className="border p-2">Status</th>
    <th className="border p-2">Actions</th>
  </tr>
</thead>
<tbody>
  {orders.map((order, index) => (
    <React.Fragment key={order._id}>
      <tr className="text-center">
        <td className="border p-2">{order._id}</td>
        <td className="border p-2">
          ₹{order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
        </td>
        <td className="border p-2">{order.status}</td>
        <td className="border p-2">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => toggleOrderDetails(index)}
          >
            {openOrderIndex === index ? "Hide Details" : "View Details"}
          </button>
        </td>
      </tr>

      {openOrderIndex === index && (
        <tr>
          <td colSpan="4" className="p-4">
            <h3 className="font-semibold">Order Details:</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Product Name</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item._id} className="text-center">
                    <td className="border p-2">{item.title}</td>
                    <td className="border p-2">{item.quantity}</td>
                    <td className="border p-2">₹{item.price}</td>
                    <td className="border p-2">₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default Orders;
