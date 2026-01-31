"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ZONE_SCALES: Record<string, number> = {
  "zone-mapa": 1.0,
  "zone-village": 2.0,
  "zone-geppetto": 1.8,
  "zone-circus": 2.2,
  "zone-forest": 2.0,
  "zone-island": 2.3,
};

const OVERVIEW_SCALE = 0.5;

export default function MapScrollCamera() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let triggers: ScrollTrigger[] = [];
    let animationFrameId: number;

    const tryInit = () => {
      let svg = document.querySelector("#map-viewport svg") as SVGSVGElement | null;

      if (!svg) {
        svg = document.querySelector(".mapViewport svg") as SVGSVGElement | null;
      }

      if (!svg) {
        svg = document.querySelector("svg") as SVGSVGElement | null;
      }

      if (!svg) {
        animationFrameId = requestAnimationFrame(tryInit);
        return;
      }

      // Force SVG to fill and stay centered in the viewport
      svg.setAttribute("preserveAspectRatio", "xMidYMid slice");

      const mapGroup = svg.querySelector("#map") as SVGGElement | null;
      if (!mapGroup) {
        return;
      }

      const mapLayer = document.querySelector(".mapLayer") as HTMLElement | null;
      const overlay = document.querySelector(".geppettoOverlay") as HTMLElement | null;
      const photos = gsap.utils.toArray<HTMLElement>(".geppettoOverlay .scenePhoto");

      const initialViewBox = {
        x: svg.viewBox.baseVal.x,
        y: svg.viewBox.baseVal.y,
        width: svg.viewBox.baseVal.width,
        height: svg.viewBox.baseVal.height,
      };

      const moveToZone = (zoneId: string | null, scale: number) => {
        const targetWidth = initialViewBox.width / scale;
        const targetHeight = initialViewBox.height / scale;
        let targetX = initialViewBox.x;
        let targetY = initialViewBox.y;

        if (zoneId) {
          const zoneElement = svg.querySelector(`#${zoneId}`);

          if (zoneElement) {
            try {
              if ("getBBox" in zoneElement && typeof zoneElement.getBBox === "function") {
                const bbox = zoneElement.getBBox();

                const zoneCenterX = bbox.x + bbox.width / 2;
                const zoneCenterY = bbox.y + bbox.height / 2;

                targetX = zoneCenterX - targetWidth / 2;
                targetY = zoneCenterY - targetHeight / 2;
              }
            } catch {
              return;
            }
          }
        }

        const maxX = initialViewBox.x + initialViewBox.width - targetWidth;
        const maxY = initialViewBox.y + initialViewBox.height - targetHeight;
        const clampedX = Math.min(Math.max(targetX, initialViewBox.x), maxX);
        const clampedY = Math.min(Math.max(targetY, initialViewBox.y), maxY);

        gsap.to(svg, {
          attr: {
            viewBox: `${clampedX} ${clampedY} ${targetWidth} ${targetHeight}`,
          },
          duration: 1.5,
          ease: "power2.inOut",
        });
      };

      // Initial state: map overview zone
      moveToZone("zone-mapa", ZONE_SCALES["zone-mapa"]);

      const sections = document.querySelectorAll(".scene");

      sections.forEach((section) => {
        const zoneIdAttr = (section as HTMLElement).dataset.zone;
        if (!zoneIdAttr) return;

        const scale = ZONE_SCALES[zoneIdAttr];
        if (!scale) return;

        const trigger = ScrollTrigger.create({
          trigger: section as HTMLElement,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            moveToZone(zoneIdAttr, scale);
          },
          onEnterBack: () => {
            moveToZone(zoneIdAttr, scale);
          },
          markers: true,
        });

        triggers.push(trigger);
      });

      const geppettoSequence = document.querySelector(".geppetto-sequence") as HTMLElement | null;
      if (geppettoSequence && mapLayer && overlay && photos.length > 0) {
        gsap.set(overlay, { autoAlpha: 0 });
        gsap.set(photos, { autoAlpha: 0 });
        gsap.set(photos[0], { autoAlpha: 1 });

        let activeIndex = 0;

        const sequenceTrigger = ScrollTrigger.create({
          trigger: geppettoSequence,
          start: "top center",
          end: "bottom center",
          scrub: 0.6,
          onEnter: () => {
            gsap.to(mapLayer, { filter: "blur(10px)", duration: 0.6, ease: "power2.out" });
            gsap.to(overlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
            overlay.classList.add("is-active");
          },
          onEnterBack: () => {
            gsap.to(mapLayer, { filter: "blur(10px)", duration: 0.6, ease: "power2.out" });
            gsap.to(overlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
            overlay.classList.add("is-active");
          },
          onLeave: () => {
            gsap.to(mapLayer, { filter: "blur(0px)", duration: 0.6, ease: "power2.out" });
            gsap.to(overlay, { autoAlpha: 0, duration: 0.4, ease: "power2.out" });
            overlay.classList.remove("is-active");
          },
          onLeaveBack: () => {
            gsap.to(mapLayer, { filter: "blur(0px)", duration: 0.6, ease: "power2.out" });
            gsap.to(overlay, { autoAlpha: 0, duration: 0.4, ease: "power2.out" });
            overlay.classList.remove("is-active");
          },
          onUpdate: (self) => {
            const nextIndex = Math.min(
              photos.length - 1,
              Math.floor(self.progress * photos.length)
            );

            if (nextIndex !== activeIndex) {
              gsap.to(photos[activeIndex], { autoAlpha: 0, duration: 0.3 });
              gsap.to(photos[nextIndex], { autoAlpha: 1, duration: 0.3 });
              activeIndex = nextIndex;
            }
          },
        });

        triggers.push(sequenceTrigger);
      }
    };

    animationFrameId = requestAnimationFrame(tryInit);

    return () => {
      cancelAnimationFrame(animationFrameId);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return null;
}
