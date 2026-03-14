import { FunctionalComponent } from "preact";
import { withIsland } from "../../../src/client-runtime.tsx";

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
