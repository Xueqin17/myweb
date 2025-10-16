# ----------------------------
# Stage 1: Build the Next.js App
# ----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy the dependent files and install them
COPY package*.json ./
RUN npm install

# Copy raw code
COPY . .

# Build Next.js 
RUN npm run build

# ----------------------------
# Stage 2: Run the App
# ----------------------------
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copy the build results and dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Exposure port
EXPOSE 3000

# Run Next.js 
CMD ["npm", "start"]