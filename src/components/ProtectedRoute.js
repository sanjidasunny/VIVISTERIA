import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import isAuthenticated from './IsAuthenticated';

const ProtectedRoute = ({ children }) => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const authStatus = await isAuthenticated();
            if (authStatus) {
                console.log("User is found authenticated");
            } else {
                console.log("Not authenticated");
                localStorage.clear();
            }
            setAuth(authStatus);
        };
        checkAuth();
    }, []);

    if (auth === null) {
        return <div>Loading...</div>;
    }

    return auth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
