import React, { useEffect, useRef, useState } from "react";
import { useDispatchCart, useCart } from "./ContextReducer";
import { Link } from "react-router-dom";


function Card(props) {
  const priceRef = useRef();
  let options = props.options || {};
  let priceOptions = Object.keys(options);
  let dispatch = useDispatchCart();
  let data = useCart();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(priceOptions[0]);

  const addToCart = async () => {
    let food = [];
    for (const item of data) {
      if (item.id === props.foodItem._id) {
        food = item;
        break;
      }
    }
    if (food.length !== 0) {
      if (food.size === size) {
        await dispatch({
          type: "UPDATE",
          id: props.foodItem._id,
          price: finalPrice,
          quantity: quantity,
        });
        return;
      } else if (food.size !== size) {
        await dispatch({
          type: "ADD",
          id: props.foodItem._id,
          name: props.foodItem.name,
          price: finalPrice,
          quantity: quantity,
          size: size,
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
      size: size,
      CategoryName: props.foodItem.CategoryName,
    });
    console.log(data);
  };

  const handleEdit = async () => {

  }
  const handleDelete = async () => {

  }

  let finalPrice = quantity * parseInt(size);
  useEffect(() => {
    setSize(priceRef.current.value);
  }, []);
  const isAdmin = localStorage.getItem("adminStatus") === 'true';
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
                onChange={(e) => setSize(e.target.value)}
              >
                {priceOptions.map((data) => (
                  <option key={data} value={options[data]}>
                    {data}
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
            </div>
          ) : (
            <button className="btn ms-2 btn-success" onClick={addToCart}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;
