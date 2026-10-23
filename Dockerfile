# Portfolio — production image (TanStack Start + Nitro node-server)
# Build: docker compose build app / docker build -t portfolio-app .
# Hardening: multi-stage, USER node (non-root), no devDeps in runtime.
ARG NODE_VERSION=20-alpine

# ── Stage 1: build ──────────────────────────────────────────
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

# Nitro preset for Docker (ghi đè cloudflare-module mặc định của Lovable).
# Khi build ngoài sandbox, NITRO_PRESET được Nitro tôn trọng.
ENV NITRO_PRESET=node-server
ENV CI=true

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
# VITE_* được inject lúc build — truyền qua --build-arg khi cần.
ARG VITE_WEB3FORMS_ACCESS_KEY=""
ARG VITE_TURNSTILE_SITE_KEY=""
ENV VITE_WEB3FORMS_ACCESS_KEY=$VITE_WEB3FORMS_ACCESS_KEY
ENV VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY

RUN npm run build

# ── Stage 2: runtime ────────────────────────────────────────
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Chỉ mang output đã bundle sang runtime (không mang source + node_modules).
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Bảo mật: chạy dưới user `node` có sẵn (non-root).
RUN chown -R node:node /app
USER node

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=20s \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", ".output/server/index.mjs"]
