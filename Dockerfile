FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

FROM base AS build
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app /usr/src/app
COPY . .
ENV REDIS_PORT=3333
ENV REDIS_HOST="0.0.0.0"
RUN npm run build
RUN npm install --omit=dev --frozen-lockfile

FROM base AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 api
RUN chown api:nodejs .

COPY --chown=api:nodejs --from=build /usr/src/app/dist /usr/src/app/dist
COPY --chown=api:nodejs --from=build /usr/src/app/node_modules /usr/src/app/node_modules

USER api
EXPOSE 3333

ENTRYPOINT [ "node", "dist/main.js" ]
