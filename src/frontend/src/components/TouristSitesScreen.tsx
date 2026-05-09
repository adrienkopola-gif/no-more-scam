import { Info, Landmark, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type MoroccoRegion, moroccoRegions } from "../data/touristSites";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// ─── Region configuration ────────────────────────────────────────────────────
// Region ids in touristSites now directly match the SVG label_point ids (MA01–MA12)

// Colors per region (fill / hover)
const REGION_COLORS: Record<string, { fill: string; hover: string }> = {
  MA01: { fill: "#4E9AF1", hover: "#2563EB" },
  MA02: { fill: "#F4A460", hover: "#D2691E" },
  MA03: { fill: "#90EE90", hover: "#22C55E" },
  MA04: { fill: "#DDA0DD", hover: "#A855F7" },
  MA05: { fill: "#F0E68C", hover: "#EAB308" },
  MA06: { fill: "#87CEEB", hover: "#0EA5E9" },
  MA07: { fill: "#FFA07A", hover: "#F97316" },
  MA08: { fill: "#98FB98", hover: "#16A34A" },
  MA09: { fill: "#F08080", hover: "#EF4444" },
  MA10: { fill: "#B0C4DE", hover: "#64748B" },
  MA11: { fill: "#FFDAB9", hover: "#FB923C" },
  MA12: { fill: "#C0C0C0", hover: "#6B7280" },
};

// Label point centers for each region (from SVG label_points)
const REGION_CENTERS: Record<string, { cx: number; cy: number }> = {
  MA01: { cx: 692.1, cy: 98.1 },
  MA02: { cx: 850.8, cy: 191.3 },
  MA03: { cx: 725.4, cy: 173 },
  MA04: { cx: 644.7, cy: 171.3 },
  MA05: { cx: 643.5, cy: 260.3 },
  MA06: { cx: 581.3, cy: 228.6 },
  MA07: { cx: 531.2, cy: 318.7 },
  MA08: { cx: 706.3, cy: 346.5 },
  MA09: { cx: 531, cy: 421.9 },
  MA10: { cx: 457.4, cy: 508.6 },
  MA11: { cx: 316.9, cy: 610.4 },
  MA12: { cx: 212.6, cy: 835 },
};

