"use client";

import React, { useEffect, useRef, useState } from "react";
import InlineSvg from "./InlineSvg";

const RECT_SELECTOR = "#pinochodemadera, [data-name='pinochodemadera']";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  opacity: number;
}

interface Flame {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  width: number;
  height: number;
  opacity: number;
  color: number;
  wobble: number;
}

const SCENE_IMAGES = [
  {
    src: "/seccion1/Escena1.jpg",
    alt: "Escena 1",
    isSplit: true,
  },
  {
    src: "/seccion1/Escena2.jpg",
    alt: "Escena 2",
    text: `Un día, mientras trabajaba, encontró un trozo de madera muy especial que brillaba con una luz dorada. "¡Qué madera tan bonita!", pensó Geppetto. "Voy a hacer una marioneta para que me haga compañía".`,
    textPosition: "bottom-left",
    hasMagicWood: true,
    hasFire: true,
  },
  {
    src: "/seccion1/Escena3.jpg",
    alt: "Escena 3",
    isSplit: true,
    customTexts: {
      topLeft:
        "Durante toda la noche, Geppetto trabajó con mucho cariño. Talló una cabeza redonda, brazos largos, piernas delgadas y una naricita pequeña.",
      bottomRight:
        'Cuando terminó, sonrió y dijo: "Te llamaré Pinocho. Serás como el hijo que nunca tuve".',
    },
  },
  {
    src: "/seccion1/Escena4.jpg",
    alt: "Escena 4",
    text: `Esa noche, antes de irse a dormir, Geppetto miró al cielo por la ventana. Una estrella brillaba más que todas las demás. Geppetto juntó las manos y susurró: "Querida estrella… ojalá Pinocho fuera un niño de verdad.".`,
    textPosition: "bottom-left",
  },
  {
    src: "/seccion2/Escena1.svg",
    alt: "Escena 5",
    isVideo: true,
    isSvg: true,
    text: "Mientras Geppetto dormía, una luz azul brillante entró por la ventana. Era el Hada Azul, con alas luminosas y un vestido del color del cielo.",
    textPosition: "top-left",
  },
  {
    src: "/seccion2/Escena2.jpg",
    alt: "Escena 6",
    text: "El hada tocó a Pinocho con su varita y le dio vida, advirtiéndole que solo podría ser un niño de verdad si era valiente, sincero y generoso, y que las mentiras tendrían consecuencias.",
    textPosition: "top-left",
  },
  {
    src: "/seccion2/Escena3.jpg",
    alt: "Escena 7",
    text: `Pinocho movió sus brazos, sus piernas y dio su primer paso. "¡Estoy vivo!", gritó feliz.\nEl Hada Azul despertó a un pequeño grillo del taller. "Pepito Grillo, tú serás su conciencia"`,
    textPosition: "top-left",
    hasGrilloTooltip: true,
  },
] as const;

const VIDEO_SRC = "/seccion2/video_1_1770053448255.mp4";

