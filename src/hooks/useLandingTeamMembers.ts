import { useState, useEffect, useCallback } from "react";
import { TeamMember, defaultTeamMembers } from "@/components/team/TeamSection";
import { getTeamMembers } from "@/services/memberService";

/**
 * Custom hook to dynamically fetch landing page team members from Google Sheets backend API or CSV export.
 * Curates ONLY the Leadership Heads for the homepage showcase carousel.
 */
export function useLandingTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>(defaultTeamMembers);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Skip network request if mock mode is explicitly turned on
    if (import.meta.env.VITE_USE_MOCK_API === "true") {
      setMembers(defaultTeamMembers);
      setLoading(false);
      return;
    }

    try {
      const allMembers = await getTeamMembers();
      if (allMembers && allMembers.length > 0) {
        // Filter strictly to Heads & Leadership for the landing page showcase
        const headsOnly = allMembers.filter((m) => {
          const v = (m.vertical || "").toLowerCase();
          const role = (m.role || "").toLowerCase();
          return (
            v === "heads" ||
            v === "head" ||
            role.includes("director") ||
            role.includes("manager") ||
            role.includes("head")
          );
        });

        if (headsOnly.length > 0) {
          const mapped: TeamMember[] = headsOnly.map((m) => ({
            name: m.name || "",
            role: m.role || "",
            image: m.image || "",
          }));
          setMembers(mapped);
        } else {
          setMembers(defaultTeamMembers);
        }
      } else {
        setMembers(defaultTeamMembers);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load members";
      console.warn("[useLandingTeamMembers] Backend unavailable:", msg);
      setError(msg);
      setMembers(defaultTeamMembers);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { members, loading, error, refetch: load };
}
