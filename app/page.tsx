import InlineSvg from "./components/InlineSvg";
import GeppettoOverlay from "./components/GeppettoOverlay";
import VillageOverlay from "./components/VillageOverlay";
import CircusOverlay from "./components/CircusOverlay";
import ForestOverlay from "./components/ForestOverlay";
import MapScrollCamera from "./components/MapScrollCamera";

export default function Page() {
  return (
    <main>
      {/* MAPA FIJO */}
      <div className="mapViewport">
        <div className="mapLayer">
          <InlineSvg
            src="/maps/map (7).svg"
            className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
          />
        </div>
        <GeppettoOverlay />
        <VillageOverlay />
        <CircusOverlay />
        <ForestOverlay />
        <MapScrollCamera />
      </div>

      {/* CAPAS DE SCROLL (una por zona) */}
      <div className="story">
        <section className="scene" data-zone="zone-mapa">
          <div className="bubble">Mapa completo</div>
        </section>

        <section className="scene" data-zone="zone-geppetto">
          <div className="bubble">Casa Geppetto</div>
        </section>

        <section className="scene geppetto-sequence" data-zone="zone-geppetto">
          <div className="sequenceHint">Escenas de la casa</div>
        </section>

        <section className="scene" data-zone="zone-village">
          <div className="bubble">Plaza central</div>
        </section>

        <section className="scene village-sequence" data-zone="zone-village">
          <div className="sequenceHint">Escenas del pueblo</div>
        </section>

        <section className="scene" data-zone="zone-circus">
          <div className="bubble">Circo</div>
        </section>

        <section className="scene circus-sequence" data-zone="zone-circus">
          <div className="sequenceHint">Escenas del circo</div>
        </section>

        <section className="scene" data-zone="zone-forest">
          <div className="bubble">Bosque</div>
        </section>

        <section className="scene forest-sequence" data-zone="zone-forest">
          <div className="sequenceHint">Escenas del bosque</div>
        </section>

        <section className="scene" data-zone="zone-island">
          <div className="bubble">Isla de los juegos</div>
        </section>

        <section className="scene" data-zone="zone-geppetto">
          <div className="bubble">Casa Geppetto</div>
        </section>

        <section className="scene" data-zone="zone-island">
          <div className="bubble">Isla de los juegos</div>
        </section>

        <section className="scene" data-zone="zone-geppetto">
          <div className="bubble">Casa Geppetto</div>
        </section>
      </div>
    </main>
  );
}
