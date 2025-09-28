#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/hard-hat"

DEPLOY_SCRIPT="deploy.js"
PID_FILE="hardhat-node.pid"

# Step 1: Start hardhat node in background
echo "🚀 Starting Hardhat node..."
npx hardhat node > hardhat-node.log 2>&1 &
NODE_PID=$!
echo $NODE_PID > "$PID_FILE"

# Step 2: Wait until the node is ready
echo "⏳ Waiting for Hardhat node to start..."
until grep -q "Started HTTP" hardhat-node.log; do
  sleep 1
done

# Step 3: Extract RPC URL
RPC_URL=$(grep -m1 -o "http://127.0.0.1:[0-9]*" hardhat-node.log)
echo "✅ Hardhat node running at $RPC_URL"

# Step 4: Extract first account private key
PRIVATE_KEY=$(grep -m1 -o "Private Key: 0x[a-fA-F0-9]\{64\}" hardhat-node.log | awk '{print $3}')
if [[ -n "$PRIVATE_KEY" ]]; then
  echo "✅ First account private key extracted"
else
  echo "⚠️ Could not find private key in log"
fi

# Step 5: Export RPC_URL and PRIVATE_KEY to .env
echo "RPC_URL=$RPC_URL" > ../.env
echo "PRIVATE_KEY=$PRIVATE_KEY" >> ../.env
echo "PORT=8000" >> ../.env

# Step 6: Compile contracts
echo "📦 Compiling contracts..."
npx hardhat compile

# Step 7: Deploy contracts if deploy.js exists
if [[ -f "$DEPLOY_SCRIPT" ]]; then
  echo "📂 Found $DEPLOY_SCRIPT, running deployment..."
  DEPLOY_OUTPUT=$(npx hardhat run "$DEPLOY_SCRIPT" --network localhost)
  echo "$DEPLOY_OUTPUT"

  CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oE "0x[a-fA-F0-9]{40}" | head -n1 || true)
  if [[ -n "$CONTRACT_ADDRESS" ]]; then
    echo "CONTRACT_ADDRESS=$CONTRACT_ADDRESS" >> ../.env
    echo "✅ Contract deployed at $CONTRACT_ADDRESS"
  else
    echo "⚠️ Could not extract contract address from deploy output"
  fi
else
  echo "⚠️ No $DEPLOY_SCRIPT found. Skipping deployment."
fi

echo "ℹ️ Node PID saved in $PID_FILE (use stop-network.sh to stop it)"
