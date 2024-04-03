import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";
import Swal from "sweetalert2";

function Signup({ setSignup }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const back = () => {
    setSignup(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/users/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      Swal.fire({
        title: "Signup Successful",
        icon: "success",
      });
      setSignup(false);
    } catch (error) {
      console.error("Signup failed:", error.response);
      Swal.fire({
        title: "Signup failed",
        icon: "error",
      });
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <div>
        <h1>Sign up</h1>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Sign Up</button>
      <button onClick={back}>Back</button>
    </form>
  );
}

export default Signup;
