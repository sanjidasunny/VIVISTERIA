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
    <div className="topbar">
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

        {!isAdmin && location.pathname === "/" && (
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

        <div className="profile-dropdown">
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
        </div>
      </div>
    </div >

























    // <div className="topbar">
    //   <nav className={`navbar1 navbar navbar-expand-lg ${isAdmin ? 'nav2' : 'nav1'}`}>
    //     <div className="container-fluid">
    //       <Link className="navbar-brand" to="/">
    //         <img src="/logo-3.png" className="navbar-logo" alt="" />
    //       </Link>
    //       <button
    //         className="navbar-toggler"
    //         type="button"
    //         onClick={handleToggle}
    //         aria-controls="navbarNav"
    //         aria-expanded={navbarOpen ? "true" : "false"}
    //         aria-label="Toggle navigation"
    //       >
    //         <span className="navbar-toggler-icon"></span>
    //       </button>
    //       <div className={`collapse navbar-collapse ${navbarOpen ? 'show' : ''} ${isAdmin ? 'admin' : 'user'}`} id="navbarNav">
    //         <ul className="navbar-nav me-auto mb-2">
    //           {localStorage.getItem("authToken") &&
    //             <li className="nav-item">
    //               <Link className="nav-link text-white active" aria-current="page" to="/profile">
    //                 Profile
    //               </Link>
    //             </li>
    //           }

    //           {!isAdmin && localStorage.getItem("authToken") && (
    //             <li className="nav-item">
    //               <Link className="nav-link text-white active" aria-current="page" to="/myOrder">
    //                 My Orders
    //               </Link>
    //             </li>
    //           )}
    //           {isAdmin && (
    //             <>
    //               <li className="nav-item">
    //                 <Link className="nav-link text-white active" aria-current="page" to="/adminPanel">
    //                   Admin Panel
    //                 </Link>
    //               </li>
    //               <li className="nav-item">
    //                 <Link className="nav-link text-white active" aria-current="page" to="/dashboard">
    //                   Dashboard
    //                 </Link>
    //               </li>
    //             </>
    //           )}
    //         </ul>
    //         {!localStorage.getItem("authToken") ? (
    //           <div className="d-flex">
    //             <Link className="btn bg-white mx-2" to="/login">
    //               Login
    //             </Link>
    //             <Link className="btn bg-white mx-2" to="/signup">
    //               Sign up
    //             </Link>
    //           </div>
    //         ) : (
    //           <div>
    //             {!isAdmin && location.pathname === "/" && (
    //               <div
    //                 className="btn bg-white mx-2 text-black"
    //                 onClick={() => setCartView(true)}
    //               >
    //                 <i className="fa-solid fa-cart-shopping"></i>
    //                 {"     "}
    //                 <Badge pill bg="danger">
    //                   {data.length}
    //                 </Badge>
    //               </div>
    //             )}
    //             {cartView && (
    //               <Modal onClose={() => setCartView(false)}>
    //                 <Cart showPayment={true} />
    //               </Modal>
    //             )}
    //             {location.pathname === "/" && (
    //               <Link className="btn bg-white mx-2 text-black" to="/reviews">
    //                 Reviews
    //               </Link>
    //             )}
    //             <div className="btn mx-2 bg-white text-danger" onClick={Logout}>
    //               Log out
    //             </div>
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   </nav >
    // </div >
  );
}

export default Navbar;
