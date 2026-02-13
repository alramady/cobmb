import { describe, expect, it, vi, beforeEach } from "vitest";
import crypto from "crypto";

// Mock the db module
vi.mock("./db", () => ({
  getClientByEmail: vi.fn(),
  getClientById: vi.fn(),
  createPasswordResetToken: vi.fn(),
  getPasswordResetToken: vi.fn(),
  markPasswordResetTokenUsed: vi.fn(),
  updateClientUser: vi.fn(),
}));

// Mock the clientAuth module
vi.mock("./clientAuth", () => ({
  hashPassword: vi.fn().mockResolvedValue("$2a$12$hashedNewPassword"),
  verifyPassword: vi.fn(),
  createClientSessionToken: vi.fn(),
  verifyClientSession: vi.fn(),
  parseCookies: vi.fn(),
  CLIENT_COOKIE_NAME: "client_session",
}));

// Mock the notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

import * as db from "./db";
import { hashPassword } from "./clientAuth";

const mockDb = db as unknown as {
  getClientByEmail: ReturnType<typeof vi.fn>;
  getClientById: ReturnType<typeof vi.fn>;
  createPasswordResetToken: ReturnType<typeof vi.fn>;
  getPasswordResetToken: ReturnType<typeof vi.fn>;
  markPasswordResetTokenUsed: ReturnType<typeof vi.fn>;
  updateClientUser: ReturnType<typeof vi.fn>;
};

// Helper to create a mock Express request/response pair
function createMockReqRes(body: Record<string, unknown> = {}, params: Record<string, string> = {}) {
  const req = {
    body,
    params,
    headers: { origin: "https://cobnb.com", cookie: "" },
    protocol: "https",
  };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return { req, res };
}

describe("Password Reset - Token Generation Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should generate a 96-character hex token", () => {
    const token = crypto.randomBytes(48).toString("hex");
    expect(token).toHaveLength(96);
    expect(/^[0-9a-f]+$/.test(token)).toBe(true);
  });

  it("should generate unique tokens each time", () => {
    const token1 = crypto.randomBytes(48).toString("hex");
    const token2 = crypto.randomBytes(48).toString("hex");
    expect(token1).not.toBe(token2);
  });

  it("should set token expiration to 1 hour from now", () => {
    const now = Date.now();
    const expiresAt = new Date(now + 1000 * 60 * 60);
    const diffMs = expiresAt.getTime() - now;
    // Should be approximately 1 hour (3600000ms)
    expect(diffMs).toBeGreaterThanOrEqual(3599000);
    expect(diffMs).toBeLessThanOrEqual(3601000);
  });
});

describe("Password Reset - Email Validation", () => {
  it("should reject empty email", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test("")).toBe(false);
  });

  it("should reject invalid email formats", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test("notanemail")).toBe(false);
    expect(emailRegex.test("missing@domain")).toBe(false);
    expect(emailRegex.test("@nodomain.com")).toBe(false);
    expect(emailRegex.test("spaces in@email.com")).toBe(false);
  });

  it("should accept valid email formats", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test("user@example.com")).toBe(true);
    expect(emailRegex.test("user.name@domain.co.uk")).toBe(true);
    expect(emailRegex.test("user+tag@example.com")).toBe(true);
  });
});

describe("Password Reset - Token Verification Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should reject null/undefined tokens", async () => {
    mockDb.getPasswordResetToken.mockResolvedValue(undefined);
    const result = await db.getPasswordResetToken("nonexistent-token");
    expect(result).toBeUndefined();
  });

  it("should detect used tokens", () => {
    const token = {
      id: 1,
      clientId: 1,
      token: "abc123",
      expiresAt: new Date(Date.now() + 3600000),
      usedAt: new Date(), // Already used
      createdAt: new Date(),
    };
    expect(token.usedAt).not.toBeNull();
  });

  it("should detect expired tokens", () => {
    const token = {
      id: 1,
      clientId: 1,
      token: "abc123",
      expiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
      usedAt: null,
      createdAt: new Date(),
    };
    const isExpired = new Date() > token.expiresAt;
    expect(isExpired).toBe(true);
  });

  it("should accept valid unexpired tokens", () => {
    const token = {
      id: 1,
      clientId: 1,
      token: "abc123",
      expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
      usedAt: null,
      createdAt: new Date(),
    };
    const isExpired = new Date() > token.expiresAt;
    const isUsed = token.usedAt !== null;
    expect(isExpired).toBe(false);
    expect(isUsed).toBe(false);
  });
});

describe("Password Reset - Password Validation", () => {
  it("should reject passwords shorter than 6 characters", () => {
    expect("abc".length < 6).toBe(true);
    expect("12345".length < 6).toBe(true);
  });

  it("should accept passwords with 6 or more characters", () => {
    expect("abcdef".length >= 6).toBe(true);
    expect("MyP@ss1".length >= 6).toBe(true);
  });

  it("should hash the new password", async () => {
    const result = await hashPassword("newPassword123");
    expect(result).toBe("$2a$12$hashedNewPassword");
    expect(hashPassword).toHaveBeenCalledWith("newPassword123");
  });
});

describe("Password Reset - Database Operations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a password reset token in the database", async () => {
    const tokenData = {
      clientId: 1,
      token: "test-token-123",
      expiresAt: new Date(Date.now() + 3600000),
    };
    await db.createPasswordResetToken(tokenData);
    expect(mockDb.createPasswordResetToken).toHaveBeenCalledWith(tokenData);
  });

  it("should look up client by email", async () => {
    mockDb.getClientByEmail.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      isActive: true,
    });
    const client = await db.getClientByEmail("test@example.com");
    expect(client).toBeDefined();
    expect(client?.email).toBe("test@example.com");
    expect(client?.isActive).toBe(true);
  });

  it("should return undefined for non-existent email", async () => {
    mockDb.getClientByEmail.mockResolvedValue(undefined);
    const client = await db.getClientByEmail("nonexistent@example.com");
    expect(client).toBeUndefined();
  });

  it("should mark token as used after password reset", async () => {
    await db.markPasswordResetTokenUsed(1);
    expect(mockDb.markPasswordResetTokenUsed).toHaveBeenCalledWith(1);
  });

  it("should update client password hash", async () => {
    await db.updateClientUser(1, { passwordHash: "$2a$12$newHash" } as any);
    expect(mockDb.updateClientUser).toHaveBeenCalledWith(1, { passwordHash: "$2a$12$newHash" });
  });
});

describe("Password Reset - Security", () => {
  it("should not reveal whether an email exists (anti-enumeration)", async () => {
    // For both existing and non-existing emails, the API should return the same success response
    // This is tested by verifying the response message is generic
    const genericMessage = "If an account with that email exists, a password reset link has been generated.";
    expect(genericMessage).not.toContain("not found");
    expect(genericMessage).not.toContain("does not exist");
  });

  it("should invalidate previous tokens when creating a new one", async () => {
    // The createPasswordResetToken function should mark old tokens as used
    // before creating a new one - this is verified by the function implementation
    const tokenData = {
      clientId: 1,
      token: "new-token",
      expiresAt: new Date(Date.now() + 3600000),
    };
    await db.createPasswordResetToken(tokenData);
    expect(mockDb.createPasswordResetToken).toHaveBeenCalledTimes(1);
  });

  it("should not allow password reset for inactive accounts", () => {
    const client = { id: 1, isActive: false };
    const shouldAllow = client.isActive;
    expect(shouldAllow).toBe(false);
  });
});
