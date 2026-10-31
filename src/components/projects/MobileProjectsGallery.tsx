import React from "react";
import { Project } from "@/types/project";

export interface MobileProjectsGalleryProps {
  projects: Project[];
}

export default function MobileProjectsGallery({ projects }: MobileProjectsGalleryProps) {
  return (
    <section className="w-full">
      {/* Gallery Header */}
      <div className="mb-8 sm:mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-black/[0.06] pb-6">
        <div className="max-w-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#2547FF] font-semibold">
              Showcase ({String(projects.length).padStart(2, "0")})
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/[0.04] text-[#0A0A0A]/50 border border-black/10">
              In Incubation
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A0A0A]">
            Every venture, considered.
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#0A0A0A]/60 sm:text-right font-sans">
          Student ventures currently in incubation. Full details coming soon.
        </p>
      </div>

      {/* Responsive Gallery Grid: 1 col on mobile, 2 cols on tablet */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-6">
        {projects.map((project, index) => (
          <div
            key={project.slug}
            className="flex flex-col gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-black/[0.08] shadow-xs filter grayscale contrast-[0.95] opacity-80"
          >
            {/* Cinematic 16:9 Image Container */}
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-black/[0.06] bg-slate-100 relative [isolation:isolate]">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover rounded-[inherit] filter grayscale contrast-[0.95] opacity-65"
                loading="lazy"
              />

              {/* Top overlay metadata */}
              <div className="absolute inset-0 p-3 flex items-start justify-between pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-transparent">
                <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-black/60 text-white backdrop-blur-xs tracking-wider">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {project.domain && (
                  <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-medium tracking-wide bg-white/90 text-[#0A0A0A] backdrop-blur-xs shadow-xs">
                    {project.domain}
                  </span>
                )}
              </div>
            </div>

            {/* Captions & Metadata */}
            <figcaption className="px-1 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#0A0A0A]/85 tracking-tight">
                    {project.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/[0.04] text-[#0A0A0A]/50 border border-black/10 shrink-0">
                    Stealth Mode
                  </span>
                </div>

                {project.tagline && (
                  <p className="mt-1 text-xs sm:text-sm font-medium text-[#0A0A0A]/60 font-sans">
                    {project.tagline}
                  </p>
                )}

                <p className="mt-2 text-xs sm:text-sm text-[#0A0A0A]/65 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Technologies row & Status pill */}
              <div className="mt-4 pt-3 border-t border-black/[0.05] flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono text-[#0A0A0A]/50 bg-black/[0.04]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-[#0A0A0A]/40 bg-black/[0.02]">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium uppercase tracking-wider text-[#0A0A0A]/40 bg-black/[0.04] px-2.5 py-0.5 rounded-full border border-black/10 shrink-0 select-none">
                  Coming Soon
                </span>
              </div>
            </figcaption>
          </div>
        ))}
      </div>
    </section>
  );
}
