"use client";

import { useEffect, useState } from "react";

const SECTION8_IMAGES = [
  {
    src: "/seccion8/Escena1.jpg",
    alt: "Escena 1",
  },
  {
    src: "/seccion8/Escena2.jpg",
    alt: "Escena 2",
  },
  {
    src: "/seccion8/Escena3.jpg",
    alt: "Escena 3",
  },
  {
    src: "/seccion8/Escena4.jpg",
    alt: "Escena 4",
  },
  {
    src: "/seccion8/Escena5.jpg",
    alt: "Escena 5",
  },
  {
    src: "/seccion8/Escena6.jpg",
    alt: "Escena 6",
  },
  {
    src: "/seccion8/Escena7.jpg",
    alt: "Escena 7",
  },
] as const;

export default function Section8Overlay() {
  const [showSection8Images, setShowSection8Images] = useState(false);

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
    <div className="section8Overlay" aria-hidden="true">
      {SECTION8_IMAGES.map((image) => (
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
      ))}
    </div>
  );
}
