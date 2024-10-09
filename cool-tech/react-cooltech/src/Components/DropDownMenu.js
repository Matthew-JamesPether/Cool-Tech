// Imports the necessary files
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

// A function that calls the appropriate components and displays them
const DropDownMenu = (props) => {

  // Returns the appropriate components
  return (
    <div className="drop-down-container">
      <h3>Organizational Units:</h3>
      {/* Displays drop items depending on how many OUs and Divisions the user is apart of */}
      {props.ouDivisions.map((ouDivision) => {
        return (
          <DropdownButton
            id="dropdown-basic-button"
            key={ouDivision.ouId._id}
            title={ouDivision.ouId.description}
          >
            {ouDivision.divisionIds.map((division) => {
              return (
                <Dropdown.Item
                  key={division._id}
                  onClick={() => {
                    props.handleClick({
                      ouId: ouDivision.ouId._id,
                      divisionId: division._id,
                    });
                  }}
                >
                  {division.description}
                </Dropdown.Item>
              );
            })}
          </DropdownButton>
        );
      })}
    </div>
  );
};

// Declares the DropDownMenu function as the default component from this module
export default DropDownMenu;
