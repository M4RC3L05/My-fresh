import type { FunctionalComponent } from "preact";
import { count } from "../state/signals.ts";
import { withIsland } from "../core/island.tsx";
import Button from "./button/Button.tsx";
import { useSignal } from "@preact/signals";

const Counter: FunctionalComponent<{ name?: string; lCount?: number }> = (
  { name, lCount: lCountInit },
) => {
  const lCount = useSignal(lCountInit ?? 0);

  return (
    <div>
      <p>The count is {count} - local count {lCount}</p>
      <button
        type="button"
        onClick={() => {
          count.value -= 1;
          lCount.value -= 1;
        }}
      >
        -
      </button>
      <button
        type="button"
        onClick={() => {
          count.value += 1;
          lCount.value += 1;
        }}
      >
        +
      </button>

      <hr />

      <Button {...(name && { name })} />
    </div>
  );
};

export default withIsland(Counter, import.meta.url);
