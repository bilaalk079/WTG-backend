import mongoose from "mongoose";
const Users = new mongoose.Schema({
     email: {
          type: String,
          required: true,
          unique: true,
          trim: true,
          match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
          lowercase: true,
     },
     password: {
          type: String,
          required: true,
     },
}, {timestamps: true});
const User = mongoose.model("User", Users);
export default User
