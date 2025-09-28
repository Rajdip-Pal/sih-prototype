#!/bin/bash

echo "🌾 Starting AgroTrace Agricultural Traceability System"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "❌ Please run this script from the blockchain/backend directory"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if blockchain network is running
echo "🔍 Checking blockchain network..."
if ! curl -s http://localhost:8545 > /dev/null; then
    echo "⚠️  Blockchain network not detected. Starting network..."
    echo "🚀 Please run: cd ../hard-hat && npm run node"
    echo "📋 Then deploy contract: npm run deploy"
    echo "⏳ Waiting for network to be ready..."
    sleep 5
fi

echo "🚀 Starting AgroTrace Backend Server..."
echo "📊 Server will be available at: http://localhost:3000"
echo "🎮 Interactive Demo: http://localhost:3000/demo"
echo "📋 API Documentation: http://localhost:3000"
echo ""
echo "⏳ Loading agricultural seed data..."
echo "=================================================="

# Start the server
node server.js
