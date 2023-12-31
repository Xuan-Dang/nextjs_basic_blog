import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: "/images/default-user-avatar.png",
    },
    expireAt: {
      type: Date,
      default: 1
    },
    verifyToken: String,
    verifyTokenExpiry: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date
  },
  { timestamps: true }
);
const User = mongoose.models.user || mongoose.model("user", userSchema);
export default User;
