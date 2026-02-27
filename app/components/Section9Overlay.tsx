"use client";

import { useEffect, useRef, useState } from "react";

const SECTION9_IMAGES = [
  {
    src: "/seccion9/Escena1.jpg",
    alt: "Escena 1",
  },
  {
    src: "/seccion9/Escena2.jpg",
    alt: "Escena 2",
  },
  {
    src: "/seccion9/Escena3.jpg",
    alt: "Escena 3",
  },
  {
    src: "/seccion9/Escena4.jpg",
    alt: "Escena 4",
  },
] as const;

export default function Section9Overlay() {
  const [goldParticles, setGoldParticles] = useState<
    { id: number; x: number; y: number; size: number; duration: number; delay: number }[]
  >([]);
  const [scene3Particles, setScene3Particles] = useState<
    {
      id: number;
      x: string;
      y: string;
      size: number;
      duration: number;
      delay: number;
      driftX: number;
      driftY: number;
      ttlUntil: number;
    }[]
  >([]);
  const goldIdRef = useRef(0);
  const scene3IdRef = useRef(0);
  const scene2FrameRef = useRef<HTMLDivElement | null>(null);
  const scene3FrameAudioRef = useRef<HTMLDivElement | null>(null);
  const baritaAudioRef = useRef<HTMLAudioElement | null>(null);
  const baritaPlayedRef = useRef(false);
  const flautaAudioRef = useRef<HTMLAudioElement | null>(null);
  const flautaPlayedRef = useRef(false);
  const scene3WasActiveRef = useRef(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = Date.now();

      setScene3Particles((prev) => {
        const alive = prev.filter((piece) => piece.ttlUntil > now);
        const duration = 1.7 + Math.random() * 1.5;
        const delay = Math.random() * 0.18;
        const ttlUntil = now + (duration + delay) * 1000;
        const baseX = 45;
        const baseY = 44;

        const newPiece = {
          id: scene3IdRef.current++,
          x: `${baseX + (Math.random() - 0.5) * 16}%`,
          y: `${baseY + (Math.random() - 0.5) * 12}%`,
          size: 2.4 + Math.random() * 3.2,
          duration,
          delay,
          driftX: -8 + Math.random() * 16,
          driftY: -28 - Math.random() * 24,
          ttlUntil,
        };

        return [...alive, newPiece].slice(-44);
      });
    }, 220);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleAudioSettings = (event: Event) => {
      const detail = (event as CustomEvent<{ effectsEnabled?: boolean }>).detail;
      if (detail?.effectsEnabled === false) {
        baritaPlayedRef.current = false;
        if (baritaAudioRef.current) {
          baritaAudioRef.current.pause();
          baritaAudioRef.current.currentTime = 0;
        }
        flautaPlayedRef.current = false;
        if (flautaAudioRef.current) {
          flautaAudioRef.current.pause();
          flautaAudioRef.current.currentTime = 0;
        }
      }
    };

    window.addEventListener("pinocho-audio-settings", handleAudioSettings);
    return () => window.removeEventListener("pinocho-audio-settings", handleAudioSettings);
  }, []);

  useEffect(() => {
    const node = scene2FrameRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || !entry.isIntersecting) {
          baritaPlayedRef.current = false;
          if (baritaAudioRef.current) {
            baritaAudioRef.current.pause();
            baritaAudioRef.current.currentTime = 0;
          }
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const frame = scene3FrameAudioRef.current;
      const overlay = document.querySelector(".section9Overlay") as HTMLElement | null;
      const isActive =
        !!overlay?.classList.contains("is-active") &&
        !!frame?.classList.contains("is-active") &&
        document.body.classList.contains("section9-active") &&
        document.body.classList.contains("zone-geppetto-active");

      if (!isActive) {
        scene3WasActiveRef.current = false;
        flautaPlayedRef.current = false;
        if (flautaAudioRef.current) {
          flautaAudioRef.current.pause();
          flautaAudioRef.current.currentTime = 0;
        }
        return;
      }

      if (!scene3WasActiveRef.current) {
        scene3WasActiveRef.current = true;
        flautaPlayedRef.current = false;
      }

      if (flautaPlayedRef.current) return;
      if (document.body.dataset.effectsEnabled === "false") return;
      const audio = flautaAudioRef.current;
      if (!audio) return;

      audio.currentTime = 0;
      void audio
        .play()
        .then(() => {
          flautaPlayedRef.current = true;
        })
        .catch(() => {
          flautaPlayedRef.current = false;
        });
    }, 220);

    return () => window.clearInterval(interval);
  }, []);

  const playFlautaOnce = () => {
    if (document.body.dataset.effectsEnabled === "false") return;
    if (flautaPlayedRef.current) return;
    const audio = flautaAudioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    void audio
      .play()
      .then(() => {
        flautaPlayedRef.current = true;
      })
      .catch(() => {
        flautaPlayedRef.current = false;
      });
  };

  const spawnScene2GoldParticles = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const targetX = rect.width * 0.5 - 165;
    const targetY = rect.height * 0.52;
    const withinX = x >= targetX - rect.width * 0.16 && x <= targetX + rect.width * 0.12;
    const withinY = Math.abs(y - targetY) <= rect.height * 0.15;

    if (!withinX || !withinY) return;

    const newPieces = Array.from({ length: 1 }).map(() => {
      const duration = 1.2 + Math.random() * 0.8;
      const delay = Math.random() * 0.2;
      return {
        id: goldIdRef.current++,
        x: x + (Math.random() - 0.5) * 24,
        y: y + (Math.random() - 0.5) * 14,
        size: 3.2 + Math.random() * 2.6,
        duration,
        delay,
      };
    });

    setGoldParticles((prev) => [...prev, ...newPieces].slice(-90));

    const effectsEnabled = document.body.dataset.effectsEnabled !== "false";
    if (effectsEnabled && !baritaPlayedRef.current) {
      const audio = baritaAudioRef.current;
      if (audio) {
        audio.currentTime = 0;
        void audio
          .play()
          .then(() => {
            baritaPlayedRef.current = true;
          })
          .catch(() => {
            baritaPlayedRef.current = false;
          });
      }
    }

    newPieces.forEach((piece) => {
      const ttl = (piece.duration + piece.delay) * 1000;
      setTimeout(() => {
        setGoldParticles((prev) => prev.filter((p) => p.id !== piece.id));
      }, ttl);
    });
  };

  return (
    <div className="section9Overlay" aria-hidden="true">
      {SECTION9_IMAGES.map((image) =>
        image.src === "/seccion9/Escena1.jpg" ? (
          <div
            key={image.src}
            className="scenePhoto sceneFrame"
            style={{ transform: "translateY(20px) scale(1.02)" }}
          >
            <img className="sceneFrameImage" src={image.src} alt={image.alt} />
            <div className="sceneCornerBox sceneCornerTopRight" style={{ width: "360px" }}>
              Geppetto acostó a Pinocho con cuidado en la cama.
              <br />
              Hijo mío susurró con lágrimas en los ojos.
              <br />
              El taller estaba en silencio.
            </div>
          </div>
        ) : image.src === "/seccion9/Escena2.jpg" ? (
          <div
            key={image.src}
            ref={scene2FrameRef}
            className="scenePhoto sceneFrame"
            style={{ transform: "translateY(20px) scale(1.02)", overflow: "hidden" }}
            onPointerMove={spawnScene2GoldParticles}
            onPointerEnter={spawnScene2GoldParticles}
          >
            <img className="sceneFrameImage" src={image.src} alt={image.alt} />
            <audio ref={baritaAudioRef} src="/Sonidos/Barita.mp3" preload="auto" />
            {goldParticles.map((piece) => (
              <div
                key={piece.id}
                className="section9GoldParticle"
                style={{
                  left: piece.x,
                  top: piece.y,
                  width: piece.size,
                  height: piece.size,
                  animationDuration: `${piece.duration}s`,
                  animationDelay: `${piece.delay}s`,
                }}
              />
            ))}
            <div className="sceneCornerBox" style={{ width: "380px" }}>
              Entonces apareció el Hada Azul.
              <br />
              Una luz brillante llenó la habitación.
              <br />
              Has demostrado amor verdadero y valentía dijo.
              <br />
              Y tocó a Pinocho con su varita.
            </div>
          </div>
        ) : image.src === "/seccion9/Escena3.jpg" ? (
          <div
            key={image.src}
            ref={scene3FrameAudioRef}
            className="scenePhoto sceneFrame"
            style={{ transform: "translateY(20px) scale(1.02)", overflow: "hidden" }}
            onPointerEnter={playFlautaOnce}
          >
            <img className="sceneFrameImage" src={image.src} alt={image.alt} />
            <audio ref={flautaAudioRef} src="/Sonidos/Flauta.mp3" preload="auto" />
            <div className="section9Scene3Glow" aria-hidden="true" />
            {scene3Particles.map((piece) => (
              <div
                key={piece.id}
                className="section9Scene3Particle"
                style={
                  {
                    left: piece.x,
                    top: piece.y,
                    width: piece.size,
                    height: piece.size,
                    animationDuration: `${piece.duration}s`,
                    animationDelay: `${piece.delay}s`,
                    "--section9-drift-x": `${piece.driftX}px`,
                    "--section9-drift-y": `${piece.driftY}px`,
                  } as React.CSSProperties
                }
              />
            ))}
            <div className="sceneCornerBox sceneCornerTopLeft" style={{ width: "360px" }}>
              La magia envolvió su cuerpo.
              <br />
              La madera desapareció.
              <br />
              Y por primera vez,
              <br />
              Pinocho respiró como un niño de verdad.
            </div>
          </div>
        ) : image.src === "/seccion9/Escena4.jpg" ? (
          <div
            key={image.src}
            className="scenePhoto sceneFrame"
            style={{ transform: "translateY(20px) scale(1.02)" }}
          >
            <img className="sceneFrameImage" src={image.src} alt={image.alt} />
            <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "390px" }}>
              Desde aquel día, Pinocho fue responsable y bondadoso.
              <br />
              Fue a la escuela.
              <br />
              Ayudó a los demás.
              <br />
              Y siempre caminó orgulloso junto a su padre.
            </div>
          </div>
        ) : (
          <img
            key={image.src}
            className="scenePhoto"
            src={image.src}
            alt={image.alt}
            style={{ transform: "translateY(20px) scale(1.02)" }}
          />
        )
      )}
    </div>
  );
}
