// Imports the necessary files
import { React, useEffect, useState } from "react";

// A function that displays the appropriate header for a user
const SingleUserLayout = (props) => {
  useEffect(() => {
    props.handleClick({
      ouId: props.ouDivisions[0].ouId._id,
      divisionId: props.ouDivisions[0].divisionIds[0]._id,
    });
  }, []);

  // Returns the header container
  return (
    <div className="single-container">
      <h3>Organizational Unit: </h3>
      <h5>{props.ouDivisions[0].ouId.description}</h5>
    </div>
  );
};

// Declares the SingleUserLayout function as the default component from this module
export default SingleUserLayout;
