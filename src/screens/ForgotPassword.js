import axios from "axios";
import React, { useState } from "react";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("")
    const [err, setErr] = useState("")
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle the forgot password logic here (e.g., API call to request a password reset)
        try {
            const response = await axios.post(
                // 'http://localhost:5000/api/forgot-password',
                'https://vivisteria-2lrx.vercel.app/api/forgot-password',
                {
                    email
                }
            )

            if (response.data.success) {
                setMsg("Check your email to renew password")
                setErr("")
                setEmail("")
            } else {
                setErr(response.data.error)
                setMsg("")
            }
        } catch (error) {
            setErr(error.data.error)
            setMsg("")
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Forgot Password</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="email">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                {msg &&
                                    <div className="bg-success rounded p-2 my-3 text-white">{msg}</div>
                                }
                                {err &&
                                    <div className="bg-danger rounded p-2 my-3 text-white">{err}</div>
                                }
                                <button type="submit" className="btn btn-primary w-100">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
