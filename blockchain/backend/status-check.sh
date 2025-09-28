#!/bin/bash

echo "🌾 AgroTrace System Status Check"
echo "================================"

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is running on http://localhost:3000"
else
    echo "❌ Server is not responding"
    exit 1
fi

# Check blockchain connection
if curl -s http://localhost:3000/fullchain > /dev/null; then
    echo "✅ Blockchain connection working"
else
    echo "❌ Blockchain connection failed"
fi

# Check API endpoints
echo "🔍 Testing API endpoints..."

# Test farmers endpoint
FARMERS=$(curl -s http://localhost:3000/api/farmers | grep -o '"count":[0-9]\+' | cut -d: -f2)
echo "👨‍🌾 Farmers in system: $FARMERS"

# Test products endpoint
PRODUCTS=$(curl -s http://localhost:3000/api/products | grep -o '"count":[0-9]\+' | cut -d: -f2)
echo "🥕 Products in system: $PRODUCTS"

# Test traceability
TRACE_RESULT=$(curl -s http://localhost:3000/api/trace/P001 | grep -o '"success":true')
if [ "$TRACE_RESULT" = '"success":true' ]; then
    echo "🔍 Product traceability: ✅ Working"
else
    echo "🔍 Product traceability: ❌ Failed"
fi

echo ""
echo "🎮 Demo Interface: http://localhost:3000/demo"
echo "📊 Dashboard Stats: http://localhost:3000/api/dashboard/stats"
echo "📋 API Docs: http://localhost:3000"
echo ""
echo "🌟 AgroTrace is ready for your agricultural supply chain demo!"
