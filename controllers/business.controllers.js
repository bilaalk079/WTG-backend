import Business from "../models/business.js";
import User from "../models/users.js";
import slugify from "slugify";
import mongoose from "mongoose";

// Public: Search businesses with filters + pagination
export const searchBusinesses = async (req, res) => {
     const { state, lga, town, category, page = 1, limit = 10 } = req.query;

     if (!state || !lga || !town || !category) {
          return res.status(400).json({
               success: false,
               message: "All fields (state, lga, town, category) are required for search",
          });
     }

     const filter = {
          state: new RegExp(`^${state}$`, "i"),
          lga: new RegExp(`^${lga}$`, "i"),
          town: new RegExp(`^${town}$`, "i"),
          categories: { $regex: new RegExp(`^${category}$`, "i") },
     };

     const skip = (parseInt(page) - 1) * parseInt(limit);

     try {
          const [results, total] = await Promise.all([
               Business.find(filter).skip(skip).limit(parseInt(limit)),
               Business.countDocuments(filter),
          ]);

          return res.status(200).json({
               success: true,
               currentPage: parseInt(page),
               totalPages: Math.ceil(total / limit),
               totalResults: total,
               results,
          });
     } catch (err) {
          console.error(err);
          return res.status(500).json({
               success: false,
               message: "Internal Server Error",
          });
     }
};
// Get personal business info public
export const getBusinessBySlug = async (req, res) => {
     const { slug } = req.params;

     try {
          const business = await Business.findOne({ slug }).select("-__v -owner -updatedAt");

          if (!business) {
               return res.status(404).json({
                    success: false,
                    message: "Business not found",
               });
          }

          return res.status(200).json({
               success: true,
               business,
          });
     } catch (err) {
          console.error(err);
          return res.status(500).json({
               success: false,
               message: "Internal Server Error",
          });
     }
};

// 🔐 Auth: Create a business (only if user doesn't have one)
export const createBusiness = async (req, res) => {
     const userID = req.user.id;

     const existing = await Business.findOne({ owner: userID });
     if (existing) {
          return res.status(400).json({
               success: false,
               message: "You already have a business listed",
          });
     }

     const { businessName, phone, categories, state, lga, town, address, store_type, description } =
          req.body;

     if (
          !businessName ||
          !phone ||
          !categories ||
          !state ||
          !lga ||
          !town ||
          !address ||
          !store_type
     ) {
          return res.status(400).json({
               success: false,
               message: "All required fields must be filled",
          });
     }

     const phoneRegex = /^\d{11}$/;
     if (!phoneRegex.test(phone)) {
          return res.status(400).json({
               success: false,
               message: "Phone number must be exactly 11 digits",
          });
     }

     if (!["physical", "online"].includes(store_type)) {
          return res.status(400).json({
               success: false,
               message: "Store type must be either 'physical' or 'online'",
          });
     }

     const slug = slugify(businessName, { lower: true, strict: true });

     try {
          const business = new Business({
               businessName,
               phone,
               categories,
               state,
               lga,
               town,
               address,
               store_type,
               description,
               owner: userID,
               slug,
          });

          await business.save();

          return res.status(201).json({
               success: true,
               message: "Business created successfully",
               business,
          });
     } catch (err) {
          console.error(err);
          if (err.code === 11000) {
               return res.status(400).json({
                    success: false,
                    message: "Business name or phone already exists",
               });
          }
          return res.status(500).json({
               success: false,
               message: "Internal Server Error",
          });
     }
};

//  Auth: Get your own business
export const getMyBusiness = async (req, res) => {
     const userID = req.user.id;
     console.log("userID from token:", userID);

     if (!userID) {
          return res.status(401).json({
               success: false,
               message: "Unauthorized: No user ID found in token",
          });
     }

     if (!mongoose.Types.ObjectId.isValid(userID)) {
          return res.status(400).json({
               success: false,
               message: "Invalid user ID format",
          });
     }

     try {
          const business = await Business.findOne({ owner: new mongoose.Types.ObjectId(userID) });

          if (!business) {
               return res.status(404).json({
                    success: false,
                    message: "You have not added a business yet",
               });
          }

          return res.status(200).json({
               success: true,
               business,
          });
     } catch (err) {
          console.error("getMyBusiness error:", err);
          return res.status(500).json({
               success: false,
               message: "Server Error",
          });
     }
};

//  Auth: Update your business
export const updateBusiness = async (req, res) => {
    const { slug } = req.params;
    const userID = req.user.id;

    try {
        // Find existing business by slug and owner to verify ownership and existence
        const existing = await Business.findOne({ owner: new mongoose.Types.ObjectId(userID) });
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "No business found to update or you're not authorized",
            });
        }

        const {
            businessName,
            phone,
            categories,
            state,
            lga,
            town,
            address,
            store_type,
            description,
        } = req.body;

        // Prepare update object
        const updateFields = {};

        if (businessName !== undefined) {
            updateFields.businessName = businessName;
        }
        if (phone !== undefined) {
            const phoneRegex = /^\d{11}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({
                    success: false,
                    message: "Phone number must be exactly 11 digits",
                });
            }
            updateFields.phone = phone;
        }
        if (categories !== undefined) {
            updateFields.categories = categories;
        }
        if (state !== undefined) {
            updateFields.state = state;
        }
        if (lga !== undefined) {
            updateFields.lga = lga;
        }
        if (town !== undefined) {
            updateFields.town = town;
        }
        if (address !== undefined) {
            updateFields.address = address;
        }
        if (store_type !== undefined) {
            if (!["physical", "online"].includes(store_type)) {
                return res.status(400).json({
                    success: false,
                    message: "Store type must be 'physical' or 'online'",
                });
            }
            updateFields.store_type = store_type;
        }
        if (description !== undefined) {
            updateFields.description = description;
        }

        // If businessName is updated, generate new slug
        if (businessName && businessName !== existing.businessName) {
            updateFields.slug = slugify(businessName, { lower: true, strict: true });
        }

        // If no fields provided to update
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided to update",
            });
        }

        // Perform update
        const updated = await Business.findOneAndUpdate(
            { owner: new mongoose.Types.ObjectId(userID) },
            updateFields,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Business updated successfully",
            business: updated,
        });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Business name or phone already exists",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const deleteAccount = async (req, res) => {
     try {
          await Business.findOneAndDelete({ owner: req.user.id });
          await User.findByIdAndDelete(req.user.id);

          return res.status(200).json({
               success: true,
               message: "Account and business deleted",
          });
     } catch (err) {
          console.error(err);
          return res.status(500).json({
               success: false,
               message: "Failed to delete account",
          });
     }
};
