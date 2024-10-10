// Imports the necessary files
import { React, useState } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

// A function that calls the appropriate components and displays them
const LoginForm = (props) => {
  // Declares state variables
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Declares a function
  const navigate = useNavigate();

  // A function that handles the user login in
  const handleLogin = async (event) => {
    event.preventDefault();

    // Verifies login details
    await fetch("http://localhost:8080/cool-tech/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      // Convert data to JSON string and handles any errors
      body: JSON.stringify({ userName: username, password: password }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 403) {
          return response.json().then((data) => {
            props.setAlertMessage({ message: data.message, type: "danger" });
            navigate("/");
          });
        } else {
          throw new Error("Unexpected error occurred");
        }
      })
      .then((data) => {
        props.handleLogin(data.token);
        props.setAlertMessage({ message: data.message, type: "success" });
        // navigate to route if user is verified
        navigate("/user");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Returns the appropriate components
  return (
    <form className="login-form" onSubmit={handleLogin}>
      <h2>Login</h2>
      <label htmlFor="user">Username:</label>
      <input
        id="user"
        name="user"
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <br />
      <label htmlFor="pass">Password:</label>
      <input
        id="pass"
        name="pass"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />
      <Button type="submit" variant="success">
        Login
      </Button>
    </form>
  );
};

// Declares the LoginForm function as the default component from this module
export default LoginForm;
