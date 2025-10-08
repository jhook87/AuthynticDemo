FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install && npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package.json ./
RUN npm install --omit=dev
EXPOSE 4173
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "4173"]
