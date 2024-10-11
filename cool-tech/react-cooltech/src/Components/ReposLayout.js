// Imports the necessary files
import { React, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";

// A function that calls the appropriate components and displays them
const ReposLayout = (props) => {
  // Declares state variables
  const [repos, setRepos] = useState({
    names: { ou: "", division: "" },
    data: [],
  });

  // Fetches the Repo-credentials based on the OU and division the user had selected
  useEffect(() => {
    fetch(
      `http://localhost:8080/cool-tech/auth/get-repo-data?ouId=${props.ouDivisionIds.ouId}&divisionId=${props.ouDivisionIds.divisionId}`,
      {
        headers: { Authorization: `Bearer ${props.accessToken}` },
      }
    )
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
                  `http://localhost:8080/cool-tech/auth/get-repo-data?ouId=${props.ouDivisionIds.ouId}&divisionId=${props.ouDivisionIds.divisionId}`,
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
            setRepos(data);
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  }, [props.ouDivisionIds]);

  // Returns the appropriate components
  return (
    <div className="repos-container">
      <p>
        {repos.names.ou}: {repos.names.division}
      </p>
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
        repos.data.map((repo) => {
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
