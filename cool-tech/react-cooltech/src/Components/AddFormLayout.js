// Imports the necessary files
import { React, useState } from "react";
import Button from "react-bootstrap/Button";

// A function that calls the appropriate components and displays them
const AddFormLayout = (props) => {
  // Declares state variables
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [retypePass, setRetypePass] = useState("");
  const [placed, setPlaced] = useState("");

  // A function that creates a repo credential
  const handleRepo = (event) => {
    event.preventDefault();
    // Return a message if both passwords do not match
    if (retypePass !== password) {
      return props.setAlertMessage({
        message: "Passwords do not match",
        type: "warning",
      });
    }

    const addData = async (token) => {
      // Adds a new Repo-credential
      await fetch("http://localhost:8080/cool-tech/auth/add-repo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          "Content-Type": "application/json",
        },
        // Convert data to JSON string and handles any errors
        body: JSON.stringify({
          username: username,
          password: password,
          ousId: props.ouDivisionIds.ouId,
          divisionId: props.ouDivisionIds.divisionId,
          placed: placed,
        }),
      })
        .then((response) => {
          if (response.status === 401) {
            // Access token expired, try refreshing the token
            return fetch("http://localhost:8080/cool-tech/token", {
              method: "POST",
              credentials: "include", // Send refresh token (cookie)
            }).then((refreshResponse) => {
              if (refreshResponse.ok) {
                return refreshResponse.json().then((refreshData) => {
                  props.handleLogin(refreshData.accessToken); // Update the access token
                  // Retry fetching protected data
                  return addData(refreshData.accessToken);
                });
              } else {
                throw new Error("Failed to refresh token");
              }
            });
          } else if (response.ok) {
            return response.json().then((data) => {
              props.setAlertMessage({ message: data.message, type: "success" });
              // Sets back to repoLayout
              props.toggleLayout("repoLayout");
            });
          }
        })
        .catch((error) => console.error("Error:", error));
    };

    // Calls the function to add data
    addData(props.accessToken);
  };

  // Returns the appropriate components
  return (
    <form className="add-form" onSubmit={handleRepo}>
      <Button
        className="home-button"
        onClick={() => props.toggleLayout("repoLayout")}
      >
        Home
      </Button>
      <br />
      <label htmlFor="user">Username:</label>
      <input
        id="user"
        placeholder="Enter users name..."
        name="user"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <br />
      <label html="place">Placed:</label>
      <input
        id="place"
        placeholder="Where they are placed..."
        name="place"
        type="text"
        value={placed}
        onChange={(e) => setPlaced(e.target.value)}
        required
      />
      <br />
      <label htmlFor="pass">Password:</label>
      <input
        id="pass"
        placeholder="Enter a password..."
        name="pass"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />
      <label htmlFor="retypePass">Retype Password:</label>
      <input
        id="retypePass"
        placeholder="Retype password..."
        name="retypePass"
        type="password"
        value={retypePass}
        onChange={(e) => setRetypePass(e.target.value)}
        required
      />
      <br />
      <Button type="submit" variant="success">
        submit
      </Button>
    </form>
  );
};

// Declares the AddFormLayout function as the default component from this module
export default AddFormLayout;
