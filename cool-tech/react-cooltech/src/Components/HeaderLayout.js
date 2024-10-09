// Imports the necessary files
import { React } from "react";
import { Outlet } from "react-router-dom";

// A function that displays the appropriate header for a user
const HeaderLayout = (props) => {
  // Returns the header container
  return (
    <header className="header-container">
      <div className="heading">
        {props.isLoggedIn ? "Cool Tech" : "Welcome to Cool Tech"}
        </div>
        <Outlet />
    </header>
  );
};

// Declares the HeaderLayout function as the default component from this module
export default HeaderLayout;