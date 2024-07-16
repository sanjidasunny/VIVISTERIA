import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function MyOrder() {
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    const fetchMyOrder = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        const response = await axios.post(
          "http://localhost:5000/api/myorderData",
          { email: userEmail },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status !== 200) {
          throw new Error(`Failed to fetch order data: ${response.status}`);
        }

        const responseData = response.data.orderData;
        setOrderData(responseData); // Assuming responseData is an array of orders
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchMyOrder();
  }, []);

  const renderOrderDetails = () => {
    return orderData.map((order, index) => (
      <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
        <div className="mt-3 border rounded p-3">
          
          {order.orderedItems.map((item, idx) => (
            <div key={idx} className="container w-100 p-0">
               <h5 className="text-black">Order Date: {new Date(order.orderDate).toLocaleDateString()}</h5>
              <div className="m-1">Name: {item.name}</div>
              <div className="m-1">Price: {item.price}/-</div>
              <div className="m-1">Quantity: {item.quantity}
                
              </div>

            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div>
      <Navbar />
      <div className="container min-vh-100">
        <h1 className="mt-4">Order History</h1>
        <div className="row">
          {Array.isArray(orderData) && orderData.length > 0 ? (
            renderOrderDetails()
          ) : (
            <p className="text-center">No orders found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
