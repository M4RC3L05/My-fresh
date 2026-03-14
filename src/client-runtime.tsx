import Preact, {
  ContainerNode,
  createContext,
  FunctionalComponent,
  hydrate,
} from "preact";
import { useContext } from "preact/hooks";

declare module "preact/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "preact-island": Preact.HTMLAttributes<HTMLElement>;
    }
  }
}

const IslandContext = createContext(false);

// deno-lint-ignore ban-types
export function withIsland<P extends Record<string, unknown> = {}>(
  Component: FunctionalComponent<P>,
  path: string,
): FunctionalComponent<P> {
  if (typeof document !== "undefined") {
    return (props: P) => {
      const parent = (props as { "@@target_hydrate@@"?: ContainerNode })[
        "@@target_hydrate@@"
      ];
      delete props["@@target_hydrate@@"];

      if (parent) {
        hydrate(<Component {...props} />, parent);

        return;
      }

      return (
        <preact-island>
          <Component {...props} />
        </preact-island>
      );
    };
  }

  // This prevents bundling the server code!
  const importPath = path.split("/src/islands/")
    .at(-1)
    ?.replace(".tsx", ".js")
    ?.replace(".ts", ".js");

  return (props: P) => {
    const inIslandContext = useContext(IslandContext);

    return (
      <>
        {inIslandContext
          ? (
            <preact-island>
              <Component {...props} />
            </preact-island>
          )
          : (
            <IslandContext.Provider value>
              <preact-island>
                <Component {...props} />
              </preact-island>
            </IslandContext.Provider>
          )}
        {!inIslandContext && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (() => {
                  var s = document.currentScript;
                  document.addEventListener("DOMContentLoaded", () => {
                    var target = s.closest("preact-island") ? null : s.previousSibling;
                    var props = ${JSON.stringify(props ?? {})};
                    props["@@target_hydrate@@"] = target;

                    import("/static/dist/${importPath}")
                      .then((m) => m.default(props))
                      .finally(() => s.remove());
                  });
                })()
              `,
            }}
          />
        )}
      </>
    );
  };
}
