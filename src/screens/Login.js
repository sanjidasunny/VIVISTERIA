import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://vivisteria-2lrx.vercel.app/api/loginuser',
        {
          email: credentials.email,
          password: credentials.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(response.data);

      if (!response.data.success) {
        alert('Enter valid email or password');
      } else {
        localStorage.setItem('authToken', response.data.authToken);
        console.log(localStorage.getItem('authToken'));
        navigate('/');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred while logging in. Please try again.');
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="container mt-3 p-10">
        <form onSubmit={submit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
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
              required
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control w-100"
              onChange={onChange}
              value={credentials.password}
              name="password"
              id="exampleInputPassword1"
              required
            />
          </div>
          <button type="submit" className="btn btn-success">
            Submit
          </button>
          <Link to="/signup" className="m-3" style={{ color: 'black' }}>
            Don't have an account? Sign up
          </Link>
        </form>
      </div>
    </>
  );
}

export default Login;
