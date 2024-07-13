import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [credentials, setCredentials] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    email: "",
    location: "",
    isAdmin: false,
    isApproved: false
  });

  let navigate = useNavigate();
  /*
    const submit = async (e) => {
      e.preventDefault();
      if (credentials.name.length < 5) {
        alert("Username must be at least 5 characters long");
        return;
      }
  
      if (credentials.password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
      }
      try {
        const response = await fetch('https://vivisteria-2lrx.vercel.app/api/createuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: credentials.name,
            email: credentials.email,
            password: credentials.password,
            location: credentials.location,
            isAdmin: credentials.isAdmin,
            isApproved: credentials.isApproved
          }),
        });
  
        const data = await response.json();
  
        if (!data.success) {
           if (data.errors === 'same email') {
        alert("email aleady exist")
      } else {
        alert("enter valid credentials");
      }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error creating user:', error);
        //alert('Error creating user. Please try again.');
      }
    };
  */
  const submit = async (e) => {
    e.preventDefault();
    if (credentials.name.length < 5) {
      alert("Username must be at least 5 characters long");
      return;
    }
    if (credentials.password !== credentials.confirmPassword) {
      alert("Password doesn't match");
      return;
    }
    if (credentials.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    const response = await fetch("http://localhost:5000/api/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: credentials.name,
        password: credentials.password,
        confirmPassword: credentials.confirmPassword,
        email: credentials.email,
        location: credentials.location,
        isAdmin: credentials.isAdmin,
        isApproved: credentials.isApproved
      }),
    });
    const json = await response.json();
    console.log(json);

    if (!json.success) {
      if (json.errors === 'same email') {
        alert("email aleady exist")
      } else {
        alert("enter valid credentials");
      }
    } else {
      navigate("/login");
    }
  };
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="signupPage">
      <div className="inside container p-10">
        <h1 className="text-black">Sign up</h1>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label htmlFor="userName" className="form-label text-black">
              Name
            </label>
            <input
              type="text"
              className="form-control w-100"
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
              className="form-control w-100"
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
              className="form-control w-100"
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
              className="form-control w-100"
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
              className="form-control w-100"
              onChange={onChange}
              value={credentials.location}
              name="location"
              id="exampleInputLocation1"
            />
          </div>

          <button type="submit" className="btn btn-success">
            Submit
          </button>
          <Link to="/login" className="m-3" style={{ color: "black" }}>
            Already have an account? Log in
          </Link>
          <Link to="/adminSignup" className="m-3" style={{ color: "black" }}>
            Signup as admin
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
