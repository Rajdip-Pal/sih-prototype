#!/bin/bash

# AgriTrace Docker Startup Script
# This script starts the entire AgriTrace system with Docker Compose

set -e

echo "🌾 AgriTrace - Agricultural Supply Chain Traceability System"
echo "============================================================"
echo ""

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Function to check if services are healthy
check_health() {
    echo "🏥 Checking service health..."

    # Wait for blockchain to be ready
    echo "   Waiting for blockchain network..."
    timeout 120 bash -c 'until curl -s http://localhost:8545 > /dev/null; do sleep 2; done' || {
        echo "❌ Blockchain network failed to start"
        exit 1
    }

    # Wait for backend to be ready
    echo "   Waiting for backend API..."
    timeout 60 bash -c 'until curl -s http://localhost:8000/api/products > /dev/null; do sleep 2; done' || {
        echo "❌ Backend API failed to start"
        exit 1
    }

    # Wait for frontend to be ready
    echo "   Waiting for frontend..."
    timeout 60 bash -c 'until curl -s http://localhost:3000 > /dev/null; do sleep 2; done' || {
        echo "❌ Frontend failed to start"
        exit 1
    }

    echo "✅ All services are healthy!"
}

# Function to show service URLs
show_urls() {
    echo ""
    echo "🚀 AgriTrace System is now running!"
    echo "=================================="
    echo ""
    echo "📱 Frontend Application:  http://localhost:3000"
    echo "🔗 Backend API:          http://localhost:8000"
    echo "⛓️  Blockchain Network:    http://localhost:8545"
    echo ""
    echo "🔍 API Endpoints:"
    echo "   • Products:           http://localhost:8000/api/products"
    echo "   • Farmers:            http://localhost:8000/api/farmers"
    echo "   • Trace Product:      http://localhost:8000/api/trace/P001"
    echo "   • QR Code:            http://localhost:8000/api/qr/P001"
    echo ""
    echo "🌾 Sample West Bengal Products:"
    echo "   • P001 - Organic Gobindobhog Rice"
    echo "   • P002 - Fresh Bengali Tomatoes"
    echo "   • P003 - West Bengal Potatoes"
    echo "   • P004 - Fresh Water Rohu Fish"
    echo "   • P005 - Bengali Brinjal"
    echo ""
    echo "📋 To stop the system: docker compose down"
    echo "🔄 To restart:        docker compose restart"
    echo "📊 To view logs:      docker compose logs -f"
}

# Parse command line arguments
COMMAND=${1:-"up"}

case $COMMAND in
    "up"|"start")
        echo "🚀 Starting AgriTrace system..."
        echo ""

        # Build and start services
        docker compose up -d --build

        # Check health
        check_health

        # Show URLs
        show_urls
        ;;

    "down"|"stop")
        echo "🛑 Stopping AgriTrace system..."
        docker compose down
        echo "✅ System stopped"
        ;;

    "restart")
        echo "🔄 Restarting AgriTrace system..."
        docker compose down
        docker compose up -d --build
        check_health
        show_urls
        ;;

    "logs")
        echo "📊 Showing system logs..."
        docker compose logs -f
        ;;

    "status")
        echo "📊 System Status:"
        docker compose ps
        ;;

    "clean")
        echo "🧹 Cleaning up Docker resources..."
        docker compose down -v --remove-orphans
        docker system prune -f
        echo "✅ Cleanup complete"
        ;;

    *)
        echo "Usage: $0 [up|down|restart|logs|status|clean]"
        echo ""
        echo "Commands:"
        echo "  up/start  - Start the AgriTrace system (default)"
        echo "  down/stop - Stop the AgriTrace system"
        echo "  restart   - Restart the AgriTrace system"
        echo "  logs      - View system logs"
        echo "  status    - Show service status"
        echo "  clean     - Clean up Docker resources"
        exit 1
        ;;
esac
