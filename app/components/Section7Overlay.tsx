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
      {SECTION7_IMAGES.map((image) => {
        if (image.src === "/seccion7/Escena1.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div className="sceneCornerBox sceneCornerTopRight" style={{ width: "360px" }}>
                Pinocho regresó al taller.
                <br />
                Todo estaba oscuro, cubierto de polvo y telarañas.
                <br />
                ¿Papá? susurró con miedo.
                <br />
                Pero nadie respondió.
              </div>
            </div>
          );
        }

        if (image.src === "/seccion7/Escena2.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "380px" }}>
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

        if (image.src === "/seccion7/Escena3.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div className="sceneCornerBox sceneCornerTopLeft" style={{ width: "400px" }}>
                Las lágrimas rodaron por su cara.
                <br />
                Pinocho abrazó la carta con tristeza.
                <br />
                Tengo que encontrarlo dijo decidido.
                <br />
                Y por primera vez, pensó más en su padre que en sí mismo.
              </div>
            </div>
          );
        }

        return (
          <img
            key={image.src}
            className="scenePhoto"
            src={image.src}
            alt={image.alt}
            style={{ transform: "translateY(20px) scale(1.02)" }}
          />
        );
      })}
    </div>
  );
}
