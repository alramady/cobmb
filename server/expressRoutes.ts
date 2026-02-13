import { Express } from "express";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import { nanoid } from "nanoid";
import { authenticateAdmin, createAdminSessionToken, verifyAdminSession, parseCookies, ADMIN_COOKIE_NAME } from "./adminAuth";
import { hashPassword as hashClientPassword, verifyPassword as verifyClientPassword, createClientSessionToken, verifyClientSession, CLIENT_COOKIE_NAME } from "./clientAuth";
import * as db from "./db";
import { storagePut } from "./storage";

export function registerExpressRoutes(app: Express) {
  // ─── Rate Limiting ─────────────────────────────────────────────
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many login attempts. Please try again in 15 minutes." },
  });

  const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many password reset requests. Please try again in 15 minutes." },
  });

  // ─── Admin Local Auth Routes ─────────────────────────────────────
  app.post("/api/admin/login", loginLimiter, async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      const admin = await authenticateAdmin(username, password);
      if (!admin) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      const token = await createAdminSessionToken(admin);
      const isSecure = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https";
      res.cookie(ADMIN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "none",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      return res.json({
        success: true,
        admin: {
          id: admin.id,
          username: admin.username,
          fullName: admin.fullName,
          displayName: admin.displayName || admin.fullName,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (error) {
      console.error("[Admin Login] Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    const isSecure = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https";
    res.clearCookie(ADMIN_COOKIE_NAME, {
      httpOnly: true,
      secure: isSecure,
      sameSite: "none",
      path: "/",
      maxAge: -1,
    });
    return res.json({ success: true });
  });

  app.get("/api/admin/me", async (req, res) => {
    try {
      const cookies = parseCookies(req.headers.cookie);
      const session = await verifyAdminSession(cookies.get(ADMIN_COOKIE_NAME));
      if (!session) {
        return res.json({ admin: null });
      }
      const admin = await db.getAdminById(session.adminId);
      if (!admin || !admin.isActive) {
        return res.json({ admin: null });
      }
      return res.json({
        admin: {
          id: admin.id,
          username: admin.username,
          fullName: admin.fullName,
          displayName: admin.displayName || admin.fullName,
          email: admin.email,
          mobile: admin.mobile,
          role: admin.role,
        },
      });
    } catch (error) {
      console.error("[Admin Me] Error:", error);
      return res.json({ admin: null });
    }
  });

  // ─── Client Local Auth Routes ───────────────────────────────
  app.post("/api/client/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone, role, company, preferredLanguage } = req.body;
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: "Email, password, first name, and last name are required" });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email address" });
      }
      const existing = await db.getClientByEmail(email);
      if (existing) {
        return res.status(409).json({ error: "An account with this email already exists" });
      }
      const passwordHash = await hashClientPassword(password);
      const clientRole = role === "owner" ? "owner" : "guest";
      await db.createClientUser({
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        phone: phone || null,
        role: clientRole,
        company: company || null,
        preferredLanguage: preferredLanguage || "ar",
      });
      const client = await db.getClientByEmail(email);
      if (!client) {
        return res.status(500).json({ error: "Registration failed" });
      }
      const token = await createClientSessionToken(client);
      const isSecure = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https";
      res.cookie(CLIENT_COOKIE_NAME, token, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "none",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
      return res.json({
        success: true,
        client: {
          id: client.id,
          email: client.email,
          firstName: client.firstName,
          lastName: client.lastName,
          phone: client.phone,
          avatar: client.avatar,
          role: client.role,
          company: client.company,
        },
      });
    } catch (error) {
      console.error("[Client Register] Error:", error);
      return res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/client/login", loginLimiter, async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      const client = await db.getClientByEmail(email);
      if (!client) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      if (!client.isActive) {
        return res.status(403).json({ error: "Account is deactivated. Please contact support." });
      }
      const valid = await verifyClientPassword(password, client.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      await db.updateClientLastLogin(client.id);
      const token = await createClientSessionToken(client);
      const isSecure = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https";
      res.cookie(CLIENT_COOKIE_NAME, token, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "none",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
      return res.json({
        success: true,
        client: {
          id: client.id,
          email: client.email,
          firstName: client.firstName,
          lastName: client.lastName,
          phone: client.phone,
          avatar: client.avatar,
          role: client.role,
          company: client.company,
        },
      });
    } catch (error) {
      console.error("[Client Login] Error:", error);
      return res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/client/logout", (req, res) => {
    const isSecure = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https";
    res.clearCookie(CLIENT_COOKIE_NAME, {
      httpOnly: true,
      secure: isSecure,
      sameSite: "none",
      path: "/",
      maxAge: -1,
    });
    return res.json({ success: true });
  });

  app.get("/api/client/me", async (req, res) => {
    try {
      const cookies = parseCookies(req.headers.cookie);
      const session = await verifyClientSession(cookies.get(CLIENT_COOKIE_NAME));
      if (!session) {
        return res.json({ client: null });
      }
      const client = await db.getClientById(session.clientId);
      if (!client || !client.isActive) {
        return res.json({ client: null });
      }
      return res.json({
        client: {
          id: client.id,
          email: client.email,
          firstName: client.firstName,
          lastName: client.lastName,
          phone: client.phone,
          avatar: client.avatar,
          role: client.role,
          company: client.company,
          bio: client.bio,
          preferredLanguage: client.preferredLanguage,
          emailVerified: client.emailVerified,
          createdAt: client.createdAt,
        },
      });
    } catch (error) {
      console.error("[Client Me] Error:", error);
      return res.json({ client: null });
    }
  });

  app.put("/api/client/profile", async (req, res) => {
    try {
      const cookies = parseCookies(req.headers.cookie);
      const session = await verifyClientSession(cookies.get(CLIENT_COOKIE_NAME));
      if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const { firstName, lastName, phone, company, bio, preferredLanguage } = req.body;
      const updates: Record<string, unknown> = {};
      if (firstName !== undefined) updates.firstName = firstName;
      if (lastName !== undefined) updates.lastName = lastName;
      if (phone !== undefined) updates.phone = phone;
      if (company !== undefined) updates.company = company;
      if (bio !== undefined) updates.bio = bio;
      if (preferredLanguage !== undefined) updates.preferredLanguage = preferredLanguage;
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }
      await db.updateClientUser(session.clientId, updates as any);
      const updated = await db.getClientById(session.clientId);
      return res.json({
        success: true,
        client: updated ? {
          id: updated.id,
          email: updated.email,
          firstName: updated.firstName,
          lastName: updated.lastName,
          phone: updated.phone,
          avatar: updated.avatar,
          role: updated.role,
          company: updated.company,
          bio: updated.bio,
          preferredLanguage: updated.preferredLanguage,
        } : null,
      });
    } catch (error) {
      console.error("[Client Profile Update] Error:", error);
      return res.status(500).json({ error: "Profile update failed" });
    }
  });

  app.put("/api/client/password", async (req, res) => {
    try {
      const cookies = parseCookies(req.headers.cookie);
      const session = await verifyClientSession(cookies.get(CLIENT_COOKIE_NAME));
      if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current and new password are required" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters" });
      }
      const client = await db.getClientById(session.clientId);
      if (!client) {
        return res.status(404).json({ error: "User not found" });
      }
      const valid = await verifyClientPassword(currentPassword, client.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      const newHash = await hashClientPassword(newPassword);
      await db.updateClientUser(session.clientId, { passwordHash: newHash });
      return res.json({ success: true });
    } catch (error) {
      console.error("[Client Password Change] Error:", error);
      return res.status(500).json({ error: "Password change failed" });
    }
  });

  // ─── Forgot Password / Reset Password Routes ──────────────────
  app.post("/api/client/forgot-password", forgotPasswordLimiter, async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email address" });
      }
      const client = await db.getClientByEmail(email);
      if (client && client.isActive) {
        const token = crypto.randomBytes(48).toString("hex");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
        await db.createPasswordResetToken({
          clientId: client.id,
          token,
          expiresAt,
        });
        const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, "") || `${req.protocol}://${req.headers.host}`;
        const resetLink = `${origin}/reset-password/${token}`;
        console.log(`[Password Reset] Link for ${email}: ${resetLink}`);
        try {
          const { notifyOwner } = await import("./_core/notification");
          await notifyOwner({
            title: `Password Reset Request - ${email}`,
            content: `A password reset was requested for ${client.firstName} ${client.lastName} (${email}).\n\nReset link: ${resetLink}\n\nThis link expires in 1 hour.`,
          });
        } catch (notifyErr) {
          console.warn("[Password Reset] Notification failed:", notifyErr);
        }
      }
      return res.json({
        success: true,
        message: "If an account with that email exists, a password reset link has been generated.",
      });
    } catch (error) {
      console.error("[Forgot Password] Error:", error);
      return res.status(500).json({ error: "Failed to process request" });
    }
  });

  app.get("/api/client/verify-reset-token/:token", async (req, res) => {
    try {
      const { token } = req.params;
      if (!token) {
        return res.status(400).json({ valid: false, error: "Token is required" });
      }
      const resetToken = await db.getPasswordResetToken(token);
      if (!resetToken) {
        return res.json({ valid: false, error: "Invalid or expired token" });
      }
      if (resetToken.usedAt) {
        return res.json({ valid: false, error: "This reset link has already been used" });
      }
      if (new Date() > resetToken.expiresAt) {
        return res.json({ valid: false, error: "This reset link has expired" });
      }
      const client = await db.getClientById(resetToken.clientId);
      return res.json({
        valid: true,
        email: client?.email || "",
      });
    } catch (error) {
      console.error("[Verify Reset Token] Error:", error);
      return res.status(500).json({ valid: false, error: "Verification failed" });
    }
  });

  app.post("/api/client/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and new password are required" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }
      const resetToken = await db.getPasswordResetToken(token);
      if (!resetToken) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }
      if (resetToken.usedAt) {
        return res.status(400).json({ error: "This reset link has already been used" });
      }
      if (new Date() > resetToken.expiresAt) {
        return res.status(400).json({ error: "This reset link has expired" });
      }
      const client = await db.getClientById(resetToken.clientId);
      if (!client || !client.isActive) {
        return res.status(400).json({ error: "Account not found or deactivated" });
      }
      const newHash = await hashClientPassword(newPassword);
      await db.updateClientUser(resetToken.clientId, { passwordHash: newHash });
      await db.markPasswordResetTokenUsed(resetToken.id);
      return res.json({ success: true, message: "Password has been reset successfully" });
    } catch (error) {
      console.error("[Reset Password] Error:", error);
      return res.status(500).json({ error: "Password reset failed" });
    }
  });

  // ─── Client Image Upload Route ──────────────────────────────
  app.post("/api/client/upload-avatar", async (req, res) => {
    try {
      const cookies = parseCookies(req.headers.cookie);
      const session = await verifyClientSession(cookies.get(CLIENT_COOKIE_NAME));
      if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const { file, filename, contentType } = req.body;
      if (!file || !filename || !contentType) {
        return res.status(400).json({ error: "Missing file, filename, or contentType" });
      }
      const buffer = Buffer.from(file, "base64");
      if (buffer.length > 5 * 1024 * 1024) {
        return res.status(400).json({ error: "File too large. Maximum 5MB." });
      }
      const ext = filename.split(".").pop() || "jpg";
      const uniqueKey = `cobnb/avatars/${session.clientId}-${nanoid(8)}.${ext}`;
      const { url } = await storagePut(uniqueKey, buffer, contentType);
      await db.updateClientUser(session.clientId, { avatar: url });
      return res.json({ success: true, url });
    } catch (error) {
      console.error("[Client Avatar Upload] Error:", error);
      return res.status(500).json({ error: "Upload failed" });
    }
  });

  // ─── Admin Image Upload Route ─────────────────────────────────────
  app.post("/api/admin/upload", async (req, res) => {
    try {
      const cookies = parseCookies(req.headers.cookie);
      const session = await verifyAdminSession(cookies.get(ADMIN_COOKIE_NAME));
      if (!session) {
        return res.status(401).json({ error: "Admin authentication required" });
      }
      const { file, filename, contentType, folder } = req.body;
      if (!file || !filename || !contentType) {
        return res.status(400).json({ error: "Missing file, filename, or contentType" });
      }
      const buffer = Buffer.from(file, "base64");
      if (buffer.length > 10 * 1024 * 1024) {
        return res.status(400).json({ error: "File too large. Maximum 10MB allowed." });
      }
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
      if (!allowedTypes.includes(contentType)) {
        return res.status(400).json({ error: `Invalid file type. Allowed: ${allowedTypes.join(", ")}` });
      }
      const ext = filename.split(".").pop() || "jpg";
      const prefix = folder || "uploads";
      const uniqueKey = `cobnb/${prefix}/${nanoid(12)}.${ext}`;
      const { url } = await storagePut(uniqueKey, buffer, contentType);
      return res.json({ success: true, url, key: uniqueKey });
    } catch (error) {
      console.error("[Upload] Error:", error);
      return res.status(500).json({ error: "Upload failed" });
    }
  });

  // ─── Public Careers API ──────────────────────────────────────
  app.get("/api/public/careers", async (_req, res) => {
    try {
      const jobs = await db.getOpenJobPostings();
      return res.json({ jobs: jobs.map(j => ({
        id: j.id, titleEn: j.titleEn, titleAr: j.titleAr,
        departmentEn: j.departmentEn, departmentAr: j.departmentAr,
        locationEn: j.locationEn, locationAr: j.locationAr,
        typeEn: j.typeEn, typeAr: j.typeAr,
        salaryRange: j.salaryRange,
        descriptionEn: j.descriptionEn, descriptionAr: j.descriptionAr,
        requirementsEn: j.requirementsEn, requirementsAr: j.requirementsAr,
      })) });
    } catch { return res.json({ jobs: [] }); }
  });

  app.post("/api/public/careers/apply", async (req, res) => {
    try {
      const { jobId, firstName, lastName, email, phone, linkedinUrl, coverLetter } = req.body;
      if (!jobId || !firstName || !lastName || !email) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      await db.createJobApplication({ jobId, firstName, lastName, email, phone: phone || null, linkedinUrl: linkedinUrl || null, coverLetter: coverLetter || null });
      return res.json({ success: true });
    } catch (error) {
      console.error("[Careers Apply]", error);
      return res.status(500).json({ error: "Failed to submit application" });
    }
  });

  // ─── XML Sitemap ───────────────────────────────────────────────
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const baseUrl = "https://cobnb.vip";
      const staticPages = [
        { loc: "/", priority: "1.0", changefreq: "weekly" },
        { loc: "/properties", priority: "0.9", changefreq: "daily" },
        { loc: "/about", priority: "0.7", changefreq: "monthly" },
        { loc: "/services", priority: "0.7", changefreq: "monthly" },
        { loc: "/blog", priority: "0.8", changefreq: "weekly" },
        { loc: "/contact", priority: "0.6", changefreq: "monthly" },
        { loc: "/owners", priority: "0.7", changefreq: "monthly" },
        { loc: "/careers", priority: "0.5", changefreq: "monthly" },
        { loc: "/app-download", priority: "0.5", changefreq: "monthly" },
        { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
        { loc: "/terms", priority: "0.3", changefreq: "yearly" },
      ];
      const cities = await db.getAllCities();
      const neighborhoods = await db.getAllNeighborhoods();
      const properties = await db.getAllProperties();
      const blogs = await db.getAllPosts();
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      for (const p of staticPages) {
        xml += `  <url><loc>${baseUrl}${p.loc}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>\n`;
      }
      for (const c of cities) {
        xml += `  <url><loc>${baseUrl}/cities/${c.slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
      }
      for (const n of neighborhoods) {
        const city = cities.find(c => c.id === n.cityId);
        if (city) xml += `  <url><loc>${baseUrl}/cities/${city.slug}/${n.slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
      }
      for (const p of properties) {
        xml += `  <url><loc>${baseUrl}/properties/${p.id}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>\n`;
      }
      for (const b of blogs) {
        xml += `  <url><loc>${baseUrl}/blog/${b.slug}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
      }
      xml += `</urlset>`;
      res.set("Content-Type", "application/xml");
      return res.send(xml);
    } catch (error) {
      console.error("[Sitemap]", error);
      return res.status(500).send("Error generating sitemap");
    }
  });

  // ─── Robots.txt ────────────────────────────────────────────────
  app.get("/robots.txt", (_req, res) => {
    res.set("Content-Type", "text/plain");
    return res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /account\nDisallow: /api/\nSitemap: https://cobnb.vip/sitemap.xml\n`);
  });
}
