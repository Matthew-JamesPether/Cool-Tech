// Imports the necessary files
import { React, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";

// A function that calls the appropriate components and displays them
const UpdateAdminLayout = (props) => {
  // Declares state variables
  const [user, setUser] = useState({
    userName: "",
    ouDivisions: [],
    role: "",
  });
  const [numOfOUs, setNumOfOUs] = useState(0);
  const [ouDivisions, setOuDivisions] = useState(
    Array(numOfOUs).fill({ ouId: {}, divisionIds: [] })
  );
  const [categoryData, setCategoryData] = useState({
    ouData: [],
    divisionData: [],
  });

  // Fetches a specific users data
  useEffect(() => {
    fetch(`http://localhost:8080/cool-tech/auth/get-user/${props.userId}`, {
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
                  `http://localhost:8080/cool-tech/auth/get-user/${props.userId}`,
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
            setUser(data);
          });
        }
      })
      .catch((error) => console.error("Error:", error));

    // Fetches Category Data from the given url
    fetch("http://localhost:8080/cool-tech/register")
      .then((response) => response.json())
      .then((data) => {
        setCategoryData(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  // Sets the state variables whenever the user variable changes
  useEffect(() => {
    setNumOfOUs(user.ouDivisions.length);
    setOuDivisions(user.ouDivisions);
  }, [user]);

  //A function that updates a user
  const handleUpdate = async () => {
    await fetch("http://localhost:8080/cool-tech/auth/update-user", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
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
                  "http://localhost:8080/cool-tech/auth/update-user",
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
        } else if (response.status === 400) {
          return response.json().then((data) => {
            props.setAlertMessage({ message: data.message, type: "danger" });
          });
        }
      })
      .catch((error) => console.error("Error:", error));
    props.toggleLayout();
  };

  // A function that handles the selected Number of organization units
  const handleNumOfOu = (e) => {
    // Stores the number selected
    const newNumOfOUs = Number(e.target.value);

    // Creates a new array with the corresponding size and saves existing data
    const newOuDivisions = [
      ...ouDivisions.slice(0, newNumOfOUs),
      ...Array(Math.max(0, newNumOfOUs - ouDivisions.length)).fill({
        ouId: {},
        divisionIds: [],
      }),
    ];

    // Updates the state variables
    setNumOfOUs(newNumOfOUs);
    setOuDivisions(newOuDivisions);
  };

  // A function handles the select check boxes
  const handleCheckboxChange = (e, index, divisionId) => {
    // Declares the selected divisions
    const newOuDivisions = [...ouDivisions];
    const selectedDivisions = newOuDivisions[index].divisionIds;

    // Adds the division if checked
    if (e.target.checked) {
      newOuDivisions[index].divisionIds = [
        ...selectedDivisions,
        { _id: divisionId },
      ];
    } else {
      // Removes the division if unchecked
      newOuDivisions[index].divisionIds = selectedDivisions.filter(
        (division) => division._id !== divisionId
      );
    }

    //Updates the state variable
    setOuDivisions(newOuDivisions);
  };

  // A function that handles the organization units
  const handleOUChange = (e, index) => {
    // Declares the selected OUs
    const newOuDivisions = [...ouDivisions];
    const selectedOUId = e.target.value;

    // Check if the selected OU has already been chosen
    const isOUSelected = newOuDivisions.some(
      (ouDiv, i) => ouDiv.ouId._id === selectedOUId && i !== index // Exclude the current index
    );

    // If not add it to the array
    if (!isOUSelected) {
      newOuDivisions[index] = {
        ...newOuDivisions[index],
        ouId: { _id: selectedOUId },
      };

      // Update the state variable
      setOuDivisions(newOuDivisions);
      setUser((prevUser) => ({
        ...prevUser,
        ouDivisions: newOuDivisions,
      }));
    } else {
      // Display a message that its already been selected
      props.setAlertMessage({
        message: "This organizational unit has already been selected.",
        type: "warning",
      });
    }
  };

  // A function that handles the role
  const handleRoleChange = (e) => {
    const newRole = e.target.value;

    // Update the user state with the new role
    setUser((prevUser) => ({
      ...prevUser,
      role: newRole,
    }));
  };

  // Returns the appropriate components
  return (
    <form className="update-admin-form" onSubmit={handleUpdate}>
      <div className="update-user-heading">
        <h4>{user.userName}</h4>
        <Button
          className="admin-back"
          onClick={() => {
            props.toggleLayout();
          }}
        >
          Back
        </Button>
      </div>
      <br />
      <label htmlFor="role">Role: </label>
      <select
        id="role"
        value={user.role}
        onChange={(e) => handleRoleChange(e)}
        required
      >
        <option value="normal">Normal</option>
        <option value="management">Management</option>
        <option value="admin">Admin</option>
      </select>
      <br />
      <label htmlFor="numOfOUs">Select Number of Organizational Unit: </label>
      <select id="numOfOUs" value={numOfOUs} onChange={(e) => handleNumOfOu(e)}>
        <option value={0}>--Number of OU--</option>
        {/* Loops through the OU categoryData to see how many OU there are*/}
        {categoryData.ouData.map((ou, index) => {
          return (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          );
        })}
      </select>
      <br />

      <div>
        {/* Displays the number of OU depending on how many a user has */}
        {Array.from({ length: numOfOUs }, (_, index) => (
          <div key={index} className="tag">
            <label htmlFor={`ous-${index}`}>Organizational Unit: </label>
            {/* Sets the OU the user is a part of */}
            <select
              id={`ous-${index}`}
              value={ouDivisions[index]?.ouId._id || ""}
              onChange={(e) => handleOUChange(e, index)}
              required
            >
              <option value="">--Select OU--</option>
              {categoryData.ouData.map((ou) => {
                return (
                  <option key={ou._id} value={ou._id}>
                    {ou.description}
                  </option>
                );
              })}
            </select>
            <br />
            <h6>Divisions: </h6>
            <div>
              {/* Displays all the divisions and checks the ones the 
                user is a part of matching with their corresponding OU*/}
              {categoryData.divisionData.map((division) => {
                const isChecked = ouDivisions[index]?.divisionIds.some(
                  (div) => div._id === division._id
                );

                return (
                  <div key={division._id}>
                    <input
                      type="checkbox"
                      id={`division-${index}-${division._id}`}
                      name="division"
                      value={division._id}
                      checked={isChecked}
                      onChange={(e) =>
                        handleCheckboxChange(e, index, division._id)
                      }
                    />
                    <label htmlFor={`division-${index}-${division._id}`}>
                      {division.description}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <br />
      <Button type="submit" variant="info">
        Update
      </Button>
    </form>
  );
};

// Declares the UpdateAdminLayout function as the default component from this module
export default UpdateAdminLayout;
