#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/hard-hat"
PID_FILE="hardhat-node.pid"

# Kill by saved PID (if exists)
if [[ -f "$PID_FILE" ]]; then
  NODE_PID=$(cat "$PID_FILE")
  if kill -0 "$NODE_PID" 2>/dev/null; then
    echo "🛑 Stopping Hardhat node (PID $NODE_PID)..."
    kill -9 "$NODE_PID" || true
  fi
  rm -f "$PID_FILE"
fi

# Kill any stray process on port 8545
EXTRA_PIDS=$(lsof -ti :8545 || true)
if [[ -n "$EXTRA_PIDS" ]]; then
  echo "⚠️ Found stray processes on port 8545: $EXTRA_PIDS"
  kill -9 $EXTRA_PIDS || true
fi

echo "✅ Hardhat node fully stopped."
echo "ℹ️ You can restart it with start-network.sh"
