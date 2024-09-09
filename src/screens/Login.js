import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
function Login() {
  const [credentials, setCredentials] = useState({
    password: "",
    email: "",
  });
  let navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const submit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        // 'http://localhost:5000/api/loginuser',
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
      if (response.data.success) {
        localStorage.setItem("userEmail", credentials.email);
        localStorage.setItem("userID", data.userID);
        localStorage.setItem("authToken", data.authToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("adminStatus", data.adminStatus.toString());
        localStorage.setItem("profilePic", data.profilePic);
        navigate("/");
      }
      if (response.data.error) {
        setErr(response.data.error);
        setMsg("");
      } else {
        setMsg(response.data.message);
        setErr("");
      }

    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("You are not approved as an admin yet");
      } else if (error.response && error.response.status === 400) {
        alert(error.response.data.errors || "Enter valid email or password");
      } else {
        console.error('Error logging in:', error);
        alert('Error logging in. Please try again.');
      }
    }
  };

  const resend = async () => {
    try {
      const response = await axios.post(
        // `http://localhost:5000/api/user/resend`,
        `https://vivisteria-2lrx.vercel.app/api/user/resend`,
        {
          email: credentials.email,
          password: credentials.password,
        }
      );
      if (response.data.success) {
        alert("Verification email send");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const googleData = async (e) => {
    try {
      const response = await axios.post(
        // `http://localhost:5000/api/google/login`,
        `https://vivisteria-2lrx.vercel.app/api/google/login`,
        {
          name: e.name,
          email: e.email,
          profilePic: e.picture,
          isAdmin: false
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
          <div className='mb-2'>

            <Link className='text-black' to='/forgotPassword'>Forgot password</Link>
          </div>

          {msg && (
            <div >
              <div className="p-2 m-3 bg-success rounded-1 text-white">{msg}</div>
              <button onClick={resend} style={{ width: "200px" }} className="btn m-2 btn-primary p-2 underline ">
                Resend mail
              </button>
            </div>
          )}
          {err && (
            <div className="p-2 m-3 bg-danger rounded-1 text-white">{err}</div>
          )}
          <button type="submit" className="btn btn-success">Submit</button>
          <div className="my-4">
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
          <Link to="/signup" className="m-3" style={{ color: "black" }}>Don't have an account? Sign up</Link>
        </form>
      </div>
    </div>
  )
}

export default Login;
