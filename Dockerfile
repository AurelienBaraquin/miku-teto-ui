# ---- Étape 1 : Build (Construction) ----
FROM node:22-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances de manière optimisée
COPY package*.json ./
RUN npm ci

# Copie de tout le code source
COPY . .

# Build du projet Next.js
RUN npm run build

# ---- Étape 2 : Runtime (Exécution) ----
FROM node:22-alpine AS runtime

WORKDIR /app

# Configuration du serveur
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# On ne copie que ce qui est strictement nécessaire pour faire tourner le serveur Node.js SSR de Next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

# Lancement de l'application
CMD ["npm", "run", "start"]
