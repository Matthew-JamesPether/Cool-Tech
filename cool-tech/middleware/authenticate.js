// Imports the necessary files
import jwt from "jsonwebtoken";

// A function that verifies the token and te type of user
export const verifyToken = (req, res, next) => {
  // Declares the token
  const token = req.headers.authorization?.split(" ")[1];

  // Returns a message if no token was found
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Decodes token and checks which user is using the selected path
  try {
    // Declares variables
    const decoded = jwt.verify(token, "access-secret").data;
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

    // Sends the decoded token as a request
    req.decoded = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
