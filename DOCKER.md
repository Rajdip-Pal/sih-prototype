# AgriTrace Docker Deployment Guide 🐳

This guide provides step-by-step instructions for deploying AgriTrace using Docker containers.

## 🚀 Quick Deployment (Recommended)

### One-Command Setup
```bash
# Make scripts executable and start system
chmod +x start-agritrace.sh setup.sh validate.sh
./setup.sh
```

### Manual Docker Compose
```bash
# Start all services
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## 📋 Prerequisites

### System Requirements
- **Docker**: Version 20.0+ ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose**: Version 2.0+ ([Install Compose](https://docs.docker.com/compose/install/))
- **RAM**: Minimum 4GB, Recommended 8GB
- **Storage**: Minimum 5GB free space
- **OS**: Linux, macOS, or Windows with WSL2

### Port Requirements
Ensure these ports are available:
- **3000**: Frontend (Next.js)
- **8000**: Backend API (Express.js)
- **8545**: Blockchain (Hardhat)

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Network                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Frontend   │  │   Backend    │  │   Blockchain     │  │
│  │  (Next.js)   │◄─┤ (Express.js) │◄─┤   (Hardhat)     │  │
│  │  Port: 3000  │  │  Port: 8000  │  │   Port: 8545    │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Services Configuration

### Frontend Container (agrotrace-frontend)
- **Base Image**: `node:18-alpine`
- **Build**: Multi-stage optimized build
- **Features**: Standalone Next.js production build
- **Health Check**: HTTP endpoint monitoring
- **Environment**: Production-ready configuration

### Backend Container (agrotrace-backend)
- **Base Image**: `node:18-alpine`
- **Features**: Express.js API with ethers.js
- **Data**: West Bengal agricultural seed data
- **Health Check**: API endpoint validation
- **Security**: Non-root user execution

### Blockchain Container (agrotrace-blockchain)
- **Base Image**: `node:18-alpine`
- **Features**: Hardhat local network with deployed contracts
- **Persistence**: Blockchain data volume
- **Health Check**: JSON-RPC endpoint monitoring
- **Auto-deployment**: Contracts deployed on startup

## 🌐 Environment Configuration

### Production Environment (`.env.docker`)
```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BLOCKCHAIN_URL=http://localhost:8545

# Backend
NODE_ENV=production
PORT=8000
BLOCKCHAIN_URL=http://blockchain:8545
CORS_ORIGIN=http://localhost:3000

# Blockchain
RPC_URL=http://blockchain:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Custom Configuration
Create your own `.env.local`:
```env
# Override default settings
NEXT_PUBLIC_API_URL=https://your-api-domain.com
BLOCKCHAIN_URL=https://your-blockchain-node.com
```

## 📊 Management Commands

### Start/Stop Operations
```bash
# Start system (build if needed)
docker-compose up -d --build

# Stop system
docker-compose down

# Restart specific service
docker-compose restart backend

# Stop and remove everything (including volumes)
docker-compose down -v --remove-orphans
```

### Monitoring & Debugging
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f blockchain

# Monitor resource usage
docker stats

# Check service health
docker-compose ps
```

### Scaling & Updates
```bash
# Scale backend service
docker-compose up -d --scale backend=2

# Update single service
docker-compose up -d --no-deps backend

# Rebuild without cache
docker-compose build --no-cache
```

## 🛠️ Development Workflow

### Local Development Override
Create `docker-compose.override.yml`:
```yaml
version: '3.8'
services:
  frontend:
    volumes:
      - ./agritrace-app:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development

  backend:
    volumes:
      - ./blockchain/backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

### Hot Reload Development
```bash
# Start with development overrides
docker-compose up -d

# Watch logs for changes
docker-compose logs -f frontend backend
```

## 🔐 Security Best Practices

### Container Security
- ✅ **Non-root users**: All containers run as unprivileged users
- ✅ **Read-only filesystems**: Where applicable
- ✅ **Resource limits**: Memory and CPU constraints
- ✅ **Network isolation**: Services communicate through Docker network
- ✅ **Minimal base images**: Alpine Linux for smaller attack surface

### Production Hardening
```yaml
# Add to docker-compose.yml
services:
  frontend:
    read_only: true
    tmpfs:
      - /tmp:noexec,nosuid,size=100m
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
```

## 🚢 Production Deployment

### Server Requirements
- **CPU**: 2+ cores recommended
- **RAM**: 4GB minimum, 8GB+ recommended
- **Storage**: 20GB+ SSD
- **Network**: Stable internet connection
- **OS**: Ubuntu 20.04+, CentOS 8+, or similar

### Deployment Steps
1. **Clone repository**:
   ```bash
   git clone <repository-url>
   cd sih-prototype
   ```

2. **Configure environment**:
   ```bash
   cp .env.docker .env.production
   # Edit .env.production with your settings
   ```

3. **Deploy with production config**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

4. **Verify deployment**:
   ```bash
   ./validate.sh
   ```

### Reverse Proxy Setup (Optional)
Using nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🧪 Testing & Validation

### Health Checks
All services include automatic health checks:
```bash
# Check service health
docker-compose ps

# Manual health check
curl http://localhost:3000/api/health
curl http://localhost:8000/api/products
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545
```

### Automated Testing
```bash
# Run system validation
./validate.sh

# Test API endpoints
curl http://localhost:8000/api/products | jq .
curl http://localhost:8000/api/trace/P001 | jq .
```

## 🆘 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find processes using ports
sudo lsof -i :3000,8000,8545

# Kill conflicting processes
sudo pkill -f "node"
sudo pkill -f "docker"
```

#### 2. Container Build Failures
```bash
# Clear Docker cache
docker system prune -f

# Rebuild without cache
docker-compose build --no-cache

# Check Docker space
docker system df
```

#### 3. Service Communication Issues
```bash
# Check network
docker network ls
docker network inspect sih-prototype_agrotrace-network

# Test internal connectivity
docker-compose exec backend ping blockchain
docker-compose exec frontend ping backend
```

#### 4. Blockchain Not Starting
```bash
# Check blockchain logs
docker-compose logs blockchain

# Restart blockchain
docker-compose restart blockchain

# Manual blockchain start
docker-compose exec blockchain npx hardhat node
```

#### 5. Frontend Build Issues
```bash
# Clear Next.js cache
docker-compose exec frontend rm -rf .next

# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up -d --no-deps --build frontend
```

### Debug Mode
Enable debug logging:
```bash
# Set debug environment
export COMPOSE_LOG_LEVEL=DEBUG
export DOCKER_BUILDKIT=1

# Start with verbose output
docker-compose up --build
```

## 📈 Performance Optimization

### Resource Limits
```yaml
# In docker-compose.yml
services:
  frontend:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'
```

### Volume Optimization
```yaml
# Use named volumes for better performance
volumes:
  node_modules_frontend:
  node_modules_backend:
  blockchain_data:
```

### Network Optimization
```yaml
# Custom network configuration
networks:
  agrotrace-network:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.0.0/16
```

## 📚 Additional Resources

- **Docker Documentation**: https://docs.docker.com/
- **Docker Compose Reference**: https://docs.docker.com/compose/
- **Next.js Docker Guide**: https://nextjs.org/docs/deployment#docker-image
- **Node.js Docker Best Practices**: https://nodejs.org/en/blog/features/docker-best-practices

## 🤝 Support

- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check inline code comments
- **Community**: Join our Discord server

---

**AgriTrace Docker Deployment** - Containerized agricultural traceability for the modern world 🌾🐳
