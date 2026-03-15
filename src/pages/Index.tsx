import { FunctionalComponent } from "preact";
import Counter from "../islands/Counter.tsx";
import Button from "../islands/button/Button.tsx";
import Map from "../islands/Map.tsx";

export type Props = { val: number };

export const Index: FunctionalComponent<Props> = ({ val }) => {
  return (
    <>
      <h1>Index page, Val {val}</h1>
      <a href="/no-js">Go to no-js page</a>

      <section>
        <Map />
      </section>

      <section>
        <Button name="Main Page" />
      </section>

      <section>
        <Counter name="Ana" />
      </section>

      <section>
        <Counter name="Bob" lCount={10} />
      </section>

      <section>
        <Counter name="John" />
      </section>
    </>
  );
};
