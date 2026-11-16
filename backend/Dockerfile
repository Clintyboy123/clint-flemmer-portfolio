# Backend: Express API. Production dependencies only, runs as the unprivileged "node" user.
FROM node:24-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node . .
RUN chmod +x docker-entrypoint.sh

# Uploaded files live here, on the "uploads" volume. Created now and handed to the "node" user
# so the volume is writable once the container drops its root rights below.
RUN mkdir -p /app/uploads && chown node:node /app/uploads

USER node
EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
