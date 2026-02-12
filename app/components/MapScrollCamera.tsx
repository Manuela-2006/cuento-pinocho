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
      let svg = document.querySelector(".mapViewport svg") as SVGSVGElement | null;

      if (!svg) {
        const candidates = Array.from(document.querySelectorAll("svg")) as SVGSVGElement[];
        svg = candidates.find((candidate) => candidate.querySelector("#map")) ?? null;
      }

      if (!svg) {
        animationFrameId = requestAnimationFrame(tryInit);
        return;
      }

      // Force SVG to fill and stay centered in the viewport
      svg.setAttribute("preserveAspectRatio", "xMidYMid slice");

      const mapGroup = svg.querySelector("#map") as SVGGElement | null;
      if (!mapGroup) {
        animationFrameId = requestAnimationFrame(tryInit);
        return;
      }

      const mapLayer = document.querySelector(".mapLayer") as HTMLElement | null;
      const overlay = document.querySelector(".geppettoOverlay") as HTMLElement | null;
      const villageOverlay = document.querySelector(".villageOverlay") as HTMLElement | null;
      const circusOverlay = document.querySelector(".circusOverlay") as HTMLElement | null;
      const forestOverlay = document.querySelector(".forestOverlay") as HTMLElement | null;
      const photos = gsap.utils.toArray<HTMLElement>(".geppettoOverlay .scenePhoto");
      const villagePhotos = gsap.utils.toArray<HTMLElement>(".villageOverlay .scenePhoto");
      const circusPhotos = gsap.utils.toArray<HTMLElement>(".circusOverlay .scenePhoto");
      const forestPhotos = gsap.utils.toArray<HTMLElement>(".forestOverlay .scenePhoto");

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
        photos[0]?.classList.add("is-active");

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
            window.dispatchEvent(new CustomEvent("geppetto-sequence-leave"));
          },
          onLeaveBack: () => {
            gsap.to(mapLayer, { filter: "blur(0px)", duration: 0.6, ease: "power2.out" });
            gsap.to(overlay, { autoAlpha: 0, duration: 0.4, ease: "power2.out" });
            overlay.classList.remove("is-active");
            window.dispatchEvent(new CustomEvent("geppetto-sequence-leave"));
          },
          onUpdate: (self) => {
            const nextIndex = Math.min(
              photos.length - 1,
              Math.floor(self.progress * photos.length)
            );

            if (nextIndex !== activeIndex) {
              gsap.to(photos[activeIndex], { autoAlpha: 0, duration: 0.3 });
              gsap.to(photos[nextIndex], { autoAlpha: 1, duration: 0.3 });
              photos[activeIndex]?.classList.remove("is-active");
              photos[nextIndex]?.classList.add("is-active");
              activeIndex = nextIndex;
              window.dispatchEvent(
                new CustomEvent("geppetto-active-index", { detail: { index: nextIndex } })
              );
            }
          },
        });

        triggers.push(sequenceTrigger);

      }

      const villageSequence = document.querySelector(
        ".village-sequence"
      ) as HTMLElement | null;

      if (villageSequence && villageOverlay && villagePhotos.length > 0) {
        gsap.set(villageOverlay, { autoAlpha: 0 });
        gsap.set(villagePhotos, { autoAlpha: 0 });
        gsap.set(villagePhotos[0], { autoAlpha: 1 });

        let villageIndex = 0;
        villagePhotos[0]?.classList.add("is-active");

        const villageTrigger = ScrollTrigger.create({
          trigger: villageSequence,
          start: "top center",
          end: "bottom center",
          scrub: 0.6,
          onEnter: () => {
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(10px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(villageOverlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
            villageOverlay.classList.add("is-active");
          },
          onEnterBack: () => {
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(10px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(villageOverlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
            villageOverlay.classList.add("is-active");
            if (villagePhotos.length > 0) {
              const lastIndex = villagePhotos.length - 1;
              gsap.set(villagePhotos, { autoAlpha: 0 });
              gsap.set(villagePhotos[lastIndex], { autoAlpha: 1 });
              villagePhotos.forEach((photo) => photo.classList.remove("is-active"));
              villagePhotos[lastIndex]?.classList.add("is-active");
              villageIndex = lastIndex;
            }
          },
          onLeave: () => {
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(0px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(villageOverlay, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
            villageOverlay.classList.remove("is-active");
          },
          onLeaveBack: () => {
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(0px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(villageOverlay, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
            villageOverlay.classList.remove("is-active");
          },
          onUpdate: (self) => {
            const nextIndex = Math.min(
              villagePhotos.length - 1,
              Math.floor(self.progress * villagePhotos.length)
            );

            if (nextIndex !== villageIndex) {
              gsap.to(villagePhotos[villageIndex], { autoAlpha: 0, duration: 0.3 });
              gsap.to(villagePhotos[nextIndex], { autoAlpha: 1, duration: 0.3 });
              villagePhotos[villageIndex]?.classList.remove("is-active");
              villagePhotos[nextIndex]?.classList.add("is-active");
              villageIndex = nextIndex;
            }
          },
        });

        triggers.push(villageTrigger);

        // Si se recarga después de la sección del pueblo, forzar ocultar el overlay
        if (window.scrollY > villageSequence.offsetTop + villageSequence.offsetHeight) {
          gsap.set(villageOverlay, { autoAlpha: 0 });
          villageOverlay.classList.remove("is-active");
          gsap.set(villagePhotos, { autoAlpha: 0 });
          villagePhotos.forEach((photo) => photo.classList.remove("is-active"));
        }
      }

      const circusSequence = document.querySelector(
        ".circus-sequence"
      ) as HTMLElement | null;

      if (circusSequence && circusOverlay && circusPhotos.length > 0) {
        gsap.set(circusOverlay, { autoAlpha: 0 });
        gsap.set(circusPhotos, { autoAlpha: 0 });
        gsap.set(circusPhotos[0], { autoAlpha: 1 });
        let circusIndex = 0;
        circusPhotos[0]?.classList.add("is-active");

        const circusTrigger = ScrollTrigger.create({
          trigger: circusSequence,
          start: "top center",
          end: "bottom center",
          scrub: 0.6,
          onEnter: () => {
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(10px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(circusOverlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
            circusOverlay.classList.add("is-active");
            if (villageOverlay) {
              gsap.to(villageOverlay, { autoAlpha: 0, duration: 0.2, ease: "power2.out" });
              villageOverlay.classList.remove("is-active");
              if (villagePhotos.length > 0) {
                gsap.set(villagePhotos, { autoAlpha: 0 });
                villagePhotos.forEach((photo) => photo.classList.remove("is-active"));
              }
            }
          },
          onEnterBack: () => {
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(10px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(circusOverlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
            circusOverlay.classList.add("is-active");
            if (villageOverlay) {
              gsap.to(villageOverlay, { autoAlpha: 0, duration: 0.2, ease: "power2.out" });
              villageOverlay.classList.remove("is-active");
              if (villagePhotos.length > 0) {
                gsap.set(villagePhotos, { autoAlpha: 0 });
                villagePhotos.forEach((photo) => photo.classList.remove("is-active"));
              }
            }
            if (circusPhotos.length > 0) {
              const lastIndex = circusPhotos.length - 1;
              gsap.set(circusPhotos, { autoAlpha: 0 });
              gsap.set(circusPhotos[lastIndex], { autoAlpha: 1 });
              circusPhotos.forEach((photo) => photo.classList.remove("is-active"));
              circusPhotos[lastIndex]?.classList.add("is-active");
              circusIndex = lastIndex;
            }
          },
          onLeave: () => {
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(0px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(circusOverlay, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
            circusOverlay.classList.remove("is-active");
            if (circusPhotos.length > 0) {
              gsap.set(circusPhotos, { autoAlpha: 0 });
              circusPhotos.forEach((photo) => photo.classList.remove("is-active"));
            }
          },
          onLeaveBack: () => {
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(0px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(circusOverlay, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
            circusOverlay.classList.remove("is-active");
            if (circusPhotos.length > 0) {
              gsap.set(circusPhotos, { autoAlpha: 0 });
              circusPhotos.forEach((photo) => photo.classList.remove("is-active"));
            }
          },
          onUpdate: (self) => {
            const nextIndex = Math.min(
              circusPhotos.length - 1,
              Math.floor(self.progress * circusPhotos.length)
            );

            if (nextIndex !== circusIndex) {
              gsap.to(circusPhotos[circusIndex], { autoAlpha: 0, duration: 0.3 });
              gsap.to(circusPhotos[nextIndex], { autoAlpha: 1, duration: 0.3 });
              circusPhotos[circusIndex]?.classList.remove("is-active");
              circusPhotos[nextIndex]?.classList.add("is-active");
              circusIndex = nextIndex;
            }
          },
          onRefresh: (self) => {
            if (self.isActive || self.progress > 0) {
              if (villageOverlay) {
                gsap.set(villageOverlay, { autoAlpha: 0 });
                villageOverlay.classList.remove("is-active");
                if (villagePhotos.length > 0) {
                  gsap.set(villagePhotos, { autoAlpha: 0 });
                  villagePhotos.forEach((photo) => photo.classList.remove("is-active"));
                }
              }
            }
          },
        });

        triggers.push(circusTrigger);

        // Si se recarga después de la sección del circo, forzar ocultar el overlay
        if (window.scrollY > circusSequence.offsetTop + circusSequence.offsetHeight) {
          gsap.set(circusOverlay, { autoAlpha: 0 });
          circusOverlay.classList.remove("is-active");
          gsap.set(circusPhotos, { autoAlpha: 0 });
          circusPhotos.forEach((photo) => photo.classList.remove("is-active"));
        }
      }

      const forestSequence = document.querySelector(
        ".forest-sequence"
      ) as HTMLElement | null;

      if (forestSequence && forestOverlay && forestPhotos.length > 0) {
        gsap.set(forestOverlay, { autoAlpha: 0 });
        gsap.set(forestPhotos, { autoAlpha: 0 });
        gsap.set(forestPhotos[0], { autoAlpha: 1 });
        let forestIndex = 0;
        forestPhotos[0]?.classList.add("is-active");

        const forestTrigger = ScrollTrigger.create({
          trigger: forestSequence,
          start: "top center",
          end: "bottom center",
          scrub: 0.6,
          onEnter: () => {
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(10px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(forestOverlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
            forestOverlay.classList.add("is-active");
            if (circusOverlay) {
              gsap.to(circusOverlay, { autoAlpha: 0, duration: 0.2, ease: "power2.out" });
              circusOverlay.classList.remove("is-active");
              if (circusPhotos.length > 0) {
                gsap.set(circusPhotos, { autoAlpha: 0 });
                circusPhotos.forEach((photo) => photo.classList.remove("is-active"));
              }
            }
          },
          onEnterBack: () => {
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(10px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(forestOverlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
            forestOverlay.classList.add("is-active");
          },
          onLeave: () => {
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(0px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(forestOverlay, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
            forestOverlay.classList.remove("is-active");
          },
          onLeaveBack: () => {
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(0px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(forestOverlay, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
            forestOverlay.classList.remove("is-active");
          },
          onUpdate: (self) => {
            const nextIndex = Math.min(
              forestPhotos.length - 1,
              Math.floor(self.progress * forestPhotos.length)
            );

            if (nextIndex !== forestIndex) {
              gsap.to(forestPhotos[forestIndex], { autoAlpha: 0, duration: 0.3 });
              gsap.to(forestPhotos[nextIndex], { autoAlpha: 1, duration: 0.3 });
              forestPhotos[forestIndex]?.classList.remove("is-active");
              forestPhotos[nextIndex]?.classList.add("is-active");
              forestIndex = nextIndex;
            }
          },
        });

        triggers.push(forestTrigger);
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
