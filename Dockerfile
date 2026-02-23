# Stage 1: Build
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:22-slim
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./
COPY --from=build /app/package*.json ./
RUN npm install --omit=dev

# Configurações recomendadas pelo Cloud Run
ENV PORT=8080
EXPOSE 8080

# Causa 3: CMD correto conforme orientação
CMD ["node", "server.js"]
