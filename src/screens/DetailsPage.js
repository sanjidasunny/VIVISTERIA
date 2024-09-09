import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/loader";

export default function DetailsPage() {
    const location = useLocation();
    const { state } = location;
    const { foodItem } = state || {}; // Get the foodItem from state
    const [loading, setLoading] = useState(true); // State to track loading

    useEffect(() => {
        if (foodItem) {
            setLoading(false); // Set loading to false once foodItem is available
        }
    }, [foodItem]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="app-container">
            <Navbar />
            <div className="details-container container">
                <div className="image-wrapper">
                    <img
                        src={foodItem.img}
                        alt={foodItem.name}
                        style={{ width: "auto", maxHeight: "600px", marginTop: "15px", borderRadius: "10px", maxWidth: "100%" }}
                    />
                </div>
                <h1 style={{ marginTop: "10px" }}>{foodItem.name}</h1>
                <p>{foodItem.description}</p>
                <div>
                    <h2>Price:</h2>
                    <div className="container">
                        {foodItem.options && foodItem.options.map((data, index) => (
                            <div key={index} className="row align-items-center my-3 p-2 border rounded shadow-sm">
                                <div className="col-6">
                                    <h5 className="mb-0">Portion: {data.portion}</h5>
                                </div>
                                <div className="col-6 text-end">
                                    <span className="fw-bold text-primary">Price: {data.price}/-</span>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            </div>
            <Footer />
        </div>
    );
}
