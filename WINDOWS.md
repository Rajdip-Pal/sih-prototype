# 🪟 AgriTrace Windows Installation Guide

This guide provides step-by-step instructions for setting up and running AgriTrace on Windows systems using Docker Desktop.

## 📋 Prerequisites for Windows

### System Requirements
- **Operating System**: Windows 10 version 2004+ (Build 19041+) or Windows 11
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: Minimum 10GB free space
- **Processor**: 64-bit processor with Second Level Address Translation (SLAT)
- **Virtualization**: Hardware virtualization support enabled in BIOS

### Required Software

#### 1. Docker Desktop for Windows
- **Download**: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Version**: Latest stable version (4.0+)
- **Features Required**:
  - WSL 2 backend (recommended)
  - Compose V2 support
  - Container resource management

#### 2. Windows Subsystem for Linux 2 (WSL2) - Recommended
```powershell
# Run in PowerShell as Administrator
wsl --install
wsl --set-default-version 2
```

#### 3. Git for Windows (Optional)
- **Download**: [Git for Windows](https://git-scm.com/download/win)
- **Purpose**: Clone repository and version control

## 🚀 Quick Installation

### Option 1: One-Click Windows Setup
1. **Download the project**:
   ```cmd
   git clone <repository-url>
   cd sih-prototype
   ```

2. **Run Windows startup script**:
   ```cmd
   agritrace.bat
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Blockchain: http://localhost:8545

### Option 2: Manual Docker Setup
1. **Start Docker Desktop** and ensure it's running

2. **Open Command Prompt or PowerShell** in the project directory

3. **Run Docker Compose**:
   ```cmd
   docker compose -f docker-compose.windows.yml up -d --build
   ```

4. **Verify services**:
   ```cmd
   docker compose ps
   ```

## 🔧 Detailed Setup Process

### Step 1: Docker Desktop Installation
1. **Download Docker Desktop** from the official website
2. **Run the installer** as Administrator
3. **During installation**:
   - ✅ Enable WSL 2 backend
   - ✅ Add Docker to PATH
   - ✅ Create desktop shortcut
4. **Restart computer** when prompted
5. **Start Docker Desktop** and complete initial setup

### Step 2: Docker Desktop Configuration
Open Docker Desktop settings and configure:

#### General Settings
- ✅ Use WSL 2 based engine
- ✅ Start Docker Desktop when you log in
- ✅ Send usage statistics (optional)

#### Resources - WSL Integration
- ✅ Enable integration with my default WSL distro
- ✅ Enable integration with additional distros (if any)

#### Resources - Advanced
```
CPUs: 4 (or half of your available cores)
Memory: 4 GB (or 50% of your RAM)
Swap: 1 GB
Disk image size: 64 GB
```

### Step 3: Download AgriTrace
#### Using Git (Recommended)
```cmd
git clone <repository-url>
cd sih-prototype
```

#### Using ZIP Download
1. Download ZIP from GitHub
2. Extract to desired folder
3. Open Command Prompt in extracted folder

### Step 4: Windows-Specific Files
The project includes Windows-optimized configurations:

#### `docker-compose.windows.yml`
- Platform specification: `linux/amd64`
- Windows volume mounting compatibility
- Health checks optimized for Windows networking

#### `agritrace.bat`
- Native Windows batch script
- Automated service management
- Windows-specific error handling
- Color-coded output for better visibility

### Step 5: Launch AgriTrace
#### Using Windows Batch Script
```cmd
# Start system
agritrace.bat up

# Stop system
agritrace.bat down

# Restart system
agritrace.bat restart

# View logs
agritrace.bat logs

# Check status
agritrace.bat status

# Clean up
agritrace.bat clean
```

#### Using Docker Compose Directly
```cmd
# Start with Windows-optimized config
docker compose -f docker-compose.windows.yml up -d --build

# Check status
docker compose -f docker-compose.windows.yml ps

# View logs
docker compose -f docker-compose.windows.yml logs -f

# Stop services
docker compose -f docker-compose.windows.yml down
```

## 🔍 Verification Steps

### 1. Check Docker Installation
```cmd
docker --version
docker compose version
```
Expected output:
```
Docker version 24.0.x
Docker Compose version v2.x.x
```

### 2. Verify Services
```cmd
# Check running containers
docker ps

# Test frontend
curl http://localhost:3000

# Test backend API
curl http://localhost:8000/api/products

# Test blockchain
curl -X POST -H "Content-Type: application/json" --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_blockNumber\",\"params\":[],\"id\":1}" http://localhost:8545
```

### 3. Access Web Interfaces
- **Frontend Application**: http://localhost:3000
- **API Documentation**: http://localhost:8000
- **Sample Product Trace**: http://localhost:3000/trace/P001

## 🛠️ Windows-Specific Troubleshooting

### Common Issues and Solutions

#### 1. Docker Desktop Won't Start
**Problem**: Docker Desktop fails to start or shows "Docker Desktop stopped"

**Solutions**:
```cmd
# Restart Docker service
net stop com.docker.service
net start com.docker.service

# Reset Docker Desktop
"C:\Program Files\Docker\Docker\Docker Desktop.exe" --reset-to-factory-defaults

# Check WSL status
wsl --list --verbose
wsl --set-default-version 2
```

#### 2. Port Already in Use
**Problem**: Ports 3000, 8000, or 8545 are occupied

**Solutions**:
```cmd
# Find processes using ports
netstat -ano | findstr :3000
netstat -ano | findstr :8000
netstat -ano | findstr :8545

# Kill specific process (replace PID)
taskkill /PID <process_id> /F

# Alternative: Use different ports
# Edit docker-compose.windows.yml to change port mappings
```

#### 3. Volume Mount Issues
**Problem**: File changes not reflecting in containers

**Solutions**:
- Enable "Shared Drives" in Docker Desktop settings
- Add project folder to Docker Desktop file sharing
- Use PowerShell instead of Command Prompt
- Check Windows Defender exclusions

#### 4. WSL 2 Integration Issues
**Problem**: Containers fail to start with WSL errors

**Solutions**:
```cmd
# Update WSL
wsl --update

# Restart WSL
wsl --shutdown
wsl

# Reset WSL integration in Docker Desktop
# Settings -> Resources -> WSL Integration -> Reset
```

#### 5. Firewall and Antivirus
**Problem**: Network connectivity issues between containers

**Solutions**:
- Add Docker Desktop to Windows Firewall exceptions
- Add Docker Desktop to antivirus exclusions
- Temporarily disable Windows Defender Real-time protection during setup

### Performance Optimization for Windows

#### 1. Resource Allocation
```cmd
# Increase Docker Desktop resources
# Settings -> Resources -> Advanced
# Memory: 6-8 GB (if available)
# CPUs: 4-6 cores
# Disk: Enable VirtioFS for better file sharing performance
```

#### 2. File System Performance
- Use WSL 2 for better file system performance
- Store project files in WSL 2 filesystem (`\\wsl$\Ubuntu\home\username\`)
- Avoid deep folder nesting on Windows filesystem

#### 3. Network Performance
```cmd
# Use Docker internal networking
# Avoid localhost references in inter-service communication
# Use service names (blockchain, backend, frontend) instead
```

## 🎯 Windows Development Workflow

### 1. Development Setup
```cmd
# Clone to WSL filesystem for better performance
wsl
cd ~
git clone <repository-url>
cd sih-prototype

# Start services
./agritrace.bat
```

### 2. Code Editing
- **VS Code**: Install WSL extension for seamless editing
- **JetBrains IDEs**: Enable WSL toolchain
- **File Access**: Use `\\wsl$\<distro>\home\username\sih-prototype`

### 3. Debugging
```cmd
# View detailed logs
agritrace.bat logs

# Access container shell
docker exec -it agritrace-frontend /bin/sh
docker exec -it agritrace-backend /bin/sh

# Monitor resource usage
docker stats
```

## 📱 Mobile Testing on Windows

### Local Network Access
1. **Find Windows IP address**:
   ```cmd
   ipconfig | findstr IPv4
   ```

2. **Update frontend environment**:
   ```env
   NEXT_PUBLIC_API_URL=http://192.168.1.100:8000
   ```

3. **Allow Windows Firewall**:
   - Add inbound rules for ports 3000, 8000, 8545
   - Enable Docker Desktop network profile

4. **Test from mobile device**:
   - Connect to same WiFi network
   - Access `http://192.168.1.100:3000`

## 🔄 Updates and Maintenance

### Regular Updates
```cmd
# Pull latest changes
git pull origin main

# Rebuild containers
agritrace.bat clean
agritrace.bat up

# Update Docker Desktop
# Settings -> Software Updates -> Check for updates
```

### Backup and Restore
```cmd
# Backup volumes
docker run --rm -v agritrace_blockchain_data:/data -v %cd%:/backup busybox tar czf /backup/blockchain-backup.tar.gz -C /data .

# Restore volumes
docker run --rm -v agritrace_blockchain_data:/data -v %cd%:/backup busybox tar xzf /backup/blockchain-backup.tar.gz -C /data
```

## 🆘 Support and Resources

### Windows-Specific Help
- **Docker Desktop Documentation**: https://docs.docker.com/desktop/windows/
- **WSL 2 Setup Guide**: https://docs.microsoft.com/en-us/windows/wsl/install
- **Windows Container Troubleshooting**: https://docs.docker.com/desktop/troubleshoot/

### AgriTrace Support
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check inline code comments
- **Community**: Join our Discord server for help

### Performance Monitoring
```cmd
# System resource usage
wmic computersystem get TotalPhysicalMemory
wmic cpu get loadpercentage /value

# Docker resource usage
docker system df
docker system events

# Container health
docker compose -f docker-compose.windows.yml ps
```

---

## ✅ Quick Checklist for Windows Users

- [ ] Windows 10/11 with latest updates
- [ ] Docker Desktop installed and running
- [ ] WSL 2 enabled and configured
- [ ] Git for Windows installed (optional)
- [ ] Project downloaded/cloned
- [ ] Firewall exceptions added
- [ ] `agritrace.bat` executed successfully
- [ ] All services accessible via browser
- [ ] Mobile testing configured (optional)

**🎉 Congratulations!** Your AgriTrace system is now running on Windows. Access the application at http://localhost:3000 and start exploring agricultural traceability features!

---

*AgriTrace Windows Guide - Bringing transparent agriculture to Windows users worldwide* 🌾🪟
