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

  const requestSceneStep = (direction: -1 | 1) => {
    window.dispatchEvent(new CustomEvent("scene-step-request", { detail: { direction } }));
  };

  return (
    <div className="scrollNose">
      <button
        type="button"
        className="scrollNoseArrow scrollNoseArrowPrev"
        aria-label="Escena anterior"
        onClick={() => requestSceneStep(-1)}
      >
        ‹
      </button>
      <div className="pinochoFace">
        <img src="/pinochomini.svg" alt="Pinocho" />
      </div>
      <div className="noseTrack">
        <div className="noseFill" />
      </div>
      <button
        type="button"
        className="scrollNoseArrow scrollNoseArrowNext"
        aria-label="Escena siguiente"
        onClick={() => requestSceneStep(1)}
      >
        ›
      </button>
    </div>
  );
}
