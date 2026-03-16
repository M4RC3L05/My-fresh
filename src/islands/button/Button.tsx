import type { FunctionalComponent } from "preact";
import { withIsland } from "../../core/island.tsx";

const Button: FunctionalComponent<{ name?: string }> = ({ name }) => {
  return (
    <button
      type="button"
      onClick={() => alert(`Hello ${name ?? "John Doe"}`)}
    >
      Click me!
    </button>
  );
};

export default withIsland(Button, import.meta.url);
