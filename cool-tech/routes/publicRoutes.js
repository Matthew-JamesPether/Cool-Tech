//Imports the necessary files
import express from "express";
import {
  createUser,
  verifyUser,
  getRegisterInfo,
  getResources,
} from "../controllers/publicController.js";

// Use built-in Express router
const router = express.Router();

// Declares routes to interact with the database
router.post("/login", verifyUser);
router.get("/register", getRegisterInfo);
router.post("/register", createUser);
router.get("/resources", getResources);

// Exports router
export default router;
