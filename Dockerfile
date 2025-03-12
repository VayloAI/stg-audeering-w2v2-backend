FROM oven/bun:latest AS base
WORKDIR /app

FROM base AS release
COPY package.json bun.lock tsconfig.json ./
COPY src src
COPY scripts scripts
RUN bun install

USER bun
ARG SERVICE=backend
ENV SERVICE=$SERVICE
ENV NODE_ENV=production
CMD ["sh", "-c", "bun run ${SERVICE}"]