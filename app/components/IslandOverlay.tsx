"use client";

import { useEffect, useRef, useState } from "react";

const ISLAND_IMAGES = [
  {
    src: "/seccion6/Escena1.jpg",
    alt: "Escena 1",
  },
  {
    src: "/seccion6/Escena2.jpg",
    alt: "Escena 2",
  },
  {
    src: "/seccion6/Escena3.jpg",
    alt: "Escena 3",
  },
  {
    src: "/seccion6/Escena4.jpg",
    alt: "Escena 4",
  },
  {
    src: "/seccion6/Escena5.jpg",
    alt: "Escena 5",
  },
  {
    src: "/seccion6/Escena6.jpg",
    alt: "Escena 6",
  },
  {
    src: "/seccion6/Escena7.jpg",
    alt: "Escena 7",
  },
  {
    src: "/seccion6/Escena8.jpg",
    alt: "Escena 8",
  },
] as const;

export default function IslandOverlay() {
  const [voiceOverEnabled, setVoiceOverEnabled] = useState(false);
  const [activeIslandIndex, setActiveIslandIndex] = useState<number | null>(null);
  const [showScene3PepitoTooltip, setShowScene3PepitoTooltip] = useState(false);
  const [showScene8PepitoTooltip, setShowScene8PepitoTooltip] = useState(false);
  const escena1VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena2VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena3VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena4VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena5VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena6VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena7VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena8VoiceRef = useRef<HTMLAudioElement | null>(null);
  const pendingVoiceUnlockRef = useRef(false);
  const scene1FrameRef = useRef<HTMLDivElement | null>(null);
  const parkAudioRef = useRef<HTMLAudioElement | null>(null);
  const parkAudioStopTimeoutRef = useRef<number | null>(null);
  const scene1WasActiveRef = useRef(false);
  const scene1AudioPlayedRef = useRef(false);
  const scene3FrameRef = useRef<HTMLDivElement | null>(null);
  const yayAudioRef = useRef<HTMLAudioElement | null>(null);
  const yayAudioStopTimeoutRef = useRef<number | null>(null);
  const scene3WasActiveRef = useRef(false);
  const scene3AudioPlayedRef = useRef(false);
  const scene4FrameRef = useRef<HTMLDivElement | null>(null);
  const burroAudioRef = useRef<HTMLAudioElement | null>(null);
  const burroAudioStopTimeoutRef = useRef<number | null>(null);
  const scene4WasActiveRef = useRef(false);
  const scene4AudioPlayedRef = useRef(false);
  const scene6FrameRef = useRef<HTMLDivElement | null>(null);
  const stormAudioRef = useRef<HTMLAudioElement | null>(null);
  const stormAudioStopTimeoutRef = useRef<number | null>(null);
  const scene6WasActiveRef = useRef(false);
  const scene6AudioPlayedRef = useRef(false);
  const effectsEnabled = () => document.body.dataset.effectsEnabled !== "false";
  const isWithinIslandSequence = () => {
    const seq = document.querySelector(".island-sequence") as HTMLElement | null;
    if (!seq) return false;
    const y = window.scrollY;
    const start = Math.max(0, seq.offsetTop - window.innerHeight * 0.45);
    const end = seq.offsetTop + seq.offsetHeight + window.innerHeight * 0.2;
    return y >= start && y <= end;
  };
  const isIslandSceneVisible = (frame: HTMLDivElement | null) => {
    if (!frame) return false;
    const overlay = document.querySelector(".islandOverlay") as HTMLElement | null;
    if (!overlay) return false;
    if (!overlay.classList.contains("is-active")) return false;
    if (!document.body.classList.contains("island-active")) return false;
    if (!document.body.classList.contains("zone-island-active")) return false;
    if (!isWithinIslandSequence()) return false;
    if (
      document.body.classList.contains("section7-active") ||
      document.body.classList.contains("section8-active") ||
      document.body.classList.contains("section9-active")
    ) {
      return false;
    }
    const style = window.getComputedStyle(overlay);
    if (style.display === "none" || style.visibility === "hidden") return false;
    if (Number.parseFloat(style.opacity || "0") <= 0) return false;
    const frameStyle = window.getComputedStyle(frame);
    if (frameStyle.display === "none" || frameStyle.visibility === "hidden") return false;
    if (Number.parseFloat(frameStyle.opacity || "0") <= 0) return false;
    if (frame.getClientRects().length === 0) return false;
    return frame.classList.contains("is-active");
  };

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
    const handleIslandIndex = (event: Event) => {
      const detail = (event as CustomEvent<{ index: number }>).detail;
      if (!detail) return;
      setActiveIslandIndex(detail.index);
    };

    const handleIslandLeave = () => {
      setActiveIslandIndex(null);
    };

    window.addEventListener("island-active-index", handleIslandIndex);
    window.addEventListener("island-sequence-leave", handleIslandLeave);
    return () => {
      window.removeEventListener("island-active-index", handleIslandIndex);
      window.removeEventListener("island-sequence-leave", handleIslandLeave);
    };
  }, []);

  useEffect(() => {
    const escena1Audio = escena1VoiceRef.current;
    const escena2Audio = escena2VoiceRef.current;
    const escena3Audio = escena3VoiceRef.current;
    const escena4Audio = escena4VoiceRef.current;
    const escena5Audio = escena5VoiceRef.current;
    const escena6Audio = escena6VoiceRef.current;
    const escena7Audio = escena7VoiceRef.current;
    const escena8Audio = escena8VoiceRef.current;
    const activeAudio =
      activeIslandIndex === 0
        ? escena1Audio
        : activeIslandIndex === 1
          ? escena2Audio
          : activeIslandIndex === 2
            ? escena3Audio
            : activeIslandIndex === 3
              ? escena4Audio
              : activeIslandIndex === 4
                ? escena5Audio
                : activeIslandIndex === 5
                  ? escena6Audio
                  : activeIslandIndex === 6
                    ? escena7Audio
                    : activeIslandIndex === 7
                      ? escena8Audio
          : null;

    [escena1Audio, escena2Audio, escena3Audio, escena4Audio, escena5Audio, escena6Audio, escena7Audio, escena8Audio].forEach((audio) => {
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
  }, [activeIslandIndex, voiceOverEnabled]);

  useEffect(() => {
    const retryIfNeeded = () => {
      if (!pendingVoiceUnlockRef.current) return;
      const audio =
        activeIslandIndex === 0
          ? escena1VoiceRef.current
          : activeIslandIndex === 1
            ? escena2VoiceRef.current
            : activeIslandIndex === 2
              ? escena3VoiceRef.current
              : activeIslandIndex === 3
                ? escena4VoiceRef.current
                : activeIslandIndex === 4
                  ? escena5VoiceRef.current
                  : activeIslandIndex === 5
                    ? escena6VoiceRef.current
                    : activeIslandIndex === 6
                      ? escena7VoiceRef.current
                      : activeIslandIndex === 7
                        ? escena8VoiceRef.current
            : null;
      if (!audio) return;
      const shouldPlay =
        (activeIslandIndex === 0 ||
          activeIslandIndex === 1 ||
          activeIslandIndex === 2 ||
          activeIslandIndex === 3 ||
          activeIslandIndex === 4 ||
          activeIslandIndex === 5 ||
          activeIslandIndex === 6 ||
          activeIslandIndex === 7) &&
        voiceOverEnabled;
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
  }, [activeIslandIndex, voiceOverEnabled]);

  useEffect(() => {
    const interval = setInterval(() => {
      const frame = scene1FrameRef.current;
      const isActive = isIslandSceneVisible(frame);
      if (!isActive) {
        scene1WasActiveRef.current = false;
        scene1AudioPlayedRef.current = false;
        if (parkAudioStopTimeoutRef.current) {
          window.clearTimeout(parkAudioStopTimeoutRef.current);
          parkAudioStopTimeoutRef.current = null;
        }
        if (parkAudioRef.current) {
          parkAudioRef.current.pause();
          parkAudioRef.current.currentTime = 0;
        }
        return;
      }

      if (!scene1WasActiveRef.current) {
        scene1WasActiveRef.current = true;
        scene1AudioPlayedRef.current = false;
      }

      if (scene1AudioPlayedRef.current) return;
      if (!effectsEnabled()) return;
      if (!parkAudioRef.current) return;

      parkAudioRef.current.currentTime = 0;
      void parkAudioRef.current.play().then(() => {
        scene1AudioPlayedRef.current = true;
        if (parkAudioStopTimeoutRef.current) {
          window.clearTimeout(parkAudioStopTimeoutRef.current);
        }
        parkAudioStopTimeoutRef.current = window.setTimeout(() => {
          if (!parkAudioRef.current) return;
          parkAudioRef.current.pause();
          parkAudioRef.current.currentTime = 0;
          parkAudioStopTimeoutRef.current = null;
        }, 8000);
      }).catch(() => undefined);
    }, 220);

    return () => {
      clearInterval(interval);
      if (parkAudioStopTimeoutRef.current) {
        window.clearTimeout(parkAudioStopTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const frame = scene3FrameRef.current;
      const isActive = isIslandSceneVisible(frame);
      if (!isActive) {
        scene3WasActiveRef.current = false;
        scene3AudioPlayedRef.current = false;
        if (yayAudioStopTimeoutRef.current) {
          window.clearTimeout(yayAudioStopTimeoutRef.current);
          yayAudioStopTimeoutRef.current = null;
        }
        if (yayAudioRef.current) {
          yayAudioRef.current.pause();
          yayAudioRef.current.currentTime = 0;
        }
        return;
      }

      if (!scene3WasActiveRef.current) {
        scene3WasActiveRef.current = true;
        scene3AudioPlayedRef.current = false;
      }

      if (scene3AudioPlayedRef.current) return;
      if (!effectsEnabled()) return;
      if (!yayAudioRef.current) return;

      yayAudioRef.current.currentTime = 0;
      void yayAudioRef.current.play().then(() => {
        scene3AudioPlayedRef.current = true;
        if (yayAudioStopTimeoutRef.current) {
          window.clearTimeout(yayAudioStopTimeoutRef.current);
        }
        yayAudioStopTimeoutRef.current = window.setTimeout(() => {
          if (!yayAudioRef.current) return;
          yayAudioRef.current.pause();
          yayAudioRef.current.currentTime = 0;
          yayAudioStopTimeoutRef.current = null;
        }, 8000);
      }).catch(() => undefined);
    }, 220);

    return () => {
      clearInterval(interval);
      if (yayAudioStopTimeoutRef.current) {
        window.clearTimeout(yayAudioStopTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const frame = scene4FrameRef.current;
      const isActive = isIslandSceneVisible(frame);
      if (!isActive) {
        scene4WasActiveRef.current = false;
        scene4AudioPlayedRef.current = false;
        if (burroAudioStopTimeoutRef.current) {
          window.clearTimeout(burroAudioStopTimeoutRef.current);
          burroAudioStopTimeoutRef.current = null;
        }
        if (burroAudioRef.current) {
          burroAudioRef.current.pause();
          burroAudioRef.current.currentTime = 0;
        }
        return;
      }

      if (!scene4WasActiveRef.current) {
        scene4WasActiveRef.current = true;
        scene4AudioPlayedRef.current = false;
      }

      if (scene4AudioPlayedRef.current) return;
      if (!effectsEnabled()) return;
      if (!burroAudioRef.current) return;

      burroAudioRef.current.currentTime = 0;
      void burroAudioRef.current.play().then(() => {
        scene4AudioPlayedRef.current = true;
        if (burroAudioStopTimeoutRef.current) {
          window.clearTimeout(burroAudioStopTimeoutRef.current);
        }
        burroAudioStopTimeoutRef.current = window.setTimeout(() => {
          if (!burroAudioRef.current) return;
          burroAudioRef.current.pause();
          burroAudioRef.current.currentTime = 0;
          burroAudioStopTimeoutRef.current = null;
        }, 8000);
      }).catch(() => undefined);
    }, 220);

    return () => {
      clearInterval(interval);
      if (burroAudioStopTimeoutRef.current) {
        window.clearTimeout(burroAudioStopTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const frame = scene6FrameRef.current;
      const isActive = isIslandSceneVisible(frame);
      if (!isActive) {
        scene6WasActiveRef.current = false;
        scene6AudioPlayedRef.current = false;
        if (stormAudioStopTimeoutRef.current) {
          window.clearTimeout(stormAudioStopTimeoutRef.current);
          stormAudioStopTimeoutRef.current = null;
        }
        if (stormAudioRef.current) {
          stormAudioRef.current.pause();
          stormAudioRef.current.currentTime = 0;
        }
        return;
      }

      if (!scene6WasActiveRef.current) {
        scene6WasActiveRef.current = true;
        scene6AudioPlayedRef.current = false;
      }

      if (scene6AudioPlayedRef.current) return;
      if (!effectsEnabled()) return;
      if (!stormAudioRef.current) return;

      stormAudioRef.current.currentTime = 0;
      void stormAudioRef.current.play().then(() => {
        scene6AudioPlayedRef.current = true;
        if (stormAudioStopTimeoutRef.current) {
          window.clearTimeout(stormAudioStopTimeoutRef.current);
        }
        stormAudioStopTimeoutRef.current = window.setTimeout(() => {
          if (!stormAudioRef.current) return;
          stormAudioRef.current.pause();
          stormAudioRef.current.currentTime = 0;
          stormAudioStopTimeoutRef.current = null;
        }, 8000);
      }).catch(() => undefined);
    }, 220);

    return () => {
      clearInterval(interval);
      if (stormAudioStopTimeoutRef.current) {
        window.clearTimeout(stormAudioStopTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="islandOverlay" aria-hidden="true">
      {ISLAND_IMAGES.map((image) => {
        if (image.src === "/seccion6/Escena1.jpg") {
          return (
            <div
              key={image.src}
              ref={scene1FrameRef}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <audio ref={parkAudioRef} src="/Sonidos/Parquedejuegos.mp3" preload="auto" />
              <div className="sceneCornerBox sceneCornerTopLeft" style={{ width: "360px" }}>
                Pinocho llegó a la Isla de los Juegos. Había montañas rusas, dulces y niños riendo por todas partes.
                <br />
                "¡Aquí no hay escuela ni obligaciones!", le dijo el Cochero.
                <br />
                Pinocho miró todo con asombro.
              </div>
            </div>
          );
        }

        if (image.src === "/seccion6/Escena2.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "330px" }}>
                Un chico le ofreció un enorme caramelo.
                <br />
                Pepito Grillo se llevó las manos a la cabeza.
                <br />
                Pero Pinocho decidió quedarse.
              </div>
              <div
                className="grilloTooltip islandScene2Tooltip"
                style={{
                  position: "absolute",
                  left: "32%",
                  top: "16%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 5,
                }}
              >
                ¡Diviértete todo lo
                <br />
                que quieras!
                <span className="thoughtTail" aria-hidden="true" />
              </div>
            </div>
          );
        }

        if (image.src === "/seccion6/Escena3.jpg") {
          return (
            <div
              key={image.src}
              ref={scene3FrameRef}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
              onPointerLeave={() => setShowScene3PepitoTooltip(false)}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <audio ref={yayAudioRef} src="/Sonidos/Yay.mp3" preload="auto" />
              <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "330px", padding: "0.2rem 0.8rem" }}>
                Pinocho comía, corría y rompía cosas sin pensar.
                <br />
                Reía mientras el desorden crecía a su alrededor.
              </div>
              <button
                type="button"
                aria-label="Pepito Grillo Escena 3"
                onPointerEnter={() => setShowScene3PepitoTooltip(true)}
                onPointerLeave={() => setShowScene3PepitoTooltip(false)}
                style={{
                  position: "absolute",
                  left: "90%",
                  top: "50%",
                  width: "110px",
                  height: "130px",
                  transform: "translate(-50%, -50%)",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  cursor: "pointer",
                  zIndex: 4,
                }}
              />
              {showScene3PepitoTooltip && (
                <div
                  className="grilloTooltip"
                  style={{
                    position: "absolute",
                    left: "96%",
                    top: "20%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 5,
                    whiteSpace: "nowrap",
                    maxWidth: "none",
                  }}
                >
                  !Pinocho ten cuidado, puede ser
                  <br />
                  que te estén mintiendo!
                  <span className="thoughtTail" aria-hidden="true" />
                </div>
              )}
            </div>
          );
        }

        if (image.src === "/seccion6/Escena4.jpg") {
          return (
            <div
              key={image.src}
              ref={scene4FrameRef}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <audio ref={burroAudioRef} src="/Sonidos/Burro.mp3" preload="auto" />
              <video
                className="sceneFrameImage"
                src="/seccion6/video_1_1769186479905.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="sceneCornerBox" style={{ width: "360px" }}>
                De repente, algo terrible empezó a suceder.
                <br />
                A Pinocho le crecieron largas orejas de burro.
                <br />
                Los demás niños gritaban al transformarse también.
              </div>
            </div>
          );
        }

        if (image.src === "/seccion6/Escena5.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "320px" }}>
                Asustado, Pinocho comprendió la verdad.
                <br />
                La Isla era una trampa del Cochero,
                <br />
                que convertía a los niños en burros para venderlos.
              </div>
            </div>
          );
        }

        if (image.src === "/seccion6/Escena6.jpg") {
          return (
            <div
              key={image.src}
              ref={scene6FrameRef}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <audio ref={stormAudioRef} src="/Sonidos/Lluviaytrueno.mp3" preload="auto" />
              <div className="sceneCornerBox" style={{ width: "320px" }}>
                El Cochero lo persiguió bajo la tormenta,
                <br />
                blandiendo su látigo.
                <br />
                Pinocho corrió por el muelle sin mirar atrás.
              </div>
            </div>
          );
        }

        if (image.src === "/seccion6/Escena7.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "320px" }}>
                Sin otra salida, Pinocho saltó al mar oscuro.
                <br />
                Las olas eran grandes, pero era su única esperanza.
              </div>
            </div>
          );
        }

        if (image.src === "/seccion6/Escena8.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
              onPointerLeave={() => setShowScene8PepitoTooltip(false)}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "340px" }}>
                Al amanecer, llegó a la orilla, cansado y empapado.
                <br />
                Miró el horizonte con tristeza.
                <br />
                Había aprendido que la diversión sin responsabilidad tiene consecuencias.
              </div>
              <button
                type="button"
                aria-label="Pepito Grillo Escena 8"
                onPointerEnter={() => setShowScene8PepitoTooltip(true)}
                onPointerLeave={() => setShowScene8PepitoTooltip(false)}
                style={{
                  position: "absolute",
                  left: "82%",
                  top: "78%",
                  width: "110px",
                  height: "120px",
                  transform: "translate(-50%, -50%)",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  cursor: "pointer",
                  zIndex: 4,
                }}
              />
              {showScene8PepitoTooltip && (
                <div
                  className="grilloTooltip"
                  style={{
                    position: "absolute",
                    left: "90%",
                    top: "44%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 5,
                    whiteSpace: "nowrap",
                    maxWidth: "none",
                  }}
                >
                  Ay Pinocho ya te advertí que
                  <br />
                  tus actos tendrían consecuencias
                  <span className="thoughtTail" aria-hidden="true" />
                </div>
              )}
            </div>
          );
        }

        return null;
      })}
      <audio
        ref={escena1VoiceRef}
        src="/Sonidos/voz/Seccion5/Escena1.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena2VoiceRef}
        src="/Sonidos/voz/Seccion5/Escena2.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena3VoiceRef}
        src="/Sonidos/voz/Seccion5/Escena3.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena4VoiceRef}
        src="/Sonidos/voz/Seccion5/Escena4.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena5VoiceRef}
        src="/Sonidos/voz/Seccion5/Escena5.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena6VoiceRef}
        src="/Sonidos/voz/Seccion5/Escena6.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena7VoiceRef}
        src="/Sonidos/voz/Seccion5/Escena7.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena8VoiceRef}
        src="/Sonidos/voz/Seccion5/Escena8.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
    </div>
  );
}
