import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Search from "../components/Search";
import Sidebar from "../components/Sidebar";
import axios from 'axios';

function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      const response = await axios.get('https://vivisteria.vercel.app/api/foodData');
      if (response.status !== 200) {
        throw new Error("Failed to fetch data - Status: " + response.status);
      }
      const responseData = response.data;
      if (!Array.isArray(responseData) || responseData.length !== 2) {
        throw new Error("Unexpected API response format");
      }
      setFoodItem(responseData[0]);
      setFoodCat(responseData[1]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    }
  };
  
  

  useEffect(() => {
    loadData().catch((error) => {
      console.error("Error loading data:", error);
      setError(error.message);
    });
  }, []);

  // Filtered items based on search and selected food category
  const filteredFoodItems = foodItem && foodCat ? foodItem.filter(item =>
    item.CategoryName === foodCat.CategoryName &&
    (typeof search === "string" && item.name.toLowerCase().includes(search.toLowerCase()))
  ) : [];

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
            {error ? (
              <div>Error: {error}</div>
            ) : foodCat.length > 0 ? (
              foodCat.map(data => (
                <div className="row mb-3" key={data._id}>
                  <div className="fs-3 m-3 text-success">
                    {data.CategoryName}
                  </div>
                  <hr className="text-success" />
                  {filteredFoodItems.length > 0 ? (
                    filteredFoodItems.map(filterItems => (
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
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
