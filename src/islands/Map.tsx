import type { FunctionalComponent } from "preact";
import { effect, useSignal } from "@preact/signals";
import { withIsland } from "../core/island.tsx";

// MapComponent utilizes Leaflet context for rendering the map
const Map: FunctionalComponent = () => {
  // deno-lint-ignore no-explicit-any
  const leaf = useSignal<any>(null);

  effect(() => {
    if (!leaf.value) return;

    const map = leaf.value.map("map").setView(leaf.value.latLng(0, 0), 2);
    leaf.value.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  });

  return (
    <>
      <div
        id="map"
        style={{ height: "280px" }}
      />
      {/* Load Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        // @ts-expect-error ignore
        crossorigin=""
      />

      {typeof window !== "undefined" && (
        <>
          {/* Load Leaflet JS */}
          <script
            defer
            onLoad={() => {
              // deno-lint-ignore no-explicit-any
              leaf.value = (window as any).L;
            }}
            src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
            integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
            // @ts-expect-error ignore
            crossorigin=""
          >
          </script>
        </>
      )}
    </>
  );
};

export default withIsland(Map, import.meta.url);
