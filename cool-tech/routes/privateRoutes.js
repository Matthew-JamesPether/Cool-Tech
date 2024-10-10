// Imports the necessary files
import express from "express";
import {verifyToken} from "../middleware/authenticate.js"
import {
  getResources,
  addRepo,
  getRepo,
  updateRepo,
  getRepoData,
  getUsers,
  getUser,
  updateUser,
} from "../controllers/privateController.js";;

// Use built-in Express router
const router = express.Router();

// Declares routes to interact with the database
router.get("/resources",verifyToken, getResources);
router.post("/add-repo", verifyToken, addRepo);
router.get("/get-repo-data", verifyToken, getRepoData);
router.get("/get-repo/:id", verifyToken, getRepo);
router.put("/update-repo", verifyToken, updateRepo);
router.get("/get-users", verifyToken, getUsers);
router.get("/get-user/:id", verifyToken, getUser);
router.put("/update-user", verifyToken, updateUser);

// Exports router
export default router;
