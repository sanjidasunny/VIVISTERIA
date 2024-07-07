import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function MyOrder() {
  const [orderData, setOrderData] = useState([]);

  const fetchMyOrder = async () => {
    const userEmail = localStorage.getItem("userEmail");

    try {
      const response = await axios.post('http://vivisteria-2lrx.vercel.app/api/myOrderData', {
        
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch order data: ${response.status}`);
      }

      const data = await response.json();
      setOrderData(data);
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
            orderData.map((data) => (
              <div key={data._id} className="col-12 col-md-6 col-lg-3">
                <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
                  <div className="card-body">
                    <h5 className="card-title text-black">{data.name}</h5>
                    <div className="container w-100 p-0" style={{ height: "38px" }}>
                      <span className="m-1 text-black">{data.qty}</span>
                      <span className="m-1 text-black">{data.size}</span>
                      <span className="m-1 text-black">{data.Order_date}</span>
                      <div className="d-inline ms-2 h-100 w-20 fs-5 text-black">
                        {data.price}/-
                      </div>
                    </div>
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
