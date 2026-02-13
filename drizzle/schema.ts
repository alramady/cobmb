import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

// ─── Users ───────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  avatar: varchar("avatar", { length: 1000 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "owner", "guest"]).default("user").notNull(),
  bio: text("bio"),
  company: varchar("company", { length: 255 }),
  preferredLanguage: varchar("preferredLanguage", { length: 5 }).default("ar"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Cities ──────────────────────────────────────────────────────────
export const cities = mysqlTable("cities", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 100 }).notNull(),
  nameAr: varchar("nameAr", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  descriptionEn: text("descriptionEn"),
  descriptionAr: text("descriptionAr"),
  heroImage: varchar("heroImage", { length: 1000 }),
  statsJson: json("statsJson"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  isActive: boolean("isActive").default(true).notNull(),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type City = typeof cities.$inferSelect;
export type InsertCity = typeof cities.$inferInsert;

// ─── Neighborhoods ───────────────────────────────────────────────────
export const neighborhoods = mysqlTable("neighborhoods", {
  id: int("id").autoincrement().primaryKey(),
  cityId: int("cityId").notNull(),
  nameEn: varchar("nameEn", { length: 200 }).notNull(),
  nameAr: varchar("nameAr", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull(),
  zone: varchar("zone", { length: 100 }),
  profileEn: text("profileEn"),
  profileAr: text("profileAr"),
  descriptionEn: text("descriptionEn"),
  descriptionAr: text("descriptionAr"),
  heroImage: varchar("heroImage", { length: 1000 }),
  landmarks: json("landmarks"),
  avgAdrPeak: decimal("avgAdrPeak", { precision: 10, scale: 2 }),
  avgAdrHigh: decimal("avgAdrHigh", { precision: 10, scale: 2 }),
  avgAdrLow: decimal("avgAdrLow", { precision: 10, scale: 2 }),
  propertyTypes: json("propertyTypes"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  propertyCount: int("propertyCount").default(0),
  avgNightlyRate: decimal("avgNightlyRate", { precision: 10, scale: 2 }),
  walkTimeToLandmark: varchar("walkTimeToLandmark", { length: 100 }),
  isActive: boolean("isActive").default(true).notNull(),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Neighborhood = typeof neighborhoods.$inferSelect;
export type InsertNeighborhood = typeof neighborhoods.$inferInsert;

// ─── Properties ──────────────────────────────────────────────────────
export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: varchar("titleEn", { length: 500 }).notNull(),
  titleAr: varchar("titleAr", { length: 500 }).notNull(),
  descriptionEn: text("descriptionEn"),
  descriptionAr: text("descriptionAr"),
  cityId: int("cityId").notNull(),
  neighborhoodId: int("neighborhoodId").notNull(),
  propertyType: mysqlEnum("propertyType", ["studio", "1br", "2br", "3br", "4br", "villa", "penthouse"]).default("2br").notNull(),
  bedrooms: int("bedrooms").default(1),
  bathrooms: int("bathrooms").default(1),
  maxGuests: int("maxGuests").default(2),
  sizeSqm: decimal("sizeSqm", { precision: 10, scale: 2 }),
  priceNightly: decimal("priceNightly", { precision: 10, scale: 2 }),
  pricePeak: decimal("pricePeak", { precision: 10, scale: 2 }),
  priceHigh: decimal("priceHigh", { precision: 10, scale: 2 }),
  priceLow: decimal("priceLow", { precision: 10, scale: 2 }),
  amenities: json("amenities"),
  images: json("images"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  status: mysqlEnum("propertyStatus", ["draft", "active", "maintenance", "inactive"]).default("active").notNull(),
  isFeatured: boolean("isFeatured").default(false),
  ownerId: int("ownerId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

// ─── Bookings ────────────────────────────────────────────────────────
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  guestId: int("guestId").notNull(),
  propertyId: int("propertyId").notNull(),
  checkIn: timestamp("checkIn").notNull(),
  checkOut: timestamp("checkOut").notNull(),
  guests: int("guests").default(1),
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }),
  status: mysqlEnum("bookingStatus", ["pending", "confirmed", "checked_in", "checked_out", "cancelled"]).default("pending").notNull(),
  specialRequests: text("specialRequests"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

// ─── Favorites ───────────────────────────────────────────────────────
export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  propertyId: int("propertyId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

// ─── Reviews ─────────────────────────────────────────────────────────
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  guestId: int("guestId").notNull(),
  propertyId: int("propertyId").notNull(),
  bookingId: int("bookingId"),
  rating: int("rating").notNull(),
  comment: text("comment"),
  status: mysqlEnum("reviewStatus", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// ─── Inquiries ───────────────────────────────────────────────────────
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  inquiryType: mysqlEnum("inquiryType", ["owner", "guest", "booking", "general", "rental_forecast"]).default("general").notNull(),
  city: varchar("city", { length: 100 }),
  neighborhood: varchar("neighborhood", { length: 200 }),
  propertyType: varchar("inquiryPropertyType", { length: 100 }),
  message: text("message"),
  propertyId: int("propertyId"),
  status: mysqlEnum("inquiryStatus", ["new", "contacted", "site_visit", "quote", "signed", "live", "closed"]).default("new").notNull(),
  assignedTo: int("assignedTo"),
  internalNotes: text("internalNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

// ─── Blog Posts ──────────────────────────────────────────────────────
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: varchar("titleEn", { length: 500 }).notNull(),
  titleAr: varchar("titleAr", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  contentEn: text("contentEn"),
  contentAr: text("contentAr"),
  excerptEn: text("excerptEn"),
  excerptAr: text("excerptAr"),
  category: mysqlEnum("blogCategory", ["saudi_tourism", "property_investment", "travel_guides", "industry_news"]).default("industry_news").notNull(),
  tags: json("tags"),
  featuredImage: varchar("featuredImage", { length: 1000 }),
  authorId: int("authorId"),
  status: mysqlEnum("blogStatus", ["draft", "published", "archived"]).default("draft").notNull(),
  seoTitle: varchar("seoTitle", { length: 500 }),
  seoDescription: text("seoDescription"),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// ─── Team Members ────────────────────────────────────────────────────
export const teamMembers = mysqlTable("team_members", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  roleEn: varchar("roleEn", { length: 255 }),
  roleAr: varchar("roleAr", { length: 255 }),
  image: varchar("image", { length: 1000 }),
  bioEn: text("bioEn"),
  bioAr: text("bioAr"),
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

// ─── Admin Users (Local Auth) ────────────────────────────────────────
export const adminUsers = mysqlTable("admin_users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  mobile: varchar("mobile", { length: 20 }),
  displayName: varchar("displayName", { length: 100 }),
  role: mysqlEnum("adminRole", ["root", "admin", "editor"]).default("admin").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  lastLogin: timestamp("lastLogin"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;

// ─── Client Users (Local Auth for Guests & Owners) ─────────────────
export const clientUsers = mysqlTable("client_users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  avatar: varchar("avatar", { length: 1000 }),
  role: mysqlEnum("clientRole", ["guest", "owner"]).default("guest").notNull(),
  company: varchar("company", { length: 255 }),
  bio: text("bio"),
  preferredLanguage: varchar("preferredLanguage", { length: 5 }).default("ar"),
  isActive: boolean("isActive").default(true).notNull(),
  emailVerified: boolean("emailVerified").default(false).notNull(),
  lastLogin: timestamp("lastLogin"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type ClientUser = typeof clientUsers.$inferSelect;
export type InsertClientUser = typeof clientUsers.$inferInsert;

// ─── Password Reset Tokens ──────────────────────────────────────────
export const passwordResetTokens = mysqlTable("password_reset_tokens", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  token: varchar("token", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;

// ─── Partners (Press / Clients / OTAs / Awards) ────────────────────
export const partners = mysqlTable("partners", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  logo: varchar("logo", { length: 1000 }),
  category: mysqlEnum("partnerCategory", ["press", "client", "ota", "award"]).default("client").notNull(),
  url: varchar("partnerUrl", { length: 500 }),
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Partner = typeof partners.$inferSelect;
export type InsertPartner = typeof partners.$inferInsert;

// ─── Job Postings ───────────────────────────────────────────────────
export const jobPostings = mysqlTable("job_postings", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: varchar("titleEn", { length: 500 }).notNull(),
  titleAr: varchar("titleAr", { length: 500 }).notNull(),
  departmentEn: varchar("departmentEn", { length: 200 }),
  departmentAr: varchar("departmentAr", { length: 200 }),
  locationEn: varchar("locationEn", { length: 200 }).default("Riyadh"),
  locationAr: varchar("locationAr", { length: 200 }).default("الرياض"),
  typeEn: varchar("typeEn", { length: 100 }).default("Full-time"),
  typeAr: varchar("typeAr", { length: 100 }).default("دوام كامل"),
  descriptionEn: text("descriptionEn"),
  descriptionAr: text("descriptionAr"),
  requirementsEn: text("requirementsEn"),
  requirementsAr: text("requirementsAr"),
  salaryRange: varchar("salaryRange", { length: 200 }),
  contactEmail: varchar("contactEmail", { length: 320 }).default("hr@cobnb.sa"),
  status: mysqlEnum("jobStatus", ["open", "closed", "draft"]).default("draft").notNull(),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type JobPosting = typeof jobPostings.$inferSelect;
export type InsertJobPosting = typeof jobPostings.$inferInsert;

// ─── Job Applications ───────────────────────────────────────────────
export const jobApplications = mysqlTable("job_applications", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("jobId").notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  linkedinUrl: varchar("linkedinUrl", { length: 500 }),
  resumeUrl: varchar("resumeUrl", { length: 1000 }),
  coverLetter: text("coverLetter"),
  status: mysqlEnum("applicationStatus", ["new", "screening", "interview", "offered", "hired", "rejected"]).default("new").notNull(),
  internalNotes: text("internalNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = typeof jobApplications.$inferInsert;

// ─── Settings ────────────────────────────────────────────────────────
export const settings = mysqlTable("settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("settingKey", { length: 100 }).notNull().unique(),
  value: text("settingValue"),
  groupName: varchar("groupName", { length: 100 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Setting = typeof settings.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;
