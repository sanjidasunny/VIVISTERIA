import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Search from "../components/Search";
import Sidebar from "../components/Sidebar";

function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      // Fetch foodData using fetch API
      const response = await fetch('https://vivisteria.vercel.app/api/foodData', {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data: " + response.status);
      }

      const data = await response.json();
      setFoodItem(data[0]);
      setFoodCat(data[1]);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error state here, e.g., show a message to the user
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mainBody">
      <Navbar />
      <Search setSearch={setSearch} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-2">
            <Sidebar />
          </div>
          <div className="col-12 col-md-10">
            {foodCat.length > 0 ? (
              foodCat.map((data) => (
                <div className="row mb-3" key={data._id}>
                  <div className="fs-3 m-3 text-success">
                    {data.CategoryName}
                  </div>
                  <hr className="text-success" />
                  {foodItem.length > 0 ? (
                    foodItem
                      .filter(
                        (item) =>
                          item.CategoryName === data.CategoryName &&
                          typeof search === "string" &&
                          item.name
                            .toLowerCase()
                            .includes(search.toLowerCase())
                      )
                      .map((filterItems) => (
                        <div
                          key={filterItems._id}
                          className="col-12 col-sm-6 col-lg-3 mb-3"
                        >
                          <Card
                            foodItem={filterItems}
                            options={filterItems.options[0]}
                          />
                        </div>
                      ))
                  ) : (
                    <div>No Such Data Found</div>
                  )}
                </div>
              ))
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
