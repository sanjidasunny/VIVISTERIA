import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import '../Dashboard.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle,
  PieChart,
  Pie,
} from "recharts";

export default function DashBoard() {
  const [foodCat, setFoodCat] = useState([]);
  const [totalFoodsDelivered, setTotalFoodsDelivered] = useState(0);

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
      const transformedData = flatResponse.map((item) => ({
        name: item.CategoryName,
        Purchased_Amount: item.purchased,
      }));
      setFoodCat(transformedData);
      const total = transformedData.reduce(
        (sum, item) => sum + item.Purchased_Amount,
        0
      );
      setTotalFoodsDelivered(total);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error state here, e.g., show a message to the user
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="dashboard bg-white">
      <Navbar />
      <div className="content">
        <div className="total-delivered">
          <h2>Total Foods Delivered: <span>{totalFoodsDelivered}</span></h2>
        </div>
        <div className="charts-container">
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={foodCat}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="Purchased_Amount"
                  fill="#8884d8"
                  activeBar={<Rectangle fill="lavender" stroke="blue" />}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="chart-title fs-3" style={{ display: "flex", justifyContent: "center" }}>Bar Chart</div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  dataKey="Purchased_Amount"
                  isAnimationActive={false}
                  data={foodCat}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-title fs-3" style={{ display: "flex", justifyContent: "center" }}>Pie Chart</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
