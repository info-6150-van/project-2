import { NextResponse } from "next/server";

// SIMBAD TAP Query //

const SIMBAD_TAP = "https://simbad.u-strasbg.fr/simbad/sim-tap/sync";

function escapeAdqlLiteral(s: string): string {
  return s.replace(/'/g, "''").trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ error: "missing q" }, { status: 400 });
  }

  const ident = escapeAdqlLiteral(q);
  const adql = `SELECT TOP 1 b.main_id, b.otype_txt, b.ra, b.dec
    FROM basic b
    WHERE b.oid IN (SELECT oidref FROM ident WHERE id = '${ident}')`;

  const params = new URLSearchParams({
    REQUEST: "doQuery",
    LANG: "ADQL",
    FORMAT: "json",
    QUERY: adql,
  });

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch(`${SIMBAD_TAP}?${params.toString()}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(t);

    if (!res.ok) {
      return NextResponse.json(
        { error: "simbad_unavailable", status: res.status },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      data?: unknown[][];
      metadata?: Array<{ name?: string }>;
    };

    const rows = data.data;
    if (!rows?.length) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const names = (data.metadata ?? []).map((col) =>
      String(col.name ?? "").toLowerCase(),
    );

    const effectiveNames =
      names.length > 0 ? names : ["main_id", "otype_txt", "ra", "dec"];

    const idx = (n: string) => effectiveNames.indexOf(n.toLowerCase());
    const row = rows[0]!;

    const iMain = idx("main_id");
    const iType = idx("otype_txt");
    const iRa = idx("ra");
    const iDec = idx("dec");

    const mainId = String(iMain >= 0 ? row[iMain]! : row[0] ?? "");
    const otype = String(iType >= 0 ? row[iType]! : row[1] ?? "");
    const ra = iRa >= 0 ? row[iRa] : row[2];
    const dec = iDec >= 0 ? row[iDec] : row[3];

    if (!mainId) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    return NextResponse.json({
      canonicalName: mainId,
      objectType: otype || "Unknown",
      ra: typeof ra === "number" ? ra : ra != null ? Number(ra) : undefined,
      dec: typeof dec === "number" ? dec : dec != null ? Number(dec) : undefined,
    });
  } catch (e) {
    clearTimeout(t);
    if (e instanceof Error && e.name === "AbortError") {
      return NextResponse.json({ error: "timeout" }, { status: 504 });
    }
    return NextResponse.json({ error: "lookup_failed" }, { status: 500 });
  }
}