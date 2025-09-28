#!/bin/bash

# AgriTrace Local Development Stop Script
# This script stops all AgriTrace services

echo "🛑 Stopping AgriTrace Local Development Environment"
echo "=================================================="

# Kill all AgriTrace processes
echo "🔧 Stopping Hardhat Blockchain Network..."
pkill -f "hardhat node" 2>/dev/null || true

echo "🔧 Stopping Backend Server..."
pkill -f "node.*server.js" 2>/dev/null || true

echo "🔧 Stopping Frontend Application..."
pkill -f "next dev" 2>/dev/null || true

# Wait for processes to stop
sleep 2

# Verify services are stopped
REMAINING=$(ps aux | grep -E "(hardhat|server\.js|next dev)" | grep -v grep | wc -l)

if [ "$REMAINING" -eq 0 ]; then
    echo "✅ All AgriTrace services stopped successfully!"
else
    echo "⚠️  Some processes may still be running. Check manually if needed."
fi

echo ""
echo "All AgriTrace services have been stopped."
