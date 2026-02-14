"use client";

import { useEffect, useState, useCallback } from "react";

interface SectionInfo {
  selector: string;
  label: string;
  top: number;
  bottom: number;
  height: number;
  paddingTop: number;
  paddingBottom: number;
  contentTop: number; // top + paddingTop (where actual content starts)
  contentBottom: number; // bottom - paddingBottom (where actual content ends)
}

interface GapInfo {
  fromLabel: string;
  toLabel: string;
  /** Distance from last content bottom to next content top */
  contentGap: number;
  /** Absolute Y where previous content ends */
  contentEndY: number;
  /** Absolute Y where next content starts */
  contentStartY: number;
  /** Physical gap between section boxes (0 if touching) */
  physicalGap: number;
  fromPaddingBottom: number;
  toPaddingTop: number;
}

const SECTION_ORDER = [
  { selector: "#hero", label: "Hero Carousel" },
  { selector: "#stats", label: "University Stats" },
  { selector: "[data-section='feature-showcase']", label: "Feature Showcase" },
  { selector: "#values", label: "Core Values" },
  { selector: "#history", label: "Video Introduction" },
  { selector: "#leadership", label: "Leadership" },
  { selector: "#units", label: "Units" },
  { selector: "#partners", label: "Partners" },
  { selector: "#news", label: "News" },
];

