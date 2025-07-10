import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
     businessName: {
          type: String,
          required: true,
          unique: true,
          trim: true,
     },
     phone: {
          type: Number,
          required: true,
          unique: true,
          trim: true,
          match: [/^\d{11}$/, "Phone number must be between 10 and 15 digits"],
     },
     categories: {
          type: [String],
          enum: [
               "Groceries",
               "Fashion",
               "Beauty",
               "Essentials",
               "Furniture",
               "Academic",
               "Gadgets",
               "Food",
               "Health",
          ],
          default: [],
     },
     owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
     state: { type: String, required: true },
     store_type: { type: String, required: true, enum: ["physical", "online"] },
     address: { type: String, required: true },
     lga: { type: String, required: true },
     town: { type: String, required: true },
     slug: { type: String, unique: true , required:true},
     description: { type: String, maxlength: 500 },
}, {timestamps: true});

const Business = mongoose.model("Business", businessSchema);
export default Business
