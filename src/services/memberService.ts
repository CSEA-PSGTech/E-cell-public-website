import { teamMembers as fallbackTeamMembers, type TeamMember, type TeamVertical } from "@/data/team";

function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "EC"
  );
}

/**
 * Fetches the team members from the backend REST API GET /api/members.
 * The backend handles Google Sheets API v4 authentication, mapping, and caching.
 * Falls back to local fallbackTeamMembers if the network or backend is unavailable.
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  if (import.meta.env.VITE_USE_MOCK_API === "true") {
    return fallbackTeamMembers;
  }

  try {
    const rawBase =
      import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_URL ||
      "";
    const base = rawBase.replace(/\/+$/, "");
    const endpoint = base
      ? base.endsWith("/api")
        ? `${base}/members`
        : `${base}/api/members`
      : "/api/members";

    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`Failed to load members: status ${res.status}`);
    }

    const data = await res.json();
    if (Array.isArray(data?.members) && data.members.length > 0) {
      return data.members.map((m: any, idx: number) => {
        const rawVertical = (m.vertical || "").toString().trim();
        const vertical: TeamVertical =
          rawVertical === "Heads" || rawVertical === "Technical" || rawVertical === "Core Team"
            ? rawVertical
            : "Core Team";

        return {
          id: String(m.id || `member-${idx}`),
          name: m.name || "Member",
          role: m.role || m.position || (vertical === "Core Team" ? "Core Member" : "Team Member"),
          vertical,
          initials: m.initials || getInitials(m.name || ""),
          department: m.department || m.yearAndClass || "PSG Tech E-Cell",
          location: m.location || "Coimbatore",
          image: m.image || m.photo || undefined,
          linkedin: m.linkedin || undefined,
          email: m.email || undefined,
        };
      });
    }
  } catch (err) {
    console.warn("[memberService] Backend unavailable, using fallback team members:", err);
  }

  return fallbackTeamMembers;
}
