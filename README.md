# AgriTrace - Agricultural Supply Chain Traceability System 🌾

A comprehensive blockchain-based agricultural supply chain traceability system built with **Next.js**, **Express.js**, and **Hardhat**, featuring authentic **West Bengal agricultural data** and complete **Docker containerization** for easy deployment on **Linux, macOS, and Windows**.

## 🚀 Quick Start

### 🐳 Docker Deployment (Recommended)

#### For Linux/macOS:
```bash
# Clone and start the entire system
git clone <repository-url>
cd sih-prototype
chmod +x start-agritrace.sh setup.sh validate.sh
./start-agritrace.sh
```

#### For Windows:
```cmd
# Clone and start the entire system
git clone <repository-url>
cd sih-prototype
agritrace.bat
```

**📖 Windows Users**: See detailed [Windows Installation Guide](WINDOWS.md) for Docker Desktop setup and troubleshooting.

Access the application at http://localhost:3000 🎉

## 🚀 Quick Start with Docker

### Prerequisites

- **Docker** (version 20.0 or higher)
- **Docker Compose** (version 2.0 or higher)
- **8GB RAM** (recommended for smooth operation)
- **10GB free disk space**

### One-Command Startup

```bash
# Clone and start the system
git clone <repository-url>
cd sih-prototype
./start-agrotrace.sh
```

The system will automatically:
- Build all Docker containers
- Start blockchain network with deployed contracts
- Launch backend API with West Bengal agricultural data
- Start the Next.js frontend application
- Perform health checks
- Display access URLs

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Blockchain    │
│   (Next.js)     │◄──►│   (Express)     │◄──►│   (Hardhat)     │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 8545    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Services

1. **Frontend** (`agrotrace-frontend`)
   - Next.js 14 application with TypeScript
   - Responsive UI with Tailwind CSS and Radix UI
   - Product tracing and supply chain visualization
   - QR code scanning capabilities

2. **Backend** (`agrotrace-backend`)
   - Express.js API server
   - Blockchain integration with ethers.js
   - West Bengal agricultural seed data
   - RESTful endpoints for farmers, products, and traceability

3. **Blockchain** (`agrotrace-blockchain`)
   - Hardhat local development network
   - Smart contracts for supply chain tracking
   - Pre-deployed BranchingBlockchain contract

## 📱 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main application interface |
| **Backend API** | http://localhost:8000 | REST API endpoints |
| **Blockchain** | http://localhost:8545 | JSON-RPC blockchain node |

## 🔗 API Endpoints

### Products & Farmers
```bash
# List all products
curl http://localhost:8000/api/products

# List all farmers
curl http://localhost:8000/api/farmers

# Get dashboard stats
curl http://localhost:8000/api/dashboard/stats
```

### Product Traceability
```bash
# Trace a product's supply chain
curl http://localhost:8000/api/trace/P001

# Get blockchain trace
curl http://localhost:8000/api/blockchain-trace/P001

# Generate QR code data
curl http://localhost:8000/api/qr/P001
```

## 🌾 Sample West Bengal Products

| ID | Product | Farmer | Location |
|----|---------|---------|----------|
| **P001** | Organic Gobindobhog Rice | Subir Chatterjee | Bardhaman |
| **P002** | Fresh Bengali Tomatoes | Mala Das | Hooghly |
| **P003** | West Bengal Potatoes | Subir Chatterjee | Bardhaman |
| **P004** | Fresh Water Rohu Fish | Ratan Mondal | North 24 Parganas |
| **P005** | Bengali Brinjal | Mala Das | Hooghly |

## 🛠️ Management Commands

### Start/Stop System
```bash
# Start system
./start-agrotrace.sh up

# Stop system
./start-agrotrace.sh down

# Restart system
./start-agrotrace.sh restart
```

### Monitoring
```bash
# View logs
./start-agrotrace.sh logs

# Check service status
./start-agrotrace.sh status

# View specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f blockchain
```

### Maintenance
```bash
# Clean up resources
./start-agrotrace.sh clean

# Rebuild containers
docker-compose up -d --build
```

## 🔧 Manual Docker Setup

If you prefer manual control:

```bash
# Build and start all services
docker-compose up -d --build

# Start specific service
docker-compose up -d frontend

# Scale services (if needed)
docker-compose up -d --scale backend=2

# Stop and remove containers
docker-compose down -v
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the ports
   lsof -i :3000,8000,8545

   # Kill processes if needed
   sudo pkill -f "node"
   ```

2. **Docker Permission Issues**
   ```bash
   # Add user to docker group
   sudo usermod -aG docker $USER
   newgrp docker
   ```

3. **Blockchain Not Starting**
   ```bash
   # Check blockchain container logs
   docker-compose logs blockchain

   # Restart blockchain service
   docker-compose restart blockchain
   ```

4. **Frontend Build Errors**
   ```bash
   # Clear Next.js cache
   docker-compose exec frontend rm -rf .next
   docker-compose restart frontend
   ```

### Health Checks

All services include health checks that verify:
- **Blockchain**: JSON-RPC endpoint responds
- **Backend**: API endpoints return data
- **Frontend**: Application loads successfully

### Log Locations

- **Container logs**: `docker-compose logs [service-name]`
- **Application logs**: Inside containers at `/app/logs/`
- **System logs**: `docker system events`

## 🔐 Security Features

- **Non-root containers**: All services run as non-root users
- **Network isolation**: Services communicate through Docker network
- **Health monitoring**: Automatic service health checks
- **Resource limits**: Memory and CPU constraints applied

## 🚢 Production Deployment

### Environment Variables

Create `.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-domain.com/api
BLOCKCHAIN_URL=https://your-blockchain-node.com
PORT=8000
NODE_ENV=production
```

### Docker Compose Override

Create `docker-compose.prod.yml`:
```yaml
version: '3.8'
services:
  frontend:
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  backend:
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Run with:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📊 Performance Monitoring

### Resource Usage
```bash
# Monitor container resources
docker stats

# Check disk usage
docker system df
```

### Application Metrics
- Frontend: Built-in Next.js metrics
- Backend: Express middleware logging
- Blockchain: Hardhat network statistics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test with Docker: `./start-agrotrace.sh restart`
4. Commit changes: `git commit -am 'Add new feature'`
5. Push to branch: `git push origin feature/new-feature`
6. Submit pull request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Create GitHub issues for bugs and feature requests
- **Documentation**: Check inline code comments and API documentation
- **Community**: Join our Discord server for discussions

---

**AgriTrace** - Empowering transparent and traceable agriculture from khetan to thala (farm to plate) 🌾
