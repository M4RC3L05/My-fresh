export const gracefulShutdown = () => {
  const abortController = new AbortController();
  const { promise, resolve } = Promise.withResolvers<void>();
  let exitCode = 0;

  abortController.signal.addEventListener("abort", () => {
    resolve();
  });

  const abort = () => {
    if (!abortController.signal.aborted) abortController.abort();
  };

  if (Deno.env.get("BUILD_DRY_RUN") === "true") {
    abort();
  }

  for (const signal of ["SIGABRT", "SIGTERM", "SIGINT"] as Deno.Signal[]) {
    Deno.addSignalListener(signal, () => {
      console.log(`OS Signal "${signal}" captured`);

      abort();
    });
  }

  globalThis.addEventListener("unhandledrejection", (e) => {
    e.preventDefault();

    console.log({ reason: e.reason }, "Unhandled rejection captured");

    exitCode = 1;

    abort();
  });

  globalThis.addEventListener("error", (e) => {
    e.preventDefault();

    console.log({ error: e.error }, "Unhandled error captured");

    exitCode = 1;

    abort();
  });

  globalThis.addEventListener("unload", () => {
    abort();

    console.log(`Existing process with status "${exitCode}"`);

    Deno.exitCode = exitCode;
  });

  const shutdownP = promise.then(() => {
    // Force exit after 10 seconds.
    Deno.unrefTimer(
      setTimeout(() => {
        console.log("Process force to exit");

        exitCode = 1;

        // Force exit.
        Deno.exit(exitCode);
      }, 10_000),
    );
  });

  return {
    promise: shutdownP,
    signal: abortController.signal,
    done: () => {
      abort();

      return shutdownP;
    },
  };
};
