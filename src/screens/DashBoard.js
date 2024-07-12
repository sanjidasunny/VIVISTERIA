import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
export default function DashBoard() {

  const [foodCat, setFoodCat] = useState([]);

  const loadData = async () => {
    try {
      let response = await fetch("http://localhost:5000/api/foodCategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      response = await response.json();
      const flatResponse = response.flat();
      const transformedData = flatResponse.map(item => ({
        name: item.CategoryName,
        data: item.purchased
      }));
      setFoodCat(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error state here, e.g., show a message to the user
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <LineChart
          width={1000}
          height={250}
          data={foodCat}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="data" stroke="#8884d8" />

        </LineChart>
      </div>
      <Footer />
    </div>
  );
}
