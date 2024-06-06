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
const allowedOrigins = ['http://localhost:1234', 'https://derm-care-new-frtontend-iwvdrbblw-iaarav03s-projects.vercel.app','https://derm-care-new-frtontend.vercel.app'];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the request origin is in the list of allowed origins
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

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