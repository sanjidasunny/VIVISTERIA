import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatchCart, useCart } from "../components/ContextReducer";

function Cart({ showPayment }) {
  const data = useCart();
  const dispatch = useDispatchCart();
  const totalPrice = data.reduce((total, food) => total + food.price, 0);
  const cartData = localStorage.getItem('cart')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  useEffect(() => {
    if (isPaymentSuccessful) {
      // Close the modal after successful payment
      setTimeout(() => {
        setIsPaymentSuccessful(false);
        // Additional logic to close the modal
      }, 500);
    }
  }, [isPaymentSuccessful]);

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method before proceeding.");
      return;
    }

    console.log(cartData)
    console.log(data)


    axios.post(
      // "http://localhost:5000/api/payment",
      "https://vivisteria-2lrx.vercel.app/api/payment",
      {

        email: localStorage.getItem("userEmail"),
        orderedItems: data.map((item) => ({ name: item.name, price: item.price, quantity: item.quantity, category: item.CategoryName })),
        totalAmount: totalPrice,
        paymentMethod: selectedPaymentMethod,
      })
      .then((response) => {
        console.log("Payment successful:", response.data);
        alert("Payment successful!");
        dispatch({ type: "DROP" });
        setIsPaymentSuccessful(true);
      })
      .catch((error) => {
        console.error("Payment error:", error);
        alert("Payment failed. Please try again.");
      });
  };

  const renderTableRows = () => {
    return data.map((food, index) => (
      <tr key={index}>
        <th className="text-black" scope="row">{index + 1}</th>
        <td className="text-black">{food.name}</td>
        <td className="text-black">{food.quantity}</td>
        <td className="text-black">{food.size}</td>
        <td className="text-black">{food.price}</td>

        <td>
          <button
            type="button"
            className="btn btn-danger p-1"
            onClick={() => {
              dispatch({ type: "REMOVE", index: index });
            }}
          >
            Remove
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div style={{ backgroundColor: "rgb(34, 34, 34)" }} className="container m-auto mt-5">
      {data.length === 0 ? (
        <h2 className="text-center text-white">The cart is empty</h2>
      ) : (
        <table className="table table-hover text-black">
          <thead className="fs-4">
            <tr  >
              <th className="text-success" scope="col">#</th>
              <th className="text-success" scope="col">Name</th>
              <th className="text-success" scope="col">Quantity</th>
              <th className="text-success" scope="col">Option</th>
              <th className="text-success" scope="col">Amount</th>

              <th className="text-success" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>{renderTableRows()}</tbody>
        </table>
      )}

      {showPayment && data.length > 0 && (
        <div className="modal-content text-center" style={{ backgroundColor: "rgb(34, 34, 34)" }}>
          <h3 className="text-center mb-3 text-white">Choose Your Payment Method</h3>
          <div className="btn-group mb-3" role="group" aria-label="Payment Method">
            <button
              type="button"
              className={`btn btn-outline-secondary ${selectedPaymentMethod === "Bkash" ? "active" : ""}`}
              onClick={() => setSelectedPaymentMethod("Bkash")}
              style={{ backgroundColor: "#e2136e", color: "white" }}
            >
              Bkash
            </button>
            <button
              type="button"
              className={`btn btn-outline-secondary ${selectedPaymentMethod === "Nagad" ? "active" : ""}`}
              onClick={() => setSelectedPaymentMethod("Nagad")}
              style={{ backgroundColor: "#f6921e", color: "white" }}
            >
              Nagad
            </button>
            <button
              type="button"
              className={`btn btn-outline-secondary ${selectedPaymentMethod === "Rocket" ? "active" : ""}`}
              onClick={() => setSelectedPaymentMethod("Rocket")}
              style={{ backgroundColor: "#7c1a84", color: "white" }}
            >
              Rocket
            </button>

          </div>
          <div className="mb-3">
            {selectedPaymentMethod && (
              <div className="border p-3 text-black">
                <p className=" text-white">Selected Payment Method</p>
                <div className="border p-2 text-white">{selectedPaymentMethod}</div>
              </div>
            )}
          </div>
          <p className="mb-3 text-white">Total Amount: {totalPrice} /-</p>
          <button className="btn btn-success text-black" onClick={handlePayment}>
            Pay Now
          </button>
        </div>
      )}



      {isPaymentSuccessful && (
        <div className="modal-content text-center">
          <h3 className="text-center mb-3">Payment Details</h3>
          <div className="border p-3">
            <p>Payment was successful!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
