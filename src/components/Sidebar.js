import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ setSelectedCategory }) {
  const [foodCat, setFoodCat] = useState([]);

  const loadData = async () => {
    try {
      let response = await fetch("https://vivisteria-2lrx.vercel.app/api/foodCategory", {
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
    <div className="sidebar fixed-side">
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
          Categories
        </div>
        <div
          className="m-2 fs-6"
          onClick={() => setSelectedCategory("All")}
          style={{ cursor: "pointer" }}
        >
          All
        </div>
        {foodCat && foodCat.length > 0
          ? foodCat.map((data) => (
            <div
              key={data._id}
              className="m-2 fs-6"
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
