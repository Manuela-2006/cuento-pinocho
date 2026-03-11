"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import InlineSvg from "./InlineSvg";

const SECTION8_IMAGES = [
  { src: "/seccion8/Escena1.jpg", alt: "Escena 1" },
  { src: "/seccion8/Escena2.svg", alt: "Escena 2" },
  { src: "/seccion8/Escena3.jpg", alt: "Escena 3" },
  { src: "/seccion8/Escena4.jpg", alt: "Escena 4" },
  { src: "/seccion8/Escena5.jpg", alt: "Escena 5" },
  { src: "/seccion8/Escena6.jpg", alt: "Escena 6" },
  { src: "/seccion8/videoBallena.mp4", alt: "Escena 7" },
] as const;

const SCENE1_WATER_PARTICLES = Array.from({ length: 44 }, (_, i) => ({
  id: i,
  x: 6 + ((i * 11) % 88),
  y: 70 + ((i * 7) % 26),
  size: 1.4 + (i % 4) * 0.55,
  opacity: 0.18 + (i % 5) * 0.06,
  duration: 2.6 + (i % 6) * 0.45,
  delay: -(i % 8) * 0.35,
  driftX: ((i % 7) - 3) * 7,
  driftY: 10 + (i % 4) * 5,
}));

const SCENE5_SMOKE_PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: 53 + ((i % 5) - 2) * 1.8,
  y: 46 + ((i % 4) - 1.5) * 1.3,
  size: 8 + (i % 4) * 3,
  opacity: 0.16 + (i % 4) * 0.05,
  duration: 8.6 + (i % 5) * 1.5,
  delay: -(i % 7) * 0.5,
  driftX: ((i % 7) - 3) * 8,
  riseY: 120 + (i % 4) * 22,
}));

const SCENE6_RAIN_PARTICLES = Array.from({ length: 160 }, (_, i) => ({
  id: i,
  x: (i * 7.3) % 100,
  y: -10 - (i % 20) * 6,
  length: 16 + (i % 8) * 4,
  width: 0.9 + (i % 3) * 0.25,
  opacity: 0.24 + (i % 5) * 0.08,
  duration: 0.75 + (i % 6) * 0.14,
  delay: -(i % 12) * 0.22,
  driftX: 36 + (i % 5) * 10,
}));

const SCENE6_LIGHTNING_BOLTS = [
  { id: 1, left: 14, top: 6, height: 290, delay: -0.5, duration: 3.8, angle: 8 },
  { id: 2, left: 63, top: 2, height: 320, delay: -1.7, duration: 4.6, angle: -11 },
  { id: 3, left: 82, top: 12, height: 240, delay: -2.9, duration: 5.1, angle: 6 },
];

const SCENE6_LIGHTNING_MAIN_SEGMENTS = [
  { top: 0, height: 18, x: 0, angle: -12 },
  { top: 16, height: 17, x: -7, angle: 18 },
  { top: 31, height: 16, x: 5, angle: -20 },
  { top: 45, height: 18, x: -6, angle: 24 },
  { top: 61, height: 17, x: 7, angle: -16 },
  { top: 76, height: 24, x: -4, angle: 13 },
];

const SCENE6_LIGHTNING_BRANCHES = [
  { top: 26, height: 14, x: -11, angle: -34 },
  { top: 56, height: 16, x: 10, angle: 32 },
];

