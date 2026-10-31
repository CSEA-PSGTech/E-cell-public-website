import { describe, it, expect, vi, afterEach } from "vitest";
import { submitContactForm } from "@/services/contactService";
import { ApiClientError, postJson, buildApiUrl } from "@/lib/api";
import type { ContactFormData } from "@/types/contact";

describe("Contact Form & Enquiries API Integration", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("submits the enquiry to /api/enquiries with the expected backend JSON contract", async () => {
    let capturedUrl = "";
    let capturedBody: any = null;

    global.fetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
      capturedUrl = url;
      capturedBody = JSON.parse(init?.body as string);
      return {
        ok: true,
        status: 201,
        headers: {
          get: (h: string) => (h === "content-type" ? "application/json" : null),
        },
        json: async () => ({
          success: true,
          message: "Your enquiry has been submitted successfully.",
          data: {
            id: "6ae59249e392af005b72a719",
            status: "PENDING",
            submittedAt: "2026-10-31T07:01:29.505682Z",
            emailNotificationQueued: true,
          },
        }),
      };
    });

    const formData: ContactFormData = {
      fullName: "  Alex Henderson  ",
      email: "  ALEX@EXAMPLE.COM  ",
      phone: "  +91 98765 43210  ",
      message: "  I would like to discuss a corporate partnership.  ",
    };

    const response = await submitContactForm(formData);

    expect(capturedUrl).toContain("/api/enquiries");
    expect(capturedBody).toEqual({
      full_name: "Alex Henderson",
      email: "alex@example.com",
      phone: "+91 98765 43210",
      message: "I would like to discuss a corporate partnership.",
    });

    expect(response.success).toBe(true);
    expect(response.id).toBe("6ae59249e392af005b72a719");
    expect(response.status).toBe("PENDING");
    expect(response.message).toBe("Your enquiry has been submitted successfully.");
    expect(response.submittedAt).toBe("2026-10-31T07:01:29.505682Z");
  });

  it("converts empty phone number to null for the backend", async () => {
    let capturedBody: any = null;

    global.fetch = vi.fn().mockImplementation(async (_url: string, init?: RequestInit) => {
      capturedBody = JSON.parse(init?.body as string);
      return {
        ok: true,
        status: 201,
        headers: {
          get: (h: string) => (h === "content-type" ? "application/json" : null),
        },
        json: async () => ({
          success: true,
          message: "Your enquiry has been submitted successfully.",
          data: {
            id: "6ae59249e392af005b72a720",
            status: "PENDING",
            submittedAt: "2026-10-31T07:05:00.000Z",
          },
        }),
      };
    });

    const formData: ContactFormData = {
      fullName: "Priya Sharma",
      email: "priya@example.com",
      phone: "   ",
      message: "Inquiring about student incubator cohort dates.",
    };

    await submitContactForm(formData);

    expect(capturedBody.phone).toBeNull();
    expect(capturedBody.full_name).toBe("Priya Sharma");
    expect(capturedBody.email).toBe("priya@example.com");
  });

  it("propagates backend HTTP 400 validation error message correctly", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      headers: {
        get: (h: string) => (h === "content-type" ? "application/json" : null),
      },
      json: async () => ({
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "full_name is required",
        },
      }),
    });

    const invalidData: ContactFormData = {
      fullName: "",
      email: "test@example.com",
      phone: "",
      message: "Testing message",
    };

    await expect(submitContactForm(invalidData)).rejects.toThrow("full_name is required");
  });

  it("handles network failure cleanly without crashing", async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));

    const formData: ContactFormData = {
      fullName: "Alex Henderson",
      email: "alex@example.com",
      message: "Inquiry message with more than 10 characters",
    };

    try {
      await submitContactForm(formData);
      expect.unreachable("Should have thrown ApiClientError");
    } catch (err: any) {
      expect(err).toBeInstanceOf(ApiClientError);
      expect(err.code).toBe("NETWORK_ERROR");
      expect(err.message).toContain("Unable to connect to the backend server");
    }
  });
});

