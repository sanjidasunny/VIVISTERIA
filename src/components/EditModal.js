import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../EditModal.css"; // Import CSS file for modal styling

const EditModal = ({ isOpen, onRequestClose, foodItem, onSave }) => {
    const [name, setName] = useState("");
    const [img, setImg] = useState("");
    const [description, setDescription] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [portions, setPortions] = useState([]);
    const [prices, setPrices] = useState([]);
    const [foodCat, setFoodCat] = useState([]); 

    // Update state with foodItem data when it changes
    useEffect(() => {
        if (foodItem) {
            setName(foodItem.name || "");
            setImg(foodItem.img || "");
            setDescription(foodItem.description || "");
            setCategoryName(foodItem.CategoryName || "");
            setPortions(foodItem.options?.map(option => option.portion) || []);
            setPrices(foodItem.options?.map(option => option.price) || []);
            
        }
    }, [foodItem]);
    useEffect(() => {
        // Fetch category names from backend
        const loadData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/foodCategory', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const categories = await response.json();
                const flatResponse = categories.flat();
                const sortedCategories = flatResponse.sort((a, b) =>
                    a.CategoryName.localeCompare(b.CategoryName)
                );
                setFoodCat(sortedCategories);
                // Initialize with the first category
                setCategoryName(sortedCategories[0].CategoryName);
                //setPriceOptions(getPriceOptions(sortedCategories[0].CategoryName));
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        loadData();
    }, []);

    // Handle save button click to update food item
    const handleSave = async () => {
        const updatedOptions = portions.map((portion, index) => ({
            portion,
            price: prices[index]
        }));

        const updatedItem = {
            ...foodItem,
            name,
            img,
            options: updatedOptions,
            description,
            CategoryName: categoryName,
        };

        try {
            const response = await fetch(`http://localhost:5000/api/foodData/${foodItem._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedItem),
            });

            if (response.ok) {
                const updatedFoodItem = await response.json();
                onSave(updatedFoodItem); // Pass updated food item to parent component
            } else {
                alert("Failed to update the food item");
            }
        } catch (error) {
            console.error("Error updating food item:", error);
            alert("Error updating food item");
        }
    };

    // Handle changes in portions and prices
    const handlePortionChange = (index, value) => {
        const newPortions = [...portions];
        newPortions[index] = value;
        setPortions(newPortions);
    };

    const handlePriceChange = (index, value) => {
        const newPrices = [...prices];
        newPrices[index] = value;
        setPrices(newPrices);
    };

    // Function to add a new portion and price pair
    const handleAddPortion = () => {
        setPortions([...portions, ""]);
        setPrices([...prices, ""]);
    };

    // Function to remove a portion and price pair
    const handleRemovePortion = (index) => {
        const newPortions = [...portions];
        newPortions.splice(index, 1);
        setPortions(newPortions);

        const newPrices = [...prices];
        newPrices.splice(index, 1);
        setPrices(newPrices);
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="edit-modal" ariaHideApp={false}>
            <div className="modal-content">
                <h2>Edit Food Item</h2>
                <form>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Category Name:</label>
                        <select
                            className="form-control"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        >
                            {foodCat.map((category) => (
                                <option key={category._id} value={category.CategoryName}>
                                    {category.CategoryName}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Image URL:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={img}
                            onChange={(e) => setImg(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>

                    {portions.map((portion, index) => (
                        <div key={index} className="form-group row">
                            <div className="col">
                                <label>{`Portion ${index + 1}:`}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={portion}
                                    onChange={(e) => handlePortionChange(index, e.target.value)}
                                />
                            </div>
                            <div className="col">
                                <label>{`Price for Portion ${index + 1}:`}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={prices[index]}
                                    onChange={(e) => handlePriceChange(index, e.target.value)}
                                />
                            </div>
                            <div className="col-auto d-flex align-items-end">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleRemovePortion(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <button type="button" className="btn btn-secondary mb-3" onClick={handleAddPortion}>
                        Add Portion
                    </button>

                    <button type="button" className="btn btn-primary" onClick={handleSave}>
                        Save
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default EditModal;
