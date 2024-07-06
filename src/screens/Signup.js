import React, { useState } from "react";
import { navigate } from "gatsby";
import axios from "axios";

function MyForm() {
  const [credentials, setCredentials] = useState({
    name: "",
    password: "",
    email: "",
    location: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
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
        }
      );

      
      console.log(response.data);

      if (!response.data.success) {
        alert("Enter valid credentials");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error creating user:", error);

    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={submit}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={credentials.name}
        onChange={onChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={credentials.password}
        onChange={onChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={credentials.email}
        onChange={onChange}
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={credentials.location}
        onChange={onChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default MyForm;
