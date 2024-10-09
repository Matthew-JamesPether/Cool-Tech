// Imports the necessary file
import users from "../models/users.js";
import ous from "../models/ous.js";
import divisions from "../models/divisions.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// A function that gets the OU's and Division info
export const getRegisterInfo = async (req, res) => {
  try {
    const ouData = await ous.find();
    const divisionData = await divisions.find();

    // Response with the found data
    res.status(200).send({ ouData: ouData, divisionData: divisionData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// A function that creates a new user
export const createUser = async (req, res) => {
  try {
    // Checks if there is at least one division for every organization unit
    const isNotValid = req.body.ouDivisions.some(
      (ouDivision) => ouDivision.divisionIds.length === 0
    );

    // If the criteria is met update the user else respond with a status 400 message
    if (!isNotValid) {
      // Deconstructs body for password
      const { password } = req.body;

      // Hashes the password
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);

      // Updates the body with hashed password
      req.body = { ...req.body, password: hashedPass };

      // Declares a new user
      await users.create(req.body);

      // Responds with a message
      res.status(201).send({ message: "User successfully created!!" });
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

// A function that verifies a user
export const verifyUser = async (req, res) => {
  try {
    // Searches for the user
    const userData = await users.find({ userName: req.body.userName });

    // If no user respond with a status 403 message
    if (userData.length === 0) {
      return res.status(403).send({ message: "User not found!" });
    }

    // Else check if the given password matches the stored password
    const match = await bcrypt.compare(req.body.password, userData[0].password);

    // If there is a match tokenize the user data
    if (match) {
      const payload = {
        name: userData[0].userName,
        role: userData[0].role,
      };

      // Generates a token
      const token = jwt.sign(JSON.stringify(payload), "jwt-secret", {
        algorithm: "HS256",
      });

      // Sends the token
      res.json({ message: "Login successful", token: token });
    } else {
      res.status(403).send({ message: "Incorrect login!" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// A function that gets the necessary resources for the user
export const getResources = async (req, res) => {
  try {
    // Checks if token exists
    const token = req.headers["authorization"].split(" ")[1];

    try {
      // Decodes the token
      const decoded = jwt.verify(token, "jwt-secret");

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
  } catch (err) {
    res.status(401).send({ err: "Bad JWT!" });
  }
};
