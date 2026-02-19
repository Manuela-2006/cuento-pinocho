"use client";

import { useLayoutEffect } from "react";
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
  useLayoutEffect(() => {
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
      const islandOverlay = document.querySelector(".islandOverlay") as HTMLElement | null;
      const section7Overlay = document.querySelector(".section7Overlay") as HTMLElement | null;
      const section8Overlay = document.querySelector(".section8Overlay") as HTMLElement | null;
      const section9Overlay = document.querySelector(".section9Overlay") as HTMLElement | null;

      // Hard reset on init to prevent stale overlay visibility after repeated reloads.
      if (section8Overlay) {
        gsap.set(section8Overlay, { autoAlpha: 0, display: "none" });
        section8Overlay.classList.remove("is-active");
      }

      // Reset explicit section/zone classes on init to avoid stale state after reload/bfcache.
      document.body.classList.remove(
        "island-active",
        "section7-active",
        "section8-active",
        "section9-active",
        "zone-mapa-active",
        "zone-geppetto-active",
        "zone-village-active",
        "zone-circus-active",
        "zone-forest-active",
        "zone-island-active"
      );
      const photos = gsap.utils.toArray<HTMLElement>(".geppettoOverlay .scenePhoto");
      const villagePhotos = gsap.utils.toArray<HTMLElement>(".villageOverlay .scenePhoto");
      const circusPhotos = gsap.utils.toArray<HTMLElement>(".circusOverlay .scenePhoto");
      const forestPhotos = gsap.utils.toArray<HTMLElement>(".forestOverlay .scenePhoto");
      const islandPhotos = gsap.utils.toArray<HTMLElement>(".islandOverlay .scenePhoto");
      const section7Photos = gsap.utils.toArray<HTMLElement>(".section7Overlay .scenePhoto");
      const section8Photos = gsap.utils.toArray<HTMLElement>(".section8Overlay .scenePhoto");
      const section9Photos = gsap.utils.toArray<HTMLElement>(".section9Overlay .scenePhoto");

      const overlays = [overlay, villageOverlay, circusOverlay, forestOverlay, islandOverlay, section7Overlay, section8Overlay, section9Overlay]
        .filter(Boolean) as HTMLElement[];
      if (overlays.length > 0) {
        gsap.set(overlays, { autoAlpha: 0 });
        overlays.forEach((el) => el.classList.remove("is-active"));
      }

      const allPhotos = [...photos, ...villagePhotos, ...circusPhotos, ...forestPhotos, ...islandPhotos, ...section7Photos, ...section8Photos, ...section9Photos];
      if (allPhotos.length > 0) {
        gsap.set(allPhotos, { autoAlpha: 0 });
        allPhotos.forEach((photo) => photo.classList.remove("is-active"));
      }

      const setIslandMode = (active: boolean) => {
        document.body.classList.toggle("island-active", active);
        if (active && forestOverlay) {
          gsap.set(forestOverlay, { autoAlpha: 0 });
          forestOverlay.classList.remove("is-active");
        }
        if (active && forestPhotos.length > 0) {
          gsap.set(forestPhotos, { autoAlpha: 0 });
          forestPhotos.forEach((photo) => photo.classList.remove("is-active"));
        }
      };

      const setSection7Mode = (active: boolean) => {
        document.body.classList.toggle("section7-active", active);
        if (active && section9Overlay) {
          gsap.set(section9Overlay, { autoAlpha: 0, display: "none" });
          section9Overlay.classList.remove("is-active");
        }
        if (active && section9Photos.length > 0) {
          gsap.set(section9Photos, { autoAlpha: 0 });
          section9Photos.forEach((photo) => photo.classList.remove("is-active"));
        }
        if (active && forestOverlay) {
          gsap.set(forestOverlay, { autoAlpha: 0 });
          forestOverlay.classList.remove("is-active");
        }
        if (active && forestPhotos.length > 0) {
          gsap.set(forestPhotos, { autoAlpha: 0 });
          forestPhotos.forEach((photo) => photo.classList.remove("is-active"));
        }
        if (active && islandOverlay) {
          gsap.set(islandOverlay, { autoAlpha: 0 });
          islandOverlay.classList.remove("is-active");
        }
        if (active && islandPhotos.length > 0) {
          gsap.set(islandPhotos, { autoAlpha: 0 });
          islandPhotos.forEach((photo) => photo.classList.remove("is-active"));
        }
      };

      const setSection8Mode = (active: boolean) => {
        document.body.classList.toggle("section8-active", active);
        if (section8Overlay) {
          gsap.set(section8Overlay, { display: active ? "grid" : "none" });
        }
        if (active && islandOverlay) {
          gsap.set(islandOverlay, { autoAlpha: 0 });
          islandOverlay.classList.remove("is-active");
        }
        if (active && islandPhotos.length > 0) {
          gsap.set(islandPhotos, { autoAlpha: 0 });
          islandPhotos.forEach((photo) => photo.classList.remove("is-active"));
        }
        if (active && section7Overlay) {
          gsap.set(section7Overlay, { autoAlpha: 0 });
          section7Overlay.classList.remove("is-active");
        }
        if (active && section7Photos.length > 0) {
          gsap.set(section7Photos, { autoAlpha: 0 });
          section7Photos.forEach((photo) => photo.classList.remove("is-active"));
        }
      };

      const setSection9Mode = (active: boolean) => {
        document.body.classList.toggle("section9-active", active);
        if (section9Overlay) {
          gsap.set(section9Overlay, { display: active ? "grid" : "none" });
        }
        if (active && section7Overlay) {
          gsap.set(section7Overlay, { autoAlpha: 0 });
          section7Overlay.classList.remove("is-active");
        }
        if (active && section7Photos.length > 0) {
          gsap.set(section7Photos, { autoAlpha: 0 });
          section7Photos.forEach((photo) => photo.classList.remove("is-active"));
        }
        if (active && section8Overlay) {
          gsap.set(section8Overlay, { autoAlpha: 0, display: "none" });
          section8Overlay.classList.remove("is-active");
        }
        if (active && section8Photos.length > 0) {
          gsap.set(section8Photos, { autoAlpha: 0 });
          section8Photos.forEach((photo) => photo.classList.remove("is-active"));
        }
      };

      const setFinalMapMode = (active: boolean) => {
        document.body.classList.toggle("final-map-active", active);
        if (active && section9Overlay) {
          gsap.set(section9Overlay, { autoAlpha: 0, display: "none" });
          section9Overlay.classList.remove("is-active");
        }
        if (active && section9Photos.length > 0) {
          gsap.set(section9Photos, { autoAlpha: 0 });
          section9Photos.forEach((photo) => photo.classList.remove("is-active"));
        }
        if (active && section8Overlay) {
          gsap.set(section8Overlay, { autoAlpha: 0, display: "none" });
          section8Overlay.classList.remove("is-active");
        }
        if (active && section8Photos.length > 0) {
          gsap.set(section8Photos, { autoAlpha: 0 });
          section8Photos.forEach((photo) => photo.classList.remove("is-active"));
        }
        if (active && section7Overlay) {
          gsap.set(section7Overlay, { autoAlpha: 0 });
          section7Overlay.classList.remove("is-active");
        }
        if (active && section7Photos.length > 0) {
          gsap.set(section7Photos, { autoAlpha: 0 });
          section7Photos.forEach((photo) => photo.classList.remove("is-active"));
        }
      };

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

      const ZONE_BODY_CLASSES = [
        "zone-mapa-active",
        "zone-geppetto-active",
        "zone-village-active",
        "zone-circus-active",
        "zone-forest-active",
        "zone-island-active",
      ];

      const setCurrentZoneClass = (zoneId: string) => {
        document.body.classList.remove(...ZONE_BODY_CLASSES);
        document.body.classList.add(`${zoneId}-active`);
        if (zoneId !== "zone-island") {
          document.body.classList.remove("section8-sequence-active");
          setSection8Mode(false);
          if (section8Overlay) {
            gsap.set(section8Overlay, { autoAlpha: 0 });
            section8Overlay.classList.remove("is-active");
          }
          if (section8Photos.length > 0) {
            gsap.set(section8Photos, { autoAlpha: 0 });
            section8Photos.forEach((photo) => photo.classList.remove("is-active"));
          }
        }
      };

      // Initial state: map overview zone
      moveToZone("zone-mapa", ZONE_SCALES["zone-mapa"]);

      const sections = document.querySelectorAll(".scene");

      sections.forEach((section) => {
        if ((section as HTMLElement).classList.contains("final-map-sequence")) return;

        const zoneIdAttr = (section as HTMLElement).dataset.zone;
        if (!zoneIdAttr) return;

        const scale = ZONE_SCALES[zoneIdAttr];
        if (!scale) return;

        const trigger = ScrollTrigger.create({
          trigger: section as HTMLElement,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            setCurrentZoneClass(zoneIdAttr);
            moveToZone(zoneIdAttr, scale);
          },
          onEnterBack: () => {
            setCurrentZoneClass(zoneIdAttr);
            moveToZone(zoneIdAttr, scale);
          },
          markers: true,
        });

        triggers.push(trigger);
      });

      const sceneList = Array.from(sections) as HTMLElement[];
      const probeY = window.scrollY + window.innerHeight / 2;
      let initialZone = "zone-mapa";
      for (const section of sceneList) {
        if (section.offsetTop <= probeY) {
          initialZone = section.dataset.zone ?? initialZone;
        } else {
          break;
        }
      }
      setCurrentZoneClass(initialZone);

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
        let forestIndex = 0;
        const setForestPhotoByProgress = (progress: number) => {
          const nextIndex = Math.min(
            forestPhotos.length - 1,
            Math.floor(progress * forestPhotos.length)
          );
          gsap.set(forestPhotos, { autoAlpha: 0 });
          forestPhotos.forEach((photo) => photo.classList.remove("is-active"));
          gsap.set(forestPhotos[nextIndex], { autoAlpha: 1 });
          forestPhotos[nextIndex]?.classList.add("is-active");
          forestIndex = nextIndex;
        };

        const forestTrigger = ScrollTrigger.create({
          trigger: forestSequence,
          start: "top center",
          end: "bottom center",
          scrub: 0.6,
          onEnter: () => {
            setIslandMode(false);
            setSection7Mode(false);
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(10px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(forestOverlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
            forestOverlay.classList.add("is-active");
            setForestPhotoByProgress(0);
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
            setIslandMode(false);
            setSection7Mode(false);
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(10px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(forestOverlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
            forestOverlay.classList.add("is-active");
            setForestPhotoByProgress(1);
          },
          onLeave: () => {
            setSection7Mode(false);
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(0px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(forestOverlay, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
            forestOverlay.classList.remove("is-active");
          },
          onLeaveBack: () => {
            setSection7Mode(false);
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
          onRefresh: (self) => {
            if (self.progress >= 1 || window.scrollY > forestSequence.offsetTop + forestSequence.offsetHeight) {
              gsap.set(forestOverlay, { autoAlpha: 0 });
              forestOverlay.classList.remove("is-active");
              if (forestPhotos.length > 0) {
                gsap.set(forestPhotos, { autoAlpha: 0 });
                forestPhotos.forEach((photo) => photo.classList.remove("is-active"));
              }
            }
          },
        });

        triggers.push(forestTrigger);

        if (window.scrollY > forestSequence.offsetTop + forestSequence.offsetHeight) {
          gsap.set(forestOverlay, { autoAlpha: 0 });
          forestOverlay.classList.remove("is-active");
          gsap.set(forestPhotos, { autoAlpha: 0 });
          forestPhotos.forEach((photo) => photo.classList.remove("is-active"));
        }
      }

      const islandSequence = document.querySelector(
        ".island-sequence"
      ) as HTMLElement | null;

      if (islandSequence && islandOverlay && islandPhotos.length > 0) {
        gsap.set(islandOverlay, { autoAlpha: 0 });
        gsap.set(islandPhotos, { autoAlpha: 0 });
        gsap.set(islandPhotos[0], { autoAlpha: 1 });
        islandPhotos[0]?.classList.add("is-active");
        let islandIndex = 0;

        const islandTrigger = ScrollTrigger.create({
          trigger: islandSequence,
          start: "top center",
          end: "bottom center",
          scrub: 0.6,
          onEnter: () => {
            setSection7Mode(false);
            setSection8Mode(false);
            setIslandMode(true);
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(10px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(islandOverlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
            islandOverlay.classList.add("is-active");
            if (forestOverlay) {
              gsap.to(forestOverlay, { autoAlpha: 0, duration: 0.2, ease: "power2.out" });
              forestOverlay.classList.remove("is-active");
              if (forestPhotos.length > 0) {
                gsap.set(forestPhotos, { autoAlpha: 0 });
                forestPhotos.forEach((photo) => photo.classList.remove("is-active"));
              }
            }
          },
          onEnterBack: () => {
            setSection7Mode(false);
            setSection8Mode(false);
            setIslandMode(true);
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(10px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(islandOverlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
            islandOverlay.classList.add("is-active");
            if (islandPhotos.length > 0) {
              const lastIndex = islandPhotos.length - 1;
              gsap.set(islandPhotos, { autoAlpha: 0 });
              gsap.set(islandPhotos[lastIndex], { autoAlpha: 1 });
              islandPhotos.forEach((photo) => photo.classList.remove("is-active"));
              islandPhotos[lastIndex]?.classList.add("is-active");
              islandIndex = lastIndex;
            }
          },
          onLeave: () => {
            setIslandMode(false);
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(0px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(islandOverlay, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
            islandOverlay.classList.remove("is-active");
          },
          onLeaveBack: () => {
            setIslandMode(false);
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(0px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(islandOverlay, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
            islandOverlay.classList.remove("is-active");
          },
          onRefresh: (self) => {
            if (self.isActive || self.progress > 0) {
              if (forestOverlay) {
                gsap.set(forestOverlay, { autoAlpha: 0 });
                forestOverlay.classList.remove("is-active");
                if (forestPhotos.length > 0) {
                  gsap.set(forestPhotos, { autoAlpha: 0 });
                  forestPhotos.forEach((photo) => photo.classList.remove("is-active"));
                }
              }
            }
          },
          onUpdate: (self) => {
            const nextIndex = Math.min(
              islandPhotos.length - 1,
              Math.floor(self.progress * islandPhotos.length)
            );

            if (nextIndex !== islandIndex) {
              gsap.to(islandPhotos[islandIndex], { autoAlpha: 0, duration: 0.3 });
              gsap.to(islandPhotos[nextIndex], { autoAlpha: 1, duration: 0.3 });
              islandPhotos[islandIndex]?.classList.remove("is-active");
              islandPhotos[nextIndex]?.classList.add("is-active");
              islandIndex = nextIndex;
            }
          },
        });

        triggers.push(islandTrigger);

        const islandStart = islandSequence.offsetTop - window.innerHeight / 2;
        if (window.scrollY >= islandStart) {
          setIslandMode(true);
          gsap.set(islandOverlay, { autoAlpha: 1 });
          islandOverlay.classList.add("is-active");
          gsap.set(islandPhotos, { autoAlpha: 0 });
          gsap.set(islandPhotos[0], { autoAlpha: 1 });
          islandPhotos.forEach((photo, index) =>
            photo.classList.toggle("is-active", index === 0)
          );

          if (forestOverlay) {
            gsap.set(forestOverlay, { autoAlpha: 0 });
            forestOverlay.classList.remove("is-active");
          }
          if (forestPhotos.length > 0) {
            gsap.set(forestPhotos, { autoAlpha: 0 });
            forestPhotos.forEach((photo) => photo.classList.remove("is-active"));
          }
        }
      }

      const section7Sequence = document.querySelector(
        ".section7-sequence"
      ) as HTMLElement | null;

      if (section7Sequence && section7Overlay && section7Photos.length > 0) {
        gsap.set(section7Overlay, { autoAlpha: 0 });
        gsap.set(section7Photos, { autoAlpha: 0 });
        gsap.set(section7Photos[0], { autoAlpha: 1 });
        section7Photos[0]?.classList.add("is-active");
        let section7Index = 0;

        const section7Trigger = ScrollTrigger.create({
          trigger: section7Sequence,
          start: "top center",
          end: "bottom center",
          scrub: 0.6,
          onEnter: () => {
            setSection7Mode(true);
            setSection9Mode(false);
            setSection8Mode(false);
            setIslandMode(false);
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(10px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(section7Overlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
            section7Overlay.classList.add("is-active");
            section7Index = 0;
            gsap.set(section7Photos, { autoAlpha: 0 });
            gsap.set(section7Photos[section7Index], { autoAlpha: 1 });
            section7Photos.forEach((photo) => photo.classList.remove("is-active"));
            section7Photos[section7Index]?.classList.add("is-active");
            if (islandOverlay) {
              gsap.to(islandOverlay, { autoAlpha: 0, duration: 0.2, ease: "power2.out" });
              islandOverlay.classList.remove("is-active");
              if (islandPhotos.length > 0) {
                gsap.set(islandPhotos, { autoAlpha: 0 });
                islandPhotos.forEach((photo) => photo.classList.remove("is-active"));
              }
            }
          },
          onEnterBack: () => {
            setSection7Mode(true);
            setSection9Mode(false);
            setSection8Mode(false);
            setIslandMode(false);
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(10px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(section7Overlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
            section7Overlay.classList.add("is-active");
            section7Index = section7Photos.length - 1;
            gsap.set(section7Photos, { autoAlpha: 0 });
            gsap.set(section7Photos[section7Index], { autoAlpha: 1 });
            section7Photos.forEach((photo) => photo.classList.remove("is-active"));
            section7Photos[section7Index]?.classList.add("is-active");
            if (islandOverlay) {
              gsap.set(islandOverlay, { autoAlpha: 0 });
              islandOverlay.classList.remove("is-active");
            }
            if (islandPhotos.length > 0) {
              gsap.set(islandPhotos, { autoAlpha: 0 });
              islandPhotos.forEach((photo) => photo.classList.remove("is-active"));
            }
          },
          onLeave: () => {
            setSection7Mode(false);
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(0px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(section7Overlay, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
            section7Overlay.classList.remove("is-active");
          },
          onLeaveBack: () => {
            setSection7Mode(false);
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(0px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(section7Overlay, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
            section7Overlay.classList.remove("is-active");
          },
          onRefresh: (self) => {
            if (self.isActive || self.progress > 0) {
              if (islandOverlay) {
                gsap.set(islandOverlay, { autoAlpha: 0 });
                islandOverlay.classList.remove("is-active");
              }
              if (islandPhotos.length > 0) {
                gsap.set(islandPhotos, { autoAlpha: 0 });
                islandPhotos.forEach((photo) => photo.classList.remove("is-active"));
              }
            }
          },
          onUpdate: (self) => {
            const nextIndex = Math.min(
              section7Photos.length - 1,
              Math.floor(self.progress * section7Photos.length)
            );

            if (nextIndex !== section7Index) {
              gsap.to(section7Photos[section7Index], { autoAlpha: 0, duration: 0.3 });
              gsap.to(section7Photos[nextIndex], { autoAlpha: 1, duration: 0.3 });
              section7Photos[section7Index]?.classList.remove("is-active");
              section7Photos[nextIndex]?.classList.add("is-active");
              section7Index = nextIndex;
            }
          },
        });

        triggers.push(section7Trigger);

        const section7Start = section7Sequence.offsetTop - window.innerHeight / 2;
        if (window.scrollY >= section7Start) {
          setSection7Mode(true);
          setSection9Mode(false);
          setSection8Mode(false);
          gsap.set(section7Overlay, { autoAlpha: 1 });
          section7Overlay.classList.add("is-active");
          gsap.set(section7Photos, { autoAlpha: 0 });
          gsap.set(section7Photos[0], { autoAlpha: 1 });
          section7Photos.forEach((photo, index) =>
            photo.classList.toggle("is-active", index === 0)
          );
          if (islandOverlay) {
            gsap.set(islandOverlay, { autoAlpha: 0 });
            islandOverlay.classList.remove("is-active");
          }
          if (islandPhotos.length > 0) {
            gsap.set(islandPhotos, { autoAlpha: 0 });
            islandPhotos.forEach((photo) => photo.classList.remove("is-active"));
          }
        }
      }

      const section8Sequence = document.querySelector(
        ".section8-sequence"
      ) as HTMLElement | null;

      if (section8Sequence && section8Overlay && section8Photos.length > 0) {
        gsap.set(section8Overlay, { autoAlpha: 0 });
        gsap.set(section8Photos, { autoAlpha: 0 });
        gsap.set(section8Photos[0], { autoAlpha: 1 });
        section8Photos[0]?.classList.add("is-active");
        let section8Index = 0;

        const section8Trigger = ScrollTrigger.create({
          trigger: section8Sequence,
          start: "top center",
          end: "bottom center",
          scrub: 0.6,
          onEnter: () => {
            document.body.classList.add("section8-sequence-active");
            setSection8Mode(true);
            setSection9Mode(false);
            setSection7Mode(false);
            setIslandMode(false);
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(10px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(section8Overlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
            section8Overlay.classList.add("is-active");
            section8Index = 0;
            gsap.set(section8Photos, { autoAlpha: 0 });
            gsap.set(section8Photos[section8Index], { autoAlpha: 1 });
            section8Photos.forEach((photo) => photo.classList.remove("is-active"));
            section8Photos[section8Index]?.classList.add("is-active");
          },
          onEnterBack: () => {
            document.body.classList.add("section8-sequence-active");
            setSection8Mode(true);
            setSection9Mode(false);
            setSection7Mode(false);
            setIslandMode(false);
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(10px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(section8Overlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
            section8Overlay.classList.add("is-active");
            section8Index = section8Photos.length - 1;
            gsap.set(section8Photos, { autoAlpha: 0 });
            gsap.set(section8Photos[section8Index], { autoAlpha: 1 });
            section8Photos.forEach((photo) => photo.classList.remove("is-active"));
            section8Photos[section8Index]?.classList.add("is-active");
          },
          onLeave: () => {
            document.body.classList.remove("section8-sequence-active");
            setSection8Mode(false);
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(0px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(section8Overlay, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
            section8Overlay.classList.remove("is-active");
          },
          onLeaveBack: () => {
            document.body.classList.remove("section8-sequence-active");
            setSection8Mode(false);
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(0px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(section8Overlay, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
            section8Overlay.classList.remove("is-active");
          },
          onRefresh: (self) => {
            document.body.classList.toggle("section8-sequence-active", self.isActive);
            if (self.isActive || self.progress > 0) {
              if (islandOverlay) {
                gsap.set(islandOverlay, { autoAlpha: 0 });
                islandOverlay.classList.remove("is-active");
              }
              if (islandPhotos.length > 0) {
                gsap.set(islandPhotos, { autoAlpha: 0 });
                islandPhotos.forEach((photo) => photo.classList.remove("is-active"));
              }
              if (section7Overlay) {
                gsap.set(section7Overlay, { autoAlpha: 0 });
                section7Overlay.classList.remove("is-active");
              }
              if (section7Photos.length > 0) {
                gsap.set(section7Photos, { autoAlpha: 0 });
                section7Photos.forEach((photo) => photo.classList.remove("is-active"));
              }
            }
          },
          onUpdate: (self) => {
            if (!document.body.classList.contains("zone-island-active")) {
              document.body.classList.remove("section8-sequence-active");
              setSection8Mode(false);
              if (section8Overlay) {
                gsap.set(section8Overlay, { autoAlpha: 0, display: "none" });
                section8Overlay.classList.remove("is-active");
              }
              if (section8Photos.length > 0) {
                gsap.set(section8Photos, { autoAlpha: 0 });
                section8Photos.forEach((photo) => photo.classList.remove("is-active"));
              }
              return;
            }

            const nextIndex = Math.min(
              section8Photos.length - 1,
              Math.floor(self.progress * section8Photos.length)
            );

            if (nextIndex !== section8Index) {
              gsap.to(section8Photos[section8Index], { autoAlpha: 0, duration: 0.3 });
              gsap.to(section8Photos[nextIndex], { autoAlpha: 1, duration: 0.3 });
              section8Photos[section8Index]?.classList.remove("is-active");
              section8Photos[nextIndex]?.classList.add("is-active");
              section8Index = nextIndex;
            }
          },
        });

        triggers.push(section8Trigger);

        const section8Start = section8Sequence.offsetTop - window.innerHeight / 2;
        if (
          window.scrollY >= section8Start &&
          document.body.classList.contains("zone-island-active")
        ) {
          document.body.classList.add("section8-sequence-active");
          setSection8Mode(true);
          setSection9Mode(false);
          gsap.set(section8Overlay, { autoAlpha: 1 });
          section8Overlay.classList.add("is-active");
          gsap.set(section8Photos, { autoAlpha: 0 });
          gsap.set(section8Photos[0], { autoAlpha: 1 });
          section8Photos.forEach((photo, index) =>
            photo.classList.toggle("is-active", index === 0)
          );
          if (islandOverlay) {
            gsap.set(islandOverlay, { autoAlpha: 0 });
            islandOverlay.classList.remove("is-active");
          }
          if (islandPhotos.length > 0) {
            gsap.set(islandPhotos, { autoAlpha: 0 });
            islandPhotos.forEach((photo) => photo.classList.remove("is-active"));
          }
          if (section7Overlay) {
            gsap.set(section7Overlay, { autoAlpha: 0 });
            section7Overlay.classList.remove("is-active");
          }
          if (section7Photos.length > 0) {
            gsap.set(section7Photos, { autoAlpha: 0 });
            section7Photos.forEach((photo) => photo.classList.remove("is-active"));
          }
        }
      }

      const section9Sequence = document.querySelector(
        ".section9-sequence"
      ) as HTMLElement | null;

      if (section9Sequence && section9Overlay && section9Photos.length > 0) {
        gsap.set(section9Overlay, { autoAlpha: 0 });
        gsap.set(section9Photos, { autoAlpha: 0 });
        gsap.set(section9Photos[0], { autoAlpha: 1 });
        section9Photos[0]?.classList.add("is-active");
        let section9Index = 0;

        const section9Trigger = ScrollTrigger.create({
          trigger: section9Sequence,
          start: "top center",
          end: "bottom center",
          scrub: 0.6,
          onEnter: () => {
            setFinalMapMode(false);
            setSection9Mode(true);
            setSection8Mode(false);
            setSection7Mode(false);
            setIslandMode(false);
            if (section8Overlay) {
              gsap.set(section8Overlay, { autoAlpha: 0 });
              section8Overlay.classList.remove("is-active");
            }
            if (section8Photos.length > 0) {
              gsap.set(section8Photos, { autoAlpha: 0 });
              section8Photos.forEach((photo) => photo.classList.remove("is-active"));
            }
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(10px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(section9Overlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
            section9Overlay.classList.add("is-active");
            section9Index = 0;
            gsap.set(section9Photos, { autoAlpha: 0 });
            gsap.set(section9Photos[section9Index], { autoAlpha: 1 });
            section9Photos.forEach((photo) => photo.classList.remove("is-active"));
            section9Photos[section9Index]?.classList.add("is-active");
          },
          onEnterBack: () => {
            setFinalMapMode(false);
            setSection9Mode(true);
            setSection8Mode(false);
            setSection7Mode(false);
            setIslandMode(false);
            if (section8Overlay) {
              gsap.set(section8Overlay, { autoAlpha: 0 });
              section8Overlay.classList.remove("is-active");
            }
            if (section8Photos.length > 0) {
              gsap.set(section8Photos, { autoAlpha: 0 });
              section8Photos.forEach((photo) => photo.classList.remove("is-active"));
            }
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(10px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(section9Overlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
            section9Overlay.classList.add("is-active");
            section9Index = section9Photos.length - 1;
            gsap.set(section9Photos, { autoAlpha: 0 });
            gsap.set(section9Photos[section9Index], { autoAlpha: 1 });
            section9Photos.forEach((photo) => photo.classList.remove("is-active"));
            section9Photos[section9Index]?.classList.add("is-active");
          },
          onLeave: () => {
            setSection9Mode(false);
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(0px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(section9Overlay, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
            section9Overlay.classList.remove("is-active");
          },
          onLeaveBack: () => {
            setSection9Mode(false);
            if (mapLayer) {
              gsap.to(mapLayer, { filter: "blur(0px)", duration: 0.6, ease: "power2.out" });
            }
            gsap.to(section9Overlay, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
            section9Overlay.classList.remove("is-active");
          },
          onRefresh: (self) => {
            if (self.isActive || self.progress > 0) {
              if (section8Overlay) {
                gsap.set(section8Overlay, { autoAlpha: 0 });
                section8Overlay.classList.remove("is-active");
              }
              if (section8Photos.length > 0) {
                gsap.set(section8Photos, { autoAlpha: 0 });
                section8Photos.forEach((photo) => photo.classList.remove("is-active"));
              }
            }
          },
          onUpdate: (self) => {
            const nextIndex = Math.min(
              section9Photos.length - 1,
              Math.floor(self.progress * section9Photos.length)
            );

            if (nextIndex !== section9Index) {
              gsap.to(section9Photos[section9Index], { autoAlpha: 0, duration: 0.3 });
              gsap.to(section9Photos[nextIndex], { autoAlpha: 1, duration: 0.3 });
              section9Photos[section9Index]?.classList.remove("is-active");
              section9Photos[nextIndex]?.classList.add("is-active");
              section9Index = nextIndex;
            }
          },
        });

        triggers.push(section9Trigger);

        const section9Start = section9Sequence.offsetTop;
        if (
          window.scrollY >= section9Start &&
          document.body.classList.contains("zone-geppetto-active")
        ) {
          setFinalMapMode(false);
          document.body.classList.remove("section8-sequence-active");
          setSection9Mode(true);
          setSection8Mode(false);
          if (section8Overlay) {
            gsap.set(section8Overlay, { autoAlpha: 0 });
            section8Overlay.classList.remove("is-active");
          }
          if (section8Photos.length > 0) {
            gsap.set(section8Photos, { autoAlpha: 0 });
            section8Photos.forEach((photo) => photo.classList.remove("is-active"));
          }
          gsap.set(section9Overlay, { autoAlpha: 1 });
          section9Overlay.classList.add("is-active");
          gsap.set(section9Photos, { autoAlpha: 0 });
          gsap.set(section9Photos[0], { autoAlpha: 1 });
          section9Photos.forEach((photo, index) =>
            photo.classList.toggle("is-active", index === 0)
          );
          if (section8Overlay) {
            gsap.set(section8Overlay, { autoAlpha: 0 });
            section8Overlay.classList.remove("is-active");
          }
          if (section8Photos.length > 0) {
            gsap.set(section8Photos, { autoAlpha: 0 });
            section8Photos.forEach((photo) => photo.classList.remove("is-active"));
          }
        }
      }

      const finalMapSequence = document.querySelector(
        ".final-map-sequence"
      ) as HTMLElement | null;

      if (finalMapSequence) {
        const finalMapTrigger = ScrollTrigger.create({
          trigger: finalMapSequence,
          start: "top center",
          end: "bottom center",
          scrub: 0.6,
          onEnter: () => {
            setCurrentZoneClass("zone-mapa");
            moveToZone(null, 1);
            setFinalMapMode(true);
          },
          onEnterBack: () => {
            setCurrentZoneClass("zone-mapa");
            moveToZone(null, 1);
            setFinalMapMode(true);
          },
          onLeave: () => {
            setFinalMapMode(false);
          },
          onLeaveBack: () => {
            setFinalMapMode(false);
          },
        });

        triggers.push(finalMapTrigger);
      }
    };

    animationFrameId = requestAnimationFrame(tryInit);

    return () => {
      cancelAnimationFrame(animationFrameId);
      triggers.forEach((t) => t.kill());
      document.body.classList.remove("island-active");
      document.body.classList.remove("section7-active");
      document.body.classList.remove("section8-active");
      document.body.classList.remove("section9-active");
      document.body.classList.remove("section8-sequence-active");
      document.body.classList.remove("final-map-active");
      document.body.classList.remove(
        "zone-mapa-active",
        "zone-geppetto-active",
        "zone-village-active",
        "zone-circus-active",
        "zone-forest-active",
        "zone-island-active"
      );
    };
  }, []);

  return null;
}