function Section8Scene2({ showSection8Images }: { showSection8Images: boolean }) {
  const svgContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isVideoActiveRef = useRef(false);
  const [showVideo, setShowVideo] = useState(false);
  const BALLENA_SELECTOR = "#Ballena1, [data-name='Ballena1']";
  const effectsEnabled = () => document.body.dataset.effectsEnabled !== "false";

  const playVideo = () => {
    if (isVideoActiveRef.current) return;
    isVideoActiveRef.current = true;
    setShowVideo(true);
    const video = videoRef.current;
    if (!video) return;
    video.muted = !effectsEnabled();
    video.volume = 1;
    video.currentTime = 0;
    void video.play().catch(() => undefined);
  };

  const stopVideo = () => {
    if (!isVideoActiveRef.current) return;
    isVideoActiveRef.current = false;
    setShowVideo(false);
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    video.muted = true;
  };

  const isOverBallena = (event: ReactPointerEvent<HTMLDivElement>) => {
    const targetEl = event.target instanceof Element ? event.target : null;
    if (targetEl?.closest?.(BALLENA_SELECTOR)) return true;

    const container = svgContainerRef.current;
    if (!container) return false;
    const svgEl = container.querySelector("svg");
    const ballenaEl = svgEl?.querySelector(BALLENA_SELECTOR) as Element | null;
    if (!ballenaEl) return false;

    const box = ballenaEl.getBoundingClientRect();
    return (
      event.clientX >= box.left &&
      event.clientX <= box.right &&
      event.clientY >= box.top &&
      event.clientY <= box.bottom
    );
  };

  return (
    <div
      ref={svgContainerRef}
      className="scenePhoto sceneFrame"
      style={{
        transform: "translateY(20px) scale(1.02)",
        display: showSection8Images ? "block" : "none",
        overflow: "hidden",
        pointerEvents: showSection8Images ? "auto" : "none",
      }}
      onPointerMove={(event) => {
        if (isOverBallena(event)) playVideo();
        else stopVideo();
      }}
      onPointerLeave={stopVideo}
    >
      <InlineSvg src="/seccion8/Escena2.svg" className="sceneSvgInner" />
      <video
        ref={videoRef}
        className={`section7BallenaVideo ${showVideo ? "is-visible" : ""}`}
        src="/seccion8/video_1_1769189322158.mp4"
        muted
        playsInline
        preload="auto"
      />
      <div className="sceneCornerBox sceneCornerTopRight" style={{ width: "390px", zIndex: 12 }}>
              De pronto, una enorme ballena apareció a su lado.
        <br />
              El agua giró a su alrededor y lo arrastró hacia su boca.
        <br />
              "¡Pinocho!" gritó Pepito.
      </div>
    </div>
  );
}

