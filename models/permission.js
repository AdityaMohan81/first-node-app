import mongoose from "mongoose";

/**
 * Define the permission schema
 */
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    display_name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Permission = mongoose.model("Permission", userSchema);

export default Permission;
