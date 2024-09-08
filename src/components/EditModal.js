import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../EditModal.css"; // Import CSS file for modal styling

const EditModal = ({ isOpen, onRequestClose, foodItem, onSave }) => {
    const [name, setName] = useState("");
    const [img, setImg] = useState("");
    const [description, setDescription] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [options, setOptions] = useState([]);
    const [foodCat, setFoodCat] = useState([]);
    const [newPortions, setNewPortions] = useState([]);

    // Update state with foodItem data when it changes
    useEffect(() => {
        if (foodItem) {
            setName(foodItem.name || "");
            setImg(foodItem.img || "");
            setDescription(foodItem.description || "");
            setCategoryName(foodItem.CategoryName || "");
            setOptions(foodItem.options || []);
            setNewPortions([]);
        }
    }, [foodItem]);

    useEffect(() => {
        // Fetch category names from backend
        const loadData = async () => {
            try {
                const response = await fetch(
                    'http://localhost:5000/api/foodCategory',
                    // 'https://vivisteria-2lrx.vercel.app/api/foodCategory', 
                    {
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
                setFoodCat(flatResponse);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        loadData();
    }, []);

    // Handle save button click to update food item
    const handleSave = async () => {
        if (!validateFields()) {
            return;
        }

        const updatedItem = {
            ...foodItem,
            name,
            img,
            options: [
                ...options,
                ...newPortions
            ],
            description,
            CategoryName: categoryName,
        };

        try {
            const response = await fetch(`https://vivisteria-2lrx.vercel.app/api/foodData/${foodItem._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedItem),
            });

            if (response.ok) {
                const updatedFoodItem = await response.json();
                onSave(updatedFoodItem); // Pass updated food item to parent component
                onRequestClose(); // Close modal after saving
            } else {
                alert("Failed to update the food item");
            }
        } catch (error) {
            console.error("Error updating food item:", error);
            alert("Error updating food item");
        }
    };

    // Validate fields before saving
    const validateFields = () => {
        if (!name || !img || !description || !categoryName) {
            alert("All fields must be filled out.");
            return false;
        }

        for (let option of options) {
            if (!option.portion || !option.price) {
                alert("All portion and price fields must be filled out.");
                return false;
            }
        }

        for (let newPortion of newPortions) {
            if (!newPortion.portion || !newPortion.price) {
                alert("All new portion and price fields must be filled out.");
                return false;
            }
        }

        return true;
    };

    // Handle changes in existing portions and prices
    const handlePortionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index].portion = value;
        setOptions(newOptions);
    };

    const handlePriceChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index].price = value;
        setOptions(newOptions);
    };

    // Function to add a new portion and price pair
    const handleAddPortion = () => {
        setNewPortions([...newPortions, { portion: "", price: "" }]);
    };

    // Function to remove a new portion and price pair
    const handleRemovePortion = (index) => {
        const newPortionsCopy = [...newPortions];
        newPortionsCopy.splice(index, 1);
        setNewPortions(newPortionsCopy);
    };

    // Function to remove an existing portion and price pair
    const handleRemoveExistingPortion = (index) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    // Handle changes in new portions and prices
    const handleNewPortionChange = (index, value) => {
        const newPortionsCopy = [...newPortions];
        newPortionsCopy[index].portion = value;
        setNewPortions(newPortionsCopy);
    };

    const handleNewPriceChange = (index, value) => {
        const newPortionsCopy = [...newPortions];
        newPortionsCopy[index].price = value;
        setNewPortions(newPortionsCopy);
    };

    // Handle closing the modal and resetting the state
    const handleCloseModal = () => {
        // Reset state to initial food item state
        if (foodItem) {
            setName(foodItem.name || "");
            setImg(foodItem.img || "");
            setDescription(foodItem.description || "");
            setCategoryName(foodItem.CategoryName || "");
            setOptions(foodItem.options || []);
            setNewPortions([]);
        }
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleCloseModal}
            className="edit-modal"
            ariaHideApp={false}
            shouldCloseOnOverlayClick={true}

        >
            <div className="modal-content bg-white">
                <h2>Edit Food Item</h2>
                <form>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            className="form-control bg-white text-black"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Category Name:</label>
                        <select
                            className="form-control bg-white text-black"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        >
                            <option key="current" value={categoryName}>
                                {categoryName}
                            </option>
                            {foodCat.filter(category => category.CategoryName !== categoryName).map((category) => (
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
                            className="form-control bg-white text-black"
                            value={img}
                            onChange={(e) => setImg(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea className="form-control bg-white text-black" id="description" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>

                    {options.map((option, index) => (
                        <div key={index} className="form-group row">
                            <div className="col">
                                <label>{`Portion ${index + 1}:`}</label>
                                <input
                                    type="text"
                                    className="form-control bg-white text-black"
                                    value={option.portion}
                                    onChange={(e) => handlePortionChange(index, e.target.value)}
                                />
                            </div>
                            <div className="col">
                                <label>{`Price for Portion ${index + 1}:`}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={option.price}
                                    onChange={(e) => handlePriceChange(index, e.target.value)}
                                />
                            </div>
                            <div className="col-auto d-flex align-items-end">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleRemoveExistingPortion(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    {newPortions.map((portion, index) => (
                        <div key={index} className="form-group row">
                            <div className="col">
                                <label>{`New Portion ${index + 1}:`}</label>
                                <input
                                    type="text"
                                    className="form-control bg-white text-black"
                                    value={portion.portion}
                                    onChange={(e) => handleNewPortionChange(index, e.target.value)}
                                />
                            </div>
                            <div className="col">
                                <label>{`Price for New Portion ${index + 1}:`}</label>
                                <input
                                    type="text"
                                    className="form-control bg-white text-black"
                                    value={portion.price}
                                    onChange={(e) => handleNewPriceChange(index, e.target.value)}
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
