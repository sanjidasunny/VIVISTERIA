import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Login() {
  const [credentials, setcredentials] = useState({
    password: "",
    email: "",
  });
  let navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    /*const response = await fetch("http://localhost:5000/api/loginuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },*/
  
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
  
      const data = response.data; // Access the response data directly
  
      if (!data.success) {
        alert('Enter valid email or password');
      } else {
        localStorage.setItem('userEmail', credentials.email);
        localStorage.setItem('authToken', data.authToken);
        console.log(localStorage.getItem('authToken'));
        navigate('/');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in. Please try again.');
    }
  };
  
  const onChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className='loginPage'>
      <div className="inside container  p-10" >
        <h1 className="text-black">Log in</h1>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label text-black">
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
            <label htmlFor="exampleInputPassword1" className="form-label text-black">
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
          <button type="submit" className="btn btn-success">
            Submit
          </button>
          <Link to="/signup" className="m-3" style={{ color: "black" }}>
            Don't have an account? Sign up
          </Link>
        </form>
      </div>
    </div>
  )
}

export default Login