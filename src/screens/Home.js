import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Search from "../components/Search";

function Home() {
  return (
    <div className="bg-dark">
      <div>
        <Navbar />
      </div>
      <div>
        <Search />
      </div>
      <div>
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