export default function Section8Overlay() {
  const [voiceOverEnabled, setVoiceOverEnabled] = useState(false);
  const [activeSection8Index, setActiveSection8Index] = useState<number | null>(null);
  const [showSection8Images, setShowSection8Images] = useState(false);
  const [showScene1Tooltip, setShowScene1Tooltip] = useState(false);
  const [showScene3Tooltip, setShowScene3Tooltip] = useState(false);
  const escena1VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena2VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena3VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena4VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena5VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena6VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena7VoiceRef = useRef<HTMLAudioElement | null>(null);
  const pendingVoiceUnlockRef = useRef(false);
  const scene5FrameRef = useRef<HTMLDivElement | null>(null);
  const fireAudioRef = useRef<HTMLAudioElement | null>(null);
  const fireStopTimeoutRef = useRef<number | null>(null);
  const scene5WasActiveRef = useRef(false);
  const scene5PlayedRef = useRef(false);
  const scene6FrameRef = useRef<HTMLDivElement | null>(null);
  const rainThunderAudioRef = useRef<HTMLAudioElement | null>(null);
  const rainThunderStopTimeoutRef = useRef<number | null>(null);
  const scene6WasActiveRef = useRef(false);
  const scene6PlayedRef = useRef(false);
  const effectsEnabled = () => document.body.dataset.effectsEnabled !== "false";

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
    const handleSection8Index = (event: Event) => {
      const detail = (event as CustomEvent<{ index: number }>).detail;
      if (!detail) return;
      setActiveSection8Index(detail.index);
    };

    const handleSection8Leave = () => {
      setActiveSection8Index(null);
    };

    window.addEventListener("section8-active-index", handleSection8Index);
    window.addEventListener("section8-sequence-leave", handleSection8Leave);
    return () => {
      window.removeEventListener("section8-active-index", handleSection8Index);
      window.removeEventListener("section8-sequence-leave", handleSection8Leave);
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
    const activeAudio =
      activeSection8Index === 0
        ? escena1Audio
        : activeSection8Index === 1
          ? escena2Audio
          : activeSection8Index === 2
            ? escena3Audio
            : activeSection8Index === 3
              ? escena4Audio
              : activeSection8Index === 4
                ? escena5Audio
                : activeSection8Index === 5
                  ? escena6Audio
                  : activeSection8Index === 6
                    ? escena7Audio
          : null;

    [escena1Audio, escena2Audio, escena3Audio, escena4Audio, escena5Audio, escena6Audio, escena7Audio].forEach((audio) => {
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
  }, [activeSection8Index, voiceOverEnabled]);

  useEffect(() => {
    const retryIfNeeded = () => {
      if (!pendingVoiceUnlockRef.current) return;
      const audio =
        activeSection8Index === 0
          ? escena1VoiceRef.current
          : activeSection8Index === 1
            ? escena2VoiceRef.current
            : activeSection8Index === 2
              ? escena3VoiceRef.current
              : activeSection8Index === 3
                ? escena4VoiceRef.current
                : activeSection8Index === 4
                  ? escena5VoiceRef.current
                  : activeSection8Index === 5
                    ? escena6VoiceRef.current
                    : activeSection8Index === 6
                      ? escena7VoiceRef.current
            : null;
      if (!audio) return;
      const shouldPlay =
        (activeSection8Index === 0 ||
          activeSection8Index === 1 ||
          activeSection8Index === 2 ||
          activeSection8Index === 3 ||
          activeSection8Index === 4 ||
          activeSection8Index === 5 ||
          activeSection8Index === 6) &&
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
  }, [activeSection8Index, voiceOverEnabled]);

  useEffect(() => {
    const computeVisibility = () => {
      const body = document.body;
      const inIsland = body.classList.contains("zone-island-active");
      const inSection8 = body.classList.contains("section8-active");
      const inSection8Sequence = body.classList.contains("section8-sequence-active");
      const inSection9 = body.classList.contains("section9-active");
      setShowSection8Images(inIsland && inSection8 && inSection8Sequence && !inSection9);
    };

    computeVisibility();

    const observer = new MutationObserver(computeVisibility);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("pageshow", computeVisibility);

    return () => {
      observer.disconnect();
      window.removeEventListener("pageshow", computeVisibility);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const frame = scene5FrameRef.current;
      if (!frame) return;

      const overlay = document.querySelector(".section8Overlay") as HTMLElement | null;
      const overlayActive = !!overlay?.classList.contains("is-active");
      const section8Active = document.body.classList.contains("section8-active");
      const section8SequenceActive = document.body.classList.contains("section8-sequence-active");
      const zoneIslandActive = document.body.classList.contains("zone-island-active");
      const inSection9 = document.body.classList.contains("section9-active");
      const sceneActive = frame.classList.contains("is-active");
      const active =
        showSection8Images &&
        overlayActive &&
        section8Active &&
        section8SequenceActive &&
        zoneIslandActive &&
        !inSection9 &&
        sceneActive;

      if (!active) {
        scene5WasActiveRef.current = false;
        scene5PlayedRef.current = false;
        if (fireStopTimeoutRef.current) {
          window.clearTimeout(fireStopTimeoutRef.current);
          fireStopTimeoutRef.current = null;
        }
        if (fireAudioRef.current) {
          fireAudioRef.current.pause();
          fireAudioRef.current.currentTime = 0;
        }
        return;
      }

      if (!scene5WasActiveRef.current) {
        scene5WasActiveRef.current = true;
        scene5PlayedRef.current = false;
      }

      if (scene5PlayedRef.current) return;
      if (!effectsEnabled()) return;
      if (!fireAudioRef.current) return;

      fireAudioRef.current.currentTime = 0;
      void fireAudioRef.current.play().then(() => {
        scene5PlayedRef.current = true;
        if (fireStopTimeoutRef.current) {
          window.clearTimeout(fireStopTimeoutRef.current);
        }
        fireStopTimeoutRef.current = window.setTimeout(() => {
          if (!fireAudioRef.current) return;
          fireAudioRef.current.pause();
          fireAudioRef.current.currentTime = 0;
          fireStopTimeoutRef.current = null;
        }, 8000);
      }).catch(() => undefined);
    }, 220);

    return () => {
      clearInterval(interval);
      if (fireStopTimeoutRef.current) {
        window.clearTimeout(fireStopTimeoutRef.current);
      }
    };
  }, [showSection8Images]);

  useEffect(() => {
    const interval = setInterval(() => {
      const frame = scene6FrameRef.current;
      if (!frame) return;

      const overlay = document.querySelector(".section8Overlay") as HTMLElement | null;
      const overlayActive = !!overlay?.classList.contains("is-active");
      const section8Active = document.body.classList.contains("section8-active");
      const section8SequenceActive = document.body.classList.contains("section8-sequence-active");
      const zoneIslandActive = document.body.classList.contains("zone-island-active");
      const inSection9 = document.body.classList.contains("section9-active");
      const sceneActive = frame.classList.contains("is-active");
      const active =
        showSection8Images &&
        overlayActive &&
        section8Active &&
        section8SequenceActive &&
        zoneIslandActive &&
        !inSection9 &&
        sceneActive;

      if (!active) {
        scene6WasActiveRef.current = false;
        scene6PlayedRef.current = false;
        if (rainThunderStopTimeoutRef.current) {
          window.clearTimeout(rainThunderStopTimeoutRef.current);
          rainThunderStopTimeoutRef.current = null;
        }
        if (rainThunderAudioRef.current) {
          rainThunderAudioRef.current.pause();
          rainThunderAudioRef.current.currentTime = 0;
        }
        return;
      }

      if (!scene6WasActiveRef.current) {
        scene6WasActiveRef.current = true;
        scene6PlayedRef.current = false;
      }

      if (scene6PlayedRef.current) return;
      if (!effectsEnabled()) return;
      if (!rainThunderAudioRef.current) return;

      rainThunderAudioRef.current.currentTime = 0;
      void rainThunderAudioRef.current.play().then(() => {
        scene6PlayedRef.current = true;
        if (rainThunderStopTimeoutRef.current) {
          window.clearTimeout(rainThunderStopTimeoutRef.current);
        }
        rainThunderStopTimeoutRef.current = window.setTimeout(() => {
          if (!rainThunderAudioRef.current) return;
          rainThunderAudioRef.current.pause();
          rainThunderAudioRef.current.currentTime = 0;
          rainThunderStopTimeoutRef.current = null;
        }, 8000);
      }).catch(() => undefined);
    }, 220);

    return () => {
      clearInterval(interval);
      if (rainThunderStopTimeoutRef.current) {
        window.clearTimeout(rainThunderStopTimeoutRef.current);
      }
    };
  }, [showSection8Images]);

  return (
    <div className="section8Overlay" aria-hidden="true" style={{ pointerEvents: showSection8Images ? "auto" : "none" }}>
      {SECTION8_IMAGES.map((image) =>
        image.src === "/seccion8/Escena1.jpg" ? (
          <div
            key={image.src}
            className={`scenePhoto sceneFrame${showScene1Tooltip ? " pepitoHintPaused" : ""}`}
            style={{
              transform: "translateY(20px) scale(1.02)",
              display: showSection8Images ? "block" : "none",
            }}
          >
            <img className="sceneFrameImage" src={image.src} alt={image.alt} />
            <span className="pepitoMagicHint pepitoMagicHintSection8Scene1" aria-hidden="true" />

            <div className="section8WaterLayer" aria-hidden="true">
              {SCENE1_WATER_PARTICLES.map((particle) => (
                <span
                  key={`scene8-water-${particle.id}`}
                  className="section8WaterParticle"
                  style={
                    {
                      "--water-x": `${Math.max(0, particle.x - 18)}%`,
                      "--water-y": `${particle.y}%`,
                      "--water-size": `${particle.size}px`,
                      "--water-opacity": particle.opacity,
                      "--water-duration": `${particle.duration}s`,
                      "--water-delay": `${particle.delay}s`,
                      "--water-drift-x": `${particle.driftX}px`,
                      "--water-drift-y": `${particle.driftY}px`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Tooltip Pinocho Escena 1"
              onPointerEnter={() => setShowScene1Tooltip(true)}
              onPointerLeave={() => setShowScene1Tooltip(false)}
              style={{
                position: "absolute",
                left: "84%",
                top: "45%",
                transform: "translate(-50%, -50%)",
                width: "11%",
                height: "20%",
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
                zIndex: 11,
                pointerEvents: "auto",
              }}
            />
            {showScene1Tooltip && (
              <div
                className="grilloTooltip grilloTooltipSection8Scene1 grilloTooltipPepitoSparkles"
                style={{
                  position: "absolute",
                  left: "calc(84.5% - clamp(36px, 7vw, 108px))",
                  top: "calc(45% - clamp(78px, 12vw, 150px))",
                  transform: "translate(-50%, -50%)",
                  zIndex: 12,
                }}
              >
                Mira pinocho
                <br />
                una Ballena!
                <span className="tooltipSparkle tooltipSparkleA" aria-hidden="true" />
                <span className="tooltipSparkle tooltipSparkleB" aria-hidden="true" />
                <span className="tooltipSparkle tooltipSparkleC" aria-hidden="true" />
                <span className="thoughtTail" aria-hidden="true" />
              </div>
            )}

            <div className="sceneCornerBox sceneCornerTopLeft" style={{ width: "390px" }}>
              Pinocho miró el mar embravecido.
              <br />
              Sabía que su padre estaba allí dentro.
              <br />
              Con el corazón lleno de valor, sostuvo una gran piedra.
              <br />
              "¡No tengo miedo!" dijo decidido.
            </div>
          </div>
        ) : image.src === "/seccion8/Escena2.svg" ? (
          <Section8Scene2 key={image.src} showSection8Images={showSection8Images} />
        ) : image.src === "/seccion8/Escena3.jpg" ? (
          <div
            key={image.src}
            className={`scenePhoto sceneFrame${showScene3Tooltip ? " pepitoHintPaused" : ""}`}
            style={{
              transform: "translateY(20px) scale(1.02)",
              width: "var(--scene-max-width)",
              maxHeight: "var(--scene-max-height)",
              aspectRatio: "1408 / 736",
              overflow: "hidden",
              display: showSection8Images ? "block" : "none",
            }}
          >
            <img className="sceneFrameImage section8BoatDriftImage" src={image.src} alt={image.alt} />
            <span className="pepitoMagicHint pepitoMagicHintSection8Scene3" aria-hidden="true" />
            <button
              type="button"
              aria-label="Tooltip Pinocho Escena 3"
              onPointerEnter={() => setShowScene3Tooltip(true)}
              onPointerLeave={() => setShowScene3Tooltip(false)}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "12%",
                height: "20%",
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
                zIndex: 11,
                pointerEvents: "auto",
              }}
            />
            {showScene3Tooltip && (
              <div
                className="grilloTooltip grilloTooltipSection8Scene3 grilloTooltipPepitoSparkles"
                style={{
                  position: "absolute",
                  left: "51.5%",
                  top: "calc(50% - clamp(64px, 9vw, 105px))",
                  transform: "translate(-50%, -50%)",
                  zIndex: 12,
                }}
              >
                &iquest;Escuchas eso
                <br />
                Pinocho?
                <span className="tooltipSparkle tooltipSparkleA" aria-hidden="true" />
                <span className="tooltipSparkle tooltipSparkleB" aria-hidden="true" />
                <span className="tooltipSparkle tooltipSparkleC" aria-hidden="true" />
                <span className="thoughtTail" aria-hidden="true" />
              </div>
            )}
            <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "390px" }}>
              Cuando despertaron, estaban en el interior oscuro de la ballena.
              <br />
              Una pequeña barca flotaba entre restos de madera.
              <br />
              Pinocho miró a su alrededor sin saber qué hacer.
            </div>
          </div>
        ) : image.src === "/seccion8/Escena4.jpg" ? (
          <div
            key={image.src}
            className="scenePhoto sceneFrame"
            style={{
              transform: "translateY(20px) scale(1.02)",
              overflow: "hidden",
              display: showSection8Images ? "block" : "none",
            }}
          >
            <img className="sceneFrameImage section8BoatDriftImage" src={image.src} alt={image.alt} />
            <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "370px" }}>
              De pronto, una voz familiar lo llamó.
              <br />
              "¡Pinocho!"
              <br />
              Era Geppetto.
              <br />
              Padre e hijo se abrazaron con alegría.
            </div>
          </div>
        ) : image.src === "/seccion8/Escena5.jpg" ? (
          <div
            key={image.src}
            ref={scene5FrameRef}
            className="scenePhoto sceneFrame"
            style={{
              transform: "translateY(20px) scale(1.02)",
              display: showSection8Images ? "block" : "none",
              overflow: "hidden",
            }}
          >
            <img className="sceneFrameImage section8BoatDriftImage" src={image.src} alt={image.alt} />
            <audio ref={fireAudioRef} src="/Sonidos/Fuego.mp3" preload="auto" />
            <div className="section8SmokeLayer" aria-hidden="true">
              {SCENE5_SMOKE_PARTICLES.map((particle) => (
                <span
                  key={`scene8-smoke-${particle.id}`}
                  className="section8SmokeParticle"
                  style={
                    {
                      "--smoke-x": `${particle.x}%`,
                      "--smoke-y": `${particle.y}%`,
                      "--smoke-size": `${particle.size}px`,
                      "--smoke-opacity": particle.opacity,
                      "--smoke-duration": `${particle.duration}s`,
                      "--smoke-delay": `${particle.delay}s`,
                      "--smoke-drift-x": `${particle.driftX}px`,
                      "--smoke-rise-y": `${particle.riseY}px`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "400px" }}>
              Dentro de la ballena, Pinocho tuvo una idea.
              <br />
              Encendieron una hoguera con los restos de madera.
              <br />
              El humo hizo cosquillas en la enorme nariz del monstruo.
              <br />
              "¡Va a estornudar!" gritó Pepito.
            </div>
          </div>
        ) : image.src === "/seccion8/Escena6.jpg" ? (
          <div
            key={image.src}
            ref={scene6FrameRef}
            className="scenePhoto sceneFrame"
            style={{
              transform: "translateY(20px) scale(1.02)",
              display: showSection8Images ? "block" : "none",
              overflow: "hidden",
            }}
          >
            <img className="sceneFrameImage" src={image.src} alt={image.alt} />
            <audio ref={rainThunderAudioRef} src="/Sonidos/Lluviaytrueno.mp3" preload="auto" />
            <div className="section8ThunderFlash" aria-hidden="true" />
            <div className="section8RainLayer" aria-hidden="true">
              {SCENE6_RAIN_PARTICLES.map((drop) => (
                <span
                  key={`scene8-rain-${drop.id}`}
                  className="section8RainDrop"
                  style={
                    {
                      "--rain-x": `${drop.x}%`,
                      "--rain-y": `${drop.y}%`,
                      "--rain-length": `${drop.length}px`,
                      "--rain-width": `${drop.width}px`,
                      "--rain-opacity": drop.opacity,
                      "--rain-duration": `${drop.duration}s`,
                      "--rain-delay": `${drop.delay}s`,
                      "--rain-drift-x": `${drop.driftX}px`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <div className="section8LightningLayer" aria-hidden="true">
              {SCENE6_LIGHTNING_BOLTS.map((bolt) => (
                <span
                  key={`scene8-bolt-${bolt.id}`}
                  className="section8LightningBolt"
                  style={
                    {
                      "--bolt-left": `${bolt.left}%`,
                      "--bolt-top": `${bolt.top}%`,
                      "--bolt-height": `${bolt.height}px`,
                      "--bolt-delay": `${bolt.delay}s`,
                      "--bolt-duration": `${bolt.duration}s`,
                      "--bolt-angle": `${bolt.angle}deg`,
                    } as CSSProperties
                  }
                >
                  {SCENE6_LIGHTNING_MAIN_SEGMENTS.map((segment, idx) => (
                    <span
                      key={`scene8-bolt-${bolt.id}-main-${idx}`}
                      className="section8LightningSegment"
                      style={
                        {
                          "--seg-top": `${segment.top}%`,
                          "--seg-height": `${segment.height}%`,
                          "--seg-x": `${segment.x}px`,
                          "--seg-angle": `${segment.angle}deg`,
                        } as CSSProperties
                      }
                    />
                  ))}
                  {SCENE6_LIGHTNING_BRANCHES.map((segment, idx) => (
                    <span
                      key={`scene8-bolt-${bolt.id}-branch-${idx}`}
                      className="section8LightningSegment section8LightningBranch"
                      style={
                        {
                          "--seg-top": `${segment.top}%`,
                          "--seg-height": `${segment.height}%`,
                          "--seg-x": `${segment.x}px`,
                          "--seg-angle": `${segment.angle}deg`,
                        } as CSSProperties
                      }
                    />
                  ))}
                </span>
              ))}
            </div>
            <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "390px" }}>
              La ballena estornudó con tanta fuerza
              <br />
              que los lanzó fuera, junto al mar embravecido.
              <br />
              Pinocho tomó los remos con decisión.
              <br />
              "¡Rápido, papá!"
            </div>
          </div>
        ) : image.src === "/seccion8/videoBallena.mp4" ? (
          <div
            key={image.src}
            className="scenePhoto sceneFrame"
            style={{
              transform: "translateY(5px) scale(1.02)",
              display: showSection8Images ? "block" : "none",
            }}
          >
            <video className="sceneFrameImage" src={image.src} autoPlay loop muted playsInline preload="auto" />
            <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "410px" }}>
              La ballena los persiguió entre rayos y olas gigantes.
              <br />
              Su enorme boca se abrió frente a la barca.
              <br />
              Geppetto temblaba.
              <br />
              Pero Pinocho encontró un sitio seguro para refugiarse.
            </div>
          </div>
        ) : null
      )}
      <audio
        ref={escena1VoiceRef}
        src="/Sonidos/voz/Seccion7/Escena1.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena2VoiceRef}
        src="/Sonidos/voz/Seccion7/Escena2.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena3VoiceRef}
        src="/Sonidos/voz/Seccion7/Escena3.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena4VoiceRef}
        src="/Sonidos/voz/Seccion7/Escena4.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena5VoiceRef}
        src="/Sonidos/voz/Seccion7/Escena5.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena6VoiceRef}
        src="/Sonidos/voz/Seccion7/Escena6.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena7VoiceRef}
        src="/Sonidos/voz/Seccion7/Escena7.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
    </div>
  );
}


