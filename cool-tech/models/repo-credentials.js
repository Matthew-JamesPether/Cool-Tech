// Imports the necessary file
import mongoose from "mongoose";

// Creates an object that helps interact with the database
const repoSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  ousId: {
    type: String,
    required: true,
  },
  divisionId: {
    type: String,
    required: true,
  },
  placed: {
    type: String,
    require: true,
  },
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
});

// Exports the object schema
export default mongoose.model("Repo-credentials", repoSchema);
