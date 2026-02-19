import InlineSvg from "./components/InlineSvg";
import GeppettoOverlay from "./components/GeppettoOverlay";
import VillageOverlay from "./components/VillageOverlay";
import CircusOverlay from "./components/CircusOverlay";
import ForestOverlay from "./components/ForestOverlay";
import IslandOverlay from "./components/IslandOverlay";
import Section7Overlay from "./components/Section7Overlay";
import Section8Overlay from "./components/Section8Overlay";
import Section9Overlay from "./components/Section9Overlay";
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
        <IslandOverlay />
        <Section7Overlay />
        <Section8Overlay />
        <Section9Overlay />
        <MapScrollCamera />
      </div>

      {/* CAPAS DE SCROLL (una por zona) */}
      <div className="story">
        <section className="scene" data-zone="zone-mapa" />

        <section className="scene" data-zone="zone-geppetto" />

        <section className="scene geppetto-sequence" data-zone="zone-geppetto" />

        <section className="scene" data-zone="zone-village" />

        <section className="scene village-sequence" data-zone="zone-village" />

        <section className="scene" data-zone="zone-circus" />

        <section className="scene circus-sequence" data-zone="zone-circus" />

        <section className="scene" data-zone="zone-forest" />

        <section className="scene forest-sequence" data-zone="zone-forest" />

        <section className="scene" data-zone="zone-island" />

        <section className="scene island-sequence" data-zone="zone-island" />

        <section className="scene" data-zone="zone-geppetto" />

        <section className="scene section7-sequence" data-zone="zone-geppetto" />

        <section className="scene" data-zone="zone-island" />

        <section className="scene section8-sequence" data-zone="zone-island" />

        <section className="scene section9-sequence" data-zone="zone-geppetto" />

        <section className="scene final-map-sequence" data-zone="zone-mapa" />
      </div>
    </main>
  );
}

