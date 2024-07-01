import React, { useState } from "react";
import Cart from "../screens/Cart";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "react-bootstrap";
import Modal from "../Modal";
import { useCart } from "./ContextReducer";

function Navbar() {
  let data = useCart();
  const navigate = useNavigate();
  const Logout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };
  const [cartView, setCartView] = useState(false);
  return (
    <div>
      <nav className="nav navbar navbar-expand-lg shadow">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src="/logo-3.png" className="navbar-logo" alt="" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span
              className="navbar-toggler-icon"
              style={{ color: "white" }}
            ></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2">
              <li className="nav-item">
                <Link
                  className="nav-link text-white active"
                  aria-current="page"
                  to="/profile"
                >
                  Profile
                </Link>
              </li>
              {localStorage.getItem("authToken") ? (
                <li className="nav-item">
                  <Link
                    className="nav-link text-white active"
                    aria-current="page"
                    to="/myOrder"
                  >
                    My Orders
                  </Link>
                </li>
              ) : (
                ""
              )}
            </ul>
            {!localStorage.getItem("authToken") ? (
              <div className="d-flex">
                <Link className="btn bg-white mx-2 text-danger" to="/login">
                  Login
                </Link>
                <Link className="btn bg-white mx-2 text-danger" to="/signup">
                  Sign up
                </Link>
              </div>
            ) : (
              <div>
                <div
                  className="btn bg-white mx-2 text-danger"
                  onClick={() => setCartView(true)}
                >
                  cart{" "}
                  <Badge pill bg="danger">
                    {data.length}
                  </Badge>
                </div>
                {cartView ? (
                  <Modal onClose={() => setCartView(false)}>
                    <Cart />
                  </Modal>
                ) : (
                  ""
                )}
                <div className="btn bg-white mx-2 text-danger" onClick={Logout}>
                  Log out
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