// ─── Morocco SVG Map Component ───────────────────────────────────────────────
// Loads the official Simplemaps SVG and renders it with interactive regions.
export function MoroccoSVGMap({
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: {
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgPaths, setSvgPaths] = useState<
    Array<{ maCode: string; d: string }>
  >([]);

  // Load and parse the official SVG, then use isPointInFill() for accurate
  // region-to-path assignment (point-in-polygon via DOM hit testing).
  useEffect(() => {
    fetch("/assets/morocco-map.svg")
      .then((r) => r.text())
      .then((text) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(text, "image/svg+xml");
        const svgEl = svgDoc.documentElement as unknown as SVGSVGElement;

        // Temporarily mount to the live DOM so isPointInFill() works
        svgEl.style.position = "absolute";
        svgEl.style.visibility = "hidden";
        svgEl.style.width = "0";
        svgEl.style.height = "0";
        svgEl.style.pointerEvents = "none";
        document.body.appendChild(svgEl);

        const rawPaths = Array.from(
          svgEl.querySelectorAll("#features path"),
        ) as SVGGeometryElement[];

        const labelCircles = Array.from(
          svgEl.querySelectorAll("#label_points circle"),
        );

        const assigned: Array<{ maCode: string; d: string }> = [];

        for (const circle of labelCircles) {
          const maCode = circle.getAttribute("id") ?? "";
          if (!maCode.startsWith("MA")) continue;

          const cx = Number.parseFloat(circle.getAttribute("cx") ?? "0");
          const cy = Number.parseFloat(circle.getAttribute("cy") ?? "0");

          const pt = svgEl.createSVGPoint();
          pt.x = cx;
          pt.y = cy;

          for (const path of rawPaths) {
            try {
              if (path.isPointInFill(pt)) {
                const d = path.getAttribute("d") ?? "";
                assigned.push({ maCode, d });
                break;
              }
            } catch {
              // ignore hit-test errors
            }
          }
        }

        // Remove from live DOM
        document.body.removeChild(svgEl);

        setSvgPaths(assigned);
      })
      .catch(() => {
        // Silently fail — map won't render but page stays functional
      });
  }, []);

  const getPathStyle = (maCode: string) => {
    const colors = REGION_COLORS[maCode] ?? { fill: "#888", hover: "#555" };
    const isSelected = selectedId === maCode;
    const isHovered = hoveredId === maCode;
    return {
      fill: isSelected || isHovered ? colors.hover : colors.fill,
      fillOpacity: isSelected ? 1 : isHovered ? 0.9 : 0.8,
      stroke: "#ffffff",
      strokeWidth: isSelected ? 1.5 : 0.8,
      cursor: "pointer" as const,
      transition: "fill 0.15s ease, fill-opacity 0.15s ease",
      filter: isSelected
        ? "brightness(1.08) drop-shadow(0 0 4px rgba(0,0,0,0.3))"
        : undefined,
      outline: "none" as const,
    };
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 1000"
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
      role="img"
      aria-label="Carte interactive des 12 régions du Maroc"
      style={{ display: "block" }}
    >
      <title>Carte des régions du Maroc</title>
      {svgPaths.map(({ maCode, d }) => {
        const region = moroccoRegions.find((r) => r.id === maCode);
        const center = REGION_CENTERS[maCode];
        return (
          <g key={maCode}>
            <path
              d={d}
              style={getPathStyle(maCode)}
              onClick={() => onSelect(maCode)}
              onMouseEnter={() => onHover(maCode)}
              onMouseLeave={() => onHover(null)}
              role="button"
              tabIndex={0}
              aria-label={region ? `Région ${region.name}` : maCode}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(maCode);
              }}
            />
            {/* Region code label */}
            {center && (
              <text
                x={center.cx}
                y={center.cy}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontWeight="700"
                fill="rgba(0,0,0,0.65)"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="2"
                paintOrder="stroke"
                pointerEvents="none"
                style={{
                  userSelect: "none",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {maCode}
              </text>
            )}
          </g>
        );
      })}
      {svgPaths.length === 0 && (
        <text x="500" y="500" textAnchor="middle" fontSize="20" fill="#999">
          Chargement de la carte…
        </text>
      )}
    </svg>
  );
}

