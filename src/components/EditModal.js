import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../EditModal.css"; // Import CSS file for modal styling

const EditModal = ({ isOpen, onRequestClose, foodItem, onSave }) => {
    const [name, setName] = useState("");
    const [img, setImg] = useState("");
    const [options, setOptions] = useState([]);
    const [description, setDescription] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [portions, setPortions] = useState([]);
    const [prices, setPrices] = useState([]);

    // Update state with foodItem data when it changes
    useEffect(() => {
        if (foodItem) {
            setName(foodItem.name || "");
            setImg(foodItem.img || "");
            setOptions(foodItem.options || []);
            setDescription(foodItem.description || "");
            setCategoryName(foodItem.CategoryName || "");
            setPortions(foodItem.portions || []);
            setPrices(foodItem.prices || []);
        }
    }, [foodItem]);

    // Handle save button click to update food item
    const handleSave = async () => {
        const updatedItem = {
            ...foodItem,
            name,
            img,
            options,
            description,
            CategoryName: categoryName,
            portions,
            prices,
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
                        <input
                            type="text"
                            className="form-control"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
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
                        <label htmlFor="description" className="form-label">Description:</label>
                        <textarea
                            id="description"
                            className="form-control"
                            style={{ minHeight: "100px", resize: "vertical" }}
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                   

                    {/* Save Button */}
                    <button type="button" className="btn btn-primary" onClick={handleSave}>
                        Save
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default EditModal;
