#!/bin/bash

# AgriTrace Quick Setup Script
# This script provides multiple deployment options

set -e

echo "🌾 AgriTrace Agricultural Traceability System"
echo "=============================================="
echo ""
echo "Choose deployment method:"
echo "1. Docker Compose (Recommended for production)"
echo "2. Local Development (Node.js required)"
echo "3. Show system information"
echo ""

read -p "Enter your choice [1-3]: " choice

case $choice in
    1)
        echo ""
        echo "🐳 Starting with Docker Compose..."
        echo ""

        # Check Docker installation
        if ! command -v docker &> /dev/null; then
            echo "❌ Docker not found. Installing Docker..."
            echo "Please install Docker from: https://docs.docker.com/get-docker/"
            exit 1
        fi

        if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
            echo "❌ Docker Compose not found."
            echo "Please install Docker Compose from: https://docs.docker.com/compose/install/"
            exit 1
        fi

        echo "🚀 Building and starting containers..."
        docker-compose up -d --build

        echo ""
        echo "⏳ Waiting for services to be ready..."
        sleep 30

        echo ""
        echo "✅ AgriTrace is now running!"
        echo "📱 Frontend: http://localhost:3000"
        echo "🔗 Backend:  http://localhost:8000"
        echo "⛓️  Blockchain: http://localhost:8545"
        ;;

    2)
        echo ""
        echo "🔧 Setting up local development environment..."
        echo ""

        # Check Node.js
        if ! command -v node &> /dev/null; then
            echo "❌ Node.js not found. Please install Node.js 18+ from: https://nodejs.org/"
            exit 1
        fi

        node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$node_version" -lt 18 ]; then
            echo "❌ Node.js version $node_version found. Please upgrade to Node.js 18+."
            exit 1
        fi

        echo "✅ Node.js $(node -v) found"

        # Start blockchain
        echo "🔗 Starting Hardhat blockchain..."
        cd blockchain/hard-hat
        if [ ! -d "node_modules" ]; then
            echo "📦 Installing blockchain dependencies..."
            npm install
        fi

        echo "⛓️  Starting blockchain network..."
        npx hardhat node --port 8545 &
        BLOCKCHAIN_PID=$!
        sleep 10

        echo "📜 Deploying contracts..."
        npx hardhat run scripts/deploy.ts --network localhost

        cd ../..

        # Start backend
        echo "🚀 Starting backend server..."
        cd blockchain/backend
        if [ ! -d "node_modules" ]; then
            echo "📦 Installing backend dependencies..."
            npm install
        fi

        node server.js &
        BACKEND_PID=$!
        sleep 5

        cd ../..

        # Start frontend
        echo "📱 Starting frontend..."
        cd agritrace-app
        if [ ! -d "node_modules" ]; then
            echo "📦 Installing frontend dependencies..."
            npm install
        fi

        npm run dev &
        FRONTEND_PID=$!

        cd ..

        echo ""
        echo "✅ AgriTrace development server is running!"
        echo "📱 Frontend: http://localhost:3001"
        echo "🔗 Backend:  http://localhost:8000"
        echo "⛓️  Blockchain: http://localhost:8545"
        echo ""
        echo "Press Ctrl+C to stop all services"

        # Wait for interrupt
        trap 'kill $BLOCKCHAIN_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT
        wait
        ;;

    3)
        echo ""
        echo "📊 AgriTrace System Information"
        echo "==============================="
        echo ""
        echo "🏗️ Architecture:"
        echo "   • Frontend: Next.js 14 with TypeScript & Tailwind CSS"
        echo "   • Backend: Express.js with ethers.js blockchain integration"
        echo "   • Blockchain: Hardhat local development network"
        echo ""
        echo "🌾 West Bengal Agricultural Data:"
        echo "   • 3 Farmers across Bardhaman, Hooghly, North 24 Parganas"
        echo "   • 5 Products: Gobindobhog Rice, Bengali Tomatoes, WB Potatoes, Rohu Fish, Bengali Brinjal"
        echo "   • Complete supply chain tracking from farm to consumer"
        echo ""
        echo "🔗 API Endpoints:"
        echo "   • GET /api/farmers - List all farmers"
        echo "   • GET /api/products - List all products"
        echo "   • GET /api/trace/:id - Trace product supply chain"
        echo "   • GET /api/blockchain-trace/:id - Blockchain verification"
        echo "   • GET /api/qr/:id - Generate QR codes"
        echo ""
        echo "🐳 Docker Services:"
        echo "   • agrotrace-frontend (Port 3000)"
        echo "   • agrotrace-backend (Port 8000)"
        echo "   • agrotrace-blockchain (Port 8545)"
        echo ""
        echo "📱 Features:"
        echo "   • Product traceability with QR codes"
        echo "   • Supply chain visualization"
        echo "   • Farmer and product management"
        echo "   • Blockchain verification"
        echo "   • Responsive mobile-first design"
        echo ""
        echo "🚀 Quick Start:"
        echo "   ./setup.sh 1  # Docker deployment"
        echo "   ./setup.sh 2  # Local development"
        ;;

    *)
        echo "❌ Invalid choice. Please run the script again and choose 1, 2, or 3."
        exit 1
        ;;
esac

echo ""
        echo "🎉 Setup complete! Enjoy using AgriTrace!"
