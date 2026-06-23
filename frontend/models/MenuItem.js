import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ["snacks", "beverages", "meals"], required: true },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    isTrending: { type: Boolean, default: false },
    preparationTime: { type: Number, required: true, default: 5 }, // in minutes
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.MenuItem || mongoose.model("MenuItem", MenuItemSchema);
