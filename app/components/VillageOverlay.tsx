"use client";
import { useRef, useState, useEffect } from "react";
import InlineSvg from "./InlineSvg";

const VILLAGE_VIDEO_SRC = "/seccion3/video_1_1769170300824.mp4";
const MUSICA_SELECTOR = "#musica1, [data-name='musica1']";
const GRILLO_SELECTOR = "#Grillo1, [data-name='Grillo1']";

const VILLAGE_IMAGES = [
  {
    src: "/seccion3/Escena3.jpg",
    alt: "Escena 10",
    text: "Pinocho salió feliz por el camino, con Pepito Grillo en su hombro. Pero pronto escuchó música, risas y aplausos.",
    textPosition: "bottom-left",
  },
  {
    src: "/seccion3/Escena4.svg",
    alt: "Escena 11",
    isSvg: true,
    isVideo: true,
    text: "Pinocho se detuvo fascinado por los colores y la música del espectáculo.",
    textPosition: "bottom-left",
    isSmallText: true,
  },
] as const;

export default function VillageOverlay() {
  const [isHoveringMusic, setIsHoveringMusic] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [grilloTooltipData, setGrilloTooltipData] = useState<{
    show: boolean;
    x: number;
    y: number;
  }>({ show: false, x: 0, y: 0 });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const svgContainerRef = useRef<HTMLDivElement | null>(null);

  // ✅ Función para reproducir video con audio
  const playVideoWithAudio = async () => {
    if (!videoRef.current) return;
    
    try {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      videoRef.current.currentTime = 0;
      await videoRef.current.play();
      console.log("Video reproducido con audio");
    } catch (error) {
      console.error("Error al reproducir con audio:", error);
    }
  };

  // ✅ Habilitar audio con click en el contenedor
  const handleContainerClick = () => {
    if (!audioUnlocked) {
      setAudioUnlocked(true);
      console.log("Audio desbloqueado por click");
    }
  };

  const handlePointerMoveGrillo = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isHoveringMusic) {
      setGrilloTooltipData({ show: false, x: 0, y: 0 });
      return;
    }

    const container = svgContainerRef.current;
    if (!container) return;

    const svgEl = container.querySelector("svg");
    if (!svgEl) return;

    const grilloEl = svgEl.querySelector(GRILLO_SELECTOR);
    if (!grilloEl) return;

    const box = grilloEl.getBoundingClientRect();
    
    const isOverGrillo =
      event.clientX >= box.left &&
      event.clientX <= box.right &&
      event.clientY >= box.top &&
      event.clientY <= box.bottom;

    if (isOverGrillo) {
      setGrilloTooltipData({
        show: true,
        x: box.left + box.width / 2 + 80,
        y: box.top - 60,
      });
    } else {
      setGrilloTooltipData(prev => ({ ...prev, show: false }));
    }
  };

  useEffect(() => {
    const container = svgContainerRef.current;
    if (!container) return;

    const checkInterval = setInterval(() => {
      const svgEl = container.querySelector("svg");
      if (!svgEl) return;

      const grilloEl = svgEl.querySelector(GRILLO_SELECTOR);
      if (!grilloEl) return;

      clearInterval(checkInterval);
      (grilloEl as HTMLElement).style.pointerEvents = "all";
    }, 100);

    return () => clearInterval(checkInterval);
  }, []);

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

  return (
    <>
      <div className="villageOverlay" aria-hidden="true">
        {VILLAGE_IMAGES.map((image) => {
          if ((image as any).isSvg) {
            return (
              <div
                key={image.src}
                ref={svgContainerRef}
                className={`scenePhoto sceneSvg villageHover${isHoveringMusic ? " is-playing" : ""}`}
                onClick={handleContainerClick}
                onPointerMove={(event) => {
                  handlePointerMoveGrillo(event);

                  const targetEl = event.target instanceof Element ? event.target : null;

                  let isOver = !!targetEl?.closest?.(MUSICA_SELECTOR);
                  
                  if (!isOver && svgContainerRef.current) {
                    const svgEl = svgContainerRef.current.querySelector("svg");
                    const musicaEl = svgEl?.querySelector(MUSICA_SELECTOR) as Element | null;
                    if (musicaEl) {
                      const box = musicaEl.getBoundingClientRect();
                      isOver =
                        event.clientX >= box.left &&
                        event.clientX <= box.right &&
                        event.clientY >= box.top &&
                        event.clientY <= box.bottom;
                    }
                  }

                  if (isOver !== isHoveringMusic) setIsHoveringMusic(isOver);

                  if (videoRef.current) {
                    if (isOver) {
                      if (!isHoveringMusic && audioUnlocked) {
                        // ✅ Solo reproducir si el audio ya está desbloqueado
                        playVideoWithAudio();
                      } else if (!isHoveringMusic && !audioUnlocked) {
                        // ✅ Si no está desbloqueado, reproducir muted
                        videoRef.current.currentTime = 0;
                        videoRef.current.play().catch(() => undefined);
                      }
                    } else {
                      videoRef.current.pause();
                      videoRef.current.currentTime = 0;
                    }
                  }
                }}
                onPointerLeave={() => {
                  setIsHoveringMusic(false);
                  setGrilloTooltipData({ show: false, x: 0, y: 0 });
                }}
                style={{
                  position: "relative",
                  transform: "translateY(20px) scale(1.02)",
                  cursor: audioUnlocked ? "default" : "pointer",
                }}
              >
                <InlineSvg src={image.src} className="sceneSvgInner" />
                
                {(image as any).text && (
                  <div 
                    className={`sceneCornerBox ${getTextPositionClass((image as any).textPosition)}`}
                    style={(image as any).isSmallText ? { width: "280px", minHeight: "100px" } : undefined}
                  >
                    {(image as any).text}
                  </div>
                )}
                
                {/* ✅ Indicador visual si el audio no está desbloqueado */}
                {!audioUnlocked && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "rgba(0,0,0,0.7)",
                      color: "white",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      pointerEvents: "none",
                      zIndex: 10,
                    }}
                  >
                    🔊 Click para activar audio
                  </div>
                )}
                
                <video
                  ref={videoRef}
                  className="sceneSvgVideo"
                  src={VILLAGE_VIDEO_SRC}
                  playsInline
                  muted
                  controls={false}
                  preload="auto"
                  style={{ pointerEvents: "none" }}
                />
              </div>
            );
          }

          if ((image as any).text) {
            return (
              <div 
                key={image.src} 
                className="scenePhoto sceneFrame"
                style={{ transform: "translateY(20px) scale(1.02)" }}
              >
                <img className="sceneFrameImage" src={image.src} alt={image.alt} />
                <div className={`sceneCornerBox ${getTextPositionClass((image as any).textPosition)}`}>
                  {(image as any).text}
                </div>
              </div>
            );
          }

          return (
            <img
              key={image.src}
              className="scenePhoto"
              src={image.src}
              alt={image.alt}
              style={{ transform: "scale(1.02)" }}
            />
          );
        })}
      </div>

      {grilloTooltipData.show && grilloTooltipData.x > 0 && grilloTooltipData.y > 0 && (
        <div
          className="grilloTooltip"
          style={{
            position: "fixed",
            left: `${grilloTooltipData.x}px`,
            top: `${grilloTooltipData.y}px`,
            transform: "translateX(-50%)",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          ¡Pinocho!, recuerda que<br />tienes que ir a la escuela
          <span className="thoughtTail" aria-hidden="true" />
        </div>
      )}
    </>
  );
}