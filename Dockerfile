FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json package.json
COPY bun.lock bun.lock
COPY tsconfig.json tsconfig.json

RUN bun install --frozen-lockfile

COPY src src

ENV NODE_ENV=production

RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --target bun \
    --external "@vaylo/pino" \
    --external pino \
    --external pino-pretty \
    --outfile server \
    ./src/index.ts

RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --target bun \
    --external "@vaylo/pino" \
    --external pino \
    --external pino-pretty \
    --external onnxruntime-node \
    --outfile subscriber \
    ./src/events/subscribers/stg.ts

FROM oven/bun:latest AS migrator

WORKDIR /app

COPY --from=builder /app ./
RUN rm -rf ./src/tasks/model

CMD ["bun", "run", "migrate:up"]

FROM debian:stable-slim AS subscriber

WORKDIR /app

COPY --from=builder /app/subscriber subscriber
COPY --from=builder /app/src/tasks/model/model.onnx src/tasks/model/model.onnx
COPY --from=builder /app/node_modules node_modules

ENV NODE_ENV=production

CMD  [ "./subscriber" ]

FROM debian:stable-slim AS final

WORKDIR /app

COPY --from=builder /app/server server
COPY --from=builder /app/node_modules node_modules

ENV NODE_ENV=production

EXPOSE 3000/tcp
CMD  [ "./server" ]