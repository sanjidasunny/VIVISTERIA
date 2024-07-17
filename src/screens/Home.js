import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Search from "../components/Search";
import Sidebar from "../components/Sidebar";
import axios from "axios";

function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);


  const loadData = async () => {
    try {
      //const response = await axios.post('https://vivisteria-2lrx.vercel.app/api/foodData');
      const response = await axios.post('https://vivisteria-2lrx.vercel.app/api/foodData', {
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
    return <div>Loading...</div>;
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
      <div>
        <Navbar />
      </div>
      <div>
        <Search setSearch={setSearch} />
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-2">
            <Sidebar setSelectedCategory={setSelectedCategory} />
          </div>
          <div className="col-12 col-md-10">
            {selectedCategory === "All" ? (
              foodCat.map((category) => (
                <div className="row mb-3" key={category._id}>
                  <div className="fs-3 m-3 text-success">
                    {category.CategoryName}
                  </div>
                  <hr className="text-success" />
                  {filteredItems
                    .filter((item) => item.CategoryName === category.CategoryName)
                    .map((item) => (
                      <div
                        key={item._id}
                        className="col-12 col-sm-6 col-lg-3 mb-3"
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
                  <div className="row mb-3" key={data._id}>
                    <div className="fs-3 m-3 text-success">
                      {data.CategoryName}
                    </div>
                    <hr className="text-success" />
                    {filteredItems
                      .filter((item) => item.CategoryName === data.CategoryName)
                      .map((filterItems) => (
                        <div
                          key={filterItems._id}
                          className="col-12 col-sm-6 col-lg-3 mb-3"
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
