import { User } from "../models/userSchema.js";
import jwt from "jsonwebtoken";

// Middleware to authenticate dashboard users
export const isAdminAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (!req.user || req.user.role !== "Admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  } catch (error) {
    console.error("Error in isAdminAuthenticated middleware:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const isPatientAuthenticated = async (req, res, next) => {
  
  try {
    const token = req.cookies.patientToken;
    
    if (!token) {
     
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    
    if (!req.user || req.user.role !== "Patient") {
      
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  } catch (error) {
    console.error("Error in isAdminAuthenticated middleware:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
