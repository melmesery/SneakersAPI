import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      default: "Super Admin",
      enum: ["User", "Admin", "Super Admin"],
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.models.User || model("User", userSchema);
export default userModel;
