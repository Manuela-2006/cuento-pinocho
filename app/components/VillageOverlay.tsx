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
  const [voiceOverEnabled, setVoiceOverEnabled] = useState(false);
  const [activeVillageIndex, setActiveVillageIndex] = useState<number | null>(null);
  const [grilloTooltipData, setGrilloTooltipData] = useState<{
    show: boolean;
    x: number;
    y: number;
  }>({ show: false, x: 0, y: 0 });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const svgContainerRef = useRef<HTMLDivElement | null>(null);
  const videoAudioUnlockedRef = useRef(false);
  const pendingVideoAudioUnlockRef = useRef(false);
  const isHoveringMusicRef = useRef(false);
  const escena1VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena2VoiceRef = useRef<HTMLAudioElement | null>(null);
  const pendingVoiceUnlockRef = useRef(false);

  // ✅ Función para reproducir video con audio
  const playVideoMuted = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.currentTime = 0;
    void video.play().catch(() => {});
  };

  const playVideoWithAudio = async () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.volume = 1;
    video.currentTime = 0;

    try {
      await video.play();
      videoAudioUnlockedRef.current = true;
      pendingVideoAudioUnlockRef.current = false;
    } catch {
      pendingVideoAudioUnlockRef.current = true;
      playVideoMuted();
    }
  };

  const handlePointerMoveGrillo = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isHoveringMusic) {
      event.currentTarget.classList.remove("pepitoHintPaused");
      event.currentTarget.style.cursor = "default";
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
    event.currentTarget.classList.toggle("pepitoHintPaused", isOverGrillo);
    event.currentTarget.style.cursor = isOverGrillo ? "pointer" : "default";

    if (isOverGrillo) {
      const viewportWidth = window.innerWidth;
      const isDesktop = viewportWidth >= 1025;
      const isLaptop = viewportWidth >= 1025 && viewportWidth <= 1600;
      setGrilloTooltipData({
        show: true,
        x: box.left + box.width / 2 + 80,
        y: isLaptop ? box.top - 45 : isDesktop ? box.top - 20 : box.top - 60,
      });
    } else {
      setGrilloTooltipData(prev => ({ ...prev, show: false }));
    }
  };

  useEffect(() => {
    isHoveringMusicRef.current = isHoveringMusic;
  }, [isHoveringMusic]);

  useEffect(() => {
    const unlockVideoAudio = () => {
      videoAudioUnlockedRef.current = true;
      if (!pendingVideoAudioUnlockRef.current) return;
      if (!isHoveringMusicRef.current) return;
      void playVideoWithAudio();
    };

    window.addEventListener("pointerdown", unlockVideoAudio);
    window.addEventListener("keydown", unlockVideoAudio);
    return () => {
      window.removeEventListener("pointerdown", unlockVideoAudio);
      window.removeEventListener("keydown", unlockVideoAudio);
    };
  }, []);

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

  useEffect(() => {
    const syncVoiceFromStorage = () => {
      setVoiceOverEnabled(localStorage.getItem("pinocho:voiceover-enabled") === "true");
    };

    syncVoiceFromStorage();

    const handleAudioSettings = (event: Event) => {
      const detail = (event as CustomEvent<{ voiceOverEnabled?: boolean }>).detail;
      if (typeof detail?.voiceOverEnabled === "boolean") {
        setVoiceOverEnabled(detail.voiceOverEnabled);
        return;
      }
      syncVoiceFromStorage();
    };

    window.addEventListener("pinocho-audio-settings", handleAudioSettings);
    return () => window.removeEventListener("pinocho-audio-settings", handleAudioSettings);
  }, []);

  useEffect(() => {
    const handleVillageIndex = (event: Event) => {
      const detail = (event as CustomEvent<{ index: number }>).detail;
      if (!detail) return;
      setActiveVillageIndex(detail.index);
    };

    const handleVillageLeave = () => {
      setActiveVillageIndex(null);
    };

    window.addEventListener("village-active-index", handleVillageIndex);
    window.addEventListener("village-sequence-leave", handleVillageLeave);
    return () => {
      window.removeEventListener("village-active-index", handleVillageIndex);
      window.removeEventListener("village-sequence-leave", handleVillageLeave);
    };
  }, []);

  useEffect(() => {
    const escena1Audio = escena1VoiceRef.current;
    const escena2Audio = escena2VoiceRef.current;
    const activeAudio =
      activeVillageIndex === 0
        ? escena1Audio
        : activeVillageIndex === 1
          ? escena2Audio
          : null;

    [escena1Audio, escena2Audio].forEach((audio) => {
      if (!audio || audio === activeAudio) return;
      audio.pause();
      audio.currentTime = 0;
    });

    const shouldPlay = !!activeAudio && voiceOverEnabled;
    if (!shouldPlay) {
      if (activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      }
      pendingVoiceUnlockRef.current = false;
      return;
    }

    activeAudio.muted = false;
    activeAudio.volume = 1;
    activeAudio.currentTime = 0;
    void activeAudio.play().catch(() => {
      pendingVoiceUnlockRef.current = true;
    });
  }, [activeVillageIndex, voiceOverEnabled]);

  useEffect(() => {
    const retryIfNeeded = () => {
      if (!pendingVoiceUnlockRef.current) return;
      const audio =
        activeVillageIndex === 0
          ? escena1VoiceRef.current
          : activeVillageIndex === 1
            ? escena2VoiceRef.current
            : null;
      if (!audio) return;
      const shouldPlay = (activeVillageIndex === 0 || activeVillageIndex === 1) && voiceOverEnabled;
      if (!shouldPlay) {
        pendingVoiceUnlockRef.current = false;
        return;
      }
      audio.muted = false;
      audio.volume = 1;
      audio.currentTime = 0;
      void audio.play()
        .then(() => {
          pendingVoiceUnlockRef.current = false;
        })
        .catch(() => {});
    };

    window.addEventListener("pointerdown", retryIfNeeded);
    window.addEventListener("keydown", retryIfNeeded);
    return () => {
      window.removeEventListener("pointerdown", retryIfNeeded);
      window.removeEventListener("keydown", retryIfNeeded);
    };
  }, [activeVillageIndex, voiceOverEnabled]);

  useEffect(() => {
    const video = videoRef.current;
    const interval = setInterval(() => {
      const overlay = document.querySelector(".villageOverlay") as HTMLElement | null;
      const isActive = !!overlay?.classList.contains("is-active");
      const isVillageZoneActive = document.body.classList.contains("zone-village-active");
      if (isActive && isVillageZoneActive) return;

      setIsHoveringMusic(false);
      setGrilloTooltipData({ show: false, x: 0, y: 0 });
      setActiveVillageIndex(null);
      if (video) {
        video.pause();
        video.currentTime = 0;
        video.muted = true;
      }
      pendingVideoAudioUnlockRef.current = false;
    }, 220);

    return () => {
      clearInterval(interval);
      if (video) {
        video.pause();
        video.currentTime = 0;
        video.muted = true;
      }
      pendingVideoAudioUnlockRef.current = false;
      if (escena1VoiceRef.current) {
        escena1VoiceRef.current.pause();
        escena1VoiceRef.current.currentTime = 0;
      }
      if (escena2VoiceRef.current) {
        escena2VoiceRef.current.pause();
        escena2VoiceRef.current.currentTime = 0;
      }
    };
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
                      if (!isHoveringMusic) {
                        if (videoAudioUnlockedRef.current) {
                          void playVideoWithAudio();
                        } else {
                          playVideoMuted();
                        }
                      }
                    } else {
                      videoRef.current.pause();
                      videoRef.current.currentTime = 0;
                      pendingVideoAudioUnlockRef.current = false;
                    }
                  }
                }}
                onPointerLeave={(event) => {
                  event.currentTarget.classList.remove("pepitoHintPaused");
                  event.currentTarget.style.cursor = "default";
                  setIsHoveringMusic(false);
                  setGrilloTooltipData({ show: false, x: 0, y: 0 });
                  pendingVideoAudioUnlockRef.current = false;
                }}
                style={{
                  position: "relative",
                  transform: "translateY(20px) scale(1.02)",
                  cursor: "default",
                }}
              >
                <InlineSvg src={image.src} className="sceneSvgInner" />
                <span className="pepitoMagicHint pepitoMagicHintVillageScene4" aria-hidden="true" />
                
                {(image as any).text && (
                  <div 
                    className={`sceneCornerBox ${getTextPositionClass((image as any).textPosition)}`}
                    style={(image as any).isSmallText ? { width: "280px", minHeight: "100px" } : undefined}
                  >
                    {(image as any).text}
                  </div>
                )}
                
                {/* ✅ Indicador visual si el audio no está desbloqueado */}
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
      <audio
        ref={escena1VoiceRef}
        src="/Sonidos/voz/Seccion2/Escena1.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena2VoiceRef}
        src="/Sonidos/voz/Seccion2/Escena2.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
    </>
  );
}
