import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/connectDB.js";
import corsOption from "./config/corsOptions.js";
import cors from "cors";
import userRouter from "./routes/auth.routes.js";
import businessRouter from "./routes/business.routes.js";
const app = express();
//middleware
dotenv.config();
app.use(cors(corsOption));
app.use(cookieParser()); 
app.use(express.json());
//routes
app.use("/api/auth", userRouter);
app.use("/api/business", businessRouter);

const PORT = process.env.PORT;
app.listen(PORT, async () => {
     try {
          await connectDB();
          console.log(`Server started successfully on PORT: ${PORT}`);
     } catch (err) {
          console.error("Server failed to start: ", err);
     }
});
