"use client";

const SECTION9_IMAGES = [
  {
    src: "/seccion9/Escena1.jpg",
    alt: "Escena 1",
  },
  {
    src: "/seccion9/Escena2.jpg",
    alt: "Escena 2",
  },
  {
    src: "/seccion9/Escena3.jpg",
    alt: "Escena 3",
  },
  {
    src: "/seccion9/Escena4.jpg",
    alt: "Escena 4",
  },
] as const;

export default function Section9Overlay() {
  return (
    <div className="section9Overlay" aria-hidden="true">
      {SECTION9_IMAGES.map((image) => (
        <img
          key={image.src}
          className="scenePhoto"
          src={image.src}
          alt={image.alt}
          style={{ transform: "translateY(20px) scale(1.02)" }}
        />
      ))}
    </div>
  );
}
