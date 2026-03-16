import type { FunctionalComponent } from "preact";
import Map from "../islands/Map.tsx";

export const ClientOnly: FunctionalComponent = () => {
  return (
    <>
      <h1>Client only page</h1>
      <a href="/">Go to home</a>

      <section>
        <Map />
      </section>
    </>
  );
};
