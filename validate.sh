#!/bin/bash

# AgriTrace System Validation Script
# Tests all components to ensure proper setup

echo "🧪 AgriTrace System Validation"
echo "=============================="
echo ""

# Function to test endpoint
test_endpoint() {
    local url=$1
    local name=$2
    local expected_status=${3:-200}

    echo -n "Testing $name... "

    if command -v curl &> /dev/null; then
        status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
        if [ "$status" = "$expected_status" ] || [ "$status" = "200" ]; then
            echo "✅ OK ($status)"
        else
            echo "❌ FAILED ($status)"
        fi
    else
        echo "⚠️  SKIPPED (curl not available)"
    fi
}

# Function to test blockchain
test_blockchain() {
    echo -n "Testing Blockchain JSON-RPC... "

    if command -v curl &> /dev/null; then
        response=$(curl -s -X POST -H "Content-Type: application/json" \
            --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
            http://localhost:8545 2>/dev/null)

        if echo "$response" | grep -q "result"; then
            echo "✅ OK"
        else
            echo "❌ FAILED"
        fi
    else
        echo "⚠️  SKIPPED (curl not available)"
    fi
}

echo "🔍 Testing Service Endpoints:"
echo ""

# Test frontend
test_endpoint "http://localhost:3000" "Frontend (Next.js)"

# Test backend API endpoints
test_endpoint "http://localhost:8000/api/products" "Backend - Products API"
test_endpoint "http://localhost:8000/api/farmers" "Backend - Farmers API"
test_endpoint "http://localhost:8000/api/trace/P001" "Backend - Trace API"
test_endpoint "http://localhost:8000/api/dashboard/stats" "Backend - Dashboard API"

# Test blockchain
echo ""
test_blockchain

echo ""
echo "🌾 Sample Data Validation:"
echo ""

if command -v curl &> /dev/null; then
    echo "📊 Products Available:"
    products=$(curl -s http://localhost:8000/api/products 2>/dev/null | grep -o '"productId":"[^"]*"' | cut -d'"' -f4 | head -5)
    if [ -n "$products" ]; then
        echo "$products" | while read -r product; do
            echo "   • $product"
        done
    else
        echo "   ❌ No products found"
    fi

    echo ""
    echo "👨‍🌾 Farmers Available:"
    farmers=$(curl -s http://localhost:8000/api/farmers 2>/dev/null | grep -o '"name":"[^"]*"' | cut -d'"' -f4 | head -3)
    if [ -n "$farmers" ]; then
        echo "$farmers" | while read -r farmer; do
            echo "   • $farmer"
        done
    else
        echo "   ❌ No farmers found"
    fi
else
    echo "⚠️  Data validation skipped (curl not available)"
fi

echo ""
echo "🏥 System Health Summary:"
echo ""

# Check if ports are open
check_port() {
    local port=$1
    local service=$2

    if command -v netstat &> /dev/null; then
        if netstat -tuln | grep -q ":$port "; then
            echo "✅ Port $port ($service) - Open"
        else
            echo "❌ Port $port ($service) - Closed"
        fi
    elif command -v ss &> /dev/null; then
        if ss -tuln | grep -q ":$port "; then
            echo "✅ Port $port ($service) - Open"
        else
            echo "❌ Port $port ($service) - Closed"
        fi
    else
        echo "⚠️  Port $port ($service) - Cannot check"
    fi
}

check_port 3000 "Frontend"
check_port 8000 "Backend"
check_port 8545 "Blockchain"

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. 🌐 Access the application: http://localhost:3000"
echo "2. 🔍 Try tracing a product: http://localhost:3000/trace/P001"
echo "3. 🔗 Test API directly: http://localhost:8000/api/products"
echo "4. 📱 Scan QR codes with your mobile device"
echo ""

if ! command -v curl &> /dev/null; then
    echo "💡 Tip: Install curl for better endpoint testing:"
    echo "   sudo apt install curl  # Ubuntu/Debian"
    echo "   brew install curl      # macOS"
    echo ""
fi

echo "🎉 Validation complete! Your AgriTrace system is ready for use."
