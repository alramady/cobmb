import { eq, and, desc, asc, like, sql, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  cities, InsertCity,
  neighborhoods, InsertNeighborhood,
  properties, InsertProperty,
  bookings, InsertBooking,
  favorites, InsertFavorite,
  reviews, InsertReview,
  inquiries, InsertInquiry,
  blogPosts, InsertBlogPost,
  teamMembers, InsertTeamMember,
  settings, InsertSetting,
  adminUsers, InsertAdminUser,
  clientUsers, InsertClientUser,
  passwordResetTokens, InsertPasswordResetToken,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ───────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "phone", "avatar", "loginMethod", "bio", "company", "preferredLanguage"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      (values as any)[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function updateUserRole(id: number, role: "user" | "admin" | "owner" | "guest") {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role }).where(eq(users.id, id));
}

// ─── Cities ──────────────────────────────────────────────────────────
export async function getAllCities() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cities).where(eq(cities.isActive, true)).orderBy(asc(cities.displayOrder));
}

export async function getCityBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(cities).where(eq(cities.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCity(city: InsertCity) {
  const db = await getDb();
  if (!db) return;
  await db.insert(cities).values(city);
}

export async function updateCity(id: number, data: Partial<InsertCity>) {
  const db = await getDb();
  if (!db) return;
  await db.update(cities).set(data).where(eq(cities.id, id));
}

// ─── Neighborhoods ───────────────────────────────────────────────────
export async function getNeighborhoodsByCity(cityId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(neighborhoods).where(and(eq(neighborhoods.cityId, cityId), eq(neighborhoods.isActive, true))).orderBy(asc(neighborhoods.displayOrder));
}

export async function getNeighborhoodBySlug(citySlug: string, neighborhoodSlug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const city = await getCityBySlug(citySlug);
  if (!city) return undefined;
  const result = await db.select().from(neighborhoods).where(and(eq(neighborhoods.cityId, city.id), eq(neighborhoods.slug, neighborhoodSlug))).limit(1);
  return result.length > 0 ? { ...result[0], city } : undefined;
}

export async function getAllNeighborhoods() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(neighborhoods).orderBy(asc(neighborhoods.cityId), asc(neighborhoods.displayOrder));
}

export async function createNeighborhood(n: InsertNeighborhood) {
  const db = await getDb();
  if (!db) return;
  await db.insert(neighborhoods).values(n);
}

export async function updateNeighborhood(id: number, data: Partial<InsertNeighborhood>) {
  const db = await getDb();
  if (!db) return;
  await db.update(neighborhoods).set(data).where(eq(neighborhoods.id, id));
}

// ─── Properties ──────────────────────────────────────────────────────
export async function getActiveProperties(filters?: { cityId?: number; neighborhoodId?: number; bedrooms?: number; minPrice?: number; maxPrice?: number; featured?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(properties.status, "active")];
  if (filters?.cityId) conditions.push(eq(properties.cityId, filters.cityId));
  if (filters?.neighborhoodId) conditions.push(eq(properties.neighborhoodId, filters.neighborhoodId));
  if (filters?.bedrooms) conditions.push(eq(properties.bedrooms, filters.bedrooms));
  if (filters?.featured) conditions.push(eq(properties.isFeatured, true));
  return db.select().from(properties).where(and(...conditions)).orderBy(desc(properties.createdAt));
}

export async function getPropertyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllProperties() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(properties).orderBy(desc(properties.createdAt));
}

export async function createProperty(p: InsertProperty) {
  const db = await getDb();
  if (!db) return;
  await db.insert(properties).values(p);
}

export async function updateProperty(id: number, data: Partial<InsertProperty>) {
  const db = await getDb();
  if (!db) return;
  await db.update(properties).set(data).where(eq(properties.id, id));
}

export async function deleteProperty(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(properties).set({ status: "inactive" }).where(eq(properties.id, id));
}

export async function getPropertiesByOwner(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(properties).where(eq(properties.ownerId, ownerId)).orderBy(desc(properties.createdAt));
}

// ─── Bookings ────────────────────────────────────────────────────────
export async function getBookingsByGuest(guestId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).where(eq(bookings.guestId, guestId)).orderBy(desc(bookings.createdAt));
}

export async function getBookingsByProperty(propertyId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).where(eq(bookings.propertyId, propertyId)).orderBy(desc(bookings.createdAt));
}

export async function createBooking(b: InsertBooking) {
  const db = await getDb();
  if (!db) return;
  await db.insert(bookings).values(b);
}

