// Imports the necessary files
import express from "express";
import {
  addRepo,
  getRepo,
  updateRepo,
  getRepoData,
  getUsers,
  getUser,
  updateUser,
} from "../controllers/privateController.js";
import jwt from "jsonwebtoken";

// Use built-in Express router
const router = express.Router();

// A function that verifies the token and te type of user
const verifyToken = (req, res, next) => {
  // Declares the token
  const token = req.headers.authorization?.split(" ")[1];

  // Returns a message if no token was found
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Decodes token and checks which user is using the selected path
  try {
    // Declares variables
    const decoded = jwt.verify(token, "jwt-secret");
    const path = req.route.path;

    // Returns a response message if the user is not a management or admin
    if (path === "/get-repo/:id" || path === "/update-repo") {
      if (decoded.role !== "management" && decoded.role !== "admin") {
        return res
          .status(403)
          .send("You do not have permission to access this resource.");
      }
    }

    // Returns a response message if the user is not a admin
    if (
      path === "/get-users" ||
      path === "/get-user/:id" ||
      path === "/update-user"
    ) {
      if (decoded.role !== "admin") {
        return res
          .status(403)
          .send("You do not have permission to access this resource.");
      }
    }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Declares routes to interact with the database
router.post("/add-repo", verifyToken, addRepo);
router.get("/get-repo-data", verifyToken, getRepoData);
router.get("/get-repo/:id", verifyToken, getRepo);
router.put("/update-repo", verifyToken, updateRepo);
router.get("/get-users", verifyToken, getUsers);
router.get("/get-user/:id", verifyToken, getUser);
router.put("/update-user", verifyToken, updateUser);

// Exports router
export default router;
