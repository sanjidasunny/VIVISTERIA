import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios"

export default function AdminSignUp() {
    const [msg, setMsg] = useState("")
    const [err, setErr] = useState("")
    const [credentials, setCredentials] = useState({
        name: "",
        password: "",
        email: "",
        location: "",
        isAdmin: true,
        isApproved: false
    });

    let navigate = useNavigate();
    const submit = async (e) => {
        e.preventDefault()
        if (credentials.password !== credentials.confirmPassword) {
            setErr("password don't match")
            setMsg("")
            return

        }
        try {
            const response = await axios.post(
                'http://localhost:5000/api/createuser',
                // 'https://vivisteria-2lrx.vercel.app/api/createuser',
                {
                    name: credentials.name,
                    email: credentials.email,
                    password: credentials.password,
                    location: credentials.location,
                    isAdmin: credentials.isAdmin,
                    isApproved: credentials.isApproved
                })



            if (response.data.errorMessage) {
                setErr(response.data.errorMessage[0].msg)
                setMsg("")
            } else if (response.data.error) {
                setErr(response.data.error)
                setMsg("")
            } else {
                setMsg(response.data.message)
                setErr("")
                setCredentials({
                    name: "",
                    password: "",
                    confirmPassword: "",
                    email: "",
                    location: "",
                })
            }
        } catch (error) {
            console.error('Error creating user:', error)
            //alert('Error creating user. Please try again.')
        }
    };
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    const googleData = async (e) => {
        try {
            const response = await axios.post(
                `http://localhost:5000/api/google/login`,
                // `https://vivisteria-2lrx.vercel.app/api/google/login`,
                {
                    name: e.name,
                    email: e.email,
                    profilePic: e.picture,
                    isAdmin: true
                }
            );
            const data = response.data;
            if (response.data.success) {
                localStorage.setItem("userEmail", e.email);
                localStorage.setItem("userID", data.userID);
                localStorage.setItem("authToken", data.authToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                localStorage.setItem("adminStatus", data.adminStatus.toString());
                localStorage.setItem("profilePic", data.profilePic);
                navigate("/");
            } else if (response.data.error) {
                setErr(response.data.error);
                setMsg("");
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="adminsignup">
            <div className="inside container p-10">
                <h1 className="text-black">Sign up</h1>
                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label htmlFor="userName" className="form-label text-black">
                            Name
                        </label>
                        <input
                            type="text"
                            className="form-control w-100 bg-white text-black"
                            onChange={onChange}
                            value={credentials.name}
                            name="name"
                            id="userName"
                        />
                    </div>
                    <div className="mb-3">
                        <label
                            htmlFor="exampleInputEmail1"
                            className="form-label text-black"
                        >
                            Email address
                        </label>
                        <input
                            type="email"
                            className="form-control w-100 bg-white text-black"
                            onChange={onChange}
                            value={credentials.email}
                            name="email"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                        />
                        <div id="emailHelp" className="form-text">
                            We'll never share your email with anyone else.
                        </div>
                    </div>
                    <div className="mb-3">
                        <label
                            htmlFor="exampleInputPassword1"
                            className="form-label text-black"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control w-100 bg-white text-black"
                            onChange={onChange}
                            value={credentials.password}
                            name="password"
                            id="exampleInputPassword1"
                        />
                    </div>
                    <div className="mb-3">
                        <label
                            htmlFor="exampleInputPassword1"
                            className="form-label text-black"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            className="form-control w-100 bg-white text-black"
                            onChange={onChange}
                            value={credentials.confirmPassword}
                            name="confirmPassword"
                            id="exampleInputPassword1"
                        />
                    </div>
                    <div className="mb-3">
                        <label
                            htmlFor="exampleInputLocation1"
                            className="form-label text-black"
                        >
                            Address
                        </label>
                        <input
                            type="text"
                            className="form-control w-100 bg-white text-black"
                            onChange={onChange}
                            value={credentials.location}
                            name="location"
                            id="exampleInputLocation1"
                        />
                    </div>
                    {msg && (

                        <div className="p-2 m-3 bg-success rounded-1 text-white">
                            {msg}
                        </div>

                    )}
                    {err && (

                        <div className="p-2 m-3 bg-danger rounded-1 text-white">{err}</div>

                    )}
                    <button type="submit" className="btn btn-success">
                        Submit
                    </button>
                    <div className="mt-4">
                        <GoogleLogin
                            onSuccess={(credentialResponse) => {
                                let userData = jwtDecode(credentialResponse.credential);

                                googleData(userData);
                            }}
                            onError={() => {
                                console.log("Login Failed");
                            }}
                        />
                    </div>
                    <br></br>
                    <Link to="/login" className="m-3" style={{ color: "black", float: "left" }}>
                        Already have an account? Log in
                    </Link>
                    <Link to="/adminSignup" className="m-3" style={{ color: "black", display: "flex", float: "left" }}>
                        Signup as admin
                    </Link>
                </form>
                <br />

            </div>
        </div>
    );
}
