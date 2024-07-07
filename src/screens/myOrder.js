import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function MyOrder() {
  const [orderData, setOrderData] = useState([]);

  const fetchMyOrder = async () => {
    const userEmail = localStorage.getItem("userEmail");

    try {
      const response = await axios.post(
        'https://vivisteria-2lrx.vercel.app/api/myOrderData',
        { email: userEmail },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status !== 200) {
        throw new Error(`Failed to fetch order data: ${response.status}`);
      }

      setOrderData(response.data.orderData); // Assuming response.data is the array of arrays
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container min-vh-100">
        <div className="row">
          {orderData.length > 0 ? (
            orderData.map((orderArray, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-3">
                <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
                  <div className="card-body">
                    <h5 className="card-title text-black">Order {index + 1}</h5>
                    {orderArray.map((order, innerIndex) => (
                      <div key={innerIndex} className="container w-100 p-0" style={{ height: "38px" }}>
                        {innerIndex === 0 ? (
                          <span className="m-1 text-black">{order.Order_date}</span>
                        ) : (
                          <>
                            <span className="m-1 text-black">{order.quantity}</span>
                            <span className="m-1 text-black">{order.size}</span>
                            <div className="d-inline ms-2 h-100 w-20 fs-5 text-black">
                              {order.price}/-
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No order data available.</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