export async function updateBookingStatus(id: number, status: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled") {
  const db = await getDb();
  if (!db) return;
  await db.update(bookings).set({ status }).where(eq(bookings.id, id));
}

export async function getAllBookings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).orderBy(desc(bookings.createdAt));
}

// ─── Favorites ───────────────────────────────────────────────────────
export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(favorites).where(eq(favorites.userId, userId)).orderBy(desc(favorites.createdAt));
}

export async function addFavorite(userId: number, propertyId: number) {
  const db = await getDb();
  if (!db) return;
  await db.insert(favorites).values({ userId, propertyId });
}

export async function removeFavorite(userId: number, propertyId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.propertyId, propertyId)));
}

// ─── Reviews ─────────────────────────────────────────────────────────
export async function getReviewsByProperty(propertyId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).where(and(eq(reviews.propertyId, propertyId), eq(reviews.status, "approved"))).orderBy(desc(reviews.createdAt));
}

export async function getReviewsByGuest(guestId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).where(eq(reviews.guestId, guestId)).orderBy(desc(reviews.createdAt));
}

export async function createReview(r: InsertReview) {
  const db = await getDb();
  if (!db) return;
  await db.insert(reviews).values(r);
}

export async function getAllReviews() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).orderBy(desc(reviews.createdAt));
}

export async function updateReviewStatus(id: number, status: "pending" | "approved" | "rejected") {
  const db = await getDb();
  if (!db) return;
  await db.update(reviews).set({ status }).where(eq(reviews.id, id));
}

// ─── Inquiries ───────────────────────────────────────────────────────
export async function createInquiry(i: InsertInquiry) {
  const db = await getDb();
  if (!db) return;
  await db.insert(inquiries).values(i);
}

export async function getAllInquiries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
}

export async function updateInquiryStatus(id: number, status: string, notes?: string) {
  const db = await getDb();
  if (!db) return;
  const data: any = { status };
  if (notes) data.internalNotes = notes;
  await db.update(inquiries).set(data).where(eq(inquiries.id, id));
}

// ─── Blog Posts ──────────────────────────────────────────────────────
export async function getPublishedPosts(category?: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(blogPosts.status, "published")];
  if (category) conditions.push(eq(blogPosts.category, category as any));
  return db.select().from(blogPosts).where(and(...conditions)).orderBy(desc(blogPosts.publishedAt));
}

export async function getPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

export async function createPost(p: InsertBlogPost) {
  const db = await getDb();
  if (!db) return;
  await db.insert(blogPosts).values(p);
}

export async function updatePost(id: number, data: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) return;
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
}

export async function deletePost(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(blogPosts).set({ status: "archived" }).where(eq(blogPosts.id, id));
}

// ─── Team Members ────────────────────────────────────────────────────
export async function getActiveTeamMembers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teamMembers).where(eq(teamMembers.isActive, true)).orderBy(asc(teamMembers.displayOrder));
}

export async function createTeamMember(m: InsertTeamMember) {
  const db = await getDb();
  if (!db) return;
  await db.insert(teamMembers).values(m);
}

// ─── Settings ────────────────────────────────────────────────────────
export async function getSetting(key: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return result.length > 0 ? result[0]?.value ?? null : null;
}

export async function setSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(settings).values({ key, value }).onDuplicateKeyUpdate({ set: { value } });
}

// ─── Admin Users (Local Auth) ────────────────────────────────────────
export async function getAdminByUsername(username: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(adminUsers).where(and(eq(adminUsers.username, username), eq(adminUsers.isActive, true))).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAdminById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAdminUser(admin: InsertAdminUser) {
  const db = await getDb();
  if (!db) return;
  await db.insert(adminUsers).values(admin);
}

export async function updateAdminLastLogin(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(adminUsers).set({ lastLogin: new Date() }).where(eq(adminUsers.id, id));
}

export async function getAllAdminUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: adminUsers.id,
    username: adminUsers.username,
    fullName: adminUsers.fullName,
    email: adminUsers.email,
    mobile: adminUsers.mobile,
    displayName: adminUsers.displayName,
    role: adminUsers.role,
    isActive: adminUsers.isActive,
    lastLogin: adminUsers.lastLogin,
    createdAt: adminUsers.createdAt,
  }).from(adminUsers).orderBy(desc(adminUsers.createdAt));
}

