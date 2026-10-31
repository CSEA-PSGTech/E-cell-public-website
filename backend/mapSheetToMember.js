/**
 * Helper to determine member vertical (Heads, Technical, Core Team)
 * Handles both explicit verticals and intelligent inference from the member's Position/Role.
 */
function determineVertical(verticalRaw, positionRaw) {
  const v = (verticalRaw || "").trim().toLowerCase();
  if (v === "heads" || v === "head") return "Heads";
  if (v === "technical" || v === "tech") return "Technical";
  if (v === "core team" || v === "core") return "Core Team";

  const pos = (positionRaw || "").trim().toLowerCase();
  if (
    pos.includes("director") ||
    pos.includes("manager") ||
    pos.includes("head")
  ) {
    return "Heads";
  }
  if (
    pos.includes("technical") ||
    pos.includes("developer") ||
    pos.includes("designer")
  ) {
    return "Technical";
  }
  return "Core Team";
}

/**
 * Extracts 2-letter uppercase initials from name.
 */
function getInitials(name) {
  return (
    (name || "")
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "EC"
  );
}

/**
 * Maps raw 2D array of rows from Google Sheets into structured member objects.
 * Compatible with frontend TeamMember interface.
 */
export function valuesToMembers(values) {
  if (!values || values.length === 0) return [];

  const headers = values[0].map((h) => (h || "").trim().toLowerCase());

  return values
    .slice(1)
    .map((row) => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = (row[i] ?? "").toString().trim();
      });

      const name = obj.name || "";
      if (!name) return null;

      const vertical = determineVertical(obj.vertical, obj.position);
      const defaultRole = vertical === "Core Team" ? "Core Member" : "Team Member";
      const role = obj.position || obj.role || defaultRole;
      const photo = obj.photo || obj.url || obj.image || "";
      const id =
        obj.id ||
        obj["roll no"] ||
        obj["roll number"] ||
        obj.roll ||
        name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      return {
        id: String(id),
        roll: obj.roll || obj["roll no"] || obj["roll number"] || obj.rollno || obj.id || "",
        name: name,
        position: role,
        role: role,
        vertical: vertical,
        initials: getInitials(name),
        yearAndClass: obj["year and class"] || obj.year || obj.batch || obj.class || "",
        year: obj.year || obj["year and class"] || obj.batch || obj.class || "",
        department: obj["year and class"] || obj.year || "PSG Tech E-Cell",
        location: "Coimbatore",
        photo: photo,
        image: photo,
        github: obj.github || "",
        linkedin: obj.linkedin || "",
        email: obj.email || "",
      };
    })
    .filter(Boolean);
}
