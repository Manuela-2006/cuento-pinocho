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
            <div className="sceneCornerBox sceneCornerTopLeft" style={{ width: "390px" }}>
              Pinocho miró el mar embravecido.
              <br />
              Sabía que su padre estaba allí dentro.
              <br />
              Con el corazón lleno de valor, sostuvo una gran piedra.
              <br />
              ¡No tengo miedo! dijo decidido.
            </div>
          </div>
        ) : image.src === "/seccion8/Escena2.jpg" ? (
          <div
            key={image.src}
            className="scenePhoto sceneFrame"
            style={{
              transform: "translateY(20px) scale(1.02)",
              display: showSection8Images ? "block" : "none",
            }}
          >
            <img className="sceneFrameImage" src={image.src} alt={image.alt} />
            <div className="sceneCornerBox sceneCornerTopRight" style={{ width: "390px" }}>
              De pronto, una enorme ballena apareció a su lado.
              <br />
              El agua giró a su alrededor y lo arrastró hacia su boca.
              <br />
              ¡Pinocho! gritó Pepito.
            </div>
          </div>
        ) : image.src === "/seccion8/Escena3.jpg" ? (
          <div
            key={image.src}
            className="scenePhoto sceneFrame"
            style={{
              transform: "translateY(20px) scale(1.02)",
              display: showSection8Images ? "block" : "none",
            }}
          >
            <img className="sceneFrameImage" src={image.src} alt={image.alt} />
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
              display: showSection8Images ? "block" : "none",
            }}
          >
            <img className="sceneFrameImage" src={image.src} alt={image.alt} />
            <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "370px" }}>
              De pronto, una voz familiar lo llamó.
              <br />
              ¡Pinocho!
              <br />
              Era Geppetto.
              <br />
              Padre e hijo se abrazaron con alegría.
            </div>
          </div>
        ) : image.src === "/seccion8/Escena5.jpg" ? (
          <div
            key={image.src}
            className="scenePhoto sceneFrame"
            style={{
              transform: "translateY(20px) scale(1.02)",
              display: showSection8Images ? "block" : "none",
            }}
          >
            <img className="sceneFrameImage" src={image.src} alt={image.alt} />
            <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "400px" }}>
              Dentro de la ballena, Pinocho tuvo una idea.
              <br />
              Encendieron una hoguera con los restos de madera.
              <br />
              El humo hizo cosquillas en la enorme nariz del monstruo.
              <br />
              ¡Va a estornudar! gritó Pepito.
            </div>
          </div>
        ) : image.src === "/seccion8/Escena6.jpg" ? (
          <div
            key={image.src}
            className="scenePhoto sceneFrame"
            style={{
              transform: "translateY(20px) scale(1.02)",
              display: showSection8Images ? "block" : "none",
            }}
          >
            <img className="sceneFrameImage" src={image.src} alt={image.alt} />
            <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "390px" }}>
              La ballena estornudó con tanta fuerza
              <br />
              que los lanzó fuera, junto al mar embravecido.
              <br />
              Pinocho tomó los remos con decisión.
              <br />
              ¡Rápido, papá!
            </div>
          </div>
        ) : image.src === "/seccion8/Escena7.jpg" ? (
          <div
            key={image.src}
            className="scenePhoto sceneFrame"
            style={{
              transform: "translateY(20px) scale(1.02)",
              display: showSection8Images ? "block" : "none",
            }}
          >
            <img className="sceneFrameImage" src={image.src} alt={image.alt} />
            <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "410px" }}>
              La ballena los persiguió entre rayos y olas gigantes.
              <br />
              Su enorme boca se abrió frente a la barca.
              <br />
              Geppetto temblaba.
              <br />
              Pero Pinocho encontró un sitio seguro para refugiarse.
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
      ))}
    </div>
  );
}
