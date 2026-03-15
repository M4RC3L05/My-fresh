import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { secureHeaders } from "@hono/hono/secure-headers";
import { Index } from "./pages/Index.tsx";
import { resolve } from "@std/path";
import { Static } from "./pages/Static.tsx";
import { gracefulShutdown } from "./process.ts";
import { renderPage } from "./utils/render.tsx";
import { layout } from "./pages/layout.ts";

const app = new Hono();

app.use(
  secureHeaders({
    crossOriginOpenerPolicy: "same-origin",
    crossOriginEmbedderPolicy: "credentialless",
    crossOriginResourcePolicy: "same-origin",
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      childSrc: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      frameSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://tile.openstreetmap.org"],
      manifestSrc: ["'self'"],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'none'"],
      scriptSrcElem: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      styleSrc: ["'self'"],
      styleSrcAttr: [
        "'none'",
        "'sha256-X1t21O9B11I6KXfTVGKaJ3t+ISIno5HeUJREz6FZTzU='",
        "'unsafe-hashes'",
      ],
      styleSrcElem: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      upgradeInsecureRequests: [],
      workerSrc: ["'self'"],
    },
  }),
);

app.get(
  "/favicon.ico",
  serveStatic({
    root: resolve(import.meta.dirname!, "..", "static"),
    path: "./favicon.ico",
  }),
);

app.get(
  "/static/*",
  serveStatic({
    root: resolve(import.meta.dirname!, "..", "static"),
    rewriteRequestPath: (path) => path.replace("/static/", "/"),
  }),
);

app.get(
  "/",
  (ctx) => {
    return ctx.html(
      renderPage(Index, {
        props: { val: 5 },
        layout: layout({ title: "Index page" }),
      }),
    );
  },
);

app.get(
  "/no-js",
  (ctx) => {
    return ctx.html(
      renderPage(Static, {
        layout: layout({ title: "No JS page" }),
      }),
    );
  },
);

const { promise } = gracefulShutdown();

await using _server = Deno.serve(
  app.fetch,
);

await promise;
