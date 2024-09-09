import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Badge } from "react-bootstrap";
import Modal from "../Modal";
import Cart from "../screens/Cart";
// import icon from './logo-white.png'
import { useCart, useDispatchCart } from "./ContextReducer";
import './navbar.css'
function Navbar() {
  const data = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatchCart();
  const isAdmin = localStorage.getItem("adminStatus") === 'true';
  const profilePic = localStorage.getItem('profilePic')
  const [cartView, setCartView] = useState(false);



  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    console.log("dropdown")
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "DROP" });
    navigate("/login");
  };

  return (
    <div className={`topbar ${isAdmin ? 'admin-navbar' : 'user-navbar'}`}>
      <Link to="/">
        <img className="icon" src='/logo-3.png' alt="Bhoj" />
      </Link>

      {!isAdmin && localStorage.getItem("authToken") && (

        <Link className="links" to="/myOrder">
          My Orders
        </Link>


      )}

      {isAdmin && (
        <>
          <Link className="links" aria-current="page" to="/adminPanel">
            Admin Panel
          </Link>
          <Link className="links" aria-current="page" to="/dashboard">
            Dashboard
          </Link>
        </>
      )}
      <Link className="links" to="/reviews">
        Reviews
      </Link>

      <div className="navbar-right">
        {!localStorage.getItem("authToken") &&
          <> <Link className="logins" aria-current="page" to="/login">
            Login
          </Link>
            <Link className="logins" aria-current="page" to="/signup">
              Signup
            </Link>
          </>}
        {!isAdmin && location.pathname === "/" && localStorage.getItem("authToken") && (
          <div
            className="btn bg-white mx-3"
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

        {localStorage.getItem("authToken") && <div className="profile-dropdown">
          {profilePic ? <img
            className="profile-icon"
            src={profilePic}
            alt="profile"
            onClick={handleDropdownToggle}
          /> : <img
            className="profile-icon"
            src="/profile.jpg"
            alt="profile"
            onClick={handleDropdownToggle}
          />}


          <div className={`dropdown-menu-bar ${dropdownOpen ? 'open' : ''}`}>
            <Link className="dropdown-item1" to="/profile">
              Profile
            </Link>
            {!isAdmin && localStorage.getItem("authToken") && (

              <Link Link className="dropdown-item1 dropdown-inside" to="/myOrder">
                My Orders
              </Link>

            )}

            {isAdmin && (
              <>
                <Link className="dropdown-item1 dropdown-inside" aria-current="page" to="/adminPanel">
                  Admin Panel
                </Link>
                <Link className="dropdown-item1 dropdown-inside" aria-current="page" to="/dashboard">
                  Dashboard
                </Link>
              </>
            )}
            <Link className="dropdown-item1 dropdown-inside" to="/reviews">
              Reviews
            </Link>
            <div className="dropdown-item1" onClick={handleLogout}>
              Logout
            </div>
          </div>
        </div>}
      </div>
    </div >


  );
}

export default Navbar;
