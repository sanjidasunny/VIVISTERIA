import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import isAuthenticated from './IsAuthenticated';

const ProtectedRoute = ({ children }) => {
    const [auth, setAuth] = useState(null); // Initially set to null to handle loading state

    useEffect(() => {
        const checkAuth = async () => {
            const authStatus = await isAuthenticated();
            setAuth(authStatus); // Set authStatus to true or false
        };
        checkAuth();
    }, []);

    if (auth === null) {

        return <div>Loading...</div>;
    }

    return auth ? children : <Navigate to="/login" />;
};
export default ProtectedRoute;
