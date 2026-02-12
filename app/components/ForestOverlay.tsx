"use client";

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
  return (
    <div className="forestOverlay" aria-hidden="true">
      {FOREST_IMAGES.map((image) => (
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
