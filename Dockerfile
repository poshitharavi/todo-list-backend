# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app

# Install dependencies and build the app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-slim
WORKDIR /app

# Copy only the necessary files for production
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist

# Expose the port and define the start command
EXPOSE 3000
CMD ["node", "dist/main.js"]
