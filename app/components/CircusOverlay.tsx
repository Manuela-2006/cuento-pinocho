"use client";

import { useEffect, useRef, useState } from "react";

const CIRCUS_IMAGES = [
  {
    src: "/seccion4/Escena1.jpg",
    alt: "Escena 1",
  },
  {
    src: "/seccion4/Escena2.jpg",
    alt: "Escena 2",
  },
  {
    src: "/seccion4/Escena3.jpg",
    alt: "Escena 3",
  },
  {
    src: "/seccion4/Escena4.jpg",
    alt: "Escena 4",
  },
  {
    src: "/seccion4/Escena5.jpg",
    alt: "Escena 5",
  },
] as const;

export default function CircusOverlay() {
  const [confetti, setConfetti] = useState<
    {
      id: number;
      x: number;
      y: number;
      size: number;
      color: string;
      rotation: number;
      duration: number;
      delay: number;
    }[]
  >([]);
  const idRef = useRef(0);
  const [tears, setTears] = useState<
    { id: number; x: number; y: number; size: number; duration: number }[]
  >([]);
  const tearIdRef = useRef(0);
  const [fairyParticles, setFairyParticles] = useState<
    { id: number; x: number; y: number; size: number; duration: number; delay: number }[]
  >([]);
  const fairyIdRef = useRef(0);
  const [grilloTooltipData, setGrilloTooltipData] = useState<{
    show: boolean;
    x: number;
    y: number;
  }>({ show: false, x: 0, y: 0 });
  const [fairySoundEnabled, setFairySoundEnabled] = useState(false);
  const escena4AudioRef = useRef<HTMLAudioElement | null>(null);
  const fairyAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastFairySoundRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const baseX = 0.39;
      const baseY = 0.53;
      const spreadX = 0.015;
      const spreadY = 0.01;

      const newTear = {
        id: tearIdRef.current++,
        x: baseX + (Math.random() - 0.5) * spreadX,
        y: baseY + (Math.random() - 0.5) * spreadY,
        size: 4 + Math.random() * 2,
        duration: 1.4 + Math.random() * 0.8,
      };

      setTears((prev) => [...prev, newTear].slice(-30));

      setTimeout(() => {
        setTears((prev) => prev.filter((t) => t.id !== newTear.id));
      }, newTear.duration * 1000);
    }, 700);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const spawnConfetti = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Solo si el cursor está en la zona izquierda superior
    if (x > rect.width * 0.5 || y > rect.height * 0.5) return;

    const colors = ["#ff5f6d", "#ffc371", "#7afcff", "#ffd166", "#8bdc65", "#b388ff"];
    const newPieces = Array.from({ length: 1 }).map(() => {
      const duration = 1.6 + Math.random() * 1.0;
      const delay = Math.random() * 0.2;
      return {
        id: idRef.current++,
        x: x + (Math.random() - 0.5) * 120,
        y: y + Math.random() * 20,
        size: 6 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)]!,
        rotation: Math.random() * 360,
        duration,
        delay,
      };
    });

    setConfetti((prev) => [...prev, ...newPieces].slice(-120));

    newPieces.forEach((piece) => {
      const ttl = (piece.duration + piece.delay) * 1000;
      setTimeout(() => {
        setConfetti((prev) => prev.filter((p) => p.id !== piece.id));
      }, ttl);
    });
  };

  const spawnFairyParticles = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const targetX = rect.width * 0.7;
    const targetY = rect.height * 0.5;
    const withinX =
      x >= targetX - rect.width * 0.3 && x <= targetX + rect.width * 0.22;
    const withinY = Math.abs(y - targetY) <= rect.height * 0.15;

    if (!withinX || !withinY) return;

    if (fairySoundEnabled) {
      const now = Date.now();
      if (fairyAudioRef.current && now - lastFairySoundRef.current > 600) {
        lastFairySoundRef.current = now;
        fairyAudioRef.current.muted = false;
        fairyAudioRef.current.volume = 0.9;
        fairyAudioRef.current.currentTime = 0;
        void fairyAudioRef.current.play().catch(() => undefined);
      }
    }

    const newPieces = Array.from({ length: 1 }).map(() => {
      const duration = 1.2 + Math.random() * 0.8;
      const delay = Math.random() * 0.2;
      return {
        id: fairyIdRef.current++,
        x: x + (Math.random() - 0.5) * 30,
        y: y + (Math.random() - 0.5) * 20,
        size: 3 + Math.random() * 3,
        duration,
        delay,
      };
    });

    setFairyParticles((prev) => [...prev, ...newPieces].slice(-80));

    newPieces.forEach((piece) => {
      const ttl = (piece.duration + piece.delay) * 1000;
      setTimeout(() => {
        setFairyParticles((prev) => prev.filter((p) => p.id !== piece.id));
      }, ttl);
    });
  };

  return (
    <div className="circusOverlay" aria-hidden="true">
      {CIRCUS_IMAGES.map((image) => {
        if (image.src === "/seccion4/Escena1.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div
                className="sceneCornerBox sceneCornerTopRight"
                style={{ width: "360px", minHeight: "160px" }}
              >
                Pinocho llegó a un gran teatro de marionetas, lleno de luces y música.
                Allí conoció a un hombre grande llamado Stromboli, que exclamó sorprendido:
                ¡Una marioneta que camina sola! ¡Serás una gran estrella!
              </div>
            </div>
          );
        }

        if (image.src === "/seccion4/Escena2.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)", overflow: "hidden" }}
              onPointerMove={spawnConfetti}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div className="sceneCornerBox sceneParagraphHero" style={{ width: "300px" }}>
                Pinocho cantó y bailó sobre el escenario.
                El público aplaudía con entusiasmo y él se sentía feliz, importante y famoso.
              </div>
              {confetti.map((piece) => (
                <div
                  key={piece.id}
                  style={{
                    position: "absolute",
                    left: piece.x,
                    top: piece.y,
                    width: piece.size,
                    height: piece.size,
                    background: piece.color,
                    transform: `rotate(${piece.rotation}deg)`,
                    opacity: 0.9,
                    pointerEvents: "none",
                    animation: `confettiRise ${piece.duration}s ease-out ${piece.delay}s forwards`,
                  }}
                />
              ))}
            </div>
          );
        }

        if (image.src === "/seccion4/Escena3.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "340px" }}>
                Después del espectáculo, Stromboli le preguntó con voz seria:
                ¿Tu padre sabe que estás aquí?
                Pinocho dudó y respondió:
                Sí claro Geppetto está muy contento.
                Entonces, su nariz empezó a crecer sin parar.
              </div>
            </div>
          );
        }

        if (image.src === "/seccion4/Escena4.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)", overflow: "hidden" }}
              onClick={() => {
                if (escena4AudioRef.current) {
                  escena4AudioRef.current.currentTime = 0;
                  void escena4AudioRef.current.play().catch(() => undefined);
                }
              }}
              onPointerMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const isOverGrillo =
                  x >= rect.width * 0.48 &&
                  x <= rect.width * 0.62 &&
                  y >= rect.height * 0.7 &&
                  y <= rect.height * 0.9;

                if (isOverGrillo) {
                  setGrilloTooltipData({
                    show: true,
                    x: rect.left + rect.width * 0.55,
                    y: rect.top + rect.height - 380,
                  });
                } else {
                  setGrilloTooltipData((prev) => ({ ...prev, show: false }));
                }
              }}
              onPointerLeave={() => {
                setGrilloTooltipData((prev) => ({ ...prev, show: false }));
              }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div
                className="sceneCornerBox sceneCornerTopRight"
                style={{ width: "300px", minHeight: "140px", padding: "0.3rem 0.7rem" }}
              >
                Stromboli se enfadó al descubrir la mentira y encerró a Pinocho en una jaula.
                ¡Trabajarás para mí para siempre! gritó.
              </div>
              {tears.map((tear) => (
                <div
                  key={tear.id}
                  className="tearDrop"
                  style={{
                    left: `${tear.x * 100}%`,
                    top: `${tear.y * 100}%`,
                    width: tear.size,
                    height: tear.size * 1.4,
                    animationDuration: `${tear.duration}s`,
                  }}
                />
              ))}
              <div
                className="grilloTooltip"
                style={{
                  position: "fixed",
                  left: `${grilloTooltipData.x}px`,
                  top: `${grilloTooltipData.y}px`,
                  transform: "translateX(-50%)",
                  opacity: grilloTooltipData.show ? 1 : 0,
                  pointerEvents: "none",
                  zIndex: 9999,
                }}
              >
                Ay, Pinocho mentir<br />nunca es buena idea.
                <span className="thoughtTail" aria-hidden="true" />
              </div>
              <audio ref={escena4AudioRef} src="/Sonidos/Llorar.mp3" preload="auto" />
            </div>
          );
        }

        if (image.src === "/seccion4/Escena5.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
              onPointerMove={spawnFairyParticles}
              onPointerEnter={spawnFairyParticles}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div
                className="sceneCornerBox sceneCornerTopRight"
                style={{ width: "300px", minHeight: "140px" }}
              >
                Esa noche apareció el Hada Azul.
                Te daré otra oportunidad, dijo.
                Pero debes prometer decir siempre la verdad.
              </div>
              <button
                type="button"
                className="sceneCornerBox"
                style={{
                  left: "16px",
                  top: "16px",
                  right: "auto",
                  bottom: "auto",
                  width: "220px",
                  minHeight: "auto",
                  padding: "0.4rem 0.7rem",
                  cursor: "pointer",
                  background: fairySoundEnabled
                    ? "rgba(200, 230, 255, 0.9)"
                    : "rgba(248, 237, 219, 0.9)",
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  setFairySoundEnabled(true);
                }}
              >
                {fairySoundEnabled ? "Sonido del Hada activo" : "Activar sonido del Hada"}
              </button>
              <div
                className="sceneCornerBox sceneCornerBottomLeft"
                style={{ width: "300px", padding: "0.05rem 0.8rem" }}
              >
                ¡Lo prometo!, dijo Pinocho llorando.
                Poco a poco, su nariz volvió a ser pequeña.
              </div>
              {fairyParticles.map((piece) => (
                <div
                  key={piece.id}
                  className="fairyParticle"
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
              <audio ref={fairyAudioRef} src="/Sonidos/Barita.mp3" preload="auto" />
            </div>
          );
        }

        const fallback = image as { src: string; alt: string };
        return (
          <img
            key={fallback.src}
            className="scenePhoto"
            src={fallback.src}
            alt={fallback.alt}
            style={{ transform: "translateY(20px) scale(1.02)" }}
          />
        );
      })}
    </div>
  );
}


