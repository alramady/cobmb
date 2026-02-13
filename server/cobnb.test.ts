import { describe, expect, it, vi, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { SignJWT } from "jose";
import { ENV } from "./_core/env";

// Helper to create a public context (no user)
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

// Helper to create an authenticated user context
function createAuthContext(role: "user" | "admin" = "user"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user-123",
      email: "test@cobnb.com",
      name: "Test User",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

// Helper to create an admin context with a valid admin session cookie
async function createAdminContext(): Promise<TrpcContext> {
  const secretKey = new TextEncoder().encode(ENV.cookieSecret + "_admin");
  const token = await new SignJWT({
    adminId: 1,
    username: "Hobart",
    role: "super_admin",
    displayName: "Hobart",
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(Math.floor((Date.now() + 1000 * 60 * 60) / 1000))
    .sign(secretKey);

  return {
    user: null,
    req: {
      protocol: "https",
      headers: {
        cookie: `admin_session=${token}`,
      },
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("CoBnB KSA - Public Routes", () => {
  it("cities.list returns an array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const cities = await caller.cities.list();
    expect(Array.isArray(cities)).toBe(true);
  });

  it("neighborhoods.all returns an array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const neighborhoods = await caller.neighborhoods.all();
    expect(Array.isArray(neighborhoods)).toBe(true);
  });

  it("properties.list returns an array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const properties = await caller.properties.list({});
    expect(Array.isArray(properties)).toBe(true);
  });

  it("properties.featured returns an array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const featured = await caller.properties.featured();
    expect(Array.isArray(featured)).toBe(true);
  });

  it("blog.published returns an array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const posts = await caller.blog.published({});
    expect(Array.isArray(posts)).toBe(true);
  });

  it("auth.me returns null for unauthenticated user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const me = await caller.auth.me();
    expect(me).toBeNull();
  });

  it("auth.me returns user for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const me = await caller.auth.me();
    expect(me).not.toBeNull();
    expect(me?.email).toBe("test@cobnb.com");
    expect(me?.name).toBe("Test User");
  });
});

describe("CoBnB KSA - Protected Account Routes", () => {
  it("account.bookings returns array for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const bookings = await caller.account.bookings();
    expect(Array.isArray(bookings)).toBe(true);
  });

  it("account.favorites returns array for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const favorites = await caller.account.favorites();
    expect(Array.isArray(favorites)).toBe(true);
  });

  it("account.reviews returns array for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const reviews = await caller.account.reviews();
    expect(Array.isArray(reviews)).toBe(true);
  });

  it("account.bookings throws for unauthenticated user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.account.bookings()).rejects.toThrow();
  });
});

describe("CoBnB KSA - Admin Routes", () => {
  it("admin.users.list throws for non-admin user", async () => {
    const ctx = createPublicContext(); // no admin cookie
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.users.list()).rejects.toThrow();
  });

  it("admin.properties.list returns array for admin", async () => {
    const ctx = await createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const properties = await caller.admin.properties.list();
    expect(Array.isArray(properties)).toBe(true);
  });

  it("admin.neighborhoods.list returns array for admin", async () => {
    const ctx = await createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const neighborhoods = await caller.admin.neighborhoods.list();
    expect(Array.isArray(neighborhoods)).toBe(true);
  });

  it("admin.blog.list returns array for admin", async () => {
    const ctx = await createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const posts = await caller.admin.blog.list();
    expect(Array.isArray(posts)).toBe(true);
  });

  it("admin.inquiries.list returns array for admin", async () => {
    const ctx = await createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const inquiries = await caller.admin.inquiries.list();
    expect(Array.isArray(inquiries)).toBe(true);
  });
});

describe("CoBnB KSA - Data Integrity", () => {
  it("cities have required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const cities = await caller.cities.list();
    if (cities.length > 0) {
      const city = cities[0];
      expect(city).toHaveProperty("id");
      expect(city).toHaveProperty("nameEn");
      expect(city).toHaveProperty("nameAr");
      expect(city).toHaveProperty("slug");
    }
  });

  it("properties have required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const properties = await caller.properties.list({});
    if (properties.length > 0) {
      const prop = properties[0];
      expect(prop).toHaveProperty("id");
      expect(prop).toHaveProperty("titleEn");
      expect(prop).toHaveProperty("titleAr");
      expect(prop).toHaveProperty("cityId");
      expect(prop).toHaveProperty("neighborhoodId");
      expect(prop).toHaveProperty("priceLow");
    }
  });

  it("neighborhoods have pricing data", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const neighborhoods = await caller.neighborhoods.all();
    if (neighborhoods.length > 0) {
      const nh = neighborhoods[0];
      expect(nh).toHaveProperty("nameEn");
      expect(nh).toHaveProperty("nameAr");
      expect(nh).toHaveProperty("avgAdrPeak");
      expect(nh).toHaveProperty("avgAdrHigh");
      expect(nh).toHaveProperty("avgAdrLow");
    }
  });
});
