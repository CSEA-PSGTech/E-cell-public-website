import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowDown, ExternalLink } from "lucide-react";
import Topography from "@/components/ui/Topography";
import { ScrollStack, ScrollStackItem } from "@/components/projects/ScrollStack";
import { LineSidebar } from "@/components/projects/LineSidebar";
import MobileProjectsGallery from "@/components/projects/MobileProjectsGallery";
import { getProjects } from "@/data/projects";

export default function Projects() {
  const navigate = useNavigate();
  const allProjects = useMemo(() => getProjects(), []);
  const projectTitles = useMemo(() => allProjects.map((p) => p.title), [allProjects]);

  const stackRef = useRef<HTMLDivElement>(null);
  const pinPointsRef = useRef<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [isReducedMotion, setIsReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  // Guarantee that navigating or loading this page starts at the very top (first project)
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Compute exact window.scrollY position where each card pins
  const updatePinPoints = useCallback(() => {
    const stackEl = stackRef.current;
    if (!stackEl) return;

    const slots = stackEl.querySelectorAll<HTMLElement>("[data-stack-slot]");
    if (!slots.length) return;

    const stackPosition = 130;
    const itemStackDistance = 20;
    const stackDocTop = stackEl.getBoundingClientRect().top + window.scrollY;

    const pins: number[] = [];
    slots.forEach((slot, i) => {
      const naturalTop =
        window.scrollY === 0
          ? slot.getBoundingClientRect().top
          : stackDocTop + slot.offsetTop;
      const pin = naturalTop - (stackPosition + i * itemStackDistance);
      pins.push(pin);
    });

    pinPointsRef.current = pins;
  }, []);

  useEffect(() => {
    updatePinPoints();
    const frameId = requestAnimationFrame(updatePinPoints);
    window.addEventListener("resize", updatePinPoints);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updatePinPoints);
    };
  }, [updatePinPoints]);

  // Sync scroll position with active sidebar index
  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const currentY = window.scrollY;
        const pins = pinPointsRef.current;
        if (!pins.length) return;

        let nextIndex = 0;
        for (let i = 0; i < pins.length; i++) {
          if (currentY >= pins[i] - 16) nextIndex = i;
        }
        setActiveIndex((prev) => (prev !== nextIndex ? nextIndex : prev));
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Jump to specific project pin on sidebar click
  const handleSidebarClick = useCallback((index: number) => {
    if (index === 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const pins = pinPointsRef.current;
    const targetPin = pins[index];
    if (targetPin === undefined) return;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: Math.max(0, targetPin),
      behavior: isReduced ? "instant" : "smooth",
    });
  }, []);

  return (
    <main className="relative w-full min-h-screen bg-[#FAFAFC] text-[#0A0A0A] selection:bg-[#2547FF] selection:text-white">
      {/* Pinned Sticky Background: Exactly identical look, feel, speed, and parameters as Home Page */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      >
        <Topography
          lowColor="#2547FF"
          midColor="#4B6FFF"
          highColor="#8CA6FE"
          speed={0.08}
          morphAmount={1.4}
          morphSpeed={0.012}
          bands={2.4}
          thickness={0.007}
          scale={2.0}
          pixelSize={1.0}
          glow={0.0}
          colorMode="elevation"
          contrast={1.4}
          brightness={1.0}
          fillBands={false}
          opacity={0.16}
          grain={false}
          grainIntensity={0.0}
          mouseInteraction={false}
        />
      </div>

      {/* Floating Back to Home Button - Redirects directly to the projects section on the main page */}
      <div className="fixed top-4 left-4 sm:top-5 sm:left-6 lg:left-12 z-40 pointer-events-auto">
        <Link
          to="/#projects"
          onClick={(e) => {
            e.preventDefault();
            navigate("/#projects");
            setTimeout(() => {
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
          className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#0A0A0A]/80 hover:text-[#2547FF] transition-all bg-white/95 hover:bg-white border border-black/10 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-xs hover:shadow-md hover:border-[#2547FF]/30 active:scale-95 group backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1 text-[#2547FF]" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Hero Header Section - Refined, clean spacing with safe clearance on mobile */}
      <section className="relative z-20 text-center max-w-4xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 lg:pt-20 pb-6 sm:pb-8">
        <div className="flex flex-col items-center gap-2 mb-3">
          <span className="text-[10px] sm:text-xs font-mono font-medium tracking-[0.14em] text-[#0A0A0A]/60 bg-black/[0.04] border border-black/10 px-3 py-1 rounded-full uppercase">
            [ STATUS: IN DEVELOPMENT & INCUBATION · COHORT 2026 ]
          </span>
          <span className="text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#2547FF]">
            INNOVATION CATALOG
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.015em] text-[#0A0A0A] mb-3 sm:mb-4">
          Our <span className="text-[#2547FF]">Projects</span>
        </h1>
        <p className="text-sm lg:text-base text-[#0A0A0A]/65 max-w-xl mx-auto leading-relaxed font-sans px-2">
          Student founders at PSG College of Technology are actively building and prototyping ventures across CleanTech, DeepTech, AI, and Robotics. Flagship projects will be unveiled shortly.
        </p>

        {/* Laptop View Scroll Indicator */}
        <div className="hidden lg:inline-flex mt-6 items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#0A0A0A]/50 bg-white/80 border border-black/[0.06] px-4 py-2 rounded-full shadow-xs">
          <span>SCROLL TO EXPLORE STACK</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#2547FF] animate-bounce" />
        </div>
      </section>

      {/* LAPTOP / DESKTOP VIEW ONLY (lg:grid) */}
      <section className="hidden lg:block relative z-20 max-w-7xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-12 items-start">
          {/* Left Sticky Magnetic Sidebar */}
          <aside className="sticky top-[130px] self-start z-30 pt-2">
            <div className="mb-4 pb-2 border-b border-black/[0.06]">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#0A0A0A]/45">
                INDEX ({String(allProjects.length).padStart(2, "0")})
              </span>
            </div>
            <LineSidebar
              items={projectTitles}
              activeIndex={activeIndex}
              onItemClick={handleSidebarClick}
              accentColor="#2547FF"
              textColor="#5A5A63"
              markerColor="#D0D5E5"
              showIndex
              showMarker
              markerLength={34}
              maxShift={14}
              itemGap={14}
              fontSize={0.92}
              proximityRadius={95}
            />
          </aside>

          {/* Right Column: Stacking Scroll Cards */}
          <div ref={stackRef} className="w-full min-w-0">
            <ScrollStack
              useWindowScroll
              smoothScroll={false}
              snap={false}
              stackPosition={130}
              itemDistance={80}
              itemStackDistance={20}
              itemScale={isReducedMotion ? 0 : 0.04}
              baseScale={isReducedMotion ? 1 : 0.86}
              dimAmount={isReducedMotion ? 0 : 0.07}
              blurAmount={0}
              tiltAmount={0}
              rotationAmount={0}
              holdDistance={180}
            >
              {allProjects.map((project, index) => (
                <ScrollStackItem
                  key={project.slug}
                  itemClassName="!bg-white !rounded-[24px] border border-black/[0.08] !h-[390px] !p-8 shadow-[0_16px_36px_-16px_rgba(0,0,0,0.08)] filter grayscale contrast-[0.95] opacity-80"
                >
                  <div className="flex flex-row items-stretch justify-between h-full w-full gap-8">
                    {/* Left details */}
                    <div className="flex flex-col justify-between flex-1 min-w-0 pr-2">
                      <div>
                        {/* Header metadata row */}
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-[#0A0A0A]/45 tracking-wider">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {project.domain && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium tracking-wide bg-black/[0.04] text-[#0A0A0A]/60 border border-black/10">
                              {project.domain}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/[0.04] text-[#0A0A0A]/50 border border-black/10">
                            Stealth Mode
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="mt-3 text-3xl font-bold text-[#0A0A0A]/85 tracking-tight">
                          {project.title}
                        </h2>

                        {/* Tagline */}
                        {project.tagline && (
                          <p className="mt-1 text-sm font-medium text-[#0A0A0A]/60 tracking-tight font-sans">
                            {project.tagline}
                          </p>
                        )}

                        {/* Description */}
                        <p className="mt-3 text-sm text-[#0A0A0A]/70 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Tech tags */}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {project.technologies.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 rounded-md text-[11px] font-mono text-[#0A0A0A]/55 bg-black/[0.03] border border-black/[0.04]"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 4 && (
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono text-[#0A0A0A]/40 bg-black/[0.02]">
                                +{project.technologies.length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium uppercase tracking-wider text-[#0A0A0A]/40 bg-black/[0.04] px-3 py-1.5 rounded-full border border-black/10 cursor-not-allowed select-none">
                          Coming Soon
                        </span>
                        <span className="text-xs font-mono text-[#0A0A0A]/40">
                          Cohort 2026 · In Incubation
                        </span>
                      </div>
                    </div>

                    {/* Right image preview */}
                    {project.coverImage && (
                      <div className="shrink-0 w-[240px] h-full rounded-2xl overflow-hidden border border-black/[0.08] bg-slate-100 shadow-xs relative">
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover filter grayscale contrast-[0.95] opacity-65"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </ScrollStackItem>
              ))}
            </ScrollStack>
          </div>
        </div>
      </section>

      {/* MOBILE & TABLET VIEW ONLY (< lg) - Powered by Gallery02 architecture */}
      <section className="lg:hidden relative z-20 max-w-5xl mx-auto px-6 sm:px-10 pt-4 pb-24">
        <MobileProjectsGallery projects={allProjects} />
      </section>

      {/* Minimal Footer */}
      <footer className="relative z-20 w-full px-6 lg:px-16 py-8 flex flex-col sm:flex-row items-center justify-between border-t border-black/[0.05] bg-white/40 text-xs font-mono text-[#0A0A0A]/50">
        <span>© 2026 E-Cell PSG Tech • Innovation Portfolio</span>
        <Link to="/" className="hover:text-[#2547FF] transition-colors mt-2 sm:mt-0 font-medium">
          Return to Overview →
        </Link>
      </footer>
    </main>
  );
}
