import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loader from '../components/loader';

export default function AddItem() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Add loading state
    const [name, setName] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [priceOptions, setPriceOptions] = useState([]);
    const [portions, setPortions] = useState([]);
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [foodCat, setFoodCat] = useState([]);

    useEffect(() => {
        // Fetch category names from backend
        const loadData = async () => {
            try {
                const response = await fetch(
                    // 'http://localhost:5000/api/foodCategory',
                    'https://vivisteria-2lrx.vercel.app/api/foodCategory',
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
                const sortedCategories = flatResponse.sort((a, b) =>
                    a.CategoryName.localeCompare(b.CategoryName)
                );
                setFoodCat(sortedCategories);
                setLoading(false); // Set loading to false once data is fetched
            } catch (error) {
                console.error('Error fetching categories:', error);
                setLoading(false); // Set loading to false in case of error
            }
        };

        loadData();
    }, []);

    const getPriceOptions = (category) => {
        switch (category) {
            case 'Meat':
                return ['Half', 'Full'];
            case 'Fish':
                return ['Small', 'Large'];
            case 'Snacks':
                return ['Half', 'Full'];
            case 'Dal/Lentil':
                return ['Half', 'Full'];
            case 'Drinks':
                return ['Half', 'Full'];
            case 'Rice':
                return ['Half', 'Full'];
            case 'Roti/Paratha':
                return ['Small', 'large'];
            case 'Special Side Items':
                return ['Half', 'Full'];
            case 'Sweets':
                return ['Half', 'Full'];
            case 'Vegetable Curry':
                return ['Half', 'Full'];
            default:
                return [];
        }
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setCategoryName(selectedCategory);
        setPriceOptions(getPriceOptions(selectedCategory));
    };

    const handlePortionChange = (index, e) => {
        const updatedPortions = portions.map((portion, i) =>
            index === i ? { ...portion, [e.target.name]: e.target.value } : portion
        );
        setPortions(updatedPortions);
    };

    const addPortion = () => {
        setPortions([...portions, { portion: '', price: '' }]);
    };

    const removePortion = (index) => {
        setPortions(portions.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newItem = {
            name,
            CategoryName: categoryName,
            options: portions,
            img: image,
            description,
        };

        try {
            const response = await fetch(
                // 'http://localhost:5000/api/addFoodItem',
                'https://vivisteria-2lrx.vercel.app/api/addFoodItem',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newItem),
                });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(`Failed to add new item: ${json.error || response.statusText}`);
            }

            console.log('New item added successfully:', json);
            navigate('/');
        } catch (error) {
            console.error('Error adding new item:', error);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div style={{ height: "100vh" }}>
            <Navbar />
            <div className="container mt-5 bg-white">
                <h2>Add New Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="itemName" className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control bg-white text-black"
                            id="itemName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="categoryName" className="form-label">Category</label>
                        <select
                            className="form-control bg-white text-black"
                            id="categoryName"
                            value={categoryName}
                            onChange={handleCategoryChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {foodCat.map((data) => (
                                <option key={data._id} value={data.CategoryName}>
                                    {data.CategoryName}
                                </option>
                            ))}
                        </select>
                    </div>
                    {portions.map((portion, index) => (
                        <div key={index} className="mb-3 d-flex">
                            <select
                                name="portion"
                                className="form-control me-2 bg-white text-black"
                                value={portion.portion}
                                onChange={(e) => handlePortionChange(index, e)}
                                required
                            >
                                <option value="">Select Portion</option>
                                {priceOptions.map((option, i) => (
                                    <option key={i} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                name="price"
                                className="form-control me-2 bg-white text-black"
                                placeholder="Price"
                                value={portion.price}
                                onChange={(e) => handlePortionChange(index, e)}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => removePortion(index)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="btn btn-secondary mb-3"
                        onClick={addPortion}
                    >
                        Add Portion
                    </button>
                    <div className="mb-3">
                        <label htmlFor="imageUrl" className="form-label">Image URL</label>
                        <input
                            type="text"
                            className="form-control bg-white text-black"
                            id="imageUrl"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            className="form-control bg-white text-black"
                            id="description"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
