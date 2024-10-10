//Imports the necessary files
import express from "express";
import {
  createUser,
  verifyUser,
  getRegisterInfo,
  getNewToken,
  logout,
} from "../controllers/publicController.js";

// Use built-in Express router
const router = express.Router();

// Declares routes to interact with the database
router.post("/login", verifyUser);
router.get("/register", getRegisterInfo);
router.post("/register", createUser);
router.post("/token", getNewToken);
router.post("/logout", logout);

// Exports router
export default router;
