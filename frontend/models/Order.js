import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // optional for guest checkout if needed
    items: [OrderItemSchema],
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Ready", "Completed"],
      default: "Pending",
    },
    tokenNumber: { type: String, required: true, unique: true },
    totalAmount: { type: Number, required: true },
    scheduledPickupTime: { type: Date, required: false }, // for Pre-Order scheduling
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
