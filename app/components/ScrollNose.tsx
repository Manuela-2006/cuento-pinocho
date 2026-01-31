"use client";

import { useEffect } from "react";

export default function ScrollNose() {
  useEffect(() => {
    let rafId = 0;

    const update = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? doc.scrollTop / maxScroll : 0;
      doc.style.setProperty("--scroll-progress", progress.toFixed(4));
      rafId = 0;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="scrollNose" aria-hidden="true">
      <div className="noseTrack">
        <div className="noseFill" />
      </div>
      <div className="pinochoFace">
        <img src="/pinochomini.svg" alt="Pinocho" />
      </div>
    </div>
  );
}
