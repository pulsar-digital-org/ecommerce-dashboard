# syntax=docker.io/docker/dockerfile:1

########## Base Stage ##########
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

########## Dependencies Stage ##########
# Install dependencies for client and server workspaces.
FROM base AS deps
# Copy root dependency files and workspace configuration
COPY package.json turbo.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Copy only the package.json files for the apps we need
COPY apps/dashboard/package.json apps/dashboard/package.json
COPY apps/server/package.json apps/server/package.json

# Install dependencies across the workspaces
RUN if [ -f yarn.lock ]; then \
      yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then \
      npm ci; \
    elif [ -f pnpm-lock.yaml ]; then \
      corepack enable pnpm && pnpm install --frozen-lockfile; \
    else \
      echo "Lockfile not found." && exit 1; \
    fi

########## Build Stage ##########
# Build the client (and required server) artifacts.
FROM base AS builder
WORKDIR /app

# Bring in installed dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the necessary root files, including lockfiles
COPY package.json turbo.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Copy only the minimal source required for building client and server
COPY apps/dashboard apps/dashboard
COPY apps/server apps/server

# Run the build command filtered to the client and server packages
RUN if [ -f yarn.lock ]; then \
      yarn turbo run build --filter=apps/dashboard... --filter=apps/server...; \
    elif [ -f package-lock.json ]; then \
      npm run build; \
    elif [ -f pnpm-lock.yaml ]; then \
      corepack enable pnpm && pnpm run build; \
    else \
      echo "Lockfile not found." && exit 1; \
    fi

########## Runner Stage ##########
# Create a minimal production image.
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only the production outputs from the client build
COPY --from=builder /app/apps/dashboard/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

ARG API_URL
ENV API_URL=${API_URL}
ARG PORT
ENV PORT=${PORT}
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
