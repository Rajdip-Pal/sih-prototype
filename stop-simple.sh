#!/bin/bash

# Simple AgriTrace Stop Script
# Stops all background services using saved PIDs

echo "🛑 Stopping AgriTrace Services"
echo "=============================="

# Kill processes using saved PIDs
if [ -f logs/blockchain.pid ]; then
    BLOCKCHAIN_PID=$(cat logs/blockchain.pid)
    echo "Stopping blockchain (PID: $BLOCKCHAIN_PID)..."
    kill $BLOCKCHAIN_PID 2>/dev/null || true
    rm logs/blockchain.pid
fi

if [ -f logs/backend.pid ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    echo "Stopping backend (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null || true
    rm logs/backend.pid
fi

if [ -f logs/frontend.pid ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    echo "Stopping frontend (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null || true
    rm logs/frontend.pid
fi

# Fallback: kill by process name
pkill -f "hardhat node" 2>/dev/null || true
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

echo "✅ All services stopped!"
