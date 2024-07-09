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

      const responseData = response.data;
      setOrderData(responseData);
      console.log(response.data.orderData);
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
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
