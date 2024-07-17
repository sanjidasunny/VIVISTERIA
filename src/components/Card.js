import React, { useEffect, useRef, useState } from "react";
import { useDispatchCart, useCart } from "./ContextReducer";
import { Link, useNavigate } from "react-router-dom";
import EditModal from "./EditModal";

function Card(props) {
  const priceRef = useRef();
  const dispatch = useDispatchCart();
  const data = useCart();
  const [quantity, setQuantity] = useState(1);
  const [portion, setPortion] = useState('');
  const [price, setPrice] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.foodItem.options.length > 0) {
      setPortion(props.foodItem.options[0].portion);
      setPrice(props.foodItem.options[0].price);
    }
  }, [props.foodItem.options]);

  const handlePortionChange = (e) => {
    const selectedPortion = e.target.value;
    setPortion(selectedPortion);
    const selectedOption = props.foodItem.options.find(option => option.portion === selectedPortion);
    if (selectedOption) {
      setPrice(selectedOption.price);
    }
  };

  const addToCart = async () => {
    let food = [];
    for (const item of data) {
      if (item.id === props.foodItem._id) {
        food = item;
        break;
      }
    }
    if (food.length !== 0) {
      if (food.size === portion) {
        await dispatch({
          type: "UPDATE",
          id: props.foodItem._id,
          price: finalPrice,
          quantity: quantity,
        });
        return;
      } else if (food.size !== portion) {
        await dispatch({
          type: "ADD",
          id: props.foodItem._id,
          name: props.foodItem.name,
          price: finalPrice,
          quantity: quantity,
          size: portion,
          CategoryName: props.foodItem.CategoryName,
        });
        return;
      }
      return;
    }
    await dispatch({
      type: "ADD",
      id: props.foodItem._id,
      name: props.foodItem.name,
      price: finalPrice,
      quantity: quantity,
      size: portion,
      CategoryName: props.foodItem.CategoryName,
    });
    console.log(data);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/foodData/${props.foodItem._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert("Food item deleted successfully");
        props.onDelete(props.foodItem._id); // Call the onDelete prop
      } else {
        alert("Failed to delete the food item");
        console.log(props.foodItem._id);
      }
    } catch (error) {
      console.error("Error deleting food item:", error);
      alert("Error deleting food item");
    }
  };

  const handleSave = (updatedItem) => {
    props.onSave(updatedItem);
    setIsEditModalOpen(false);
  };

  let finalPrice = quantity * parseInt(price);
  const isAdmin = localStorage.getItem("adminStatus") === 'true';
  const isLoggedIn = localStorage.getItem("authToken");
  return (
    <div className="card-container">
      <div className="card">
        <Link to={`/details/${props.foodItem._id}`} state={{ foodItem: props.foodItem }}>
          <img
            src={props.foodItem.img}
            className="card-img-top"
            alt="..."
          />
        </Link>
        <div className="card-body">
          <h5 className="card-title">{props.foodItem.name}</h5>

          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <select
                className="m-2 p-1 h-100 rounded"
                onChange={(e) => setQuantity(e.target.value)}
              >
                {Array.from(Array(6), (e, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex align-items-center">
              <select
                className="form-select"
                ref={priceRef}
                onChange={handlePortionChange}
                value={portion}
              >
                {props.foodItem.options.map((option) => (
                  <option key={option.portion} value={option.portion}>
                    {option.portion}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-uppercase">{finalPrice}/-</div>
          </div>
          <hr />
          {isAdmin ? (
            <div>
              <button className="btn ms-2 btn-warning" onClick={handleEdit}>
                Edit
              </button>
              <button className="btn ms-2 btn-danger" onClick={handleDelete}>
                Delete
              </button>
              <EditModal
                isOpen={isEditModalOpen}
                onRequestClose={() => setIsEditModalOpen(false)}
                foodItem={props.foodItem}
                onSave={handleSave}
              />
            </div>
          ) : (
            isLoggedIn ? (
              <button className="btn ms-2 btn-success" onClick={addToCart}>
                Add to Cart
              </button>
            ) : <button className="btn ms-2 btn-success" onClick={() => navigate('/login')}>
              Add to Cart
            </button>
          )
          }
        </div>
      </div>
    </div>
  );
}

export default Card;
