import connectDB from "@/lib/db";
import User from "@/models/User";
import MenuItem from "@/models/MenuItem";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    // Don't re-seed if data already exists
    const existingItems = await MenuItem.countDocuments();
    if (existingItems > 0) {
      return NextResponse.json({ message: "Already seeded — skipping." }, { status: 200 });
    }

    // 1. Ensure users exist
    let customer = await User.findOne({ username: "jane" });
    if (!customer) {
      customer = await User.create({
        name: "Jane Student", username: "jane",
        password: "password123", role: "customer", rewardPoints: 120,
      });
    }

    // 2. Seed Menu Items
    const menuData = [
      { name: "Classic Samosa",             category: "snacks",    price: 15,  inStock: true,  isTrending: true,  preparationTime: 2,  image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80" },
      { name: "Veg Grilled Sandwich",        category: "snacks",    price: 50,  inStock: true,  isTrending: false, preparationTime: 5,  image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&q=80" },
      { name: "Masala French Fries",         category: "snacks",    price: 40,  inStock: false, isTrending: false, preparationTime: 7,  image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&q=80" },
      { name: "Cold Coffee",                 category: "beverages", price: 40,  inStock: true,  isTrending: true,  preparationTime: 3,  image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&q=80" },
      { name: "Masala Chai",                 category: "beverages", price: 10,  inStock: true,  isTrending: false, preparationTime: 2,  image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=500&q=80" },
      { name: "Fresh Lime Soda",             category: "beverages", price: 25,  inStock: true,  isTrending: false, preparationTime: 2,  image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80" },
      { name: "Paneer Butter Masala Combo",  category: "meals",     price: 120, inStock: true,  isTrending: true,  preparationTime: 12, image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&q=80" },
      { name: "Veg Biryani",                 category: "meals",     price: 90,  inStock: true,  isTrending: false, preparationTime: 10, image: "https://images.unsplash.com/photo-1563379091339-03b11adbc936?w=800&q=80" },
      { name: "Dal Makhani + Roti",          category: "meals",     price: 80,  inStock: true,  isTrending: false, preparationTime: 8,  image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80" },
    ];

    const menuItems = await MenuItem.insertMany(menuData);

    // 3. Seed realistic-looking orders
    const orderTemplates = [
      { items: [{ menuItem: menuItems[0]._id, quantity: 2 }, { menuItem: menuItems[3]._id, quantity: 1 }], status: "Preparing", tokenNumber: "T-100", totalAmount: 70  },
      { items: [{ menuItem: menuItems[6]._id, quantity: 1 }],                                               status: "Ready",     tokenNumber: "T-101", totalAmount: 120 },
      { items: [{ menuItem: menuItems[7]._id, quantity: 1 }, { menuItem: menuItems[4]._id, quantity: 2 }], status: "Completed", tokenNumber: "T-099", totalAmount: 110 },
      { items: [{ menuItem: menuItems[1]._id, quantity: 1 }, { menuItem: menuItems[5]._id, quantity: 1 }], status: "Pending",   tokenNumber: "T-102", totalAmount: 75  },
    ];

    await Promise.all(
      orderTemplates.map((o) => Order.create({ ...o, user: customer._id }))
    );

    return NextResponse.json({ message: "✅ Seed complete! Menu items and orders created." }, { status: 200 });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
