// Imports the necessary file
import users from "../models/users.js";
import repoCredentials from "../models/repo-credentials.js";

// A function that gets the necessary resources for the user
export const getResources = async (req, res) => {
  try {
    // Declares the decoded token
    const decoded = req.decoded;

    // Finds the users data based on token
    const ouDivData = await users
      .find({ userName: decoded.name })
      .populate({
        path: "ouDivisions.ouId",
        select: "description", // Fetch only the description field from OU
      })
      .populate({
        path: "ouDivisions.divisionIds",
        select: "description", // Fetch only the description field from Division
      })
      .select("ouDivisions -_id")
      .lean();

    // Declares the users data
    const userData = {
      name: decoded.name,
      ouDivisions: ouDivData[0].ouDivisions,
      role: decoded.role,
    };

    // Responses with the users data
    res.status(200).send(userData);
  } catch (err) {
    res.status(401).send({ err: "Bad JWT!" });
  }
};

// A function when called adds a new repo credential to the database
export const addRepo = async (req, res) => {
  try {
    await repoCredentials.create(req.body);

    // Sends a response message
    res
      .status(201)
      .send({ message: "Repo credentials successfully submitted!!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// A function when called response with the selected divisions repos
export const getRepoData = async (req, res) => {
  try {
    // Querying the RepoCredentials model
    const repoData = await repoCredentials.find({
      ousId: req.query.ouId,
      divisionId: req.query.divisionId,
    });

    // Filters though the data retrieved
    const filterData = repoData.map((credential) => {
      return {
        id: credential._id,
        username: credential.username,
        password: credential.password,
        placed: credential.placed,
        dateSubmitted: new Date(credential.dateSubmitted)
          .toISOString()
          .slice(0, 10), // Update dateSubmitted
      };
    });

    // Responses with the filtered data
    res.status(200).send(filterData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// A function when called response with repo info that can be updated
export const getRepo = async (req, res) => {
  try {
    // Finds repoCredential
    const repo = await repoCredentials.find({ _id: req.params.id });

    // Filters through the repoCredential
    const filterRepo = {
      id: repo[0]._id,
      username: repo[0].username,
      placed: repo[0].placed,
    };

    // responses with the filtered repoCredential
    res.status(200).send(filterRepo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// A function when called updates a repo credential
export const updateRepo = async (req, res) => {
  try {
    // Declares the data that will be updated
    const updateData = {
      password: req.body.password,
      placed: req.body.placed,
      username: req.body.username,
    };

    // Updates the data using the request id and the declared data
    await repoCredentials.findByIdAndUpdate(req.body.id, updateData);

    // Sends a response message
    res
      .status(200)
      .send({ message: "Repo credentials successfully updated!!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// A function when called fetches all the users
export const getUsers = async (req, res) => {
  try {
    // Finds users that match the organization Id and division Ids
    const usersData = await users
      .find()
      .populate({
        path: "ouDivisions.ouId",
        select: "description", // Fetch only the description field from OU
      })
      .populate({
        path: "ouDivisions.divisionIds",
        select: "description", // Fetch only the description field from Division
      })
      .select("userName ouDivisions role")
      .lean();

    // Response with the users found
    res.status(200).send(usersData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// A function that gets the selected user
export const getUser = async (req, res) => {
  try {
    // Finds the user based on their id and retrieves the selected data
    const user = await users
      .find({ _id: req.params.id })
      .populate({
        path: "ouDivisions.ouId",
        select: "_id", // Fetch only the description field from OU
      })
      .populate({
        path: "ouDivisions.divisionIds",
        select: "_id", // Fetch only the description field from Division
      })
      .select("userName ouDivisions role")
      .lean();

    // Responses with the found user
    res.status(200).send(user[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// A function when called updates a specific user
export const updateUser = async (req, res) => {
  try {
    // Checks if there is at least one division for every organization unit
    const isNotValid = req.body.ouDivisions.some(
      (ouDivision) => ouDivision.divisionIds.length === 0
    );

    // Filters out the id
    const { _id, ...filterData } = req.body;

    // If the criteria is met update the user else respond with a status 400 message
    if (!isNotValid) {
      await users.findByIdAndUpdate(req.body._id, filterData);
      res
        .status(200)
        .send({ message: "Repo credentials successfully submitted!!" });
    } else {
      res.status(400).send({
        message:
          "Please select at least one division for each Organization Unit!",
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
