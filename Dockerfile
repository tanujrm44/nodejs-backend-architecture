# Use Node.js Alpine as base image
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

RUN npm i -g pnpm

# Install dependencies
RUN pnpm install

# Copy application code
COPY . .

# Build the TypeScript application
RUN npm run build

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]