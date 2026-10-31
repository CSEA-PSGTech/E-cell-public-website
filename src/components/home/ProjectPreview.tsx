import * as React from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { WorksWheel } from "@/components/ui/works-wheel";
import { getWorksWheelItems } from "@/data/projects";
import PrismProjectShowcase from "./PrismProjectShowcase";

export default function ProjectPreview() {
  const items = React.useMemo(() => getWorksWheelItems(), []);

  return (
    <section
      id="projects"
      className="relative w-full min-h-[100dvh] lg:h-screen lg:min-h-screen bg-transparent text-[#0A0A0A] overflow-hidden flex flex-col justify-between scroll-mt-0"
      aria-label="Projects Showcase"
    >
      {/* =========================================================================
          DESKTOP / LAPTOP VIEW (lg+): Enhanced 6-card circular wheel
          ========================================================================= */}
      <div className="hidden lg:flex flex-col justify-between w-full h-full relative overflow-hidden flex-1">
        {/* Top Section Header: Clean branding without redundant badges */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 lg:px-12 py-6 sm:py-7 pointer-events-none">
          <div className="flex flex-col gap-1 pointer-events-auto">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2547FF]">
              Innovation Showcase
            </span>
            <h2 className="text-xl lg:text-2xl font-display font-semibold tracking-[-0.015em] text-[#0A0A0A]">
              Featured Projects
            </h2>
          </div>
        </div>

        {/* WorksWheel Interactive Canvas - Frozen in ring state with blurred cards & central COMING SOON */}
        <div className="w-full h-full flex-1 relative">
          <WorksWheel
            items={items}
            label="COMING SOON"
            action="View"
            frozen={true}
            className="w-full h-full"
          />
        </div>

        {/* Bottom Bar: Centered action pair and spacer on right */}
        <div className="absolute bottom-6 sm:bottom-8 left-8 lg:left-12 right-8 lg:right-12 z-20 flex items-center justify-between pointer-events-none">
          <div aria-hidden="true" className="w-14" />

          {/* Centered Actions: Disabled "View All Projects" with original text + Active Meet the Team */}
          <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-3.5">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="w-auto h-11 sm:h-12 px-6 sm:px-7 rounded-full inline-flex items-center justify-center gap-2.5 text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.06em] text-white/80 bg-[#2547FF]/75 border border-[#2547FF]/50 shadow-xs cursor-not-allowed select-none text-center"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4 text-white/80" />
            </button>

            <button
              type="button"
              onClick={() =>
                document.getElementById("team")?.scrollIntoView({ behavior: "smooth" })
              }
              className="w-auto h-11 sm:h-12 px-6 sm:px-7 rounded-full inline-flex items-center justify-center gap-2.5 text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.06em] text-[#0A0A0A] hover:text-[#2547FF] bg-white/95 hover:bg-white border border-black/10 hover:border-[#2547FF]/40 shadow-xs hover:shadow-md active:scale-95 transition-all group cursor-pointer backdrop-blur-md text-center"
            >
              <span>Meet The Team</span>
              <ArrowDown className="w-4 h-4 text-[#2547FF] transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>

          {/* Reserved spacer on right so FAB floats in dedicated clean space */}
          <div aria-hidden="true" className="w-14" />
        </div>
      </div>

      {/* =========================================================================
          MOBILE & TABLET VIEW (< lg): Prism Peek-Card Showcase from Guide
          ========================================================================= */}
      <div className="lg:hidden w-full h-full min-h-[100dvh] flex flex-col justify-center relative z-20 overflow-hidden">
        <PrismProjectShowcase />
      </div>
    </section>
  );
}
