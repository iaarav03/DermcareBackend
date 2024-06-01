import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = async (req, res, next) => {
  const { firstName, lastName, email, phone, dob, gender, password } = req.body;
  try {
    if (!firstName || !lastName || !email || !phone ||  !dob || !gender || !password) {
      return res.status(400).json({ message: "Failed: Please fill out all fields" });
    }

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return res.status(400).json({ message: "Failed: User is already registered" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      
      dob,
      gender,
      password,
      role: "Patient",
    });

    generateToken(user, "User Registered!", 200, res);
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error in patient registration:", error);
    return res.status(500).json({ message: "Failed: Internal Server Error" });
  }
};


export const login = async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;
  if (!email || !password || !confirmPassword || !role) {
    return res.status(400).json({ message: "Failed: Please fill out all fields" });
  }
  if (password !== confirmPassword) {
   return res.status(400).json({ message: "Failed: Password dont match" });
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({ message: "Failed: User not found" });
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
   return  res.status(400).json({ message: "Failed: Password wrong" });
  }
  if (role !== user.role) {
    return  res.status(400).json({ message: "Failed: Access denied" });
  }
  generateToken(user, "Login Successfully!", 201, res);
};



export const addNewAdmin= async (req, res, next) => {
  const { firstName, lastName, email, phone, dob, gender, password } = req.body;
  try {
    if (!firstName || !lastName || !email || !phone ||  !dob || !gender || !password) {
      return res.status(400).json({ message: "Failed: Please fill out all fields" });
    }

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return res.status(400).json({ message: "Failed: Patient have same email already registered" });
    }

    const admin = await User.create({
      firstName,
      lastName,
      email,
      phone,
      
      dob,
      gender,
      password,
      role: "Admin",
    });
    return  res.status(200).json({
      success: true,
      message: "New Admin Registered",
      admin,
    });
    
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error in patient registration:", error);
    return res.status(500).json({ message: "Failed: Internal Server Error" });
  }
};


export const getAllDoctors = async (req, res, next) => {
  try {
   
    const doctors = await User.find({ role: "Doctor" });
    res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error("Error in getAllDoctors:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const logoutAdmin = async (req, res, next) => {
  try {
    res
      .status(201)
      .cookie("adminToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Admin Logged Out Successfully.",
      });
  } catch (error) {
    console.error("Error in logoutAdmin:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const logoutPatient = async (req, res, next) => {
  try {
    res
      .status(201)
      .cookie("patientToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Patient Logged Out Successfully.",
      });
  } catch (error) {
    console.error("Error in logoutAdmin:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const addNewDoctor = async (req, res, next) => {
  try {
   
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(404).json({ message: "Doctor Avatar Required!" });
    }

    const { docAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
      return res.status(402).json({ message: "File Format Not Supported!" });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
    
      dob,
      gender,
      password,
      doctorDepartment,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !dob ||
      !gender ||
      !password ||
      !doctorDepartment ||
      !docAvatar
    ) {
      return res.status(400).json({ message: "Please Fill Full Form!" });
    }

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return res
        .status(201)
        .json({ message: "Doctor With This Email Already Exists!" });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      docAvatar.tempFilePath
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      return res
        .status(401)
        .json({ message: "Failed To Upload Doctor Avatar To Cloudinary" });
    }

    const doctor = await User.create({
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      password,
      role: "Doctor",
      doctorDepartment,
      docAvatar: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    res.status(200).json({
      success: true,
      message: "New Doctor Registered",
      doctor,
    });
  } catch (error) {
    console.error("Error in addNewDoctor:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};