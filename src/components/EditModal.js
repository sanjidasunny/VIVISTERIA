import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../EditModal.css"; // Import CSS file for modal styling

const EditModal = ({ isOpen, onRequestClose, foodItem, onSave }) => {
    const [name, setName] = useState(foodItem.name);
    const [img, setImg] = useState(foodItem.img);
    const [options, setOptions] = useState(foodItem.options);
    const [description, setDescription] = useState(foodItem.description);
    const [categoryName, setCategoryName] = useState(foodItem.CategoryName);

    // Update state with foodItem data when it changes
    useEffect(() => {
        setName(foodItem.name);
        setImg(foodItem.img);
        setOptions(foodItem.options);
        setDescription(foodItem.description);
        setCategoryName(foodItem.CategoryName);
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

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="edit-modal">
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
                    <div className="form-group">
                        <label>Description:</label>
                        <input
                            type="text"
                            className="form-control description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <button type="button" className="btn btn-primary" onClick={handleSave}>
                        Save
                    </button>
                </form>

            </div>
        </Modal>
    );
};

export default EditModal;
