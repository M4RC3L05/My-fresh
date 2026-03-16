import HYDRATION_CONTEXT_SRC from "./src/core/hydration-context.ts" with {
  type: "text",
};
import ISLAND_SRC from "./src/core/island.tsx" with {
  type: "text",
};
import SSR_SRC from "./src/core/ssr.tsx" with {
  type: "text",
};

const CORE_DIR = await Deno.realPath(Deno.env.get("CORE_DIR") ?? "./core");
const CORE_FILES = await Promise.all([
  { path: `${CORE_DIR}/hydration-context.ts`, src: HYDRATION_CONTEXT_SRC },
  { path: `${CORE_DIR}/island.tsx`, src: ISLAND_SRC },
  { path: `${CORE_DIR}/ssr.tsx`, src: SSR_SRC },
]);

console.log(`Sync core file into "${CORE_DIR}" process started`);

await Promise.all(
  CORE_FILES.map((file) =>
    Deno.writeTextFile(file.path, file.src, { create: true, append: false })
      .then(() =>
        console.log(
          `  %c✔%c Syncing successfull for file "${file.path}"`,
          "color: green",
          "color: inherit",
        )
      ).catch((error) =>
        console.error(
          `  %c✖%c Syncing failed for file "${file.path}"\n${
            Deno.inspect(error, {
              colors: true,
              depth: 1000,
              breakLength: Number.POSITIVE_INFINITY,
              compact: false,
              strAbbreviateSize: Number.POSITIVE_INFINITY,
              trailingComma: true,
            }).split("\n").map((l) => `      ${l}`).join("\n")
          }`,
          "color: red",
          "color: inherit",
        )
      )
  ),
)
  .finally(() => console.log("Sync core files process completed"));
