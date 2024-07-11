import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function MyOrder() {
  const [orderData, setOrderData] = useState([]);
  /*
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
  
        const responseData = response.data;
        setOrderData(responseData);
        console.log(response.data.orderData);
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };
  */
  const fetchMyOrder = async () => {
    console.log(localStorage.getItem("userEmail"));
    await fetch("http://localhost:5000/api/myOrderData", {
      // credentials: 'include',
      // Origin:"http://localhost:3000/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: localStorage.getItem("userEmail"),
      }),
    }).then(async (res) => {
      let response = await res.json();
      await setOrderData(response);
    });

    // await res.map((data)=>{
    //    console.log(data)
    // })
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div className="container min-vh-100">
        <h1 className="mt-4">Order History</h1>
        <div className="row">
          {orderData != {}
            ? Array(orderData).map((data) => {
                return data.orderData
                  ? data.orderData.order_data
                      .slice(0)
                      .reverse()
                      .map((item) => {
                        return item.map((arrayData) => {
                          return (
                            <div>
                              {arrayData.Order_date ? (
                                <div className="m-auto mt-5 text-black">
                                  {(data = arrayData.Order_date)}
                                  <hr />
                                </div>
                              ) : (
                                <div className="col-12 col-md-6 col-lg-3">
                                  <div className="mt-3  border rounded p-3 m-3">
                                    <h5 className="text-black">
                                      {arrayData.name}
                                    </h5>
                                    <div className="container w-100 p-0">
                                      <div className="m-1 text-danger">
                                        {"Price: "}
                                        {arrayData.size}
                                      </div>
                                      <div className="m-1 text-primary">
                                        {"Quantity: "}
                                        {arrayData.quantity}
                                      </div>

                                      <div className=" d-inline ms-2 h-100 w-20 fs-5 text-black">
                                        {"Total price: "}
                                        {arrayData.price}/-
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        });
                      })
                  : "";
              })
            : ""}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
