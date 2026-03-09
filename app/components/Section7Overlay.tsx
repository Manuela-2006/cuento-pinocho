"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";

const SECTION7_IMAGES = [
  { src: "/seccion7/Escena1.jpg", alt: "Escena 1" },
  { src: "/seccion7/Escena2.svg", alt: "Escena 2" },
  { src: "/seccion7/Escena3.jpg", alt: "Escena 3" },
] as const;

const SCENE1_DUST_PARTICLES = Array.from({ length: 64 }, (_, i) => ({
  id: i,
  x: 14 + ((i * 9) % 62),
  y: 4 + ((i * 13) % 90),
  size: 1.5 + (i % 5) * 0.6,
  opacity: 0.16 + (i % 6) * 0.04,
  duration: 6.2 + (i % 7) * 0.9,
  delay: -(i % 7) * 1.2,
  drift: ((i % 5) - 2) * 3,
}));

const SCENE3_TEAR_PARTICLES = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  x: 58 + ((i % 2) - 0.5) * 0.25,
  y: 38 + i * 2.2,
  size: 3.6 + (i % 3) * 0.8,
  duration: 1.15 + (i % 4) * 0.2,
  delay: -(i % 6) * 0.22,
}));

type Area = { left: number; top: number; width: number; height: number };

function Section7Scene1() {
  return (
    <div
      className="scenePhoto sceneFrame section7DustScene"
      style={{ transform: "translateY(20px) scale(1.02)", overflow: "hidden" }}
    >
      <img className="sceneFrameImage" src="/seccion7/Escena1.jpg" alt="Escena 1" />

      <div className="section7DustLayer" aria-hidden="true">
        {SCENE1_DUST_PARTICLES.map((particle) => (
          <span
            key={particle.id}
            className="section7DustParticle"
            style={
              {
                "--dust-x": `${particle.x}%`,
                "--dust-y": `${particle.y}%`,
                "--dust-size": `${particle.size}px`,
                "--dust-opacity": particle.opacity,
                "--dust-duration": `${particle.duration}s`,
                "--dust-delay": `${particle.delay}s`,
                "--dust-drift": `${particle.drift}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="sceneCornerBox sceneCornerTopRight" style={{ width: "360px" }}>
        Pinocho regresó al taller.
        <br />
        Todo estaba oscuro, cubierto de polvo y telarañas.
        <br />
        "¿Papá?" susurró con miedo.
        <br />
        Pero nadie respondió.
      </div>
    </div>
  );
}

function Section7Scene2() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isVideoActiveRef = useRef(false);
  const [showVideo, setShowVideo] = useState(false);
  const [ballenaArea, setBallenaArea] = useState<Area>({ left: 58.9, top: 14.7, width: 31.3, height: 43.2 });

  useEffect(() => {
    let cancelled = false;

    const loadBallenaAreaFromSvg = async () => {
      try {
        const text = await fetch("/seccion7/Escena2.svg").then((r) => r.text());
        if (cancelled) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");
        const svg = doc.querySelector("svg");
        const ballena = doc.querySelector<SVGRectElement>("#Ballena");
        if (!svg || !ballena) return;

        const viewBox = svg.getAttribute("viewBox") || "";
        const vbParts = viewBox.split(/\s+/).map(Number);
        const vbW = vbParts.length === 4 ? vbParts[2] : Number(svg.getAttribute("width") || 1408);
        const vbH = vbParts.length === 4 ? vbParts[3] : Number(svg.getAttribute("height") || 736);

        const x = Number(ballena.getAttribute("x") || 0);
        const y = Number(ballena.getAttribute("y") || 0);
        const w = Number(ballena.getAttribute("width") || 0);
        const h = Number(ballena.getAttribute("height") || 0);

        if (vbW > 0 && vbH > 0 && w > 0 && h > 0) {
          setBallenaArea({
            left: (x / vbW) * 100,
            top: (y / vbH) * 100,
            width: (w / vbW) * 100,
            height: (h / vbH) * 100,
          });
        }
      } catch {
        // fallback to defaults
      }
    };

    void loadBallenaAreaFromSvg();
    return () => {
      cancelled = true;
    };
  }, []);

  const playVideo = () => {
    if (isVideoActiveRef.current) return;
    isVideoActiveRef.current = true;
    setShowVideo(true);
    const video = videoRef.current;
    if (!video) return;
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
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((event.clientY - rect.top) / rect.height) * 100;

    const inside =
      xPercent >= ballenaArea.left &&
      xPercent <= ballenaArea.left + ballenaArea.width &&
      yPercent >= ballenaArea.top &&
      yPercent <= ballenaArea.top + ballenaArea.height;

    if (inside) playVideo();
    else stopVideo();
  };

  return (
    <div
      className="scenePhoto sceneFrame section7DustScene"
      style={{ transform: "translateY(20px) scale(1.02)", overflow: "hidden" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={stopVideo}
    >
      <img className="sceneFrameImage" src="/seccion7/Escena2.svg" alt="Escena 2" />

      <video
        ref={videoRef}
        className={`section7BallenaVideo ${showVideo ? "is-visible" : ""}`}
        src="/seccion7/video_1_1769187278241.mp4"
        muted
        playsInline
        preload="auto"
      />

      <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "380px", zIndex: 12 }}>
        En la ventana, una paloma le dejó una carta.
        <br />
        Pinocho la leyó con manos temblorosas.
        <br />
        Geppetto había salido al mar para buscarlo
        <br />
        y una enorme ballena lo había tragado.
      </div>
    </div>
  );
}

function Section7Scene3() {
  const [showPepitoTooltip, setShowPepitoTooltip] = useState(false);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const cryAudioRef = useRef<HTMLAudioElement | null>(null);
  const wasActiveRef = useRef(false);
  const playedRef = useRef(false);
  const effectsEnabled = () => document.body.dataset.effectsEnabled !== "false";

  useEffect(() => {
    const interval = window.setInterval(() => {
      const frame = sceneRef.current;
      if (!frame) return;

      const overlay = document.querySelector(".section7Overlay") as HTMLElement | null;
      const overlayActive = !!overlay?.classList.contains("is-active");
      const sceneActive = frame.classList.contains("is-active");
      const section7Active = document.body.classList.contains("section7-active");
      const active = overlayActive && section7Active && sceneActive;

      if (!active) {
        wasActiveRef.current = false;
        playedRef.current = false;
        if (cryAudioRef.current) {
          cryAudioRef.current.pause();
          cryAudioRef.current.currentTime = 0;
        }
        return;
      }

      if (!wasActiveRef.current) {
        wasActiveRef.current = true;
        playedRef.current = false;
      }

      if (playedRef.current) return;
      if (!effectsEnabled()) return;
      if (!cryAudioRef.current) return;

      cryAudioRef.current.currentTime = 0;
      void cryAudioRef.current.play().then(() => {
        playedRef.current = true;
      }).catch(() => undefined);
    }, 220);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div ref={sceneRef} className="scenePhoto sceneFrame" style={{ transform: "translateY(20px) scale(1.02)", overflow: "hidden" }}>
      <img className="sceneFrameImage" src="/seccion7/Escena3.jpg" alt="Escena 3" />
      <audio ref={cryAudioRef} src="/Sonidos/Llorar.mp3" preload="auto" />

      <div className="section7DustLayer" aria-hidden="true">
        {SCENE1_DUST_PARTICLES.map((particle) => (
          <span
            key={`scene3-dust-${particle.id}`}
            className="section7DustParticle"
            style={
              {
                "--dust-x": `${Math.max(0, particle.x - 28)}%`,
                "--dust-y": `${Math.min(98, particle.y + 14)}%`,
                "--dust-size": `${particle.size}px`,
                "--dust-opacity": particle.opacity,
                "--dust-duration": `${particle.duration}s`,
                "--dust-delay": `${particle.delay}s`,
                "--dust-drift": `${particle.drift}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {SCENE3_TEAR_PARTICLES.map((tear) => (
        <div
          key={tear.id}
          className="tearDrop"
          style={{
            left: `${tear.x}%`,
            top: `${tear.y}%`,
            width: `${tear.size}px`,
            height: `${tear.size * 1.45}px`,
            animationDuration: `${tear.duration}s`,
            animationDelay: `${tear.delay}s`,
            animationIterationCount: "infinite",
          }}
        />
      ))}

      <button
        type="button"
        aria-label="Pepito Grillo Escena 3"
        onPointerEnter={() => setShowPepitoTooltip(true)}
        onPointerLeave={() => setShowPepitoTooltip(false)}
        style={{
          position: "absolute",
          left: "68%",
          top: "50%",
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

      {showPepitoTooltip && (
        <div
          className="grilloTooltip grilloTooltipSection7"
          style={{
            position: "absolute",
            left: "calc(68% + clamp(42px, 6vw, 100px))",
            top: "calc(50% - clamp(58px, 8vw, 90px))",
            transform: "translate(-50%, -50%)",
            zIndex: 12,
          }}
        >
          No te preocupes Pinocho,
          <br />
          encontraremos a Geppetto
          <span className="thoughtTail" aria-hidden="true" />
        </div>
      )}

      <div className="sceneCornerBox sceneCornerTopLeft" style={{ width: "400px" }}>
        Las lágrimas rodaron por su cara.
        <br />
        Pinocho abrazó la carta con tristeza.
        <br />
        "Tengo que encontrarlo", dijo decidido.
        <br />
        Y por primera vez, pensó más en su padre que en sí mismo.
      </div>
    </div>
  );
}

export default function Section7Overlay() {
  const [voiceOverEnabled, setVoiceOverEnabled] = useState(false);
  const [activeSection7Index, setActiveSection7Index] = useState<number | null>(null);
  const escena1VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena2VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena3VoiceRef = useRef<HTMLAudioElement | null>(null);
  const pendingVoiceUnlockRef = useRef(false);

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
    const handleSection7Index = (event: Event) => {
      const detail = (event as CustomEvent<{ index: number }>).detail;
      if (!detail) return;
      setActiveSection7Index(detail.index);
    };

    const handleSection7Leave = () => {
      setActiveSection7Index(null);
    };

    window.addEventListener("section7-active-index", handleSection7Index);
    window.addEventListener("section7-sequence-leave", handleSection7Leave);
    return () => {
      window.removeEventListener("section7-active-index", handleSection7Index);
      window.removeEventListener("section7-sequence-leave", handleSection7Leave);
    };
  }, []);

  useEffect(() => {
    const escena1Audio = escena1VoiceRef.current;
    const escena2Audio = escena2VoiceRef.current;
    const escena3Audio = escena3VoiceRef.current;
    const activeAudio =
      activeSection7Index === 0
        ? escena1Audio
        : activeSection7Index === 1
          ? escena2Audio
          : activeSection7Index === 2
            ? escena3Audio
          : null;

    [escena1Audio, escena2Audio, escena3Audio].forEach((audio) => {
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
  }, [activeSection7Index, voiceOverEnabled]);

  useEffect(() => {
    const retryIfNeeded = () => {
      if (!pendingVoiceUnlockRef.current) return;
      const audio =
        activeSection7Index === 0
          ? escena1VoiceRef.current
          : activeSection7Index === 1
            ? escena2VoiceRef.current
            : activeSection7Index === 2
              ? escena3VoiceRef.current
            : null;
      if (!audio) return;
      const shouldPlay =
        (activeSection7Index === 0 || activeSection7Index === 1 || activeSection7Index === 2) &&
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
  }, [activeSection7Index, voiceOverEnabled]);

  return (
    <div className="section7Overlay" aria-hidden="true">
      {SECTION7_IMAGES.map((image) => {
        if (image.src === "/seccion7/Escena1.jpg") {
          return <Section7Scene1 key={image.src} />;
        }

        if (image.src === "/seccion7/Escena2.svg") {
          return <Section7Scene2 key={image.src} />;
        }

        if (image.src === "/seccion7/Escena3.jpg") {
          return <Section7Scene3 key={image.src} />;
        }

        return null;
      })}
      <audio
        ref={escena1VoiceRef}
        src="/Sonidos/voz/Seccion6/Escena1.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena2VoiceRef}
        src="/Sonidos/voz/Seccion6/Escena2.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena3VoiceRef}
        src="/Sonidos/voz/Seccion6/Escena3.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
    </div>
  );
}
