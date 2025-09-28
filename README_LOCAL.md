# AgriTrace - Simple Local Development Setup

## Quick Start (Choose One Method)

### Method 1: Simple Background Mode (Recommended)
```bash
# Start all services in background
./start-simple.sh

# Check status
./status.sh

# Stop all services
./stop-simple.sh
```

### Method 2: Multiple Terminal Windows
```bash
# Start services in separate terminal windows
./start-local.sh

# Stop all services
./stop-local.sh
```

## Access Your Application

Once started, access these URLs:

- **🌐 Main Application**: http://localhost:3000
- **📱 QR Scan Feature**: http://localhost:3000/scan
- **🔗 Backend API**: http://localhost:8000
- **⛓️ Blockchain**: http://localhost:8545

## Test Products Available

Try scanning these sample products:

1. **Bengali Tomatoes (P002)** - Pusa Ruby variety by Mala Das
2. **Gobindobhog Rice (P001)** - Aromatic organic by Subir Chatterjee
3. **Rohu Fish (P004)** - Fresh water by Ratan Mondal

## Troubleshooting

### Check Service Status
```bash
./status.sh
```

### View Logs (Background Mode)
```bash
# View backend logs
tail -f logs/backend.log

# View frontend logs
tail -f logs/frontend.log

# View blockchain logs
tail -f logs/blockchain.log
```

### Manual Service Start
If scripts don't work, start manually:

```bash
# Terminal 1: Blockchain
cd blockchain/hard-hat
npx hardhat node

# Terminal 2: Backend (after blockchain is running)
cd blockchain/backend
node server.js

# Terminal 3: Frontend
cd agritrace-app
npm run dev
```

### Common Issues

**Port Already in Use:**
```bash
# Kill existing processes
pkill -f "hardhat node"
pkill -f "node.*server.js"
pkill -f "next dev"
```

**Contract Not Deployed:**
```bash
cd blockchain/hard-hat
node deploy.js
```

## File Structure

```
AgriTrace/
├── start-simple.sh      # Background mode startup
├── stop-simple.sh       # Stop background services
├── start-local.sh       # Multi-terminal startup
├── stop-local.sh        # Stop multi-terminal services
├── status.sh            # Check service status
├── logs/                # Service logs (created automatically)
├── blockchain/
│   ├── hard-hat/        # Blockchain network
│   └── backend/         # API server
└── agritrace-app/       # Frontend application
```

## What Each Service Does

- **Blockchain (Port 8545)**: Local Ethereum network for storing supply chain data
- **Backend (Port 8000)**: API server with West Bengal agricultural data
- **Frontend (Port 3000)**: Next.js web application with QR scanning

## Development Notes

- Services start in order: Blockchain → Backend → Frontend
- Wait 10-15 seconds for all services to fully initialize
- The scan feature uses real West Bengal farmer and product data
- All data is stored locally - no external dependencies

---

**Quick Commands:**
- Start: `./start-simple.sh`
- Status: `./status.sh`
- Stop: `./stop-simple.sh`