// ─── Client Users (Local Auth for Guests & Owners) ──────────────────
export async function getClientByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(clientUsers).where(eq(clientUsers.email, email.toLowerCase())).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(clientUsers).where(eq(clientUsers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createClientUser(client: InsertClientUser) {
  const db = await getDb();
  if (!db) return;
  await db.insert(clientUsers).values({ ...client, email: client.email.toLowerCase() });
}

export async function updateClientUser(id: number, data: Partial<InsertClientUser>) {
  const db = await getDb();
  if (!db) return;
  if (data.email) data.email = data.email.toLowerCase();
  await db.update(clientUsers).set(data).where(eq(clientUsers.id, id));
}

export async function updateClientLastLogin(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(clientUsers).set({ lastLogin: new Date() }).where(eq(clientUsers.id, id));
}

export async function getAllClientUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: clientUsers.id,
    email: clientUsers.email,
    firstName: clientUsers.firstName,
    lastName: clientUsers.lastName,
    phone: clientUsers.phone,
    avatar: clientUsers.avatar,
    role: clientUsers.role,
    company: clientUsers.company,
    isActive: clientUsers.isActive,
    emailVerified: clientUsers.emailVerified,
    lastLogin: clientUsers.lastLogin,
    createdAt: clientUsers.createdAt,
  }).from(clientUsers).orderBy(desc(clientUsers.createdAt));
}

// ─── Dashboard Stats ─────────────────────────────────────────────────
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { cities: 0, neighborhoods: 0, properties: 0, inquiries: 0, bookings: 0, users: 0 };
  const [cityCount] = await db.select({ count: sql<number>`count(*)` }).from(cities);
  const [nhCount] = await db.select({ count: sql<number>`count(*)` }).from(neighborhoods);
  const [propCount] = await db.select({ count: sql<number>`count(*)` }).from(properties).where(eq(properties.status, "active"));
  const [inqCount] = await db.select({ count: sql<number>`count(*)` }).from(inquiries);
  const [bookCount] = await db.select({ count: sql<number>`count(*)` }).from(bookings);
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  return {
    cities: cityCount?.count || 0,
    neighborhoods: nhCount?.count || 0,
    properties: propCount?.count || 0,
    inquiries: inqCount?.count || 0,
    bookings: bookCount?.count || 0,
    users: userCount?.count || 0,
  };
}

// ─── Password Reset Tokens ──────────────────────────────────────────
export async function createPasswordResetToken(data: InsertPasswordResetToken) {
  const db = await getDb();
  if (!db) return;
  // Invalidate any existing unused tokens for this client
  await db.update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(and(
      eq(passwordResetTokens.clientId, data.clientId),
      sql`${passwordResetTokens.usedAt} IS NULL`
    ));
  await db.insert(passwordResetTokens).values(data);
}

export async function getPasswordResetToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function markPasswordResetTokenUsed(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(eq(passwordResetTokens.id, id));
}

// ─── Partners ───────────────────────────────────────────────────────
import { partners, InsertPartner, jobPostings, InsertJobPosting, jobApplications, InsertJobApplication } from "../drizzle/schema";

export async function getAllPartners() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(partners).orderBy(asc(partners.displayOrder));
}

export async function getActivePartnersByCategory(category?: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(partners.isActive, true)];
  if (category) conditions.push(eq(partners.category, category as any));
  return db.select().from(partners).where(and(...conditions)).orderBy(asc(partners.displayOrder));
}

export async function createPartner(p: InsertPartner) {
  const db = await getDb();
  if (!db) return;
  await db.insert(partners).values(p);
}

export async function updatePartner(id: number, data: Partial<InsertPartner>) {
  const db = await getDb();
  if (!db) return;
  await db.update(partners).set(data).where(eq(partners.id, id));
}

export async function deletePartner(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(partners).where(eq(partners.id, id));
}

// ─── Job Postings ───────────────────────────────────────────────────
export async function getAllJobPostings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(jobPostings).orderBy(desc(jobPostings.createdAt));
}

export async function getOpenJobPostings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(jobPostings).where(eq(jobPostings.status, "open")).orderBy(asc(jobPostings.displayOrder));
}

