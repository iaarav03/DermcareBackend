import express from "express";
import { config } from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/dbconnection.js";
import userRouter from "./router/userRouter.js";
import messageRouter from "./router/messageRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";

const app=express();
config({path: "./config/config.env"});
app.use(
  cors({
    origin: true, // Allow requests from any origin
    methods: ["GET", "POST", "DELETE", "PUT"], // Allow specific HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/v1/message", messageRouter);
   app.use("/api/v1/user", userRouter);
   app.use("/api/v1/appointment", appointmentRouter);
 dbConnection();
  

export default app;