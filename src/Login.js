import React, { useState } from "react";
import axios from "axios";
import Signup from "./Signup";
import "./Login.css";
import Swal from "sweetalert2";

function Login({ setLogin, login }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [signup, setSignup] = useState(false);

  const sign = () => {
    setSignup(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          // Transforming the request to URL encoded form data
          transformRequest: [
            (data) => {
              return Object.entries(data)
                .map(
                  ([key, value]) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
                )
                .join("&");
            },
          ],
        }
      );
      Swal.fire({
        title: "Login Successful",
        text: response.data.message,
        icon: "success",
      });
      // alert(`Login successful: ${response.data.message}`);
      setLogin(true);
      console.log(login);
      // Handle successful login here (e.g., redirect to another page or store login state)
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        setErrorMessage(error.response.data.detail);
      } else if (error.request) {
        // The request was made but no response was received
        setErrorMessage("The server did not respond. Please try again later.");
      } else {
        console.log(error);
        // Something else happened in setting up the request that triggered an error
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };
  if (signup) {
    return <Signup setSignup={setSignup} />;
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Login</h1>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button type="submit">Login</button>
        <button onClick={sign}>Sign up</button>
      </form>
    </div>
  );
}

export default Login;
