import { describe, it, expect, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { SignJWT } from "jose";
import { ENV } from "./_core/env";

// ─── Test Helpers ────────────────────────────────────────────────────────────

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

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
      headers: { cookie: `admin_session=${token}` },
    } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ─── New Public Routes ───────────────────────────────────────────────────────

describe("Public Routes — Team", () => {
  it("team.list returns an array", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const team = await caller.team.list();
    expect(Array.isArray(team)).toBe(true);
  });
});

describe("Public Routes — Partners", () => {
  it("partners.byCategory returns an array (no filter)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const partners = await caller.partners.byCategory();
    expect(Array.isArray(partners)).toBe(true);
  });

  it("partners.byCategory returns an array (with filter)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const partners = await caller.partners.byCategory({ category: "ota" });
    expect(Array.isArray(partners)).toBe(true);
  });
});

describe("Public Routes — Jobs", () => {
  it("jobs.open returns an array", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const jobs = await caller.jobs.open();
    expect(Array.isArray(jobs)).toBe(true);
  });
});

describe("Public Routes — Settings", () => {
  it("settings.heroVideo returns object with videoUrl and posterUrl", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const hero = await caller.settings.heroVideo();
    expect(hero).toHaveProperty("videoUrl");
    expect(hero).toHaveProperty("posterUrl");
  });

  it("settings.getMultiple returns an object", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.settings.getMultiple({ keys: ["site_phone", "site_email"] });
    expect(typeof result).toBe("object");
  });
});

// ─── Admin Routes — New Tabs ─────────────────────────────────────────────────

describe("Admin Routes — Cities", () => {
  it("admin.cities.list returns array for admin", async () => {
    const caller = appRouter.createCaller(await createAdminContext());
    const cities = await caller.admin.cities.list();
    expect(Array.isArray(cities)).toBe(true);
  });

  it("admin.cities.list throws for non-admin", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.admin.cities.list()).rejects.toThrow();
  });
});

describe("Admin Routes — Bookings", () => {
  it("admin.bookings.list returns array for admin", async () => {
    const caller = appRouter.createCaller(await createAdminContext());
    const bookings = await caller.admin.bookings.list();
    expect(Array.isArray(bookings)).toBe(true);
  });

  it("admin.bookings.list throws for non-admin", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.admin.bookings.list()).rejects.toThrow();
  });
});

describe("Admin Routes — Reviews", () => {
  it("admin.reviews.list returns array for admin", async () => {
    const caller = appRouter.createCaller(await createAdminContext());
    const reviews = await caller.admin.reviews.list();
    expect(Array.isArray(reviews)).toBe(true);
  });

  it("admin.reviews.list throws for non-admin", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.admin.reviews.list()).rejects.toThrow();
  });
});

describe("Admin Routes — Client Users", () => {
  it("admin.clientUsers.list returns array for admin", async () => {
    const caller = appRouter.createCaller(await createAdminContext());
    const clients = await caller.admin.clientUsers.list();
    expect(Array.isArray(clients)).toBe(true);
  });

  it("admin.clientUsers.list throws for non-admin", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.admin.clientUsers.list()).rejects.toThrow();
  });
});

describe("Admin Routes — Admin Users", () => {
  it("admin.adminUsers.list returns array for admin", async () => {
    const caller = appRouter.createCaller(await createAdminContext());
    const admins = await caller.admin.adminUsers.list();
    expect(Array.isArray(admins)).toBe(true);
  });

  it("admin.adminUsers.list throws for non-admin", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.admin.adminUsers.list()).rejects.toThrow();
  });
});

describe("Admin Routes — Partners", () => {
  it("admin.partners.list returns array for admin", async () => {
    const caller = appRouter.createCaller(await createAdminContext());
    const partners = await caller.admin.partners.list();
    expect(Array.isArray(partners)).toBe(true);
  });

  it("admin.partners.list throws for non-admin", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.admin.partners.list()).rejects.toThrow();
  });
});

describe("Admin Routes — Team", () => {
  it("admin.team.list returns array for admin", async () => {
    const caller = appRouter.createCaller(await createAdminContext());
    const team = await caller.admin.team.list();
    expect(Array.isArray(team)).toBe(true);
  });

  it("admin.team.list throws for non-admin", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.admin.team.list()).rejects.toThrow();
  });
});

describe("Admin Routes — Careers", () => {
  it("admin.careers.jobs.list returns array for admin", async () => {
    const caller = appRouter.createCaller(await createAdminContext());
    const jobs = await caller.admin.careers.jobs.list();
    expect(Array.isArray(jobs)).toBe(true);
  });

  it("admin.careers.applications.list returns array for admin", async () => {
    const caller = appRouter.createCaller(await createAdminContext());
    const apps = await caller.admin.careers.applications.list();
    expect(Array.isArray(apps)).toBe(true);
  });

  it("admin.careers.jobs.list throws for non-admin", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.admin.careers.jobs.list()).rejects.toThrow();
  });
});

describe("Admin Routes — Settings", () => {
  it("admin.settings.getAll returns an object for admin", async () => {
    const caller = appRouter.createCaller(await createAdminContext());
    const settings = await caller.admin.settings.getAll();
    expect(typeof settings).toBe("object");
  }, 15000);

  it("admin.settings.getAll throws for non-admin", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.admin.settings.getAll()).rejects.toThrow();
  });
});

describe("Admin Routes — Dashboard", () => {
  it("admin.dashboard returns stats object for admin", async () => {
    const caller = appRouter.createCaller(await createAdminContext());
    const stats = await caller.admin.dashboard();
    expect(typeof stats).toBe("object");
  });

  it("admin.recentActivity returns object with arrays for admin", async () => {
    const caller = appRouter.createCaller(await createAdminContext());
    const activity = await caller.admin.recentActivity();
    expect(activity).toHaveProperty("recentInquiries");
    expect(activity).toHaveProperty("recentBookings");
    expect(activity).toHaveProperty("recentClients");
  });

  it("admin.dashboard throws for non-admin", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.admin.dashboard()).rejects.toThrow();
  });
});
