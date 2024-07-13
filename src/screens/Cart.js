import React from "react";
import axios from "axios";
//import Delete from "@material-ui/icons/Delete";
import { useCart, useDispatchCart } from "../components/ContextReducer";
export default function Cart() {
  let data = useCart();
  let dispatch = useDispatchCart();
  if (data.length === 0) {
    return (
      <div>
        <div className="m-5 w-100 text-center text-white fs-3">The Cart is Empty!</div>
      </div>
    );
  }

  /*
    const handleCheckOut = async () => {
      let userEmail = localStorage.getItem("userEmail");
      try {
        const response = await axios.post(
          'https://vivisteria-2lrx.vercel.app/api/orderData',
          {
            order_data: data,
            email: userEmail,
            order_date: new Date().toDateString(),
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        console.log("Response status:", response.status);
        if (response.status === 200) {
          dispatch({ type: "DROP" });
  
        }
      } catch (error) {
        console.error("Fetch error:", error);
       
      }
    };
  
  */
  const handleCheckOut = async () => {
    let userEmail = localStorage.getItem("userEmail");
    let response;
    try {
      response = await fetch("http://localhost:5000/api/orderData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_data: data,
          email: userEmail,
          order_date: new Date().toDateString(),
        }),
      });
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      console.log("JSON Response:", responseData);
      if (response.status === 200) {
        dispatch({ type: "DROP" });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      // Handle error state here, e.g., show an error message to the user
    }
  };

  let totalPrice = data.reduce((total, food) => total + food.price, 0);
  return (
    <div>
      {console.log(data)}
      <div className="container m-auto mt-5 table-responsive  table-responsive-sm table-responsive-md">
        <table className="table table-hover text-white">
          <thead className="fs-4">
            <tr>
              <th className="text-success" scope="col">#</th>
              <th className="text-success" scope="col">Name</th>
              <th className="text-success" scope="col">Quantity</th>
              <th className="text-success" scope="col">Option</th>
              <th className="text-success" scope="col">Amount</th>
              <th className="text-success" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr key={index}>
                <th className="text-white" scope="row">{index + 1}</th>
                <td className="text-white">{food.name}</td>
                <td className="text-white">{food.quantity}</td>
                <td className="text-white">{food.size}</td>
                <td className="text-white">{food.price}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger p-1"
                    onClick={() => {
                      dispatch({ type: "REMOVE", index: index });
                    }}
                  >
                    Remove
                  </button>{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>
          <h1 className="fs-2 text-white">Total Price: {totalPrice}/-</h1>
        </div>
        <div>
          <button className="btn bg-success mt-5 text-white" onClick={handleCheckOut}>
            {" "}
            Check Out{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
