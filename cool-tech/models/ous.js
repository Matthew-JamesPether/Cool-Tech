// Imports the necessary file
import mongoose from "mongoose";

// Creates an object that helps interact with the database
const ousSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
});

// Exports the object schema
export default mongoose.model("Ous", ousSchema);
