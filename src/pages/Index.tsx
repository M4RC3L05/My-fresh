import { FunctionalComponent } from "preact";
import Counter from "../islands/Counter.tsx";

export type Props = { val: number };

export const Index: FunctionalComponent<Props> = ({ val }) => {
  return (
    <div>
      <h1>Index page, Val {val}</h1>
      <a href="/no-js">Go to no-js page</a>

      <hr />

      <Counter name="Ana" />

      <hr />

      <Counter name="Bob" lCount={10} />
    </div>
  );
};
