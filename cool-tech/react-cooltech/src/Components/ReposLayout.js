// Imports the necessary files
import { React, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";

// A function that calls the appropriate components and displays them
const ReposLayout = (props) => {
  // Declares state variables
  const [repos, setRepos] = useState([]);

  // Fetches the Repo-credentials based on the OU and division the user had selected
  useEffect(() => {
    fetch(
      `http://localhost:8080/cool-tech/auth/get-repo-data?ouId=${props.ouDivisionIds.ouId}&divisionId=${props.ouDivisionIds.divisionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${JSON.parse(
            sessionStorage.getItem("token")
          )}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setRepos(data);
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
  }, [props.ouDivisionIds]);

  // Returns the appropriate components
  return (
    <div className="repos-container">
      <Button
        variant="success"
        className="home-button"
        onClick={() => props.toggleLayout("addLayout")}
      >
        Add a credential
      </Button>
      <br />
      {/* If there is no repo data display a message */}
      {repos.length === 0 ? (
        <div>There are no Repo-credentials yet for this division</div>
      ) : (
        repos.map((repo) => {
          return (
            <div className="repo-credential" key={repo.id}>
              <div>
                <p>
                  User: <span>{repo.username}</span>
                </p>
                <p>
                  Password: <span>{repo.password}</span>
                </p>
                <p>
                  Placed: <span>{repo.placed}</span>
                </p>
                <p>
                  Date Submitted: <span>{repo.dateSubmitted}</span>
                </p>
              </div>
              {props.isManager && (
                <Button
                  variant="info"
                  onClick={() => {
                    props.toggleLayout("updateLayout");
                    sessionStorage.setItem("repoId", repo.id);
                  }}
                >
                  Update
                </Button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

// Declares the ReposLayout function as the default component from this module
export default ReposLayout;
