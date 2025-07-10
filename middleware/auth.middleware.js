import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const authenticate = (req, res, next) => {
     const authHeader = req.headers.authorization;

     if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res
               .status(401)
               .json({ success: false, message: "Access token missing or invalid" });
     }
     const token = authHeader.split(" ")[1];

     try {
          const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
          req.user = decoded;
          next();
     } catch (err) {
          console.error("Error: ", err);
          return res.status(403).json({ success: false, message: "Token is Invalid or expired" });
     }
};
