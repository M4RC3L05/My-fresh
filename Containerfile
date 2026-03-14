FROM docker.io/denoland/deno:alpine-2.7.3

RUN mkdir /app
RUN chown -R deno:deno /app

USER deno

WORKDIR /app

COPY --chown=deno:deno . .

RUN deno install --entrypoint src/main.tsx

RUN BUILD_DRY_RUN="true" timeout 30s deno run -A --cached-only src/main.tsx || true

RUN mkdir /app/data

VOLUME [ "/app/data" ]

EXPOSE 8000
