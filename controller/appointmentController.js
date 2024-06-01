
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      appointment_date,
      department,
      doctor_firstName,
      doctor_lastName,
      address,
    } = req.body;
  
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !dob ||
      !gender ||
      !appointment_date ||
      !department ||
      !doctor_firstName ||
      !doctor_lastName ||
      !address
    ) {
      return res.status(400).json({ message: "Please Fill Full Form!" });
    }
  
    const isConflict = await User.find({
      firstName: doctor_firstName,
      lastName: doctor_lastName,
      role: "Doctor",
      doctorDepartment: department,
    });
  
    if (isConflict.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }
  
   
  
    const doctorId = isConflict[0]._id;
    const patientId = req.user._id;
  
    const appointment = await Appointment.create({
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      appointment_date,
      department,
      doctor: {
        firstName: doctor_firstName,
        lastName: doctor_lastName,
      },
      hasVisited:"false",
      address,
      doctorId,
      patientId,
    });
  
    res.status(200).json({
      success: true,
      appointment,
      message: "Appointment Sent!",
    });
  } catch (error) {
    console.error("Error in postAppointment:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Error in getAllAppointments:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found!" });
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
    });
  } catch (error) {
    console.error("Error in updateAppointmentStatus:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment Not Found!" });
    }
    await appointment.deleteOne();
    res.status(200).json({
      success: true,
      message: "Appointment Deleted!",
    });
  } catch (error) {
    console.error("Error in deleteAppointment:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const patientAppointment = async (req, res, next) => {
  try {
   
    const patientId = req.user._id;
   
    const appointments = await Appointment.find({ patientId });

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No appointments found for this patient.",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointments found for this patient.",
      data: appointments,
    });
  } catch (error) {
    console.error("Error in patientAppointment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