// ─── Site Card ────────────────────────────────────────────────────────────────
export function SiteCard({
  site,
  index,
}: {
  site: MoroccoRegion["sites"][0];
  index: number;
}) {
  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-shadow duration-200 border border-border"
      data-ocid={`sites.site_card.${index + 1}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <span
            className="text-3xl leading-none mt-0.5 flex-shrink-0"
            role="img"
            aria-label={site.name}
          >
            {site.icon}
          </span>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base leading-snug">
              {site.name}
            </CardTitle>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
              <span className="text-xs text-muted-foreground truncate">
                {site.city}
              </span>
            </div>
          </div>
          {site.tips.length > 0 && (
            <Badge variant="secondary" className="text-xs shrink-0">
              {site.tips.length} conseil{site.tips.length > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {site.description}
        </p>
        {site.tips.length > 0 && (
          <div className="space-y-1.5">
            {site.tips.map((tip) => (
              <div
                key={tip.slice(0, 40)}
                className="flex items-start gap-2 bg-muted/60 rounded-md px-2.5 py-1.5"
              >
                <Info className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" />
                <p className="text-xs text-foreground leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        )}
        {site.mapUrl && (
          <a
            href={site.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors duration-200 group"
            data-ocid={`sites.map_link.${site.id}`}
          >
            <MapPin className="h-3.5 w-3.5 group-hover:text-primary transition-colors" />
            <span className="underline underline-offset-2 decoration-dotted group-hover:decoration-solid">
              Voir sur la carte
            </span>
          </a>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Selected Region Panel ────────────────────────────────────────────────────
export function RegionPanel({ region }: { region: MoroccoRegion }) {
  return (
    <div data-ocid="sites.region_panel">
      <div
        className="rounded-xl border px-5 py-4 mb-5"
        style={{
          background: `color-mix(in srgb, ${region.color} 35%, transparent)`,
          borderColor: region.hoverColor,
        }}
      >
        <div className="flex items-start gap-3">
          <span
            className="w-5 h-5 rounded-full border-2 border-white/70 shadow-sm flex-shrink-0 mt-1"
            style={{ background: region.hoverColor }}
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <h3
              className="text-xl font-bold text-foreground"
              data-ocid="sites.region_name"
            >
              {region.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5 mb-2">
              {region.description}
            </p>
            {region.cities && region.cities.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {region.cities.map((city) => (
                  <span
                    key={city}
                    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border"
                    style={{
                      background: `color-mix(in srgb, ${region.color} 60%, white)`,
                      borderColor: region.hoverColor,
                      color: "inherit",
                    }}
                  >
                    <MapPin className="h-2.5 w-2.5" />
                    {city}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4" data-ocid="sites.site_cards_list">
        {region.sites.map((site, index) => (
          <SiteCard key={site.id} site={site} index={index} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function TouristSitesScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const selectedRegion: MoroccoRegion | null = selectedId
    ? (moroccoRegions.find((r) => r.id === selectedId) ?? null)
    : null;

  const hoveredRegion: MoroccoRegion | null = hoveredId
    ? (moroccoRegions.find((r) => r.id === hoveredId) ?? null)
    : null;

  function handleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        document
          .getElementById("sites-right-panel")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }

  return (
    <div className="container pt-24 pb-8">
      {/* Page Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Landmark className="h-8 w-8 text-primary" />
          Explorez les régions du Maroc
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Cliquez sur la carte ou sur une région pour découvrir les villes et
          sites touristiques
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT — Interactive Map (sticky on desktop) */}
        <div className="w-full lg:w-[55%] lg:flex-shrink-0">
          <div data-ocid="sites.map_panel">
            <Card className="overflow-visible border border-border shadow-sm">
              <div className="bg-muted/20 px-4 pt-4 pb-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🗺️</span>
                    <span className="text-sm font-semibold text-foreground">
                      Carte officielle du Maroc
                    </span>
                  </div>
                  {hoveredRegion && (
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full border"
                      style={{
                        background: `color-mix(in srgb, ${hoveredRegion.color} 50%, transparent)`,
                        borderColor: hoveredRegion.hoverColor,
                        color: "inherit",
                      }}
                    >
                      {hoveredRegion.name}
                    </span>
                  )}
                </div>

                {/* SVG Map Container — no fixed height, no overflow-hidden */}
                <div style={{ width: "100%", overflow: "visible" }}>
                  <MoroccoSVGMap
                    selectedId={selectedId}
                    hoveredId={hoveredId}
                    onSelect={handleSelect}
                    onHover={setHoveredId}
                  />
                </div>
              </div>

              {/* Region legend */}
              <div className="px-4 py-3 border-t border-border/50">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Régions — Cliquez pour explorer
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                  {moroccoRegions.map((region, i) => (
                    <button
                      key={region.id}
                      type="button"
                      onClick={() => handleSelect(region.id)}
                      data-ocid={`sites.legend_item.${i + 1}`}
                      className={[
                        "flex items-center gap-1.5 rounded px-1.5 py-1 transition-colors text-left w-full text-xs",
                        selectedId === region.id
                          ? "bg-muted/70 font-semibold"
                          : "hover:bg-muted/40",
                      ].join(" ")}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: region.hoverColor }}
                        aria-hidden="true"
                      />
                      <span className="text-foreground leading-tight truncate">
                        <span className="text-muted-foreground mr-0.5">
                          {i + 1}.
                        </span>
                        {region.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-4 pb-2">
                <p className="text-[10px] text-muted-foreground/50 text-center">
                  Source : données Simplemaps.com — Licence CC0
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* RIGHT — Region details */}
        <div className="w-full lg:flex-1 min-w-0" id="sites-right-panel">
          {selectedRegion ? (
            <RegionPanel region={selectedRegion} />
          ) : (
            <div
              className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-border bg-muted/20"
              data-ocid="sites.empty_state"
            >
              <span className="text-6xl mb-4">🗺️</span>
              <p className="text-lg font-medium text-foreground mb-1">
                Choisissez une région pour commencer
              </p>
              <p className="text-muted-foreground text-sm max-w-sm">
                Cliquez directement sur la carte ou sur l'une des régions dans
                la légende pour découvrir ses villes et sites touristiques
                incontournables.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
