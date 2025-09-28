FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY hardhat.config.ts ./

# Install dependencies
RUN npm ci

# Copy contracts and scripts
COPY contracts/ ./contracts/
COPY scripts/ ./scripts/
COPY ignition/ ./ignition/

# Compile contracts
RUN npx hardhat compile

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "🚀 Starting Hardhat Network..."' >> /app/start.sh && \
    echo 'npx hardhat node --hostname 0.0.0.0 --port 8545 &' >> /app/start.sh && \
    echo 'sleep 10' >> /app/start.sh && \
    echo 'echo "📜 Deploying contracts..."' >> /app/start.sh && \
    echo 'npx hardhat run scripts/deploy.ts --network localhost' >> /app/start.sh && \
    echo 'echo "✅ Hardhat network ready with contracts deployed"' >> /app/start.sh && \
    echo 'wait' >> /app/start.sh && \
    chmod +x /app/start.sh

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 8545

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8545 || exit 1

# Start the blockchain network
CMD ["/app/start.sh"]
