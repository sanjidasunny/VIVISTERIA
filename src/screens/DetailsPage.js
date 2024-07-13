import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DetailsPage() {
    const location = useLocation();
    const { state } = location;
    const { foodItem } = state || {}; // Get the foodItem from state

    if (!foodItem) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app-container">
            <Navbar />
            <div className="details-container container">
                <div className="image-wrapper">
                    <img
                        src={foodItem.img}
                        alt={foodItem.name}
                        style={{ width: "auto", maxHeight: "600px", marginTop: "15px", borderRadius: "10px" }}
                    />
                </div>
                <h1 style={{ marginTop: "10px" }}>{foodItem.name}</h1>
                <p>{foodItem.description}</p>
            </div>
            <Footer />
        </div>
    );
}
