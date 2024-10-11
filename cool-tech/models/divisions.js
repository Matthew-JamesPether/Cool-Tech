// Imports the necessary file
import mongoose from "mongoose";

// Creates an object that helps interact with the database
const divisionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
});

// Exports the object schema
export default mongoose.model("Division", divisionSchema);
