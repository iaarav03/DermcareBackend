import express from "express"
const router=express.Router();
import { getAllMessages, sendMessage } from "../controller/messageController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

router.post("/send",sendMessage);
router.get("/getall", isAdminAuthenticated, getAllMessages);

export default router;