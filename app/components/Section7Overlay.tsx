"use client";

const SECTION7_IMAGES = [
  {
    src: "/seccion7/Escena1.jpg",
    alt: "Escena 1",
  },
  {
    src: "/seccion7/Escena2.jpg",
    alt: "Escena 2",
  },
  {
    src: "/seccion7/Escena3.jpg",
    alt: "Escena 3",
  },
] as const;

export default function Section7Overlay() {
  return (
    <div className="section7Overlay" aria-hidden="true">
      {SECTION7_IMAGES.map((image) => (
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
