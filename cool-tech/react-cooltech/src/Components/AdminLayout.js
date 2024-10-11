// Imports the necessary files
import { React, useState, useEffect } from "react";
import "./Styles/AdminLayout.css";
import UpdateAdminLayout from "./UpdateAdminLayout";
import Button from "react-bootstrap/Button";

// A function that calls the appropriate components and displays them
const AdminLayout = (props) => {
  // Declares state variables
  const [users, setUsers] = useState([]);
  const [selectUpdate, setSelectUpdate] = useState(false);

  // Fetches all the users
  useEffect(() => {
    fetch("http://localhost:8080/cool-tech/auth/get-users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${props.accessToken}`, // Include the token in the Authorization
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
                return fetch("http://localhost:8080/cool-tech/auth/get-users", {
                  headers: {
                    Authorization: `Bearer ${refreshData.accessToken}`,
                  },
                });
              });
            } else {
              throw new Error("Failed to refresh token");
            }
          });
        } else if (response.ok) {
          return response.json().then((data) => {
            setUsers(data);
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  // A function that sets the layout and saves variables to session storage
  const toggleLayout = (userId) => {
    sessionStorage.setItem("userId", JSON.stringify(userId));
    setSelectUpdate(!selectUpdate);
    sessionStorage.setItem("selectUpdate", JSON.stringify(selectUpdate));
  };

  // Returns the appropriate components
  return (
    <div className="admin-container">
      {/* If the user has not selected Update render all users */}
      {!JSON.parse(sessionStorage.getItem("selectUpdate")) ? (
        <>
          {users.map((user) => (
            <div className="user-admin-container" key={user._id}>
              <h6>
                User: <span>{user.userName}</span>
              </h6>
              <h6>
                Role: <span>{user.role}</span>
              </h6>

              {user.ouDivisions.map((division, divisionIndex) => (
                <div key={divisionIndex}>
                  <h6>
                    OU Description: <span>{division.ouId.description}</span>
                  </h6>
                  <ul>
                    {division.divisionIds.map((div, divIndex) => (
                      <li key={divIndex}>{div.description}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <Button
                variant="info"
                onClick={() => {
                  toggleLayout(user._id);
                }}
              >
                Update
              </Button>
            </div>
          ))}
        </>
      ) : (
        // Else render the update admin layout
        <UpdateAdminLayout
          userId={JSON.parse(sessionStorage.getItem("userId"))}
          toggleLayout={toggleLayout}
          setAlertMessage={props.setAlertMessage}
          accessToken={props.accessToken}
          handleLogin={props.handleLogin}
        />
      )}
    </div>
  );
};

// Declares the AdminLayout function as the default component from this module
export default AdminLayout;
