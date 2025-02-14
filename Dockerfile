FROM oven/bun:1.2.2-slim AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY . .
RUN bun run build

FROM frolvlad/alpine-glibc:latest

COPY --from=builder /app/dist/main .
EXPOSE 3000

ENTRYPOINT [ "./main" ]
