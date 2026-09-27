"use client";

import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, Check, Award, Users2, Clock, Scale, Quote, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { SchoolConfig } from "./data";
import { SectionLabel } from "./Shared";

const GALLERY_PREVIEW_COUNT = 8;

export function HomePage({ school }: { school: SchoolConfig }) {
  const yearsRunning = new Date().getFullYear() - school.stats.yearEstablished;
  const heroImages = school.heroPhotos;
  const [photoIndex, setPhotoIndex] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Lightbox keyboard support — Escape closes, arrow keys navigate
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i! - 1 + school.photos.length) % school.photos.length);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i! + 1) % school.photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, school.photos.length]);

  const statStrip = [
    { Icon: Award,  value: `${school.stats.passRate}%`, label: "Matric Pass Rate" },
    { Icon: Users2, value: school.stats.learnerCount.toLocaleString("en-US"), label: "Enrolled Learners" },
    { Icon: Clock,  value: `${yearsRunning}`, label: "Years Running" },
    { Icon: Scale,  value: school.stats.ratio, label: "Learner:Teacher Ratio" },
  ];

  return (
    <>
      {/* Hero — full-bleed, fills the viewport, slides up under the (transparent) nav */}
      <section className="relative overflow-hidden min-h-screen -mt-16 flex flex-col" style={{ background: `linear-gradient(135deg, var(--foreground), ${school.accentColor}22 150%)` }}>
        {/* Decorative dot-grid — sits in the dark zone, well clear of the photo (which
            covers the right ~52%) so it isn't rendered over/hidden by the image */}
        <div
          className="absolute top-24 left-[38%] w-28 h-28 opacity-[0.2] pointer-events-none hidden lg:block"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1.5px, transparent 1.5px)", backgroundSize: "16px 16px" }}
        />

        {/* Hidden SVG defs — the clip-path shape for the hero photo's wavy left edge.
            objectBoundingBox coordinates (0-1) so it scales with the element it clips. */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
          <defs>
            <clipPath id="hero-photo-clip" clipPathUnits="objectBoundingBox">
              <path d="M1,0 L1,1 L0.22,1 C0.05,0.85 0.30,0.75 0.18,0.62 C0.08,0.52 0.02,0.42 0.10,0.30 C0.20,0.15 0.05,0.10 0.30,0 Z" />
            </clipPath>
          </defs>
        </svg>

        {/* Photo — full-bleed to the section's edges (including under the nav), with a wavy left silhouette (desktop only) */}
        <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-[52%]">
          <div className="relative w-full h-full" style={{ clipPath: "url(#hero-photo-clip)" }}>
            <img key={photoIndex} src={heroImages[photoIndex]} alt={`${school.schoolName} campus`} className="w-full h-full object-cover" loading="eager" />
            {/* Dark gradient hugging the curved edge — helps the ring and the edge itself
                read clearly against busy photo content, rather than the boundary getting lost */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to right, rgba(0,0,0,0.45), transparent 35%)" }}
            />
          </div>
          {/* Ring tracing that same wavy edge — the straight top/right/bottom edges bleed off, so only this curve needs a stroke */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M30,0 C5,10 20,15 10,30 C2,42 8,52 18,62 C30,75 5,85 22,100" fill="none" stroke={school.accentColor} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          </svg>

          {heroImages.length > 1 && (
            <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-10">
              <button
                onClick={() => setPhotoIndex((i) => (i - 1 + heroImages.length) % heroImages.length)}
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                aria-label="Previous photo"
              >
                <ChevronLeft size={18} color="var(--foreground)" />
              </button>
              <button
                onClick={() => setPhotoIndex((i) => (i + 1) % heroImages.length)}
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                aria-label="Next photo"
              >
                <ChevronRight size={18} color="var(--foreground)" />
              </button>
            </div>
          )}
        </div>

        {/* pt-16 gives back the space the nav overlaps, so headline text clears it */}
        <div className="relative flex-1 flex items-center pt-16">
          <div className="relative w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-16 lg:pr-[52%] py-12 sm:py-16">
            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-7 bg-white/10">
                <CheckCircle2 size={14} color={school.accentColor} />
                <span className="text-xs font-semibold text-white/90 tracking-wide">{school.province} · Est. {school.stats.yearEstablished}</span>
              </div>
              <h1 className="font-display font-black text-4xl sm:text-6xl text-white leading-[1.05] mb-5">
                {school.schoolName.split(" ").map((word, i, arr) => (
                  <span key={i}>
                    {i === arr.length - 1 ? <em className="not-italic" style={{ color: school.accentColor }}>{word}</em> : word}{" "}
                  </span>
                ))}
              </h1>
              <p className="text-white/60 text-base sm:text-lg max-w-md mb-9 leading-relaxed">{school.motto}</p>
              <div className="flex flex-wrap items-center gap-7">
                <a
                  href="/admissions"
                  className="px-7 py-4 text-white font-semibold text-sm rounded-full hover:opacity-90 transition-opacity flex items-center gap-2"
                  style={{ backgroundColor: school.accentColor }}
                >
                  Apply for Admission <ArrowRight size={15} />
                </a>
                <a href="/about" className="text-white font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                  Learn About Us <ArrowRight size={14} />
                </a>
              </div>

              {/* Small squiggle accent — decorative, echoing the reference's little hand-drawn mark */}
              <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className="mt-6 opacity-60" aria-hidden>
                <path d="M2 18C6 8 10 2 14 10C17 16 21 6 26 2" stroke={school.accentColor} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Mobile fallback — the wavy full-bleed shape only makes sense at wide viewports */}
            <div className="lg:hidden relative mt-10 aspect-[4/3] w-full rounded-3xl overflow-hidden" style={{ border: `6px solid ${school.accentColor}` }}>
              <img key={`mobile-${photoIndex}`} src={heroImages[photoIndex]} alt={`${school.schoolName} campus`} className="w-full h-full object-cover" loading="eager" />
              {heroImages.length > 1 && (
                <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                  <button
                    onClick={() => setPhotoIndex((i) => (i - 1 + heroImages.length) % heroImages.length)}
                    className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={16} color="var(--foreground)" />
                  </button>
                  <button
                    onClick={() => setPhotoIndex((i) => (i + 1) % heroImages.length)}
                    className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={16} color="var(--foreground)" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats — pinned to the bottom edge of this same full-viewport hero */}
        <div className="relative max-w-[1440px] mx-auto w-full px-5 sm:px-8 lg:px-16 pb-10 sm:pb-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/15">
            {statStrip.map(({ Icon, value, label }, i) => (
              <div key={i} className="flex items-center gap-4 py-5 lg:py-0 lg:px-8 first:lg:pl-0">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-white/10">
                  <Icon size={18} color="#fff" />
                </div>
                <div>
                  <div className="font-display font-black text-xl sm:text-2xl text-white leading-none mb-1">{value}</div>
                  <div className="text-xs text-white/50">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal's Welcome — photo collage + checklist, "Who We Are" style */}
      <section className="py-16 sm:py-20 bg-muted">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Collage */}
          <div className="relative max-w-md mx-auto lg:mx-0 lg:max-w-none">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] w-4/5">
              <img src={school.principalPhoto} alt={school.principalName} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="absolute top-4 left-4 bg-card rounded-2xl px-4 py-3 shadow-md">
              <div className="font-display font-black text-2xl leading-none" style={{ color: school.accentColor }}>{yearsRunning}+</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Years of Legacy</div>
            </div>
          </div>

          {/* Text */}
          <div>
            <SectionLabel>Meet Our Principal</SectionLabel>
            <h2 className="font-display font-black text-3xl sm:text-4xl leading-[1.1] text-foreground mb-5">
              A message from <em className="not-italic" style={{ color: school.accentColor }}>our principal</em>
            </h2>
            <p className="text-base text-muted-foreground leading-[1.75] mb-7">{school.principalMessage}</p>

            <div className="flex flex-col gap-3 mb-8">
              {school.features.slice(0, 3).map(({ title }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: school.accentColor + "18" }}>
                    <Check size={12} color={school.accentColor} />
                  </span>
                  <span className="text-sm font-medium text-foreground">{title}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <a href="/about" className="px-6 py-3.5 text-white font-semibold text-sm rounded-full hover:opacity-90 transition-opacity" style={{ backgroundColor: school.accentColor }}>
                More About Us
              </a>
              <div className="flex items-center gap-3">
                <div className="w-px h-8 bg-border" />
                <div>
                  <div className="font-display font-bold text-sm text-foreground">{school.principalName}</div>
                  <div className="text-xs text-muted-foreground">Principal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us — tab-list + feature cards, "Our Courses" style */}
      <section className="py-16 sm:py-20 max-w-[1440px] mx-auto px-5 sm:px-8">
        <div className="mb-12 max-w-xl">
          <SectionLabel>Why {school.whyLabel}</SectionLabel>
          <h2 className="font-display font-black text-3xl sm:text-4xl leading-[1.1] text-foreground">
            Built for every learner, <em className="not-italic" style={{ color: school.accentColor }}>not just the top few</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] gap-10">
          {/* Left tab list — click one to swap the card on the right */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {school.features.map(({ title }, i) => (
              <button
                key={i}
                onClick={() => setActiveFeature(i)}
                className="shrink-0 lg:shrink px-5 py-4 rounded-2xl text-sm font-semibold whitespace-nowrap lg:whitespace-normal text-left transition-colors"
                style={i === activeFeature
                  ? { backgroundColor: school.accentColor, color: "#fff" }
                  : { backgroundColor: "var(--card)", color: "var(--foreground)", border: "1px solid var(--border)" }}
              >
                {title}
              </button>
            ))}
          </div>

          {/* Right — two cards. The selected tab is always the first card; the second
              previews the next one. "See all" expands to every feature at once. */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(showAllFeatures
                ? school.features
                : [activeFeature, (activeFeature + 1) % school.features.length].map((i) => school.features[i])
              ).map(({ title, body }, i) => {
                const photoIdx = school.photos.length > 0 ? i % school.photos.length : -1;
                return (
                  <div key={`${title}-${i}`} className="rounded-3xl overflow-hidden border border-border bg-card">
                    {photoIdx >= 0 && (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img src={school.photos[photoIdx]} alt={title} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-display font-bold text-base text-foreground mb-2">{title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {school.features.length > 2 && (
              <button
                onClick={() => setShowAllFeatures((v) => !v)}
                className="mt-6 text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                style={{ color: school.accentColor }}
              >
                {showAllFeatures ? "Show fewer" : "See all features"} <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Avatar-stack strip */}
        {school.staffList.length > 0 && (
          <div className="flex items-center gap-4 mt-10">
            <div className="flex -space-x-3">
              {school.staffList.slice(0, 5).map((m, i) => (
                <img key={i} src={m.photo} alt={m.name} className="w-10 h-10 rounded-full object-cover border-2 border-background" />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">{school.staffList.length}+ Dedicated Teachers</span>
          </div>
        )}
      </section>

      {/* Testimonials — dark section */}
      <section className="py-16 sm:py-20 bg-foreground">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
          <div className="mb-12 max-w-xl">
            <SectionLabel><span className="text-white/50">Voices</span></SectionLabel>
            <h2 className="font-display font-black text-3xl sm:text-4xl leading-[1.1] text-white">
              Real experiences from <em className="not-italic" style={{ color: school.accentColor }}>our community</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {school.testimonials.map(({ quote, author, role }) => (
              <div key={author} className="rounded-3xl p-7 flex flex-col bg-white/5 border border-white/10">
                <Quote size={22} color={school.accentColor} className="mb-4" />
                <p className="text-sm text-white/80 leading-relaxed flex-1">{quote}</p>
                <div className="mt-6 pt-5 border-t border-white/10">
                  <div className="font-display font-bold text-sm text-white">{author}</div>
                  <div className="text-xs text-white/50 mt-0.5">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News — asymmetric featured + list, instead of a uniform grid */}
      <section className="py-16 sm:py-20 max-w-[1440px] mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <SectionLabel>Latest News</SectionLabel>
            <h2 className="font-display font-black text-3xl sm:text-4xl leading-[1.1] text-foreground">
              From the <em className="not-italic" style={{ color: school.accentColor }}>community</em>
            </h2>
          </div>
          <a href="/news" className="hidden sm:flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all shrink-0" style={{ color: school.accentColor }}>
            View all <ArrowRight size={14} />
          </a>
        </div>

        {school.newsItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured — spans 2 columns */}
            <a href="/news" className="lg:col-span-2 group rounded-3xl overflow-hidden border border-border bg-card block">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={school.newsItems[0].image} alt={school.newsItems[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-7">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full" style={{ backgroundColor: school.accentColor + "18", color: school.accentColor }}>{school.newsItems[0].category}</span>
                  <span className="text-xs text-muted-foreground">{school.newsItems[0].date}</span>
                </div>
                <h3 className="font-display font-bold text-xl text-foreground leading-snug mb-2">{school.newsItems[0].title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{school.newsItems[0].excerpt}</p>
              </div>
            </a>

            {/* Two compact list items */}
            <div className="flex flex-col gap-6">
              {school.newsItems.slice(1, 3).map((item) => (
                <a key={item.id} href="/news" className="group flex gap-4 rounded-2xl border border-border bg-card p-3 flex-1">
                  <div className="w-24 aspect-square shrink-0 rounded-xl overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: school.accentColor }}>{item.category}</span>
                    <h4 className="font-display font-bold text-sm text-foreground leading-snug line-clamp-2">{item.title}</h4>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Gallery — varied-height masonry-style scroll, capped with a "+N more" overflow
          tile so the strip's length stays consistent regardless of library size. Every
          photo (not just the visible ones) is reachable via the lightbox. */}
      <section className="py-16 sm:py-20 bg-muted overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 mb-10">
          <SectionLabel>Life at School</SectionLabel>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-foreground leading-[1.1]">
            <em className="not-italic" style={{ color: school.accentColor }}>Moments</em> that matter
          </h2>
        </div>
        <div className="flex items-end gap-4 pl-5 sm:pl-8 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {school.photos.slice(0, GALLERY_PREVIEW_COUNT).map((src, i) => {
            const remaining = school.photos.length - GALLERY_PREVIEW_COUNT;
            const isLastTile = i === GALLERY_PREVIEW_COUNT - 1 && remaining > 0;
            return (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className={`relative shrink-0 w-56 sm:w-72 rounded-2xl overflow-hidden bg-card ${i % 2 === 0 ? "aspect-[3/4]" : "aspect-square"}`}
              >
                <img src={src} alt={`School life ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                {isLastTile && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="font-display font-black text-2xl text-white">+{remaining}</span>
                  </div>
                )}
              </button>
            );
          })}
          <div className="shrink-0 w-5 sm:w-8" />
        </div>
      </section>

      {/* Lightbox — browses the full photo set, not just the capped preview strip */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 sm:p-10"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i! - 1 + school.photos.length) % school.photos.length); }}
            className="absolute left-3 sm:left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            aria-label="Previous photo"
          >
            <ChevronLeft size={22} />
          </button>

          <img
            src={school.photos[lightboxIndex]}
            alt={`School life ${lightboxIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i! + 1) % school.photos.length); }}
            className="absolute right-3 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            aria-label="Next photo"
          >
            <ChevronRight size={22} />
          </button>

          <span className="absolute bottom-5 text-sm text-white/60">{lightboxIndex + 1} / {school.photos.length}</span>
        </div>
      )}

      {/* CTA — rounded inset card, matching the hero treatment */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-8 py-6 sm:py-10">
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] px-6 sm:px-16 py-14 sm:py-20 text-center" style={{ backgroundColor: school.accentColor }}>
          {/* Dot-grid — same decorative texture as the hero, for rhythm across the page */}
          <div
            className="absolute bottom-6 left-6 w-32 h-32 opacity-[0.15] pointer-events-none hidden sm:block"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1.5px, transparent 1.5px)", backgroundSize: "16px 16px" }}
          />
          <h2 className="relative font-display font-black text-3xl sm:text-5xl text-white leading-[1.1] mb-5 max-w-2xl mx-auto">
            {school.ctaTitle}
          </h2>
          <p className="text-white/80 text-base max-w-xl mx-auto mb-9 leading-relaxed">{school.ctaBody}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/admissions" className="px-8 py-4 bg-white font-semibold text-sm rounded-full hover:bg-white/90 transition-colors" style={{ color: school.accentColor }}>
              Apply for Admission
            </a>
            <a href="/contact" className="px-8 py-4 border-2 border-white/40 text-white font-semibold text-sm rounded-full hover:bg-white/10 transition-colors">
              Contact Us
            </a>
          </div>
          {school.ctaBullets.length > 0 && (
            <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:gap-8 justify-center text-sm text-white/70">
              {school.ctaBullets.map((b, i) => <span key={i}>✓ {b}</span>)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
