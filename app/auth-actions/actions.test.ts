import { describe, it, expect, vi, beforeEach } from "vitest";
import { login, logout } from "./actions";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession, deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/password", () => ({
  verifyPassword: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  createSession: vi.fn(),
  deleteSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("Auth Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("should return validation errors if fields are missing or invalid", async () => {
      const formData = new FormData();
      formData.append("email", "invalid-email");
      formData.append("password", "");

      const result = await login(undefined, formData);

      expect(result).toHaveProperty("errors");
      expect(result?.errors?.email).toBeDefined();
      expect(result?.errors?.password).toBeDefined();
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it("should return invalid message if user is not found", async () => {
      const formData = new FormData();
      formData.append("email", "nonexistent@example.com");
      formData.append("password", "password123");

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await login(undefined, formData);

      expect(result).toEqual({
        message: "Invalid email or password.",
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "nonexistent@example.com" },
      });
    });

    it("should return invalid message if password verification fails", async () => {
      const formData = new FormData();
      formData.append("email", "user.dev@gmail.com");
      formData.append("password", "ChangeMeImmediately!");

      const mockUser = {
        id: "cmp3bqzab001cijmmunus2pky",
        email: "user.dev@gmail.com",
        passwordHash: "hashed_password",
        firstName: "Test",
        lastName: "User",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(verifyPassword).mockResolvedValue(false);

      const result = await login(undefined, formData);

      expect(result).toEqual({
        message: "Invalid email or password.",
      });
      expect(verifyPassword).toHaveBeenCalledWith("ChangeMeImmediately!", "hashed_password");
      expect(createSession).not.toHaveBeenCalled();
    });

    it("should create a session and redirect to dashboard if login is successful", async () => {
      const formData = new FormData();
      formData.append("email", "user@example.com");
      formData.append("password", "correctpassword");

      const mockUser = {
        id: "user_1",
        email: "user@example.com",
        passwordHash: "hashed_password",
        firstName: "Test",
        lastName: "User",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(verifyPassword).mockResolvedValue(true);

      await login(undefined, formData);

      expect(createSession).toHaveBeenCalledWith("user_1");
      expect(redirect).toHaveBeenCalledWith("/dashboard");
    });
  });

  describe("logout", () => {
    it("should delete the session and redirect to home", async () => {
      await logout();

      expect(deleteSession).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith("/");
    });
  });
});
