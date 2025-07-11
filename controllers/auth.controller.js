import User from "../models/users.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../utils/methods.js";

dotenv.config();

export const SignUp = async (req, res) => {
     const user = req.body;
     if (!user.email || !user.password) {
          return res.status(400).json({ success: false, message: "  All fields are required" });
     }

     const existingEmail = await User.findOne({ email: user.email });
     if (existingEmail) {
          res.status(400).json({ success: false, message: "Email already exists" });
     }
     const emailRegex = /^\S+@\S+\.\S+$/;
     if (!emailRegex.test(user.email)) {
          return res.status(400).json({ success: false, message: "Invalid Email Format" });
     }
     try {
          const hashedPassword = await hashPassword(user.password);
          const newUser = new User({
               email: user.email,
               password: hashedPassword,
          });

          await newUser.save();
          return res
               .status(201)
               .json({ success: true, message: "User Account Created, Pls Login" });
     } catch (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: "Internal Server Error" });
     }
};

export const Login = async (req, res) => {
     const userInfo = req.body;
     if (!userInfo.email || !userInfo.password) {
          return res.status(400).json({ success: false, message: "Pls fill in your credentials" });
     }

     try {
          const user = await User.findOne({ email: userInfo.email });
          if (!user) {
               return res
                    .status(400)
                    .json({ success: false, message: "Wrong Email: User not found" });
          }
          const isMatchPassword = await verifyPassword(user.password, userInfo.password);
          if (!isMatchPassword) {
               return res.status(400).json({ success: false, message: "Wrong Password" });
          }
          const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, {
               expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
          });
          const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
               expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
          });
          res.cookie("refreshToken", refreshToken, {
               httpOnly: true,
               secure: false,
               sameSite: "None",
               maxAge: 30 * 24 * 60 * 60 * 1000,
          });
          return res.status(200).json({
               success: true,
               message: "You have been Logged In successfully",
               accessToken,
               user: {
                    id: user._id,
                    email: user.email,
               },
          });
     } catch (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: "Internal Server Error" });
     }
};

export const refreshToken = async (req, res) => {
     const refreshToken = req.cookies.refreshToken;
     if (!refreshToken) {
          return res.status(401).json({ success: false, message: "Refresh token missing" });
     }
     try {
          const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

          const accessToken = jwt.sign({ userID: decoded.userID }, process.env.JWT_ACCESS_SECRET, {
               expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
          });

          return res.status(200).json({ success: true, accessToken });
     } catch (err) {
          console.error("Error: ", err);
          return res
               .status(403)
               .json({ success: false, message: "Invalid or expired Refresh token" });
     }
};

export const logOut = (req, res) => {
     res.clearCookie("refreshToken", {
          httpOnly: true,
          sameSite: "Lax",
     });

     res.status(200).json({ success: true, message: "You've been logged out successfully" });
};
