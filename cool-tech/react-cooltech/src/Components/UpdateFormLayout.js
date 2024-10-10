// Imports the necessary files
import { React, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";

// A function that calls the appropriate components and displays them
const UpdateFormLayout = (props) => {
  // Declares state variables
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [retypePass, setRetypePass] = useState("");
  const [placed, setPlaced] = useState("");

  // Fetches the selected repos data
  useEffect(() => {
    fetch(`http://localhost:8080/cool-tech/auth/get-repo/${props.repoId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${props.accessToken}`, // Include the token in the Authorization header
        "Content-Type": "application/json",
      },
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
                return fetch(
                  `http://localhost:8080/cool-tech/auth/get-repo/${props.repoId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${refreshData.accessToken}`,
                    },
                  }
                );
              });
            } else {
              throw new Error("Failed to refresh token");
            }
          });
        } else if (response.ok) {
          return response.json().then((data) => {
            setUsername(data.username);
            setPlaced(data.placed);
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  //A function that updates a repo
  const handleUpdate = async () => {
    // Return a message if both passwords do not match
    if (retypePass !== password) {
      return props.setAlertMessage({
        message: "Passwords do not match",
        type: "warning",
      });
    }

    // Updates new data
    await fetch("http://localhost:8080/cool-tech/auth/update-repo", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${props.accessToken}`, // Include the token in the Authorization header
        "Content-Type": "application/json",
      },
      // Convert data to JSON string and handles any errors
      body: JSON.stringify({
        id: props.repoId,
        username: username,
        password: password,
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
                return fetch(
                  "http://localhost:8080/cool-tech/auth/update-repo",
                  {
                    headers: {
                      Authorization: `Bearer ${refreshData.accessToken}`,
                    },
                  }
                );
              });
            } else {
              throw new Error("Failed to refresh token");
            }
          });
        } else if (response.ok) {
          return response.json().then((data) => {
            props.setAlertMessage({ message: data.message, type: "success" });
          });
        }
      })
      .catch((error) => console.error("Error:", error));
    props.toggleLayout("repoLayout");
  };

  // Returns the appropriate components
  return (
    <form className="update-form" onSubmit={handleUpdate}>
      <Button
        className="home-button"
        onClick={() => props.toggleLayout("repoLayout")}
      >
        Home
      </Button>
      <br />
      <label htmlFor="user">Username: </label>
      <input
        id="user"
        name="user"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter new username..."
        required
      />
      <br />
      <label htmlFor="placed">Placed: </label>
      <input
        id="placed"
        name="placed"
        type="text"
        value={placed}
        onChange={(e) => setPlaced(e.target.value)}
        placeholder="Enter new user placement..."
        required
      />
      <br />
      <label htmlFor="pass">Password: </label>
      <input
        id="pass"
        name="pass"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Type password..."
        required
      />
      <br />
      <label htmlFor="retypePass">Retype Password: </label>
      <input
        id="retypePass"
        name="retypePass"
        type="password"
        value={retypePass}
        onChange={(e) => setRetypePass(e.target.value)}
        placeholder="Retype new password..."
        required
      />
      <br />
      <Button type="submit" variant="info">
        Update
      </Button>
    </form>
  );
};

// Declares the UpdateFormLayout function as the default component from this module
export default UpdateFormLayout;
