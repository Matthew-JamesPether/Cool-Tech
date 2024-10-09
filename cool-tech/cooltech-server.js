// Imports the necessary files
import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import publicRouter from "./routes/publicRoutes.js";
import privateRouter from "./routes/privateRoutes.js";
import cors from "cors";

// Declares global variables
const app = express();
const PORT = 8080;
const uri = `mongodb+srv://mongo:${process.env.db_KEY}@cluster0.ymsfh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Uses the specific functions
app.use(express.json());
app.use(cors());
mongoose.Promise = global.Promise;

// Connects to the database
mongoose.connect(uri);

// Checks if there is a connection
mongoose.connection.on("error", function (error) {
  console.log("Connection to Mongo established.");
  console.log(error.message);
  console.log("Could not connect to the database. Exiting now...");
  process.exit();
});

// Displays a message if connection was successful
mongoose.connection.once("open", function () {
  console.log("Successfully connected to the database");
});

// Set up routes to be handled from: http://localhost:8080/cool-tech
app.use("/cool-tech", publicRouter);
app.use("/cool-tech/auth", privateRouter);

// Server is listening to the port
app.listen(PORT, () => console.log("Listening engaged"));