import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";

// Demo users — seeded automatically if DB is empty
const DEMO_USERS = [
  { name: "Admin User",    username: "admin", password: "password123", role: "admin"    },
  { name: "Kitchen Staff", username: "staff", password: "password123", role: "staff"    },
  { name: "Jane Student",  username: "jane",  password: "password123", role: "customer", rewardPoints: 120 },
];

async function ensureDemoUsers() {
  const count = await User.countDocuments();
  if (count === 0) {
    await User.insertMany(DEMO_USERS);
    console.log("✅ Demo users seeded automatically.");
  }
}

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        await ensureDemoUsers();

        const { username, password } = credentials;
        console.log(`🔐 Login attempt: ${username}`);
        
        const user = await User.findOne({ username: username.toLowerCase() }); // Case-insensitive check

        if (!user) {
          console.log(`❌ User not found: ${username}`);
          throw new Error("Invalid username or password");
        }

        if (password !== user.password) {
          console.log(`❌ Password mismatch for: ${username}`);
          throw new Error("Invalid username or password");
        }

        console.log(`✅ Login successful: ${username}`);

        return {
          id:       user._id.toString(),
          name:     user.name,
          username: user.username,
          role:     user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id       = user.id;
        token.role     = user.role;
        token.rewardPoints = user.rewardPoints ?? 0;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id       = token.id;
        session.user.username = token.username;
        session.user.role     = token.role;
        session.user.rewardPoints = token.rewardPoints;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages:   { signIn: "/login" },
  // MUST match NEXTAUTH_SECRET in .env.local — never change this at runtime
  secret: "nexgen-canteen-super-secret-key-2024",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
