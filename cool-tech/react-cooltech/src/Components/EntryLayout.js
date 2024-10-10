// Imports the necessary files
import { React, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import "./Styles/EntryLayout.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

// A function that displays the appropriate EntryLayout for a user
const EntryLayout = (props) => {
  // Declares state variables
  const [formLayout, setFormLayout] = useState("login");
  const [categoryData, setCategoryData] = useState({});

  // Fetches Category Data for user to register
  useEffect(() => {
    fetch("http://localhost:8080/cool-tech/register")
      .then((response) => response.json())
      .then((data) => setCategoryData(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  // A function that sets the components layout
  const handleLayout = (state) => {
    setFormLayout(state);
  };

  // Returns the EntryLayout container
  return (
    <div className="entry-container">
      {/* Displays Login form if state equals login */}
      {formLayout === "login" && (
        <>
          <LoginForm
            handleLogin={props.handleLogin}
            setAlertMessage={props.setAlertMessage}
          />
          <Button onClick={() => handleLayout("register")}>Register</Button>
        </>
      )}

      {/* Displays register form if state equals register */}
      {formLayout === "register" && (
        <>
          <RegisterForm
            ouData={categoryData.ouData}
            divisionData={categoryData.divisionData}
            setAlertMessage={props.setAlertMessage}
          />
          <Button onClick={() => handleLayout("login")}>Login</Button>
        </>
      )}
    </div>
  );
};

// Declares the EntryLayout function as the default component from this module
export default EntryLayout;
