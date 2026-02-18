"use client";

import { useState } from "react";

const ISLAND_IMAGES = [
  {
    src: "/seccion6/Escena1.jpg",
    alt: "Escena 1",
  },
  {
    src: "/seccion6/Escena2.jpg",
    alt: "Escena 2",
  },
  {
    src: "/seccion6/Escena3.jpg",
    alt: "Escena 3",
  },
  {
    src: "/seccion6/Escena4.jpg",
    alt: "Escena 4",
  },
  {
    src: "/seccion6/Escena5.jpg",
    alt: "Escena 5",
  },
  {
    src: "/seccion6/Escena6.jpg",
    alt: "Escena 6",
  },
  {
    src: "/seccion6/Escena7.jpg",
    alt: "Escena 7",
  },
  {
    src: "/seccion6/Escena8.jpg",
    alt: "Escena 8",
  },
] as const;

export default function IslandOverlay() {
  const [showScene3PepitoTooltip, setShowScene3PepitoTooltip] = useState(false);
  const [showScene8PepitoTooltip, setShowScene8PepitoTooltip] = useState(false);

  return (
    <div className="islandOverlay" aria-hidden="true">
      {ISLAND_IMAGES.map((image) => {
        if (image.src === "/seccion6/Escena1.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div className="sceneCornerBox sceneCornerTopLeft" style={{ width: "360px" }}>
                Pinocho llegó a la Isla de los Juegos.
                <br />
                Había montañas rusas, dulces y niños riendo por todas partes.
                <br />
                ¡Aquí no hay escuela ni obligaciones! le dijo el Cochero.
                <br />
                Pinocho miró todo con asombro.
              </div>
            </div>
          );
        }

        if (image.src === "/seccion6/Escena2.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "330px" }}>
                Un chico le ofreció un enorme caramelo.
                <br />
                Pepito Grillo se llevó las manos a la cabeza.
                <br />
                Pero Pinocho decidió quedarse.
              </div>
              <div
                className="grilloTooltip islandScene2Tooltip"
                style={{
                  position: "absolute",
                  left: "32%",
                  top: "16%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 5,
                }}
              >
                ¡Diviértete todo lo
                <br />
                que quieras!
                <span className="thoughtTail" aria-hidden="true" />
              </div>
            </div>
          );
        }

        if (image.src === "/seccion6/Escena3.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
              onPointerLeave={() => setShowScene3PepitoTooltip(false)}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "330px", padding: "0.2rem 0.8rem" }}>
                Pinocho comía, corría y rompía cosas sin pensar.
                <br />
                Reía mientras el desorden crecía a su alrededor.
              </div>
              <button
                type="button"
                aria-label="Pepito Grillo Escena 3"
                onPointerEnter={() => setShowScene3PepitoTooltip(true)}
                onPointerLeave={() => setShowScene3PepitoTooltip(false)}
                style={{
                  position: "absolute",
                  left: "90%",
                  top: "50%",
                  width: "110px",
                  height: "130px",
                  transform: "translate(-50%, -50%)",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  cursor: "pointer",
                  zIndex: 4,
                }}
              />
              {showScene3PepitoTooltip && (
                <div
                  className="grilloTooltip"
                  style={{
                    position: "absolute",
                    left: "96%",
                    top: "20%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 5,
                    whiteSpace: "nowrap",
                    maxWidth: "none",
                  }}
                >
                  !Pinocho ten cuidado, puede ser
                  <br />
                  que te estén mintiendo!
                  <span className="thoughtTail" aria-hidden="true" />
                </div>
              )}
            </div>
          );
        }

        if (image.src === "/seccion6/Escena4.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <video
                className="sceneFrameImage"
                src="/seccion6/video_1_1769186479905.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="sceneCornerBox" style={{ width: "360px" }}>
                De repente, algo terrible empezó a suceder.
                <br />
                A Pinocho le crecieron largas orejas de burro.
                <br />
                Los demás niños gritaban al transformarse también.
              </div>
            </div>
          );
        }

        if (image.src === "/seccion6/Escena5.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "320px" }}>
                Asustado, Pinocho comprendió la verdad.
                <br />
                La Isla era una trampa del Cochero,
                <br />
                que convertía a los niños en burros para venderlos.
              </div>
            </div>
          );
        }

        if (image.src === "/seccion6/Escena6.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div className="sceneCornerBox" style={{ width: "320px" }}>
                El Cochero lo persiguió bajo la tormenta,
                <br />
                blandiendo su látigo.
                <br />
                Pinocho corrió por el muelle sin mirar atrás.
              </div>
            </div>
          );
        }

        if (image.src === "/seccion6/Escena7.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "320px" }}>
                Sin otra salida, Pinocho saltó al mar oscuro.
                <br />
                Las olas eran grandes, pero era su única esperanza.
              </div>
            </div>
          );
        }

        if (image.src === "/seccion6/Escena8.jpg") {
          return (
            <div
              key={image.src}
              className="scenePhoto sceneFrame"
              style={{ transform: "translateY(20px) scale(1.02)" }}
              onPointerLeave={() => setShowScene8PepitoTooltip(false)}
            >
              <img className="sceneFrameImage" src={image.src} alt={image.alt} />
              <div className="sceneCornerBox sceneCornerBottomLeft" style={{ width: "340px" }}>
                Al amanecer, llegó a la orilla, cansado y empapado.
                <br />
                Miró el horizonte con tristeza.
                <br />
                Había aprendido que la diversión sin responsabilidad tiene consecuencias.
              </div>
              <button
                type="button"
                aria-label="Pepito Grillo Escena 8"
                onPointerEnter={() => setShowScene8PepitoTooltip(true)}
                onPointerLeave={() => setShowScene8PepitoTooltip(false)}
                style={{
                  position: "absolute",
                  left: "82%",
                  top: "78%",
                  width: "110px",
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
              {showScene8PepitoTooltip && (
                <div
                  className="grilloTooltip"
                  style={{
                    position: "absolute",
                    left: "90%",
                    top: "44%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 5,
                    whiteSpace: "nowrap",
                    maxWidth: "none",
                  }}
                >
                  Ay Pinocho ya te advertí que
                  <br />
                  tus actos tendrían consecuencias
                  <span className="thoughtTail" aria-hidden="true" />
                </div>
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
