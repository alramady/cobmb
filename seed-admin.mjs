import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

async function seedAdmin() {
  // Read credentials from environment variables — never hardcode
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_FULL_NAME || "Admin";
  const email = process.env.ADMIN_EMAIL || "";
  const mobile = process.env.ADMIN_MOBILE || "";
  const displayName = process.env.ADMIN_DISPLAY_NAME || "Admin";
  const role = "root";

  if (!username || !password) {
    console.error("❌ Error: ADMIN_USERNAME and ADMIN_PASSWORD environment variables are required.");
    console.error("   Set them in your .env file or pass them inline:");
    console.error("   ADMIN_USERNAME=myuser ADMIN_PASSWORD=mypass node seed-admin.mjs");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌ Error: ADMIN_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  const passwordHash = await bcrypt.hash(password, 12);

  // Check if admin already exists
  const [existing] = await conn.execute("SELECT id FROM admin_users WHERE username = ?", [username]);
  if (existing.length > 0) {
    // Update existing admin
    await conn.execute(
      "UPDATE admin_users SET passwordHash = ?, fullName = ?, email = ?, mobile = ?, displayName = ?, adminRole = ?, isActive = 1 WHERE username = ?",
      [passwordHash, fullName, email, mobile, displayName, role, username]
    );
    console.log("✅ Root admin updated:", username);
  } else {
    // Insert new admin
    await conn.execute(
      "INSERT INTO admin_users (username, passwordHash, fullName, email, mobile, displayName, adminRole, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, 1)",
      [username, passwordHash, fullName, email, mobile, displayName, role]
    );
    console.log("✅ Root admin created:", username);
  }

  await conn.end();
  console.log("Done!");
}

seedAdmin().catch(console.error);
