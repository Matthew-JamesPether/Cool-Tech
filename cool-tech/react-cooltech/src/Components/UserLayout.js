// Imports the necessary files
import { React, useState, useEffect } from "react";
import ReposLayout from "./ReposLayout";
import AddFormLayout from "./AddFormLayout";
import UpdateFormLayout from "./UpdateFormLayout";
import AdminLayout from "./AdminLayout";
import "./Styles/UserLayout.css";
import Button from "react-bootstrap/Button";
import DropDownMenu from "./DropDownMenu";
import Spinner from "react-bootstrap/Spinner";
import SingleUserLayout from "./SingleUserLayout";

// A function that calls the appropriate components and displays them
const UserLayout = (props) => {
  // Declares state variables
  const [render, setRender] = useState("homeLayout");
  const [decodedToken, setDecodedToken] = useState({});
  const [loading, setLoading] = useState(true);
  const [ouDivisionIds, setOuDivisionIds] = useState({});
  const [isManager, setIsManager] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetches data and checks what role the user has
  useEffect(() => {
    fetch("http://localhost:8080/cool-tech/auth/resources", {
      headers: { Authorization: `Bearer ${props.accessToken}` },
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
                return fetch("http://localhost:8080/cool-tech/auth/resources", {
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
            setDecodedToken(data);
            if (data.role === "management") {
              setIsManager(true);
            } else if (data.role === "admin") {
              setIsManager(true);
              setIsAdmin(true);
            }
          });
        }
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => setLoading(false));
  }, []);

  // Checks session storage if the page gets reloaded
  useEffect(() => {
    if (sessionStorage.getItem("renderLayout") !== null) {
      setOuDivisionIds(JSON.parse(sessionStorage.getItem("ouDivisionIds")));
      setRender(sessionStorage.getItem("renderLayout"));
    }
  }, []);

  // A function that sets which layout gets displayed
  const toggleLayout = (formLayout) => {
    sessionStorage.setItem("renderLayout", formLayout);
    setOuDivisionIds(JSON.parse(sessionStorage.getItem("ouDivisionIds")));
    return setRender(formLayout);
  };

  // A function that stores which ouDivision is selected
  const handleClick = (ouDivIds) => {
    sessionStorage.setItem("ouDivisionIds", JSON.stringify(ouDivIds));
    sessionStorage.setItem("selectedDivision", true);
    toggleLayout("repoLayout");
  };

  // Renders a spinner component if loading is true
  if (loading) return <Spinner animation="border" role="status" />;

  // Returns the appropriate components
  return (
    <div className="user-container">
      <div className="user-heading">
        <h1>Welcome Back {decodedToken.name}</h1>
        {/* Renders a log out button if user is logged in */}
        {props.isLoggedIn && (
          <Button onClick={props.handleLogout} variant="warning">
            Log Out
          </Button>
        )}
        {/* Renders a admin button if user is admin */}
        {isAdmin && (
          <Button
            onClick={() => {
              if (render !== "adminLayout") {
                return toggleLayout("adminLayout");
              }
              toggleLayout("repoLayout");
            }}
          >
            {render === "adminLayout" ? "Home" : "Admin"}
          </Button>
        )}
      </div>

      {/* Renders Admin layout if user select admin */}
      {render === "adminLayout" && (
        <AdminLayout
          token={props.token}
          setAlertMessage={props.setAlertMessage}
          accessToken={props.accessToken}
          handleLogin={props.handleLogin}
        />
      )}
      {/* Renders home layout if admin layout is not selected */}
      {render !== "adminLayout" && (
        <>
          {decodedToken.ouDivisions.length === 1 &&
          decodedToken.ouDivisions[0].divisionIds.length === 1 ? (
            <SingleUserLayout
              ouDivisions={decodedToken.ouDivisions}
              handleClick={handleClick}
            />
          ) : (
            <DropDownMenu
              ouDivisions={decodedToken.ouDivisions}
              handleClick={handleClick}
            />
          )}
          {/* Displays a message if user has not selected a division */}
          {sessionStorage.getItem("selectedDivision") === null ? (
            <div className="division-selected">Please select a Division</div>
          ) : (
            <>
              {/* Renders layout if selected */}
              {render === "repoLayout" && (
                <ReposLayout
                  ouDivisions={decodedToken.ouDivisions}
                  isManager={isManager}
                  toggleLayout={toggleLayout}
                  ouDivisionIds={ouDivisionIds}
                  accessToken={props.accessToken}
                  handleLogin={props.handleLogin}
                />
              )}

              {/* Renders layout if selected */}
              {render === "addLayout" && (
                <AddFormLayout
                  token={props.token}
                  ouDivisionIds={ouDivisionIds}
                  setAlertMessage={props.setAlertMessage}
                  toggleLayout={toggleLayout}
                  accessToken={props.accessToken}
                  handleLogin={props.handleLogin}
                />
              )}

              {/* Renders layout if selected */}
              {render === "updateLayout" && (
                <UpdateFormLayout
                  repoId={sessionStorage.getItem("repoId")}
                  token={props.token}
                  setAlertMessage={props.setAlertMessage}
                  toggleLayout={toggleLayout}
                  accessToken={props.accessToken}
                  handleLogin={props.handleLogin}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

// Declares the UserLayout function as the default component from this module
export default UserLayout;
