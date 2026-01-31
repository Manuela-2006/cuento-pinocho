"use client";

import { useEffect, useRef, useState } from "react";
import InlineSvg from "./InlineSvg";

const RECT_SELECTOR = "#pinochodemadera, [data-name='pinochodemadera']";

const SCENE_IMAGES = [
  { src: "/secci%C3%B3n1/Escena%201.jpg", alt: "Escena 1" },
  { src: "/secci%C3%B3n1/Escena%202.jpg", alt: "Escena 2" },
  { src: "/secci%C3%B3n1/Escena%203.jpg", alt: "Escena 3" },
  { src: "/secci%C3%B3n1/Escena%204.jpg", alt: "Escena 4" },
  { src: "/secci%C3%B3n2/Escena%201.svg", alt: "Escena 5", isVideo: true, isSvg: true },
  { src: "/secci%C3%B3n2/Escena%203.jpg", alt: "Escena 6" },
];

const VIDEO_SRC = "/secci%C3%B3n2/video_1_1769169708445.mp4";

export default function GeppettoOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => {});
    });
  };

  return (
    <>
      <div className="geppettoOverlay" aria-hidden="true">
        {SCENE_IMAGES.map((image) => {
          if (image.isSvg) {
            return (
              <div
                key={image.src}
                className={`scenePhoto sceneSvg${image.isVideo ? " is-video" : ""}${
                  isOpen ? " is-playing" : ""
                }`}
                onClick={(event) => {
                  const target = (event.target as Element | null)?.closest(RECT_SELECTOR);
                  if (target) handleOpen();
                }}
              >
                <InlineSvg src={image.src} className="sceneSvgInner" />
                {image.isVideo && (
                  <video
                    ref={videoRef}
                    className="sceneSvgVideo"
                    src={VIDEO_SRC}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls={false}
                  />
                )}
              </div>
            );
          }

          return (
            <img
              key={image.src}
              className={`scenePhoto${image.isVideo ? " is-video" : ""}`}
              src={image.src}
              alt={image.alt}
            />
          );
        })}
      </div>

    </>
  );
}
