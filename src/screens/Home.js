import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Search from "../components/Search";
import Sidebar from "../components/Sidebar";
import Loader from "../components/loader";
import axios from "axios";
import { Link } from "react-router-dom";
function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const isAdmin = localStorage.getItem("adminStatus") === 'true';

  const loadData = async () => {
    try {

      const response = await axios.post(
        // 'http://localhost:5000/api/foodData',
        'https://vivisteria-2lrx.vercel.app/api/foodData',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      const responseData = response.data;
      if (Array.isArray(responseData) && responseData.length >= 2) {
        setFoodItem(responseData[0] || []);
        const sortedCategories = (responseData[1] || []).sort((a, b) =>
          a.CategoryName.localeCompare(b.CategoryName)
        );
        setFoodCat(sortedCategories);
      } else {
        console.error('Unexpected response data structure:', responseData);
        setFoodItem([]);
        setFoodCat([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      setLoading(false);
    }
  };




  useEffect(() => {
    loadData();
  }, []);
  if (loading) {
    return <Loader />;
  }

  const handleDelete = (id) => {
    setFoodItem(foodItem.filter((item) => item._id !== id));
  };

  const handleSave = (updatedItem) => {
    setFoodItem(
      foodItem.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      )
    );
  };

  const filteredItems = foodItem.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.CategoryName === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mainBody">

      <Navbar />

      <div>
        <Search setSearch={setSearch} />
      </div>
      {isAdmin ? <Link className="AddNew" to="/addItem">
        <i class="fa-solid fa-plus text-white"></i>
      </Link> : ""

      }

      <div className="container-fluid">
        <div className="home">
          <div className="sidebar">
            <Sidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
          </div>
          <div className="main">
            {selectedCategory === "All" ? (
              foodCat.map((category) => (
                <div className="category-container" key={category._id}>

                  <div className="category-title ">
                    {category.CategoryName}
                  </div>
                  <hr className="text-success" />
                  {filteredItems
                    .filter((item) => item.CategoryName === category.CategoryName)
                    .map((item) => (
                      <div
                        key={item._id}
                        className="box"
                      >
                        <Card
                          foodItem={item}
                          options={item.options[0]}
                          onDelete={handleDelete}
                          onSave={handleSave}
                        />
                      </div>
                    ))}

                </div>
              ))
            ) : (
              foodCat
                .filter((category) => category.CategoryName === selectedCategory)
                .map((data) => (
                  <div className="category-container" key={data._id} style={{ minHeight: "70vh" }}>
                    <div className="category-title">
                      {data.CategoryName}
                    </div>
                    <hr className="text-success" />
                    {filteredItems
                      .filter((item) => item.CategoryName === data.CategoryName)
                      .map((filterItems) => (
                        <div
                          key={filterItems._id}
                          className="box"
                        >
                          <Card
                            foodItem={filterItems}
                            options={filterItems.options[0]}
                            onDelete={handleDelete}
                            onSave={handleSave}
                          />
                        </div>
                      ))}
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
