#!/bin/bash

# AgriTrace Local Development Server Startup Script
# This script starts all required services for local development

echo "🚀 Starting AgriTrace Local Development Environment"
echo "=================================================="

# Kill any existing processes
echo "🔧 Stopping existing services..."
pkill -f "hardhat node" 2>/dev/null || true
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Start Blockchain Network
echo "⛓️  Starting Hardhat Blockchain Network..."
cd blockchain/hard-hat
gnome-terminal --title="AgriTrace Blockchain" -- bash -c "npx hardhat node --hostname 127.0.0.1; exec bash" &
sleep 5

# Deploy Contract
echo "📋 Deploying Smart Contract..."
node deploy.js
CONTRACT_ADDRESS=$(node deploy.js)
echo "✅ Contract deployed at: $CONTRACT_ADDRESS"
cd ../..

# Start Backend Server
echo "🖥️  Starting Backend Server..."
cd blockchain/backend
gnome-terminal --title="AgriTrace Backend" -- bash -c "node server.js; exec bash" &
sleep 3
cd ../..

# Start Frontend
echo "🌐 Starting Frontend Application..."
cd agritrace-app
gnome-terminal --title="AgriTrace Frontend" -- bash -c "npm run dev; exec bash" &
sleep 5
cd ..

echo ""
echo "✅ AgriTrace Services Started Successfully!"
echo "=========================================="
echo "🔗 Frontend:     http://localhost:3000"
echo "🔗 Backend API:  http://localhost:8000"
echo "🔗 Blockchain:   http://localhost:8545"
echo ""
echo "📱 Test the scan functionality at: http://localhost:3000/scan"
echo ""
echo "To stop all services, run: ./stop-local.sh"
echo ""
echo "Services are running in separate terminal windows."
