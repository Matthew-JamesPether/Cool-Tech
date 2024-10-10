// Imports the necessary file
import users from "../models/users.js";
import ous from "../models/ous.js";
import divisions from "../models/divisions.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Stores refresh tokens
const refreshTokenArray = [];

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

      // Generates tokens
      const accessToken = await jwt.sign(
        { data: JSON.stringify(payload) },
        "access-secret",
        {
          algorithm: "HS256",
          expiresIn: "15m",
        }
      );
      const refreshToken = await jwt.sign(
        { data: JSON.stringify(payload) },
        "refresh-secret",
        {
          algorithm: "HS256",
          expiresIn: "1d",
        }
      );

      // Sends the refreshToken as a HTTP-only cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        path: "/token",
        maxAge: 24 * 60 * 60 * 1000,
      });

      //Stores all refresh tokens
      refreshTokenArray.push(req.cookies.refreshToken);

      // Sends the accessToken
      res.json({ message: "Login successful", token: accessToken });
    } else {
      res.status(403).send({ message: "Incorrect login!" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// A function that refreshes the access token using the refresh token
export const getNewToken = async (req, res) => {
  try {
    // Declares the refresh token
    const refreshToken = req.cookies.refreshToken;

    // Validates the refreshToken and sends a code 403 if criteria have not been met
    if (!refreshToken || !refreshTokenArray.includes(refreshToken)) {
      return res.sendStatus(403);
    }

    // Else generates a new access token if refreshToken is verified
    await jwt.verify(refreshToken, "refresh-secret", (err, payload) => {
      if (err) return res.sendStatus(403);

      // New token generated
      const newAccessToken = jwt.sign({ data: payload.data }, "access-secret", {
        algorithm: "HS256",
        expiresIn: "15m",
      });

      // Responds with new token
      res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    res.status(401).send({ err: "Bad JWT!" });
  }
};

// A function that clears all tokens and cookies
export const logout = async (req, res) => {
  // Clear the refresh token cookie by setting it with an expiration in the past
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  
  res.status(200)
}
