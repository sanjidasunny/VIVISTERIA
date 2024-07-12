import React, { useEffect, useState } from "react";
export default function Sidebar() {


    const [foodCat, setFoodCat] = useState([]);

    const loadData = async () => {
        try {
            let response = await fetch("http://localhost:5000/api/foodData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            response = await response.json();

            setFoodCat(response[1]);
        } catch (error) {
            console.error("Error fetching data:", error);
            // Handle error state here, e.g., show a message to the user
        }
    };

    useEffect(() => {
        loadData();
    }, []);
    return (
        <div className='sidebar'>
            <div className="sidebar-content">
                <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                    <svg className="bi me-2" width="40" height="32"><use xlinkHref="#bootstrap"></use></svg>
                    <span className="fs-4">Sidebar</span>
                </a>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <a href="/" className="nav-link" aria-current="page">
                            <svg className="bi me-2" width="16" height="16"><use xlinkHref="#home"></use></svg>
                            Biryani/Rice
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/" className="nav-link link-dark">
                            <svg className="bi me-2" width="16" height="16"><use xlinkHref="#speedometer2"></use></svg>
                            Pizza
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/" className="nav-link link-dark">
                            <svg className="bi me-2" width="16" height="16"><use xlinkHref="#table"></use></svg>
                            Starter
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}