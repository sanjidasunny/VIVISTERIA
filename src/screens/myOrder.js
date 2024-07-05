import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function MyOrder() {
  const [orderData, setorderData] = useState({});

  const fetchMyOrder = async () => {
   /* console.log(localStorage.getItem("userEmail"));
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
      await setorderData(response);
    });*/
    const userEmail = localStorage.getItem('userEmail');
        try {
            const response = await axios.post(
                'https://vivisteria.vercel.app/api/myOrderData',
                { email: userEmail },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // You can add additional headers as needed
                    },
                }
            );
            setOrderData(response.data);
        } catch (error) {
            console.error('Error fetching order data:', error);
        }

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
                                  <div
                                    className="card mt-3"
                                    style={{
                                      width: "16rem",
                                      maxHeight: "360px",
                                    }}
                                  >
                                    <div className="card-body">
                                      <h5 className="card-title text-black">
                                        {arrayData.name}
                                      </h5>
                                      <div
                                        className="container w-100 p-0"
                                        style={{ height: "38px" }}
                                      >
                                        <span className="m-1 text-black">
                                          {arrayData.qty}
                                        </span>
                                        <span className="m-1 text-black">
                                          {arrayData.size}
                                        </span>
                                        <span className="m-1 text-black">
                                          {data}
                                        </span>
                                        <div className=" d-inline ms-2 h-100 w-20 fs-5 text-black">
                                          {arrayData.price}/-
                                        </div>
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
