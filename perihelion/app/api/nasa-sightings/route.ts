import { NextResponse } from "next/server";

const SBDB = "https://ssd-api.jpl.nasa.gov/sbdb.api";
const HORIZONS = "https://ssd.jpl.nasa.gov/api/horizons.api";

export type NasaSightingsResponse =
  | {
      applicable: true;
      designation: string;
      name?: string;
      kind?: string;
      orbitClass?: string;
      note?: string;
    }
  | { applicable: false; reason: string };

// Static table for major solar-system bodies not covered by SBDB (which only handles small bodies).
// Planets, dwarf planets, the Sun, and notable moons are finite and well-known.
const MAJOR_BODIES: Record<string, { name: string; designation: string; kind: string }> = {
  // Sun
  sun: { name: "Sun", designation: "10", kind: "Star" },
  // Major planets
  mercury: { name: "Mercury", designation: "199", kind: "Planet" },
  venus: { name: "Venus", designation: "299", kind: "Planet" },
  earth: { name: "Earth", designation: "399", kind: "Planet" },
  terra: { name: "Earth", designation: "399", kind: "Planet" },
  mars: { name: "Mars", designation: "499", kind: "Planet" },
  jupiter: { name: "Jupiter", designation: "599", kind: "Planet" },
  saturn: { name: "Saturn", designation: "699", kind: "Planet" },
  uranus: { name: "Uranus", designation: "799", kind: "Planet" },
  neptune: { name: "Neptune", designation: "899", kind: "Planet" },
  // Dwarf planets (Ceres is also in SBDB and handled there first)
  pluto: { name: "Pluto", designation: "999", kind: "Dwarf Planet" },
  eris: { name: "Eris", designation: "136199", kind: "Dwarf Planet" },
  makemake: { name: "Makemake", designation: "136472", kind: "Dwarf Planet" },
  haumea: { name: "Haumea", designation: "136108", kind: "Dwarf Planet" },
  // Earth's Moon
  moon: { name: "Moon", designation: "301", kind: "Natural Satellite" },
  luna: { name: "Moon", designation: "301", kind: "Natural Satellite" },
  // Mars moons
  phobos: { name: "Phobos", designation: "401", kind: "Natural Satellite" },
  deimos: { name: "Deimos", designation: "402", kind: "Natural Satellite" },
  // Galilean moons
  io: { name: "Io", designation: "501", kind: "Natural Satellite" },
  europa: { name: "Europa", designation: "502", kind: "Natural Satellite" },
  ganymede: { name: "Ganymede", designation: "503", kind: "Natural Satellite" },
  callisto: { name: "Callisto", designation: "504", kind: "Natural Satellite" },
  // Saturn moons
  mimas: { name: "Mimas", designation: "601", kind: "Natural Satellite" },
  enceladus: { name: "Enceladus", designation: "602", kind: "Natural Satellite" },
  tethys: { name: "Tethys", designation: "603", kind: "Natural Satellite" },
  dione: { name: "Dione", designation: "604", kind: "Natural Satellite" },
  rhea: { name: "Rhea", designation: "605", kind: "Natural Satellite" },
  titan: { name: "Titan", designation: "606", kind: "Natural Satellite" },
  iapetus: { name: "Iapetus", designation: "608", kind: "Natural Satellite" },
  // Uranus moons
  miranda: { name: "Miranda", designation: "705", kind: "Natural Satellite" },
  ariel: { name: "Ariel", designation: "701", kind: "Natural Satellite" },
  umbriel: { name: "Umbriel", designation: "702", kind: "Natural Satellite" },
  titania: { name: "Titania", designation: "703", kind: "Natural Satellite" },
  oberon: { name: "Oberon", designation: "704", kind: "Natural Satellite" },
  // Neptune moons
  triton: { name: "Triton", designation: "801", kind: "Natural Satellite" },
  // Pluto moons
  charon: { name: "Charon", designation: "901", kind: "Natural Satellite" },
};

