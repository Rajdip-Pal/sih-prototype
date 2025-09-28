@echo off
REM AgriTrace Windows Startup Script
REM This script starts the entire AgriTrace system with Docker Desktop on Windows

setlocal enabledelayedexpansion

echo.
echo 🌾 AgriTrace - Agricultural Supply Chain Traceability System
echo ============================================================
echo.

REM Check if Docker Desktop is running
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed or not running
    echo    Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/
    echo    Make sure Docker Desktop is running before using this script
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not available
    echo    Please make sure you have Docker Desktop with Compose support
    pause
    exit /b 1
)

REM Parse command line arguments
set COMMAND=%1
if "%COMMAND%"=="" set COMMAND=up

if /i "%COMMAND%"=="up" goto :start
if /i "%COMMAND%"=="start" goto :start
if /i "%COMMAND%"=="down" goto :stop
if /i "%COMMAND%"=="stop" goto :stop
if /i "%COMMAND%"=="restart" goto :restart
if /i "%COMMAND%"=="logs" goto :logs
if /i "%COMMAND%"=="status" goto :status
if /i "%COMMAND%"=="clean" goto :clean
goto :help

:start
echo 🚀 Starting AgriTrace system...
echo.

REM Use Windows-optimized docker-compose file
if exist docker-compose.windows.yml (
    docker compose -f docker-compose.windows.yml up -d --build
) else (
    docker compose up -d --build
)

if %errorlevel% neq 0 (
    echo ❌ Failed to start services
    pause
    exit /b 1
)

echo.
echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Check if services are running
call :check_health

echo.
echo ✅ AgriTrace is now running!
echo ==================================
echo.
echo 📱 Frontend Application:  http://localhost:3000
echo 🔗 Backend API:          http://localhost:8000
echo ⛓️  Blockchain Network:    http://localhost:8545
echo.
echo 🔍 API Endpoints:
echo    • Products:           http://localhost:8000/api/products
echo    • Farmers:            http://localhost:8000/api/farmers
echo    • Trace Product:      http://localhost:8000/api/trace/P001
echo    • QR Code:            http://localhost:8000/api/qr/P001
echo.
echo 🌾 Sample West Bengal Products:
echo    • P001 - Organic Gobindobhog Rice
echo    • P002 - Fresh Bengali Tomatoes
echo    • P003 - West Bengal Potatoes
echo    • P004 - Fresh Water Rohu Fish
echo    • P005 - Bengali Brinjal
echo.
echo 📋 Management Commands:
echo    agritrace.bat down    - Stop the system
echo    agritrace.bat restart - Restart the system
echo    agritrace.bat logs    - View logs
echo    agritrace.bat status  - Check status
echo.
pause
goto :end

:stop
echo 🛑 Stopping AgriTrace system...
if exist docker-compose.windows.yml (
    docker compose -f docker-compose.windows.yml down
) else (
    docker compose down
)
echo ✅ System stopped
pause
goto :end

:restart
echo 🔄 Restarting AgriTrace system...
if exist docker-compose.windows.yml (
    docker compose -f docker-compose.windows.yml down
    docker compose -f docker-compose.windows.yml up -d --build
) else (
    docker compose down
    docker compose up -d --build
)
call :check_health
echo ✅ System restarted
pause
goto :end

:logs
echo 📊 Showing system logs...
if exist docker-compose.windows.yml (
    docker compose -f docker-compose.windows.yml logs -f
) else (
    docker compose logs -f
)
goto :end

:status
echo 📊 System Status:
if exist docker-compose.windows.yml (
    docker compose -f docker-compose.windows.yml ps
) else (
    docker compose ps
)
pause
goto :end

:clean
echo 🧹 Cleaning up Docker resources...
if exist docker-compose.windows.yml (
    docker compose -f docker-compose.windows.yml down -v --remove-orphans
) else (
    docker compose down -v --remove-orphans
)
docker system prune -f
echo ✅ Cleanup complete
pause
goto :end

:help
echo Usage: agritrace.bat [command]
echo.
echo Commands:
echo   up/start  - Start the AgriTrace system (default)
echo   down/stop - Stop the AgriTrace system
echo   restart   - Restart the AgriTrace system
echo   logs      - View system logs
echo   status    - Show service status
echo   clean     - Clean up Docker resources
echo.
pause
goto :end

:check_health
echo 🏥 Checking service health...

REM Wait for services with timeout
set /a timeout=120
set /a counter=0

:wait_blockchain
curl -s http://localhost:8545 >nul 2>&1
if %errorlevel% equ 0 goto :blockchain_ready
set /a counter+=2
if %counter% geq %timeout% (
    echo ❌ Blockchain network failed to start
    goto :end
)
timeout /t 2 /nobreak >nul
goto :wait_blockchain

:blockchain_ready
echo    ✅ Blockchain network is ready

set /a counter=0
:wait_backend
curl -s http://localhost:8000/api/products >nul 2>&1
if %errorlevel% equ 0 goto :backend_ready
set /a counter+=2
if %counter% geq 60 (
    echo ❌ Backend API failed to start
    goto :end
)
timeout /t 2 /nobreak >nul
goto :wait_backend

:backend_ready
echo    ✅ Backend API is ready

set /a counter=0
:wait_frontend
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 goto :frontend_ready
set /a counter+=2
if %counter% geq 60 (
    echo ❌ Frontend failed to start
    goto :end
)
timeout /t 2 /nobreak >nul
goto :wait_frontend

:frontend_ready
echo    ✅ Frontend is ready
echo ✅ All services are healthy!
goto :eof

:end
endlocal