export default function SpacingDebug() {
  const [sections, setSections] = useState<SectionInfo[]>([]);
  const [gaps, setGaps] = useState<GapInfo[]>([]);
  const [visible, setVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [containerPadding, setContainerPadding] = useState<{
    left: number;
    right: number;
    containerLeft: number;
    containerRight: number;
  } | null>(null);

  const measure = useCallback(() => {
    const sy = window.scrollY;
    const measured: SectionInfo[] = [];

    for (const s of SECTION_ORDER) {
      const el = document.querySelector(s.selector) as HTMLElement | null;
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      const computed = window.getComputedStyle(el);
      const pt = parseFloat(computed.paddingTop) || 0;
      const pb = parseFloat(computed.paddingBottom) || 0;
      const absTop = rect.top + sy;
      const absBottom = rect.bottom + sy;

      measured.push({
        selector: s.selector,
        label: s.label,
        top: Math.round(absTop),
        bottom: Math.round(absBottom),
        height: Math.round(rect.height),
        paddingTop: Math.round(pt),
        paddingBottom: Math.round(pb),
        contentTop: Math.round(absTop + pt),
        contentBottom: Math.round(absBottom - pb),
      });
    }

    setSections(measured);

    // Gaps: from content-bottom of section[i] to content-top of section[i+1]
    const gapInfos: GapInfo[] = [];
    for (let i = 0; i < measured.length - 1; i++) {
      const curr = measured[i];
      const next = measured[i + 1];

      const contentGap = next.contentTop - curr.contentBottom;
      const physicalGap = next.top - curr.bottom; // 0 if sections touch

      gapInfos.push({
        fromLabel: curr.label,
        toLabel: next.label,
        contentGap: Math.round(contentGap),
        contentEndY: curr.contentBottom,
        contentStartY: next.contentTop,
        physicalGap: Math.round(physicalGap),
        fromPaddingBottom: curr.paddingBottom,
        toPaddingTop: next.paddingTop,
      });
    }

    setGaps(gapInfos);

    // Measure Container padding-x from a real Container element on the page
    const containerEl = document.querySelector(
      "[class*='max-w-'][class*='px-']",
    ) as HTMLElement | null;
    if (containerEl) {
      const computed = window.getComputedStyle(containerEl);
      const rect = containerEl.getBoundingClientRect();
      setContainerPadding({
        left: parseFloat(computed.paddingLeft) || 0,
        right: parseFloat(computed.paddingRight) || 0,
        containerLeft: rect.left,
        containerRight: rect.right,
      });
    }
  }, []);

  // Track scroll position for overlay positioning
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Measure on mount + resize
  useEffect(() => {
    const timer = setTimeout(measure, 1000);
    const handleResize = () => setTimeout(measure, 300);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [measure]);

  if (!visible) return null;

  // Check if all gaps are equal
  const allEqual =
    gaps.length > 0 && gaps.every((g) => g.contentGap === gaps[0].contentGap);

  return (
    <>
      {/* Fixed summary panel */}
      <div className="fixed top-4 left-4 z-[9999] font-mono text-xs select-none">
        <button
          onClick={() => setVisible(false)}
          className="mb-2 px-3 py-1.5 bg-red-600 text-white rounded-md shadow-lg hover:bg-red-700 transition-colors"
        >
          ✕ Close Debug
        </button>

        <div className="bg-black/90 text-white p-4 rounded-xl shadow-2xl max-h-[70vh] overflow-y-auto w-[380px] backdrop-blur-sm border border-white/10">
          <h3 className="font-bold text-sm mb-1 text-yellow-400">
            📐 Section Spacing Debug
          </h3>
          <p className="text-gray-500 text-[10px] mb-3">
            Content gap = pb(prev) + physical gap + pt(next)
          </p>

          {allEqual && (
            <div className="mb-3 px-2 py-1 bg-green-900/50 rounded border border-green-500/30 text-green-400 text-[11px]">
              ✓ All content gaps are equal: {gaps[0].contentGap}px
            </div>
          )}

          {/* Sections table */}
          <table className="w-full text-[10px] mb-4">
            <thead>
              <tr className="text-gray-500 border-b border-white/10">
                <th className="text-left py-1">Section</th>
                <th className="text-right py-1">pt</th>
                <th className="text-right py-1">pb</th>
                <th className="text-right py-1">height</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((s) => (
                <tr key={s.selector} className="border-b border-white/5">
                  <td className="text-blue-300 py-0.5">{s.label}</td>
                  <td className="text-right text-green-400 font-semibold">
                    {s.paddingTop}
                  </td>
                  <td className="text-right text-green-400 font-semibold">
                    {s.paddingBottom}
                  </td>
                  <td className="text-right text-gray-400">{s.height}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Gaps table */}
          <h4 className="font-bold text-sm mb-2 text-orange-400">
            ↕ Content Gaps
          </h4>
          <table className="w-full text-[10px]">
            <thead>
              <tr className="text-gray-500 border-b border-white/10">
                <th className="text-left py-1">Between</th>
                <th className="text-right py-1">Gap</th>
                <th className="text-right py-1">Breakdown</th>
              </tr>
            </thead>
            <tbody>
              {gaps.map((g, i) => {
                const isConsistent = g.contentGap === gaps[0]?.contentGap;
                return (
                  <tr key={i} className="border-b border-white/5">
                    <td className="text-purple-300 py-1 max-w-[140px] truncate">
                      {g.fromLabel} → {g.toLabel}
                    </td>
                    <td
                      className={`text-right font-bold ${isConsistent ? "text-green-400" : "text-red-400"}`}
                    >
                      {g.contentGap}px
                    </td>
                    <td className="text-right text-gray-500">
                      {g.fromPaddingBottom}+{g.physicalGap}+{g.toPaddingTop}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual overlay — absolute lines that scroll with page */}
      {gaps.map((g, i) => {
        const topOnScreen = g.contentEndY - scrollY;
        const heightOnScreen = g.contentStartY - g.contentEndY;

        // Only render if visible in viewport (±200px buffer)
        if (
          topOnScreen + heightOnScreen < -200 ||
          topOnScreen > window.innerHeight + 200
        )
          return null;

        const isConsistent = g.contentGap === gaps[0]?.contentGap;
        const color = isConsistent ? "green" : "red";

        return (
          <div
            key={i}
            className="fixed left-0 right-0 pointer-events-none z-[9998]"
            style={{
              top: `${topOnScreen}px`,
              height: `${heightOnScreen}px`,
            }}
          >
            {/* Shaded gap area */}
            <div
              className={`absolute inset-0 ${isConsistent ? "bg-green-500/[0.05]" : "bg-red-500/[0.07]"}`}
            />

            {/* Top boundary — content end of previous section */}
            <div
              className={`absolute top-0 left-0 right-0 border-t-2 border-dashed ${isConsistent ? "border-green-500/50" : "border-red-500/50"}`}
            />
            {/* Bottom boundary — content start of next section */}
            <div
              className={`absolute bottom-0 left-0 right-0 border-t-2 border-dashed ${isConsistent ? "border-green-500/50" : "border-blue-500/50"}`}
            />

            {/* LEFT vertical measurement arrow */}
            <div className="absolute left-6 top-0 bottom-0 flex flex-col items-center">
              <div
                className={`w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent -mt-[1px] ${color === "green" ? "border-b-green-500" : "border-b-red-500"}`}
              />
              <div
                className={`flex-1 w-[2px] ${color === "green" ? "bg-green-500/60" : "bg-red-500/60"}`}
              />
              <div
                className={`w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent -mb-[1px] ${color === "green" ? "border-t-green-500" : "border-t-red-500"}`}
              />
            </div>

            {/* RIGHT vertical measurement arrow */}
            <div className="absolute right-6 top-0 bottom-0 flex flex-col items-center">
              <div
                className={`w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent -mt-[1px] ${color === "green" ? "border-b-green-500" : "border-b-red-500"}`}
              />
              <div
                className={`flex-1 w-[2px] ${color === "green" ? "bg-green-500/60" : "bg-red-500/60"}`}
              />
              <div
                className={`w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent -mb-[1px] ${color === "green" ? "border-t-green-500" : "border-t-red-500"}`}
              />
            </div>

            {/* Center label */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
              <div
                className={`px-3 py-1 rounded-full text-[11px] font-bold shadow-lg whitespace-nowrap ${
                  isConsistent
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                {g.contentGap}px
              </div>
              <span className="text-[9px] text-gray-500 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                {g.fromLabel} ↔ {g.toLabel}
              </span>
            </div>
          </div>
        );
      })}

      {/* Container padding-x guides */}
      {containerPadding && (
        <>
          {/* Left padding zone */}
          <div
            className="fixed top-0 bottom-0 z-[9997] pointer-events-none bg-purple-500/[0.06] border-r-2 border-dashed border-purple-500/50"
            style={{
              left: `${containerPadding.containerLeft}px`,
              width: `${containerPadding.left}px`,
            }}
          />
          {/* Left padding label */}
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{
              left: `${containerPadding.containerLeft}px`,
              top: "50%",
              width: `${containerPadding.left}px`,
            }}
          >
            <div className="flex items-center justify-center">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white shadow-lg whitespace-nowrap">
                {Math.round(containerPadding.left)}px
              </span>
            </div>
          </div>

          {/* Right padding zone */}
          <div
            className="fixed top-0 bottom-0 z-[9997] pointer-events-none bg-purple-500/[0.06] border-l-2 border-dashed border-purple-500/50"
            style={{
              left: `${containerPadding.containerRight - containerPadding.right}px`,
              width: `${containerPadding.right}px`,
            }}
          />
          {/* Right padding label */}
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{
              left: `${containerPadding.containerRight - containerPadding.right}px`,
              top: "50%",
              width: `${containerPadding.right}px`,
            }}
          >
            <div className="flex items-center justify-center">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white shadow-lg whitespace-nowrap">
                {Math.round(containerPadding.right)}px
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
