// Imports the necessary files
import "./App.css";
import { React, useState } from "react";
import HeaderLayout from "./Components/HeaderLayout";
import EntryLayout from "./Components/EntryLayout";
import UserLayout from "./Components/UserLayout";
import Alert from "react-bootstrap/Alert";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Creates a router for the browser
const App = () => {
  // Declares state variables
  const [alertMessage, setAlertMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("token") !== null;
  });

  // A function that handles access to routes
  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/" />;
  };

  // A Function that stores the token and sets login to true
  const handleLogin = (token) => {
    sessionStorage.setItem("token", JSON.stringify(token)); // Set the token in sessionStorage
    setIsLoggedIn(true); // Update the login state
  };

  // A function that logs out and clears all session storage
  const handleLogout = () => {
    setAlertMessage({ message: "You have logged out", type: "warning" })
    sessionStorage.clear();
    setIsLoggedIn(false);
  };

  // Creates the route elements
  const router = createBrowserRouter(
    createRoutesFromElements(
      // Creates a main route and displays the HeaderLayout component
      <Route
        path="/"
        element={
          <HeaderLayout isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        }
      >
        {/* Creates a route for the entry point */}
        <Route
          index
          element={
            <EntryLayout
              handleLogin={handleLogin}
              setAlertMessage={setAlertMessage}
            />
          }
        />
        {/* Use ProtectedRoute for UserLayout */}
        <Route
          path="user"
          element={
            <ProtectedRoute
              element={
                <UserLayout
                  isLoggedIn={isLoggedIn}
                  handleLogout={handleLogout}
                  setAlertMessage={setAlertMessage}
                />
              }
            />
          }
        />
      </Route>
    )
  );

  // Returns the RouterProvider with defined routes and a Alert component
  return (
    <div className="App">
      {alertMessage && (
        <Alert
          variant={alertMessage.type}
          onClose={() => setAlertMessage(null)}
          dismissible
        >
          {alertMessage.message}
        </Alert>
      )}
      <RouterProvider router={router} />
    </div>
  );
};

// Declares the App function as the default component from this module
export default App;
