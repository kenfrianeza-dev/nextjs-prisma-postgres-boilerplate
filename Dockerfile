# Base image
FROM node:24-alpine

# Enable Corepack (for pnpm)
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy package files first (pnpm-lock.yaml is required)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 3000

# Default command
CMD ["pnpm", "dev"]
