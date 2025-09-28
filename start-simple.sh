#!/bin/bash

# Simple AgriTrace Startup Script (Single Terminal)
# Starts all services in background processes

echo "🚀 Starting AgriTrace (Background Mode)"
echo "======================================="

# Create logs directory if it doesn't exist
mkdir -p logs

# Stop any existing services
pkill -f "hardhat node" 2>/dev/null || true
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Start Hardhat Blockchain
echo "⛓️  Starting blockchain network..."
cd blockchain/hard-hat || exit
nohup npx hardhat node --hostname 127.0.0.1 > ../../logs/blockchain.log 2>&1 &
BLOCKCHAIN_PID=$!
echo "Blockchain PID: $BLOCKCHAIN_PID"
sleep 5

# Deploy contract
echo "📋 Deploying contract..."
CONTRACT_ADDRESS=$(node deploy.js)
echo "Contract deployed: $CONTRACT_ADDRESS"
cd ../.. || exit

# Start Backend
echo "🖥️  Starting backend server..."
cd blockchain/backend || exit
nohup node server.js > ../../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
sleep 3
cd ../.. || exit

# Start Frontend
echo "🌐 Starting frontend..."
cd agritrace-app || exit
nohup npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd .. || exit

# Save PIDs for easy stopping
echo "$BLOCKCHAIN_PID" > logs/blockchain.pid
echo "$BACKEND_PID" > logs/backend.pid
echo "$FRONTEND_PID" > logs/frontend.pid

echo ""
echo "✅ All services started!"
echo "======================="
echo "🔗 Frontend:   http://localhost:3000"
echo "🔗 Backend:    http://localhost:8000"
echo "🔗 Blockchain: http://localhost:8545"
echo ""
echo "📝 Logs available in logs/ directory"
echo "🛑 Stop with: ./stop-simple.sh"
echo ""
echo "Wait 10 seconds for all services to fully start..."
