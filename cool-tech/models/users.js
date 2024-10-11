// Imports the necessary file
import mongoose from "mongoose";

// Creates a schema for ouDivisions
const ouDivisionSchema = new mongoose.Schema({
  ouId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ous", // Reference to the OU model
    required: true,
  },
  divisionIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division", // Reference to the Division model
      required: true,
    },
  ],
});

// Custom validation for the divisionIds array
ouDivisionSchema.path('divisionIds').validate(function(value) {
  return value.length > 0; // Ensures the array is not empty
}, 'Please select at least one division for each Organization Unit');

// Creates an object that helps interact with the database
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  ouDivisions: [ouDivisionSchema],
  role: {
    type: String,
    enum: ["normal", "management", "admin"],
    default: "normal",
  },
});

// Exports the object schema
export default mongoose.model("User", userSchema);
