import React, { createContext, useContext, useReducer, useEffect } from "react";

const cartStateContext = createContext();
const cartDispatchContext = createContext();

const cartFromLocalStorage = JSON.parse(localStorage.getItem("cart") || '[]');

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        {
          id: action.id,
          name: action.name,
          quantity: action.quantity,
          size: action.size,
          price: action.price,
          CategoryName: action.CategoryName,
        },
      ];
    case "REMOVE":
      let newArr = [...state];
      newArr.splice(action.index, 1);
      return newArr;
    case "DROP":
      return [];
    case "UPDATE":
      let arr = [...state];
      arr.find((food, index) => {
        if (food.id === action.id) {
          arr[index] = {
            ...food,
            quantity: parseInt(action.quantity) + food.quantity,
            price: action.price + food.price,
          };
        }
        return arr;
      });
      return arr;
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, cartFromLocalStorage);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  return (
    <cartDispatchContext.Provider value={dispatch}>
      <cartStateContext.Provider value={state}>
        {children}
      </cartStateContext.Provider>
    </cartDispatchContext.Provider>
  );
};

export const useCart = () => useContext(cartStateContext);
export const useDispatchCart = () => useContext(cartDispatchContext);