async function trySBDB(q: string): Promise<NasaSightingsResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  try {
    const res = await fetch(`${SBDB}?sstr=${encodeURIComponent(q)}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timer);

    if (!res.ok) return { applicable: false, reason: "not_a_small_body_or_unknown" };

    const json = (await res.json()) as {
      object?: {
        designation?: string;
        name?: string;
        kind?: string;
        orbit_class?: { name?: string };
      };
      count?: number;
      list?: Array<{ designation: string; name?: string; kind?: string }>;
      message?: string;
    };

    if (json.message) return { applicable: false, reason: "api_error" };

    if (json.count && json.list && json.list.length > 0) {
      const first = json.list[0];
      return {
        applicable: true,
        designation: first.designation,
        name: first.name,
        kind: first.kind,
        note: `NASA JPL SBDB — matched ${json.count} record(s); showing first result`,
      } satisfies NasaSightingsResponse;
    }

    const obj = json.object;
    if (!obj?.designation) return { applicable: false, reason: "not_a_small_body_or_unknown" };

    return {
      applicable: true,
      designation: obj.designation,
      name: obj.name,
      kind: obj.kind,
      orbitClass: obj.orbit_class?.name,
      note: "NASA JPL SBDB — solar-system small-body record",
    } satisfies NasaSightingsResponse;
  } catch {
    clearTimeout(timer);
    return { applicable: false, reason: "sbdb_error" };
  }
}

async function tryHorizons(q: string): Promise<NasaSightingsResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  try {
    const url = new URL(HORIZONS);
    url.searchParams.set("format", "json");
    url.searchParams.set("COMMAND", q);
    url.searchParams.set("OBJ_DATA", "YES");
    url.searchParams.set("MAKE_EPHEM", "NO");

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: "application/json", "User-Agent": "Perihelion/1.0" },
    });
    clearTimeout(timer);

    if (!res.ok) return { applicable: false, reason: "not_a_solar_system_body" };

    const json = (await res.json()) as { result?: string };
    const result = json.result ?? "";

    if (!result || result.trimStart().startsWith("!")) {
      return { applicable: false, reason: "not_a_solar_system_body" };
    }

    // Try "Target body name: Mars (499)" — present in ephemeris-mode output
    const headerMatch = result.match(/Target body name:\s*([^\n{]+)/);
    // Fallback: "Mars (499)" anywhere in the result
    const bodyMatch = result.match(/\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\s*\((\d+)\)/);

    let name: string;
    let designation: string;

    if (headerMatch) {
      const fullName = headerMatch[1].trim();
      const parts = fullName.match(/^(.+?)\s*\((\w+)\)\s*$/);
      name = parts ? parts[1].trim() : fullName;
      designation = parts ? parts[2] : fullName;
    } else if (bodyMatch) {
      name = bodyMatch[1].trim();
      designation = bodyMatch[2];
    } else {
      // Result is non-error but unparseable — still report as applicable
      name = q;
      designation = q;
    }

    return {
      applicable: true,
      designation,
      name,
      note: "NASA JPL Horizons — solar-system body",
    } satisfies NasaSightingsResponse;
  } catch {
    clearTimeout(timer);
    return { applicable: false, reason: "horizons_error" };
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ error: "missing q" }, { status: 400 });

  // 1. SBDB — authoritative for asteroids, comets, dwarf planets
  const sbdb = await trySBDB(q);
  if (sbdb.applicable) return NextResponse.json(sbdb);

  // 2. Static table — major planets, moons, dwarf planets, Sun (no API call needed)
  const staticHit = MAJOR_BODIES[q.toLowerCase()];
  if (staticHit) {
    return NextResponse.json({
      applicable: true,
      designation: staticHit.designation,
      name: staticHit.name,
      kind: staticHit.kind,
      note: "NASA JPL Horizons — major solar-system body",
    } satisfies NasaSightingsResponse);
  }

  // 3. Horizons — catches anything else (uncommon moons, barycenters, etc.)
  const horizons = await tryHorizons(q);
  return NextResponse.json(horizons);
}
