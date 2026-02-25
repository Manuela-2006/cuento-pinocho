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
        De pronto, una enorme ballena aparecio a su lado.
        <br />
        El agua giro a su alrededor y lo arrastro hacia su boca.
        <br />
        &iexcl;Pinocho! grito Pepito.
      </div>
    </div>
  );
}

export default function Section8Overlay() {
  const [showSection8Images, setShowSection8Images] = useState(false);
  const [showScene1Tooltip, setShowScene1Tooltip] = useState(false);
  const [showScene3Tooltip, setShowScene3Tooltip] = useState(false);

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

  return (
    <div className="section8Overlay" aria-hidden="true" style={{ pointerEvents: showSection8Images ? "auto" : "none" }}>
      {SECTION8_IMAGES.map((image) =>
        image.src === "/seccion8/Escena1.jpg" ? (
          <div
            key={image.src}
            className="scenePhoto sceneFrame"
            style={{
              transform: "translateY(20px) scale(1.02)",
              display: showSection8Images ? "block" : "none",
            }}
          >
            <img className="sceneFrameImage" src={image.src} alt={image.alt} />

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
                className="grilloTooltip"
                style={{
                  position: "absolute",
                  left: "86%",
                  top: "calc(45% - 130px)",
                  transform: "translate(-50%, -50%)",
                  zIndex: 12,
                }}
              >
                Mira pinocho
                <br />
                una Ballena!
                <span className="thoughtTail" aria-hidden="true" />
              </div>
            )}

            <div className="sceneCornerBox sceneCornerTopLeft" style={{ width: "390px" }}>
              Pinocho miro el mar embravecido.
              <br />
              Sabia que su padre estaba alli dentro.
              <br />
              Con el corazon lleno de valor, sostuvo una gran piedra.
              <br />
              &iexcl;No tengo miedo! dijo decidido.
            </div>
          </div>
        ) : image.src === "/seccion8/Escena2.svg" ? (
          <Section8Scene2 key={image.src} showSection8Images={showSection8Images} />
        ) : image.src === "/seccion8/Escena3.jpg" ? (
          <div
            key={image.src}
            className="scenePhoto sceneFrame"
            style={{
              transform: "translateY(20px) scale(1.02)",
              width: "min(85vw, 960px)",
              aspectRatio: "1408 / 768",
              overflow: "hidden",
              display: showSection8Images ? "block" : "none",
            }}
          >
            <img className="sceneFrameImage section8BoatDriftImage" src={image.src} alt={image.alt} />
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
                className="grilloTooltip"
                style={{
                  position: "absolute",
                  left: "53%",
                  top: "calc(50% - 80px)",
                  transform: "translate(-50%, -50%)",
                  zIndex: 12,
                }}
              >
                &iquest;Escuchas eso
                <br />
                Pinocho?
                <span className="thoughtTail" aria-hidden="true" />
              </div>
            )}
            <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "390px" }}>
              Cuando despertaron, estaban en el interior oscuro de la ballena.
              <br />
              Una pequena barca flotaba entre restos de madera.
              <br />
              Pinocho miro a su alrededor sin saber que hacer.
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
              De pronto, una voz familiar lo llamo.
              <br />
              &iexcl;Pinocho!
              <br />
              Era Geppetto.
              <br />
              Padre e hijo se abrazaron con alegria.
            </div>
          </div>
        ) : image.src === "/seccion8/Escena5.jpg" ? (
          <div
            key={image.src}
            className="scenePhoto sceneFrame"
            style={{
              transform: "translateY(20px) scale(1.02)",
              display: showSection8Images ? "block" : "none",
              overflow: "hidden",
            }}
          >
            <img className="sceneFrameImage section8BoatDriftImage" src={image.src} alt={image.alt} />
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
              &iexcl;Va a estornudar! grito Pepito.
            </div>
          </div>
        ) : image.src === "/seccion8/Escena6.jpg" ? (
          <div
            key={image.src}
            className="scenePhoto sceneFrame"
            style={{
              transform: "translateY(20px) scale(1.02)",
              display: showSection8Images ? "block" : "none",
              overflow: "hidden",
            }}
          >
            <img className="sceneFrameImage" src={image.src} alt={image.alt} />
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
              La ballena estornudo con tanta fuerza
              <br />
              que los lanzo fuera, junto al mar embravecido.
              <br />
              Pinocho tomo los remos con decision.
              <br />
              &iexcl;Rapido, papa!
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
              La ballena los persiguio entre rayos y olas gigantes.
              <br />
              Su enorme boca se abrio frente a la barca.
              <br />
              Geppetto temblaba.
              <br />
              Pero Pinocho encontro un sitio seguro para refugiarse.
            </div>
          </div>
        ) : (
          <img
            key={image.src}
            className="scenePhoto"
            src={image.src}
            alt={image.alt}
            style={{
              transform: "translateY(20px) scale(1.02)",
              display: showSection8Images ? "block" : "none",
            }}
          />
        )
      )}
    </div>
  );
}


