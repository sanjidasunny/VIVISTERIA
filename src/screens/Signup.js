import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [credentials, setcredentials] = useState({
    name: "",
    password: "",
    email: "",
    location: "",
  });
  let navigate = useNavigate();
  const submit = async (e) => { const submit = async (e) => {
    e.preventDefault();
    // const response = await fetch("http://localhost:5000/api/createuser", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     name: credentials.name,
    //     password: credentials.password,
    //     email: credentials.email,
    //     location: credentials.location,
    //   }),
    try {
      const response = await axios.post(
        'https://vivisteria-2lrx.vercel.app/api/createuser',
        {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          location: credentials.location,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data; // Access the response data directly

      if (!data.success) {
        alert('Enter valid credentials');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user. Please try again.');
    }
  };

    e.preventDefault();
    
    const response = await axios.post(
      "https://vivisteria-2lrx.vercel.app/api/createuser",
      {
        name: credentials.name,
        password: credentials.password,
        email: credentials.email,
        location: credentials.location,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
    });
    //const json = await response.json();
    console.log(json);

    if (!json.success) {
      alert("enter valid credentials");
    } else {
      navigate("/login");
    }
  };
  const onChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="signupPage" >

      <div className="inside container p-10" >
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
              htmlFor="exampleInputLocation1"
              className="form-label text-black"
            >
              address
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
            already has an account? Log in
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
