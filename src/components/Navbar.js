import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge } from "react-bootstrap";
import Modal from "../Modal";
import Cart from "../screens/Cart";
import { useCart, useDispatchCart } from "./ContextReducer";

function Navbar() {
  const data = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatchCart();
  const isAdmin = localStorage.getItem("adminStatus") === 'true';
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [cartView, setCartView] = useState(false);
  

  const handleToggle = () => {
    setNavbarOpen(!navbarOpen);
  };
 
  const Logout = () => {
   
    localStorage.clear(); // Clears all keys in local storage
    dispatch({ type: "DROP" });
    
    navigate("/login");
  };

  return (
    <div className="topbar">
      <nav className={`navbar1 navbar navbar-expand-lg ${isAdmin ? 'nav2' : 'nav1'}`}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src="/logo-3.png" className="navbar-logo" alt="" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={handleToggle}
            aria-controls="navbarNav"
            aria-expanded={navbarOpen ? "true" : "false"}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${navbarOpen ? 'show' : ''} ${isAdmin ? 'admin' : 'user'}`} id="navbarNav">
            <ul className="navbar-nav me-auto mb-2">
              {localStorage.getItem("authToken") &&
                <li className="nav-item">
                  <Link className="nav-link text-white active" aria-current="page" to="/profile">
                    Profile
                  </Link>
                </li>
              }

              {!isAdmin && localStorage.getItem("authToken") && (
                <li className="nav-item">
                  <Link className="nav-link text-white active" aria-current="page" to="/myOrder">
                    My Orders
                  </Link>
                </li>
              )}
              {isAdmin && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-white active" aria-current="page" to="/adminPanel">
                      Admin Panel
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white active" aria-current="page" to="/dashboard">
                      Dashboard
                    </Link>
                  </li>
                </>
              )}
            </ul>
            {!localStorage.getItem("authToken") ? (
              <div className="d-flex">
                <Link className="btn bg-white mx-2" to="/login">
                  Login
                </Link>
                <Link className="btn bg-white mx-2" to="/signup">
                  Sign up
                </Link>
              </div>
            ) : (
              <div>
                {!isAdmin && location.pathname === "/" && (
                  <div
                    className="btn bg-white mx-2 text-black"
                    onClick={() => setCartView(true)}
                  >
                    <i className="fa-solid fa-cart-shopping"></i>
                    {"     "}
                    <Badge pill bg="danger">
                       {data.length}
                    </Badge>
                  </div>
                )}
                {cartView && (
                  <Modal onClose={() => setCartView(false)}>
                    <Cart showPayment={true} />
                  </Modal>
                )}
                {location.pathname === "/" && (
                  <Link className="btn bg-white mx-2 text-black" to="/reviews">
                    Reviews
                  </Link>
                )}
                <div className="btn mx-2 bg-white text-danger" onClick={Logout}>
                  Log out
                </div>
              </div>
            )}
          </div>
        </div>
      </nav >
    </div >
  );
}

export default Navbar;
