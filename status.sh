#!/bin/bash

# AgriTrace Status Checker
# Shows the status of all services

echo "📊 AgriTrace Services Status"
echo "============================="

# Check if services are running
BLOCKCHAIN_STATUS="❌ Not Running"
BACKEND_STATUS="❌ Not Running"
FRONTEND_STATUS="❌ Not Running"

# Check blockchain (port 8545)
if ss -tlnp | grep -q ":8545"; then
    BLOCKCHAIN_STATUS="✅ Running on port 8545"
fi

# Check backend (port 8000)
if ss -tlnp | grep -q ":8000"; then
    BACKEND_STATUS="✅ Running on port 8000"
fi

# Check frontend (port 3000)
if ss -tlnp | grep -q ":3000"; then
    FRONTEND_STATUS="✅ Running on port 3000"
fi

echo "⛓️  Blockchain: $BLOCKCHAIN_STATUS"
echo "🖥️  Backend:    $BACKEND_STATUS"
echo "🌐 Frontend:   $FRONTEND_STATUS"
echo ""

# Show access URLs if services are running
if [[ $FRONTEND_STATUS == *"Running"* ]]; then
    echo "🔗 Access URLs:"
    echo "   Frontend:   http://localhost:3000"
    echo "   Scan Page:  http://localhost:3000/scan"
fi

if [[ $BACKEND_STATUS == *"Running"* ]]; then
    echo "   Backend:    http://localhost:8000"
    echo "   API Docs:   http://localhost:8000/api"
fi

if [[ $BLOCKCHAIN_STATUS == *"Running"* ]]; then
    echo "   Blockchain: http://localhost:8545"
fi

echo ""

# Show logs if available
if [ -d "logs" ]; then
    echo "📝 Recent log entries:"
    echo "----------------------"

    if [ -f "logs/backend.log" ]; then
        echo "Backend (last 3 lines):"
        tail -3 logs/backend.log | sed 's/^/   /'
    fi

    if [ -f "logs/frontend.log" ]; then
        echo "Frontend (last 3 lines):"
        tail -3 logs/frontend.log | sed 's/^/   /'
    fi
fi
