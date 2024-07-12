import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
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

      setFoodCat(flatResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error state here, e.g., show a message to the user
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  const isAdmin = localStorage.getItem("adminStatus") === "true";
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <span className="fs-4">Sidebar</span>
        <hr />
        {isAdmin ? (
          <Link className="btn btn-success" to="/addItem">
            Add New Item
          </Link>
        ) : (
          ""
        )}

        <div
          className="fs-4"
          style={{ marginBottom: "15px", marginTop: "15px" }}
        >
          Catagories
        </div>
        <div className="m-2 fs-6">All</div>
        {foodCat && foodCat.length > 0
          ? foodCat.map((data) => (
            <div className="m-2 fs-6">{data.CategoryName}</div>
          ))
          : ""}
      </div>
    </div>
  );
}
