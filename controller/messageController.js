import { Message } from "../models/messageSchema.js";

export const sendMessage = async (req, res, next) => {
  const { firstName, lastName, email, phone, message } = req.body;
  try {
    // Check if all required fields are present
    if (!firstName || !lastName || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Create message
    await Message.create({ firstName, lastName, email, phone, message });

    // Send success response
    res.status(200).json({
      success: true,
      message: "Message Sent!",
    });
  } catch (error) {
    // Handle any errors
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

export const getAllMessages = async (req, res, next) => {
  const messages = await Message.find();
  res.status(200).json({
    success: true,
    messages,
  });
};
