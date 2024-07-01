import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Search from "../components/Search";

function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      let response = await fetch("http://localhost:5000/api/foodData", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      response = await response.json();
      setFoodItem(response[0]);
      setFoodCat(response[1]);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error state here, e.g., show a message to the user
    }
  }
  

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="mainBody" >
      <div>
        <Navbar />
      </div>
      <div>
        <Search setSearch={setSearch} />
      </div>
      <div className="container">
        {foodCat != [] ? (
          foodCat.map((data) => {
            return (
              <div className="row mb-3">
                <div key={data._id} className="fs-3 m-3 text-success">

                  {data.CategoryName}
                </div>
                <hr className="text-success" />
                {foodItem != [] ?
                  foodItem.filter((item) => (
                    (item.CategoryName === data.CategoryName) && typeof search === 'string' &&
                    item.name.toLowerCase().includes(search.toLowerCase())
                  ))
                    .map(filterItems => {
                      return (
                        <div key={filterItems._id} className="col-12 col-md-6 col-lg-3">
                          <Card foodItem={filterItems}
                            options={filterItems.options[0]}
                          ></Card>
                        </div>
                      )
                    }



                    ) : <div>"No Such Data Found"</div>
                }
              </div>
            )
          }

          )
        ) : (
          ""
        )}

      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default Home;