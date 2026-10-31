import * as React from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { getProjects } from "@/data/projects";

interface PrismProjectShowcaseProps {
  limit?: number;
}

export default function PrismProjectShowcase({ limit = 3 }: PrismProjectShowcaseProps) {
  const allProjects = React.useMemo(() => getProjects(), []);
  const projects = React.useMemo(() => allProjects.slice(0, limit), [allProjects, limit]);

  return (
    <div className="w-full min-h-[100dvh] flex flex-col justify-between items-center py-6 sm:py-8 px-4 sm:px-8 max-w-lg md:max-w-3xl lg:max-w-4xl mx-auto select-none relative">
      {/* 1. Top-Left Section Heading: Matches Desktop */}
      <div className="w-full flex items-start justify-between pt-1 sm:pt-2 px-1">
        <div className="flex flex-col items-start gap-1 text-left">
          <span className="font-mono text-[11px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-[#2547FF]">
            Innovation Showcase
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-semibold tracking-[-0.015em] text-[#0A0A0A]">
            Featured Projects
          </h2>
        </div>
      </div>

      {/* Middle Cluster: Static blurred cards with centered Coming Soon message (No interaction / No project info) */}
      <div className="w-full flex flex-col items-center justify-center gap-4 my-auto py-2">
        {/* Static Peek Showcase Container */}
        <div className="relative w-full h-[220px] sm:h-[280px] md:h-[370px] flex items-center justify-center overflow-hidden">
          {projects.map((project, idx) => {
            const isCenter = idx === 0;
            const isLeft = idx === 1;
            const isRight = idx === 2;

            let xOffset = "0%";
            let scale = 1;
            let opacity = 1;
            let zIndex = 20;

            if (isLeft) {
              xOffset = "-58%";
              scale = 0.72;
              opacity = 0.4;
              zIndex = 10;
            } else if (isRight) {
              xOffset = "58%";
              scale = 0.72;
              opacity = 0.4;
              zIndex = 10;
            }

            return (
              <div
                key={project.slug}
                className="absolute w-[72%] sm:w-[60%] md:w-[62%] aspect-[1.5] max-w-[360px] md:max-w-[500px] rounded-2xl sm:rounded-3xl md:rounded-[28px] overflow-hidden shadow-lg md:shadow-2xl bg-[#0A0A0A] pointer-events-none transition-transform duration-300"
                style={{
                  transform: `translateX(${xOffset}) scale(${scale})`,
                  opacity,
                  zIndex,
                }}
              >
                {/* Blurred image */}
                <img
                  src={project.coverImage}
                  alt=""
                  className="w-full h-full object-cover select-none pointer-events-none rounded-[inherit] filter blur-md grayscale contrast-[0.95] opacity-55 scale-110"
                  loading="eager"
                  draggable={false}
                />

                {/* Center Card COMING SOON Overlay */}
                {isCenter && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] rounded-[inherit]">
                    <span className="font-display font-bold tracking-[0.1em] sm:tracking-[0.14em] text-2xl sm:text-3xl text-white uppercase drop-shadow-md">
                      COMING SOON
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Buttons: Disabled "View All Projects" + Active "Meet The Team" */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3.5 md:gap-4 px-4 max-w-sm sm:max-w-none mx-auto md:pb-2">
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="w-auto h-11 sm:h-12 md:h-12 px-6 sm:px-7 md:px-8 rounded-full inline-flex items-center justify-center gap-2.5 text-xs sm:text-sm md:text-sm font-sans font-semibold uppercase tracking-[0.06em] text-white/80 bg-[#2547FF]/75 border border-[#2547FF]/50 shadow-xs cursor-not-allowed select-none text-center"
        >
          <span>View All Projects</span>
          <ArrowRight className="w-4 h-4 text-white/80" />
        </button>

        <button
          type="button"
          onClick={() => {
            document.getElementById("team")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-auto h-11 sm:h-12 md:h-12 px-6 sm:px-7 md:px-8 rounded-full inline-flex items-center justify-center gap-2.5 text-xs sm:text-sm md:text-sm font-sans font-semibold uppercase tracking-[0.06em] text-[#0A0A0A] hover:text-[#2547FF] bg-white/95 hover:bg-white border border-black/10 hover:border-[#2547FF]/40 shadow-xs hover:shadow-md active:scale-95 transition-all group cursor-pointer backdrop-blur-md text-center"
        >
          <span>Meet The Team</span>
          <ArrowDown className="w-4 h-4 text-[#2547FF] transition-transform group-hover:translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}