export default function GeppettoOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAfterVideo, setShowAfterVideo] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const [grilloTooltipData, setGrilloTooltipData] = useState<{
    show: boolean;
    x: number;
    y: number;
  }>({ show: false, x: 0, y: 0 });

  const [particles, setParticles] = useState<Particle[]>([]);
  const [flames, setFlames] = useState<Flame[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const particleIdRef = useRef(0);
  const flameIdRef = useRef(0);

  const animationFrameRef = useRef<number | undefined>(undefined);
  const flameAnimationFrameRef = useRef<number | undefined>(undefined);

  const lastParticleTimeRef = useRef(0);

  // 🔥 Generación de llamas
  useEffect(() => {
    const generateFlames = () => {
      const shouldGenerate = Math.random() > 0.2;
      if (!shouldGenerate) return;

      const count = Math.random() > 0.6 ? 2 : 1;
      const newFlames: Flame[] = [];

      for (let i = 0; i < count; i++) {
        newFlames.push({
          id: flameIdRef.current++,
          x: 98 + (Math.random() - 0.5) * 4,
          y: 60 + Math.random() * 1,
          vx: (Math.random() - 0.5) * 0.1,
          vy: -Math.random() * 0.3 - 0.2,
          life: 1,
          width: Math.random() * 6 + 6,
          height: Math.random() * 12 + 14,
          opacity: Math.random() * 0.2 + 0.7,
          color: Math.floor(Math.random() * 3),
          wobble: Math.random() * Math.PI * 2,
        });
      }

      setFlames((prev) => [...prev, ...newFlames].slice(-15));
    };

    const interval = setInterval(generateFlames, 200);
    return () => clearInterval(interval);
  }, []);

  // 🔥 Animación de llamas
  useEffect(() => {
    if (flames.length === 0) {
      if (flameAnimationFrameRef.current !== undefined) {
        cancelAnimationFrame(flameAnimationFrameRef.current);
        flameAnimationFrameRef.current = undefined;
      }
      return;
    }

    const animate = () => {
      setFlames((prev) =>
        prev
          .map((f) => {
            const wobbleOffset = Math.sin(f.wobble) * 0.15;
            return {
              ...f,
              x: f.x + f.vx + wobbleOffset,
              y: f.y + f.vy,
              vx: f.vx * 0.97,
              vy: f.vy - 0.005,
              width: f.width * 0.985,
              height: f.height * 1.015,
              life: f.life - 0.012,
              opacity: f.life > 0.5 ? f.life * 0.75 : f.life * 0.25,
              wobble: f.wobble + 0.15,
            };
          })
          .filter((f) => f.life > 0)
      );
      flameAnimationFrameRef.current = requestAnimationFrame(animate);
    };

    flameAnimationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (flameAnimationFrameRef.current !== undefined) {
        cancelAnimationFrame(flameAnimationFrameRef.current);
      }
    };
  }, [flames.length > 0]);

  // ✨ Reset de vídeo y audio al cerrar
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isOpen]);

  // Eventos externos
  useEffect(() => {
    const handleLeave = () => {
      setIsOpen(false);
      setShowAfterVideo(false);
      setIsFading(false);
    };
    window.addEventListener("geppetto-sequence-leave", handleLeave);
    return () => window.removeEventListener("geppetto-sequence-leave", handleLeave);
  }, []);

  useEffect(() => {
    const handleActiveIndex = (event: Event) => {
      const detail = (event as CustomEvent<{ index: number }>).detail;
      if (!detail) return;

      const photos = Array.from(
        document.querySelectorAll(".geppettoOverlay .scenePhoto")
      ) as HTMLElement[];

      const svgIndex = photos.findIndex((photo) =>
        photo.classList.contains("sceneSvg")
      );

      if (detail.index === svgIndex) {
        setIsOpen(false);
        setShowAfterVideo(false);
        setIsFading(false);
      }
    };

    window.addEventListener("geppetto-active-index", handleActiveIndex);
    return () => window.removeEventListener("geppetto-active-index", handleActiveIndex);
  }, []);

  // ✨ Partículas
  useEffect(() => {
    if (particles.length === 0) {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
      return;
    }

    const animate = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy - 0.05,
            life: p.life - 0.008,
            opacity: p.life > 0.7 ? p.life : p.life * 0.5,
          }))
          .filter((p) => p.life > 0)
      );
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particles.length > 0]);

  const handleOpen = () => {
    console.log("🎬 Video play triggered!");

    setShowAfterVideo(false);
    setIsFading(false);
    setIsOpen(true);

    // Importante: algunos navegadores son más estables si llamas a play en el siguiente frame
    requestAnimationFrame(() => {
      if (videoRef.current) {
        console.log("📹 Video ref exists, playing...");
        try {
          videoRef.current.currentTime = 0;
          videoRef.current.load(); // ayuda cuando el vídeo no arranca por estado raro
          void videoRef.current.play().catch((err) =>
            console.error("❌ Video error:", err)
          );
        } catch (e) {
          console.error("❌ Video exception:", e);
        }
      } else {
        console.error("❌ Video ref is null!");
      }

      if (audioRef.current) {
        console.log("🔊 Audio ref exists, playing...");
        try {
          audioRef.current.currentTime = 0;
          void audioRef.current.play().catch((err) =>
            console.error("❌ Audio error:", err)
          );
        } catch (e) {
          console.error("❌ Audio exception:", e);
        }
      } else {
        console.error("❌ Audio ref is null!");
      }
    });
  };

  const getTextPositionClass = (position?: string) => {
    switch (position) {
      case "top-left":
        return "sceneCornerTopLeft";
      case "top-right":
        return "sceneCornerTopRight";
      case "bottom-left":
        return "sceneCornerBottomLeft";
      case "bottom-right":
      default:
        return "sceneParagraphHero";
    }
  };

  const handleMouseMoveGrillo = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const imageWidth = rect.width;
    const imageHeight = rect.height;

    const grilloX = imageWidth * 0.82;
    const grilloY = imageHeight * 0.28;
    const grilloSize = 300;

    const isOverGrillo =
      x >= grilloX - grilloSize / 2 &&
      x <= grilloX + grilloSize / 2 &&
      y >= grilloY - grilloSize / 2 &&
      y <= grilloY + grilloSize / 2;

    if (isOverGrillo) {
      setGrilloTooltipData({
        show: true,
        x: rect.left + grilloX - 80,
        y: rect.top + grilloY - 80,
      });
    } else {
      setGrilloTooltipData((prev) => ({ ...prev, show: false }));
    }
  };

  const handleMouseMoveWood = (event: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastParticleTimeRef.current < 100) return;
    lastParticleTimeRef.current = now;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const imageWidth = rect.width;
    const imageHeight = rect.height;

    const woodX = imageWidth * 0.5;
    const woodY = imageHeight * 0.4;
    const woodWidth = imageWidth * 0.3;
    const woodHeight = imageHeight * 0.4;

    const isOverWood =
      x >= woodX - woodWidth / 2 &&
      x <= woodX + woodWidth / 2 &&
      y >= woodY - woodHeight / 2 &&
      y <= woodY + woodHeight / 2;

    if (isOverWood) {
      const numParticles = Math.random() > 0.5 ? 1 : 2;
      const newParticles: Particle[] = [];

      for (let i = 0; i < numParticles; i++) {
        newParticles.push({
          id: particleIdRef.current++,
          x: event.clientX + (Math.random() - 0.5) * 30,
          y: event.clientY + (Math.random() - 0.5) * 30,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -Math.random() * 0.5 - 0.3,
          life: 1,
          size: Math.random() * 3 + 4,
          opacity: 0.9,
        });
      }
      setParticles((prev) => [...prev, ...newParticles].slice(-30));
    }
  };

  const getFlameColor = (colorIndex: number, opacity: number) => {
    const colors = [
      `rgba(255, 140, 40, ${opacity})`,
      `rgba(255, 190, 80, ${opacity})`,
      `rgba(255, 230, 160, ${opacity})`,
    ];
    return colors[colorIndex] ?? colors[0];
  };

  // ✅ Hit-test robusto para SVG: intenta closest(), y si falla, busca el elemento dentro del svg
  const didClickPinocho = (container: HTMLElement, rawTarget: EventTarget | null) => {
    const targetEl = rawTarget instanceof Element ? rawTarget : null;

    // 1) Camino rápido (tu lógica original)
    const closest = targetEl?.closest?.(RECT_SELECTOR);
    if (closest) return true;

    // 2) Fallback: si por cómo se embebe el SVG el target no coincide, mira si existe el elemento y estamos dentro del contenedor
    const svg = container.querySelector("svg");
    if (!svg) return false;

    const pinocho = svg.querySelector(RECT_SELECTOR);
    if (!pinocho) return false;

    // Si el pinocho existe, y el click viene de dentro del svg, lo damos por válido
    // (Puedes endurecer esto si quieres, pero así te aseguras de que funciona)
    return !!targetEl && (targetEl === svg || svg.contains(targetEl));
  };

  return (
    <>
      {/* ✅ IMPORTANTE: añadimos is-active para que el overlay reciba clicks */}
      <div className="geppettoOverlay is-active" aria-hidden="true">
        {SCENE_IMAGES.map((image) => {
          if ((image as any).isSplit) {
            if (image.alt === "Escena 1") {
              return (
                <div key={image.src} className="scenePhoto sceneFrame">
                  <img className="sceneFrameImage" src={image.src} alt={image.alt} />
                  <div className="sceneCornerBox sceneParagraphHero">
                    Geppetto era un señor mayor, con barba blanca y ojos dulces, que vivía
                    solo en su pequeño taller de madera.
                  </div>
                  <div className="sceneCornerBox sceneCornerTopLeft sceneTitleHero">
                    Había una vez, en un pequeño pueblo de Italia, un carpintero muy bueno y
                    solitario llamado Geppetto.
                  </div>
                </div>
              );
            }

            if (image.alt === "Escena 3" && (image as any).customTexts) {
              const customTexts = (image as any).customTexts as {
                topLeft: string;
                bottomRight: string;
              };
              return (
                <div key={image.src} className="scenePhoto sceneFrame">
                  <img className="sceneFrameImage" src={image.src} alt={image.alt} />
                  <div className="sceneCornerBox sceneCornerTopLeft">{customTexts.topLeft}</div>
                  <div className="sceneCornerBox sceneParagraphHero">{customTexts.bottomRight}</div>
                </div>
              );
            }
          }

          if ((image as any).isSvg) {
            const isVideo = !!(image as any).isVideo;

            return (
              <div
                key={image.src}
                className={`scenePhoto sceneSvg${isVideo ? " is-video" : ""}${
                  isOpen ? " is-playing" : ""
                }${isFading ? " is-fading" : ""}`}
                // ✅ Mejor que onClick para “gesto de usuario” (móviles + policies)
                onPointerDown={(event) => {
                  console.log("🖱️ SVG clicked!");
                  if (showAfterVideo) {
                    console.log("⏹️ Blocked: showAfterVideo is true");
                    return;
                  }

                  const container = event.currentTarget as HTMLElement;

                  const ok = didClickPinocho(container, event.target);
                  console.log("🎯 didClickPinocho:", ok);

                  if (ok) handleOpen();
                }}
                // ✅ Sin tocar tu CSS, aseguramos que el vídeo absolute se encaja aquí
                style={{ position: "relative" }}
              >
                <InlineSvg src={image.src} className="sceneSvgInner" />

                {(image as any).text && !showAfterVideo && (
                  <div className={`sceneCornerBox ${getTextPositionClass((image as any).textPosition)}`}>
                    {(image as any).text}
                  </div>
                )}

                {isVideo && (
                  <>
                    <video
                      ref={videoRef}
                      className="sceneSvgVideo"
                      src={VIDEO_SRC}
                      playsInline
                      muted
                      controls={false}
                      preload="auto"
                      onTimeUpdate={(event) => {
                        const video = event.currentTarget;
                        if (!video.duration || isFading) return;
                        if (video.duration - video.currentTime <= 0.8) {
                          setIsFading(true);
                        }
                      }}
                      onEnded={() => {
                        setIsOpen(false);
                        setShowAfterVideo(false);
                        setIsFading(false);
                        if (audioRef.current) {
                          audioRef.current.pause();
                          audioRef.current.currentTime = 0;
                        }
                      }}
                    />
                    <audio ref={audioRef} src="/sonidos/Barita.mp3" preload="auto" />
                  </>
                )}
              </div>
            );
          }

          if ((image as any).text) {
            if ((image as any).hasMagicWood && (image as any).hasFire) {
              return (
                <div
                  key={image.src}
                  className="scenePhoto sceneFrame"
                  onMouseMove={handleMouseMoveWood}
                  style={{ position: "relative", overflow: "hidden" }}
                >
                  <img className="sceneFrameImage" src={image.src} alt={image.alt} />
                  <div className={`sceneCornerBox ${getTextPositionClass((image as any).textPosition)}`}>
                    {(image as any).text}
                  </div>

                  {flames.map((flame) => (
                    <div
                      key={flame.id}
                      style={{
                        position: "absolute",
                        left: `${flame.x}%`,
                        top: `${flame.y}%`,
                        width: `${flame.width}px`,
                        height: `${flame.height}px`,
                        borderRadius: "50% 50% 15% 15% / 60% 60% 35% 35%",
                        background: `linear-gradient(to top,
                          ${getFlameColor(0, flame.opacity * 0.95)} 0%,
                          ${getFlameColor(0, flame.opacity * 0.85)} 20%,
                          ${getFlameColor(1, flame.opacity * 0.8)} 50%,
                          ${getFlameColor(2, flame.opacity * 0.6)} 85%,
                          ${getFlameColor(2, flame.opacity * 0.3)} 100%)`,
                        boxShadow: `
                          0 0 ${flame.width * 2}px ${getFlameColor(1, flame.opacity * 0.4)},
                          0 0 ${flame.width * 1.2}px ${getFlameColor(2, flame.opacity * 0.6)},
                          inset 0 -${flame.height * 0.3}px ${flame.width * 0.5}px ${getFlameColor(
                          0,
                          flame.opacity * 0.3
                        )}
                        `,
                        pointerEvents: "none",
                        zIndex: 10,
                        transform: `translate(-50%, -100%) scaleX(${0.9 + Math.sin(flame.wobble) * 0.1})`,
                        filter: `blur(${1.2}px)`,
                      }}
                    />
                  ))}
                </div>
              );
            }

            if ((image as any).hasGrilloTooltip) {
              return (
                <div
                  key={image.src}
                  className="scenePhoto sceneFrame"
                  onMouseMove={handleMouseMoveGrillo}
                  onMouseLeave={() => setGrilloTooltipData((prev) => ({ ...prev, show: false }))}
                >
                  <img className="sceneFrameImage" src={image.src} alt={image.alt} />
                  <div className={`sceneCornerBox ${getTextPositionClass((image as any).textPosition)}`}>
                    {(image as any).text}
                  </div>

                  <div
                    className="grilloTooltip"
                    style={{
                      position: "fixed",
                      left: `${grilloTooltipData.x}px`,
                      top: `${grilloTooltipData.y}px`,
                      transform: "translateX(-50%)",
                      opacity: grilloTooltipData.show ? 1 : 0,
                      pointerEvents: "none",
                    }}
                  >
                    ¡Haré todo lo posible<br />para ayudarlo!
                    <span className="thoughtTail" aria-hidden="true" />
                  </div>
                </div>
              );
            }

            return (
              <div key={image.src} className="scenePhoto sceneFrame">
                <img className="sceneFrameImage" src={image.src} alt={image.alt} />
                <div className={`sceneCornerBox ${getTextPositionClass((image as any).textPosition)}`}>
                  {(image as any).text}
                </div>
              </div>
            );
          }

          return <img key={image.src} className="scenePhoto" src={image.src} alt={image.alt} />;
        })}
      </div>

      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: "fixed",
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: "50%",
            background: `radial-gradient(circle,
              rgba(255, 235, 150, ${particle.opacity}) 0%,
              rgba(255, 215, 100, ${particle.opacity * 0.6}) 40%,
              transparent 70%)`,
            boxShadow: `
              0 0 ${particle.size * 3}px rgba(255, 215, 100, ${particle.opacity * 0.8}),
              0 0 ${particle.size * 1.5}px rgba(255, 235, 200, ${particle.opacity * 0.6})
            `,
            pointerEvents: "none",
            zIndex: 9999,
            transform: "translate(-50%, -50%)",
            filter: `blur(${0.5}px)`,
          }}
        />
      ))}
    </>
  );
}