export async function getJobPostingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(jobPostings).where(eq(jobPostings.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createJobPosting(j: InsertJobPosting) {
  const db = await getDb();
  if (!db) return;
  await db.insert(jobPostings).values(j);
}

export async function updateJobPosting(id: number, data: Partial<InsertJobPosting>) {
  const db = await getDb();
  if (!db) return;
  await db.update(jobPostings).set(data).where(eq(jobPostings.id, id));
}

export async function deleteJobPosting(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(jobPostings).where(eq(jobPostings.id, id));
}

// ─── Job Applications ───────────────────────────────────────────────
export async function getAllJobApplications() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(jobApplications).orderBy(desc(jobApplications.createdAt));
}

export async function getApplicationsByJob(jobId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(jobApplications).where(eq(jobApplications.jobId, jobId)).orderBy(desc(jobApplications.createdAt));
}

export async function createJobApplication(a: InsertJobApplication) {
  const db = await getDb();
  if (!db) return;
  await db.insert(jobApplications).values(a);
}

export async function updateJobApplication(id: number, data: Partial<InsertJobApplication>) {
  const db = await getDb();
  if (!db) return;
  await db.update(jobApplications).set(data).where(eq(jobApplications.id, id));
}

// ─── Team Members (extended) ────────────────────────────────────────
export async function getAllTeamMembers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teamMembers).orderBy(asc(teamMembers.displayOrder));
}

export async function updateTeamMember(id: number, data: Partial<InsertTeamMember>) {
  const db = await getDb();
  if (!db) return;
  await db.update(teamMembers).set(data).where(eq(teamMembers.id, id));
}

export async function deleteTeamMember(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
}

// ─── Admin Users (extended) ─────────────────────────────────────────
export async function updateAdminUser(id: number, data: Partial<InsertAdminUser>) {
  const db = await getDb();
  if (!db) return;
  await db.update(adminUsers).set(data).where(eq(adminUsers.id, id));
}

export async function deleteAdminUser(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(adminUsers).set({ isActive: false }).where(eq(adminUsers.id, id));
}

// ─── Inquiries (extended) ───────────────────────────────────────────
export async function updateInquiry(id: number, data: { status?: string; internalNotes?: string; assignedTo?: number | null }) {
  const db = await getDb();
  if (!db) return;
  await db.update(inquiries).set(data as any).where(eq(inquiries.id, id));
}

// ─── Dashboard Stats (extended) ─────────────────────────────────────
export async function getRecentInquiries(limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(limit);
}

export async function getRecentBookings(limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(limit);
}

export async function getRecentClientUsers(limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: clientUsers.id,
    email: clientUsers.email,
    firstName: clientUsers.firstName,
    lastName: clientUsers.lastName,
    role: clientUsers.role,
    createdAt: clientUsers.createdAt,
  }).from(clientUsers).orderBy(desc(clientUsers.createdAt)).limit(limit);
}

export async function getDashboardStatsExtended() {
  const db = await getDb();
  if (!db) return { cities: 0, neighborhoods: 0, properties: 0, inquiries: 0, bookings: 0, users: 0, clientUsers: 0, adminUsers: 0, blogPosts: 0, reviews: 0, partners: 0, jobPostings: 0 };
  const [cityCount] = await db.select({ count: sql<number>`count(*)` }).from(cities);
  const [nhCount] = await db.select({ count: sql<number>`count(*)` }).from(neighborhoods);
  const [propCount] = await db.select({ count: sql<number>`count(*)` }).from(properties).where(eq(properties.status, "active"));
  const [inqCount] = await db.select({ count: sql<number>`count(*)` }).from(inquiries);
  const [bookCount] = await db.select({ count: sql<number>`count(*)` }).from(bookings);
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [clientCount] = await db.select({ count: sql<number>`count(*)` }).from(clientUsers);
  const [adminCount] = await db.select({ count: sql<number>`count(*)` }).from(adminUsers).where(eq(adminUsers.isActive, true));
  const [blogCount] = await db.select({ count: sql<number>`count(*)` }).from(blogPosts);
  const [reviewCount] = await db.select({ count: sql<number>`count(*)` }).from(reviews);
  const [partnerCount] = await db.select({ count: sql<number>`count(*)` }).from(partners);
  const [jobCount] = await db.select({ count: sql<number>`count(*)` }).from(jobPostings).where(eq(jobPostings.status, "open"));
  return {
    cities: cityCount?.count || 0,
    neighborhoods: nhCount?.count || 0,
    properties: propCount?.count || 0,
    inquiries: inqCount?.count || 0,
    bookings: bookCount?.count || 0,
    users: userCount?.count || 0,
    clientUsers: clientCount?.count || 0,
    adminUsers: adminCount?.count || 0,
    blogPosts: blogCount?.count || 0,
    reviews: reviewCount?.count || 0,
    partners: partnerCount?.count || 0,
    jobPostings: jobCount?.count || 0,
  };
}
