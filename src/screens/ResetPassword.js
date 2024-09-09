import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap styles
import axios from 'axios';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    const navigate = useNavigate()
    // State for password inputs
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.put(
                // `http://localhost:5000/api/password/reset`,
                `https://vivisteria-2lrx.vercel.app/api/password/reset`,
                {
                    id, password
                })
            if (response.data.errorMessage) {
                setError(response.data.errorMessage[0].msg)
            } else if (response.data.error) {
                setError(response.data.error)
            } else if (response.data.success) {
                navigate('/login')
            } else {
                setError("An unexpected error occured")
            }


        } catch (error) {
            setError("An unexpected error occured")
        }



        console.log('Password reset form submitted:', { id, password });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h1 className="text-center">Reset Password</h1>
                    <p className="text-center">Email: {email}</p>  {/* Display user email */}


                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="password">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <div className="bg-danger rounded p-2 my-3 text-white">{error}</div>}

                        <button type="submit" className="btn btn-primary w-100">
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
