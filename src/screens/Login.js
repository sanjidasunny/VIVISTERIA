import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Login() {
  const [credentials, setCredentials] = useState({
    password: "",
    email: "",
  });
  let navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://vivisteria-2lrx.vercel.app/api/loginuser',
        {
          email: credentials.email,
          password: credentials.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;

      if (!data.success) {
        if (response.status === 401) {
          alert("You are not approved as an admin yet");
        } else {
          alert("Enter valid email or password");
        }
      } else {
        localStorage.setItem("userEmail", credentials.email);
        localStorage.setItem("userID", data.userID);
        localStorage.setItem("authToken", data.authToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("adminStatus", data.adminStatus.toString());

        console.log(localStorage.getItem("userID"));
        if (localStorage.getItem("adminStatus") === "true") {
          console.log("user is an admin");
        } else {
          console.log("user is not an admin");
        }

        navigate("/");
      }
    } catch (error) {
      if (error.response.status === 401) {
        alert("You are not approved as an admin yet");
      } else if (error.response.status === 400) {
        alert(error.response.data.errors || "Enter valid email or password");
      } else {
        console.error('Error logging in:', error);
        alert('Error logging in. Please try again.');
      }
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className='loginPage'>
      <div className="inside container p-10">
        <h1 className="text-black">Log in</h1>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label text-black">Email address</label>
            <input
              type="email"
              className="form-control w-100 bg-white text-black"
              onChange={onChange}
              value={credentials.email}
              name="email"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label text-black">Password</label>
            <input
              type="password"
              className="form-control w-100 bg-white text-black"
              onChange={onChange}
              value={credentials.password}
              name="password"
              id="exampleInputPassword1"
            />
          </div>
          <button type="submit" className="btn btn-success">Submit</button>
          <Link to="/signup" className="m-3" style={{ color: "black" }}>Don't have an account? Sign up</Link>
        </form>
      </div>
    </div>
  )
}

export default Login;
