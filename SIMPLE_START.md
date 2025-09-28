# 🚀 AgriTrace - Simple Setup Instructions

## Quick Start (3 Steps)

### Step 1: Start Blockchain
```bash
cd blockchain/hard-hat
npx hardhat node
```
Keep this terminal open. You'll see accounts with ETH balances.

### Step 2: Start Frontend
```bash
# In a new terminal
cd agritrace-app
npm run dev
```
Keep this terminal open. Wait for "Ready in X seconds" message.

### Step 3: Access Your App
Open your browser and go to:
- **Main App**: http://localhost:3000
- **QR Scanner**: http://localhost:3000/scan

## Test the Scanner

On the scan page, click any of these sample products:
1. **Bengali Tomatoes** - Try this first!
2. **Gobindobhog Rice** - Premium organic variety
3. **Rohu Fish** - Fresh water fish

Each product shows real West Bengal farmer information.

## That's It!

Your AgriTrace app is now running with:
- ✅ Frontend on port 3000
- ✅ Blockchain on port 8545
- ✅ Real scan functionality
- ✅ West Bengal agricultural data

## Stop Everything
Press `Ctrl+C` in each terminal to stop the services.

## Troubleshooting

**Port in use error?**
```bash
pkill -f "hardhat node"
pkill -f "next dev"
```

**Need backend API?**
```bash
# Optional: Start backend server (in 3rd terminal)
cd blockchain/backend
node server.js
```

---
**That's all you need!** The scan functionality works perfectly with just the frontend and blockchain running.
