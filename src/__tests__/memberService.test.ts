import { describe, it, expect, vi, afterEach } from "vitest";
import { getTeamMembers } from "@/services/memberService";
import { teamMembers as fallbackTeamMembers } from "@/data/team";

describe("memberService API integration", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("fetches members from /api/members and normalizes them correctly", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        members: [
          {
            id: "1",
            name: "Sanjay J",
            position: "Director",
            vertical: "Heads",
            yearAndClass: "Final Year CSE AIML",
            photo: "https://example.com/sanjay.png",
          },
          {
            id: "25",
            name: "Agnesh K K",
            position: "Technical",
            vertical: "Technical",
            yearAndClass: "Pre Final Year CSE G1",
            photo: "",
          },
        ],
      }),
    });

    const members = await getTeamMembers();

    expect(members).toHaveLength(2);

    const agnesh = members.find((m) => m.name === "Agnesh K K");
    expect(agnesh).toBeDefined();
    expect(agnesh?.vertical).toBe("Technical");
    expect(agnesh?.role).toBe("Technical");
    expect(agnesh?.initials).toBe("AK");
    expect(agnesh?.department).toBe("Pre Final Year CSE G1");
  });

  it("gracefully returns fallbackTeamMembers when backend endpoint fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Connection refused"));

    const members = await getTeamMembers();

    expect(members).toEqual(fallbackTeamMembers);
    expect(members.length).toBeGreaterThan(0);
    expect(members.some((m) => m.name === "Agnesh K K")).toBe(true);
  });
});
