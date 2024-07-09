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
  const [loading, setLoading] = useState(true);
  const [innerLoading, setInnerLoading] = useState(true);

  const loadData = async () => {
    try {
      const response = await axios.post('https://vivisteria-2lrx.vercel.app/api/foodData');
      const responseData = response.data;
      setFoodItem(responseData[0] || []);
      setFoodCat(responseData[1] || []);
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
    if (!loading && foodCat.length > 0 && foodItem.length > 0) {
      setInnerLoading(false);
    }
  }, [loading, foodCat, foodItem]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
            <Sidebar />
          </div>
          <div className="col-12 col-md-10">
            {innerLoading ? (
              <div>Loading...</div>
            ) : (
              foodCat && foodCat.length > 0 ? (
                foodCat.map((data) => (
                  <div className="row mb-3" key={data._id}>
                    <div className="fs-3 m-3 text-success">
                      {data.CategoryName}
                    </div>
                    <hr className="text-success" />
                    {foodItem && foodItem.length > 0 ? (
                      foodItem
                        .filter(
                          (item) =>
                            item.CategoryName === data.CategoryName &&
                            typeof search === "string" &&
                            item.name.toLowerCase().includes(search.toLowerCase())
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
              )
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
