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
      {SECTION9_IMAGES.map((image) =>
        image.src === "/seccion9/Escena1.jpg" ? (
          <div
            key={image.src}
            className="scenePhoto sceneFrame"
            style={{ transform: "translateY(20px) scale(1.02)" }}
          >
            <img className="sceneFrameImage" src={image.src} alt={image.alt} />
            <div className="sceneCornerBox sceneCornerTopRight" style={{ width: "360px" }}>
              Geppetto acostó a Pinocho con cuidado en la cama.
              <br />
              Hijo mío susurró con lágrimas en los ojos.
              <br />
              El taller estaba en silencio.
            </div>
          </div>
        ) : image.src === "/seccion9/Escena2.jpg" ? (
          <div
            key={image.src}
            className="scenePhoto sceneFrame"
            style={{ transform: "translateY(20px) scale(1.02)" }}
          >
            <img className="sceneFrameImage" src={image.src} alt={image.alt} />
            <div className="sceneCornerBox" style={{ width: "380px" }}>
              Entonces apareció el Hada Azul.
              <br />
              Una luz brillante llenó la habitación.
              <br />
              Has demostrado amor verdadero y valentía dijo.
              <br />
              Y tocó a Pinocho con su varita.
            </div>
          </div>
        ) : image.src === "/seccion9/Escena3.jpg" ? (
          <div
            key={image.src}
            className="scenePhoto sceneFrame"
            style={{ transform: "translateY(20px) scale(1.02)" }}
          >
            <img className="sceneFrameImage" src={image.src} alt={image.alt} />
            <div className="sceneCornerBox sceneCornerTopLeft" style={{ width: "360px" }}>
              La magia envolvió su cuerpo.
              <br />
              La madera desapareció.
              <br />
              Y por primera vez,
              <br />
              Pinocho respiró como un niño de verdad.
            </div>
          </div>
        ) : image.src === "/seccion9/Escena4.jpg" ? (
          <div
            key={image.src}
            className="scenePhoto sceneFrame"
            style={{ transform: "translateY(20px) scale(1.02)" }}
          >
            <img className="sceneFrameImage" src={image.src} alt={image.alt} />
            <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "390px" }}>
              Desde aquel día, Pinocho fue responsable y bondadoso.
              <br />
              Fue a la escuela.
              <br />
              Ayudó a los demás.
              <br />
              Y siempre caminó orgulloso junto a su padre.
            </div>
          </div>
        ) : (
          <img
            key={image.src}
            className="scenePhoto"
            src={image.src}
            alt={image.alt}
            style={{ transform: "translateY(20px) scale(1.02)" }}
          />
        )
      )}
    </div>
  );
}
