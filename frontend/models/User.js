import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, enum: ["customer", "staff", "admin"], default: "customer" },
    rewardPoints: { type: Number, default: 0 },
    // Simplified auth for demo
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
