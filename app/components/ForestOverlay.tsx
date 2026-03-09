"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

const FOREST_IMAGES = [
  {
    src: "/seccion5/Escena1.jpg",
    alt: "Escena 1",
  },
  {
    src: "/seccion5/Escena2.jpg",
    alt: "Escena 2",
  },
  {
    src: "/seccion5/Escena3.jpg",
    alt: "Escena 3",
  },
  {
    src: "/seccion5/Escena4.jpg",
    alt: "Escena 4",
  },
  {
    src: "/seccion5/Escena5.jpg",
    alt: "Escena 5",
  },
] as const;

export default function ForestOverlay() {
  const [voiceOverEnabled, setVoiceOverEnabled] = useState(false);
  const [activeForestIndex, setActiveForestIndex] = useState<number | null>(null);
  const [showScene3GrilloTooltip, setShowScene3GrilloTooltip] = useState(false);
  const [showScene5GrilloTooltip, setShowScene5GrilloTooltip] = useState(false);
  const [scene2Sparkles, setScene2Sparkles] = useState<
    { id: number; x: number; y: number; size: number; duration: number; delay: number }[]
  >([]);
  const [tears, setTears] = useState<
    { id: number; x: number; y: number; size: number; duration: number }[]
  >([]);
  const [fallingCoins, setFallingCoins] = useState<
    { id: number; x: number; y: number; size: number; duration: number; delay: number; drift: number }[]
  >([]);
  const sparkleIdRef = useRef(0);
  const tearIdRef = useRef(0);
  const coinIdRef = useRef(0);
  const scene5FrameRef = useRef<HTMLDivElement | null>(null);
  const scene5LaughPlayedRef = useRef(false);
  const scene5WasActiveRef = useRef(false);
  const moneyAudioRef = useRef<HTMLAudioElement | null>(null);
  const baritaAudioRef = useRef<HTMLAudioElement | null>(null);
  const foxLaughAudioRef = useRef<HTMLAudioElement | null>(null);
  const escena1VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena2VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena3VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena4VoiceRef = useRef<HTMLAudioElement | null>(null);
  const escena5VoiceRef = useRef<HTMLAudioElement | null>(null);
  const pendingVoiceUnlockRef = useRef(false);
  const effectsEnabled = () => document.body.dataset.effectsEnabled !== "false";

  const triggerScene2CoinSparkles = () => {
    const newSparkles = Array.from({ length: 14 }).map(() => {
      const duration = 0.9 + Math.random() * 0.7;
      const delay = Math.random() * 0.15;
      return {
        id: sparkleIdRef.current++,
        x: 42 + (Math.random() - 0.5) * 8,
        y: 46 + (Math.random() - 0.5) * 8,
        size: 4 + Math.random() * 5,
        duration,
        delay,
      };
    });

    setScene2Sparkles((prev) => [...prev, ...newSparkles].slice(-90));

    newSparkles.forEach((sparkle) => {
      const ttl = (sparkle.duration + sparkle.delay) * 1000;
      setTimeout(() => {
        setScene2Sparkles((prev) => prev.filter((p) => p.id !== sparkle.id));
      }, ttl);
    });
  };

  const playBaritaSound = () => {
    if (!effectsEnabled()) return;
    if (!baritaAudioRef.current) return;
    baritaAudioRef.current.currentTime = 0;
    void baritaAudioRef.current.play().catch(() => undefined);
  };

  const playMoneySound = () => {
    if (!effectsEnabled()) return;
    if (!moneyAudioRef.current) return;
    moneyAudioRef.current.currentTime = 0;
    void moneyAudioRef.current.play().catch(() => undefined);
  };

  const playFoxLaughSound = () => {
    if (!effectsEnabled()) return;
    if (!foxLaughAudioRef.current) return;
    foxLaughAudioRef.current.currentTime = 0;
    void foxLaughAudioRef.current.play().catch(() => undefined);
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
    const handleForestIndex = (event: Event) => {
      const detail = (event as CustomEvent<{ index: number }>).detail;
      if (!detail) return;
      setActiveForestIndex(detail.index);
    };

    const handleForestLeave = () => {
      setActiveForestIndex(null);
    };

    window.addEventListener("forest-active-index", handleForestIndex);
    window.addEventListener("forest-sequence-leave", handleForestLeave);
    return () => {
      window.removeEventListener("forest-active-index", handleForestIndex);
      window.removeEventListener("forest-sequence-leave", handleForestLeave);
    };
  }, []);

  useEffect(() => {
    const escena1Audio = escena1VoiceRef.current;
    const escena2Audio = escena2VoiceRef.current;
    const escena3Audio = escena3VoiceRef.current;
    const escena4Audio = escena4VoiceRef.current;
    const escena5Audio = escena5VoiceRef.current;
    const activeAudio =
      activeForestIndex === 0
        ? escena1Audio
        : activeForestIndex === 1
          ? escena2Audio
          : activeForestIndex === 2
            ? escena3Audio
            : activeForestIndex === 3
              ? escena4Audio
              : activeForestIndex === 4
                ? escena5Audio
          : null;

    [escena1Audio, escena2Audio, escena3Audio, escena4Audio, escena5Audio].forEach((audio) => {
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
  }, [activeForestIndex, voiceOverEnabled]);

  useEffect(() => {
    const retryIfNeeded = () => {
      if (!pendingVoiceUnlockRef.current) return;
      const audio =
        activeForestIndex === 0
          ? escena1VoiceRef.current
          : activeForestIndex === 1
            ? escena2VoiceRef.current
            : activeForestIndex === 2
              ? escena3VoiceRef.current
              : activeForestIndex === 3
                ? escena4VoiceRef.current
                : activeForestIndex === 4
                  ? escena5VoiceRef.current
            : null;
      if (!audio) return;
      const shouldPlay =
        (activeForestIndex === 0 ||
          activeForestIndex === 1 ||
          activeForestIndex === 2 ||
          activeForestIndex === 3 ||
          activeForestIndex === 4) &&
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
  }, [activeForestIndex, voiceOverEnabled]);

  useEffect(() => {
    const interval = setInterval(() => {
      const baseX = 0.34;
      const baseY = 0.52;
      const spreadX = 0.009;
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

  useEffect(() => {
    const interval = setInterval(() => {
      const newCoin = {
        id: coinIdRef.current++,
        x: 50 + (Math.random() - 0.5) * 14,
        y: 7 + (Math.random() - 0.5) * 5,
        size: 10 + Math.random() * 8,
        duration: 2.3 + Math.random() * 1.3,
        delay: Math.random() * 0.2,
        drift: (Math.random() - 0.5) * 70,
      };

      setFallingCoins((prev) => [...prev, newCoin].slice(-80));

      const ttl = (newCoin.duration + newCoin.delay) * 1000;
      setTimeout(() => {
        setFallingCoins((prev) => prev.filter((coin) => coin.id !== newCoin.id));
      }, ttl);
    }, 260);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const frame = scene5FrameRef.current;
      if (!frame) return;

      const isActive = frame.classList.contains("is-active");
      if (!isActive) {
        scene5WasActiveRef.current = false;
        scene5LaughPlayedRef.current = false;
        return;
      }

      if (!scene5WasActiveRef.current) {
        scene5WasActiveRef.current = true;
        scene5LaughPlayedRef.current = false;
      }

      if (scene5LaughPlayedRef.current) return;
      if (!effectsEnabled()) return;
      if (!foxLaughAudioRef.current) return;

      foxLaughAudioRef.current.currentTime = 0;
      void foxLaughAudioRef.current.play().then(() => {
        scene5LaughPlayedRef.current = true;
      }).catch(() => undefined);
    }, 220);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="forestOverlay" aria-hidden="true">
      {FOREST_IMAGES.map((image) => {
        if (image.src === "/seccion5/Escena1.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "360px", padding: "0.35rem 0.8rem" }}>
                En el camino hacia la escuela, Pinocho se encontró con un Gato y un Zorro.
                Parecían simpáticos y comenzaron a caminar junto a él.
              </div>
            </div>
          );
        }

        if (image.src === "/seccion5/Escena2.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              {scene2Sparkles.map((sparkle) => (
                <div
                  key={sparkle.id}
                  className="fairyParticle"
                  style={{
                    left: `${sparkle.x}%`,
                    top: `${sparkle.y}%`,
                    width: `${sparkle.size}px`,
                    height: `${sparkle.size}px`,
                    animationDuration: `${sparkle.duration}s, 0.45s`,
                    animationDelay: `${sparkle.delay}s, 0s`,
                    background:
                      "radial-gradient(circle, rgba(255,255,240,1) 0%, rgba(255,242,165,1) 42%, rgba(255,206,88,1) 74%)",
                    boxShadow:
                      "0 0 14px rgba(255,242,170,1), 0 0 24px rgba(255,208,96,0.9), 0 0 34px rgba(226,162,45,0.65)",
                  }}
                />
              ))}
              <button
                type="button"
                aria-label="Moneda"
                onClick={() => {
                  triggerScene2CoinSparkles();
                  playMoneySound();
                }}
                style={{
                  position: "absolute",
                  left: "42%",
                  top: "50%",
                  width: "60px",
                  height: "90px",
                  transform: "translate(-50%, -50%)",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  cursor: "pointer",
                  zIndex: 4,
                }}
              />
              <audio ref={moneyAudioRef} src="/Sonidos/Dinero.mp3" preload="auto" />
              <div className="sceneCornerBox sceneCornerTopRight" style={{ width: "300px" }}>
                "Conocemos una forma de hacerte rico", le susurró el Zorro, y le contó que había un árbol en el que, si plantabas una moneda, crecían muchas más.
              </div>
              <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "290px", padding: "0 0.8rem" }}>
                Pinocho miraba su dinero emocionado, sin sospechar nada.
                <br />
                Pepito Grillo, preocupado, intentaba advertirle.
              </div>
            </div>
          );
        }

        if (image.src === "/seccion5/Escena3.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
              onPointerLeave={() => setShowScene3GrilloTooltip(false)}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              {fallingCoins.map((coin) => (
                <div
                  key={coin.id}
                  className="coinDrop"
                  style={{
                    left: `${coin.x}%`,
                    top: `${coin.y}%`,
                    width: `${coin.size}px`,
                    height: `${coin.size}px`,
                    animationDuration: `${coin.duration}s`,
                    animationDelay: `${coin.delay}s`,
                    "--coin-drift": `${coin.drift}px`,
                  } as CSSProperties}
                />
              ))}
              <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "320px", padding: "0 0.8rem" }}>
                Mientras Pinocho soñaba con un árbol lleno de monedas de oro, el Gato y el Zorro ya sonreían en la sombra a lo lejos.
              </div>
              <button
                type="button"
                aria-label="Zorro"
                onClick={playFoxLaughSound}
                style={{
                  position: "absolute",
                  left: "78%",
                  top: "32%",
                  width: "55px",
                  height: "80px",
                  transform: "translate(-50%, -50%)",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  cursor: "pointer",
                  zIndex: 4,
                }}
              />
              <button
                type="button"
                aria-label="Pepito Grillo"
                onPointerEnter={() => setShowScene3GrilloTooltip(true)}
                onPointerLeave={() => setShowScene3GrilloTooltip(false)}
                style={{
                  position: "absolute",
                  left: "64%",
                  top: "68%",
                  width: "140px",
                  height: "180px",
                  transform: "translate(-50%, -50%)",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  cursor: "pointer",
                  zIndex: 4,
                }}
              />
              {showScene3GrilloTooltip && (
                <div
                  className="grilloTooltip"
                  style={{
                    position: "absolute",
                    left: "74%",
                    top: "44%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 5,
                  }}
                >
                  ¡No les creas!
                  <br />
                  ¡Solo quieren engañarte!
                  <span className="thoughtTail" aria-hidden="true" />
                </div>
              )}
              <audio ref={foxLaughAudioRef} src="/Sonidos/Risa.mp3" preload="auto" />
            </div>
          );
        }

        if (image.src === "/seccion5/Escena4.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div className="sceneCornerBox sceneCornerTopRight" style={{ width: "320px", padding: "0 0.8rem" }}>
                Pinocho decidió seguirlos hasta el bosque en búsqueda del árbol de dinero.
              </div>
            </div>
          );
        }

        if (image.src === "/seccion5/Escena5.jpg") {
          return (
            <div
              key={image.src}
              ref={scene5FrameRef}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
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
                className="sceneCornerBox"
                style={{
                  width: "250px",
                  minHeight: "0",
                  right: "56px",
                  paddingTop: "0.6rem",
                  paddingRight: "0.3rem",
                  paddingBottom: "0.6rem",
                  paddingLeft: "0.6rem",
                  textAlign: "left",
                }}
              >
                Allí, el Gato y el Zorro lo engañaron y le robaron su dinero.
              </div>
              <button
                type="button"
                aria-label="Bolsa de dinero"
                onClick={playBaritaSound}
                style={{
                  position: "absolute",
                  left: "80%",
                  top: "56%",
                  width: "70px",
                  height: "70px",
                  transform: "translate(-50%, -50%)",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  cursor: "pointer",
                  zIndex: 4,
                }}
              />
              <button
                type="button"
                aria-label="Pepito Grillo Escena 5"
                onPointerEnter={() => setShowScene5GrilloTooltip(true)}
                onPointerLeave={() => setShowScene5GrilloTooltip(false)}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "84%",
                  width: "120px",
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
              {showScene5GrilloTooltip && (
                <div
                  className="grilloTooltip"
                  style={{
                    position: "absolute",
                    left: "57%",
                    top: "60%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 5,
                    whiteSpace: "normal",
                    maxWidth: "320px",
                  }}
                >
                  !Pinocho recuerda que mentir
                  <br />
                  y dejarse llevar por el dinero
                  <br />
                  no es bueno!
                  <span className="thoughtTail" aria-hidden="true" />
                </div>
              )}
              <audio ref={baritaAudioRef} src="/Sonidos/Barita.mp3" preload="auto" />
            </div>
          );
        }

        return null;
      })}
      <audio
        ref={escena1VoiceRef}
        src="/Sonidos/voz/Seccion4/Escena1.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena2VoiceRef}
        src="/Sonidos/voz/Seccion4/Escena2.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena3VoiceRef}
        src="/Sonidos/voz/Seccion4/Escena3.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena4VoiceRef}
        src="/Sonidos/voz/Seccion4/Escena4.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      <audio
        ref={escena5VoiceRef}
        src="/Sonidos/voz/Seccion4/Escena5.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
    </div>
  );
}
