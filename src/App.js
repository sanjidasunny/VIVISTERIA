import "./App.css";
import React, { useState, useEffect } from 'react';
import Home from "./screens/Home";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import AdminSignUp from "./screens/AdminSignUp.js";
import MyOrder from "./screens/myOrder.js";
import "../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Profile from "./screens/Profile.js";
import { CartProvider } from "./components/ContextReducer.js";
import AdminPanel from "./screens/AdminPanel.js";
import DashBoard from "./screens/DashBoard.js";
import DetailsPage from "./screens/DetailsPage.js";
import AddItem from "./screens/AddItem.js";
import Reviews from './screens/Reviews';
import ProtectedRoute from './components/ProtectedRoute.js'
import Loader from "./components/loader.js";
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      
      setTimeout(() => {
          setLoading(false);
      }, 3000);
  }, []);
  return (
    <CartProvider>
       {loading ? (
                <Loader />
            ) : (
      <Router>
        <div>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/adminSignup" element={<AdminSignUp />} />
            <Route exact path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route exact path="/myOrder" element={<ProtectedRoute><MyOrder /></ProtectedRoute>} />
            <Route exact path="/adminPanel" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
            <Route exact path="/dashboard" element={<ProtectedRoute><DashBoard /></ProtectedRoute>} />
            <Route exact path="/details/:id" element={<ProtectedRoute><DetailsPage /></ProtectedRoute>} />
            <Route exact path="/addItem" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
            <Route exact path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
       )}
    </CartProvider>
  );
}

export default App;
