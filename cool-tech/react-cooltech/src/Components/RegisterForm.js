// Imports the necessary files
import { React, useState } from "react";
import Button from "react-bootstrap/Button";

// A function that calls the appropriate components and displays them
const RegisterForm = (props) => {
  // Declares state variables
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [numOfOUs, setNumOfOUs] = useState(0);
  const [ouDivisions, setOuDivisions] = useState(
    Array(numOfOUs).fill({ ouId: "", divisionIds: [] })
  );
  const [retypePass, setRetypePass] = useState("");

  // A function that creates a new user
  const handleRegister = async (e) => {
    // Return a message if both passwords do not match
    if (retypePass !== password) {
      e.preventDefault();
      return props.setAlertMessage({
        message: "Passwords do not match",
        type: "warning",
      });
    }

    // Creates new user
    await fetch("http://localhost:8080/cool-tech/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Convert data to JSON string and handles any errors
      body: JSON.stringify({
        userName: username,
        password: password,
        ouDivisions: ouDivisions,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 400) {
          return response.json().then((data) => {
            props.setAlertMessage({ message: data.message, type: "danger" });
          });
        }
      })
      .then((data) =>
        props.setAlertMessage({ message: data.message, type: "success" })
      )
      .catch((error) => console.error("Error:", error));
  };

  // A function that stores the select check box divisions
  const handleCheckboxChange = (e, index, divisionId) => {
    const newOuDivisions = [...ouDivisions];
    const selectedDivisions = newOuDivisions[index].divisionIds;

    // Add the division if checked
    if (e.target.checked) {
      newOuDivisions[index].divisionIds = [...selectedDivisions, divisionId];
    } else {
      // Remove the division if unchecked
      newOuDivisions[index].divisionIds = selectedDivisions.filter(
        (id) => id !== divisionId
      );
    }

    // Updates the state variable
    setOuDivisions(newOuDivisions);
  };

  // A function that stores the select OUs
  const handleOUChange = (e, index) => {
    const newOuDivisions = [...ouDivisions];
    const ouIds = newOuDivisions.map((newOuDivision) => {
      return newOuDivision.ouId;
    });

    // Checks if the OU has already been selected
    const isSelected = ouIds.includes(e.target.value);

    // If not already selected add it to the array
    if (!isSelected) {
      newOuDivisions[index] = {
        ...newOuDivisions[index],
        ouId: e.target.value,
      };

      // Updates the state variable
      setOuDivisions(newOuDivisions);
    } else {
      // Else display a message
      props.setAlertMessage({
        message: "This organizational unit has already been selected!",
        type: "warning",
      });
    }
  };

  // Returns the appropriate components
  return (
    <form className="register-form" onSubmit={handleRegister}>
      <h2>register</h2>
      <label htmlFor="user">Username:</label>
      <input
        id="user"
        name="user"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <br />
      <label htmlFor="numOfOUs">Select Number of Organizational Unit: </label>
      <select
        id="numOfOUs"
        value={numOfOUs}
        onChange={(e) => {
          setNumOfOUs(e.target.value);
          setOuDivisions(
            Array(Number(e.target.value)).fill({ ouId: "", divisionIds: [] })
          );
        }}
      >
        <option value={0}>--Number of OU--</option>
        {props.ouData.map((ou, index) => {
          return (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          );
        })}
      </select>
      <br />

      <div>
        {Array.from({ length: numOfOUs }, (_, index) => (
          <div key={index} className="tag">
            <label htmlFor={`ous-${index}`}>Organizational Unit: </label>
            <select
              id={`ous-${index}`}
              value={ouDivisions[index]?.ouId || ""}
              onChange={(e) => handleOUChange(e, index)}
              required
            >
              <option value="">--Select OU--</option>
              {props.ouData.map((ou) => {
                return (
                  <option key={ou._id} value={ou._id}>
                    {ou.description}
                  </option>
                );
              })}
            </select>
            <br />
            <span>Divisions: </span>
            <div>
              {props.divisionData.map((division) => {
                return (
                  <div key={division._id}>
                    <input
                      type="checkbox"
                      id={`division-${index}-${division._id}`}
                      name="division"
                      value={division._id}
                      checked={ouDivisions[index]?.divisionIds.includes(
                        division._id
                      )}
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
      <label htmlFor="pass">Password:</label>
      <input
        id="pass"
        placeholder="Type password..."
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
        type="text"
        value={retypePass}
        onChange={(e) => setRetypePass(e.target.value)}
        required
      />
      <br />
      <Button type="submit" variant="success">register</Button>
    </form>
  );
};

// Declares the RegisterForm function as the default component from this module
export default RegisterForm;
