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
  const moneyAudioRef = useRef<HTMLAudioElement | null>(null);
  const foxLaughAudioRef = useRef<HTMLAudioElement | null>(null);

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

  const playMoneySound = () => {
    if (!moneyAudioRef.current) return;
    moneyAudioRef.current.currentTime = 0;
    void moneyAudioRef.current.play().catch(() => undefined);
  };

  const playFoxLaughSound = () => {
    if (!foxLaughAudioRef.current) return;
    foxLaughAudioRef.current.currentTime = 0;
    void foxLaughAudioRef.current.play().catch(() => undefined);
  };

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
                onClick={triggerScene2CoinSparkles}
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
              <div className="sceneCornerBox sceneCornerTopRight" style={{ width: "300px" }}>
                Conocemos una forma de hacerte rico le susurró el Zorro y le contó que había un árbol en que que si plantabas una moneda crecían muchas más.
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
                    left: "79%",
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
                onClick={playMoneySound}
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
                    left: "60%",
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
              <audio ref={moneyAudioRef} src="/Sonidos/Dinero.mp3" preload="auto" />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
