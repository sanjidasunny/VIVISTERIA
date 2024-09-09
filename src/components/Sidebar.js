import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ selectedCategory, setSelectedCategory }) {
  const [foodCat, setFoodCat] = useState([]);

  const loadData = async () => {
    try {
      let response = await fetch(
        // "http://localhost:5000/api/foodCategory"
        "https://vivisteria-2lrx.vercel.app/api/foodCategory"
        , {
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
      const sortedCategories = flatResponse.sort((a, b) =>
        a.CategoryName.localeCompare(b.CategoryName)
      );

      setFoodCat(sortedCategories);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isAdmin = localStorage.getItem("adminStatus") === "true";

  return (
    <div>
      <div className="sidebar-content">
        {isAdmin && (
          <Link className="btn btn-success" to="/addItem">
            Add New Item
          </Link>
        )}

        <div
          className="fs-4 text-black"
          style={{ marginBottom: "15px", marginTop: "15px" }}
        >
          Categories
        </div>
        <div
          className={`m-2 fs-6 ${selectedCategory === "All" ? "active-category" : ""}`}
          onClick={() => setSelectedCategory("All")}
          style={{ cursor: "pointer", color: "black" }}
        >
          All
        </div>
        {foodCat && foodCat.length > 0
          ? foodCat.map((data) => (
            <div
              key={data._id}
              className={`m-2 fs-6 text-black ${selectedCategory === data.CategoryName ? "active-category" : ""}`}
              onClick={() => setSelectedCategory(data.CategoryName)}
              style={{ cursor: "pointer" }}
            >
              {data.CategoryName}
            </div>
          ))
          : ""}
      </div>
    </div>
  );
}
