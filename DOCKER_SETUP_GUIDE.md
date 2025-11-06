# Docker Setup Guide for Windows

This guide will help you install and run Docker on Windows to execute your `docker compose up -d --build` command.

## Prerequisites

1. **Windows 10 64-bit: Pro, Enterprise, or Education (Build 19041 or higher)** OR **Windows 11 64-bit**
2. **WSL 2 feature enabled** (Windows Subsystem for Linux 2)
3. **Hyper-V and Containers Windows features enabled** (for Windows 10 Pro/Enterprise/Education)
4. **64-bit processor with Second Level Address Translation (SLAT)**
5. **At least 4GB RAM**
6. **BIOS-level hardware virtualization support must be enabled in the BIOS settings**

## Step-by-Step Installation

### Step 1: Enable WSL 2 (Windows Subsystem for Linux 2)

1. Open **PowerShell as Administrator** (Right-click Start → Windows PowerShell (Admin))

2. Run the following commands:
   ```powershell
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```

3. **Restart your computer** (required after enabling these features)

4. After restart, open PowerShell as Administrator again and set WSL 2 as default:
   ```powershell
   wsl --set-default-version 2
   ```

### Step 2: Enable Virtualization Features (if using Windows 10 Pro/Enterprise/Education)

1. Open **PowerShell as Administrator**

2. Enable Hyper-V and Containers:
   ```powershell
   Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
   Enable-WindowsOptionalFeature -Online -FeatureName Containers -All
   ```

3. **Restart your computer** if prompted

### Step 3: Download Docker Desktop

1. Go to the official Docker Desktop download page:
   https://www.docker.com/products/docker-desktop/

2. Click **"Download for Windows"**

3. The installer file will be named something like `Docker Desktop Installer.exe`

### Step 4: Install Docker Desktop

1. **Double-click** the downloaded installer file

2. Follow the installation wizard:
   - Accept the license agreement
   - Check the box for **"Use WSL 2 instead of Hyper-V"** (recommended)
   - Click **Install**

3. When installation completes, click **Close and restart**

4. **Restart your computer** if prompted

### Step 5: Start Docker Desktop

1. After restart, look for **Docker Desktop** in your Start menu

2. **Launch Docker Desktop** (it may take a minute to start)

3. You may see a prompt asking to accept the terms of service - click **Accept**

4. Docker Desktop will initialize - wait until you see **"Docker Desktop is running"** in the system tray (bottom-right corner)

5. The Docker Desktop window should show **"Docker Desktop is running"** with a green indicator

### Step 6: Verify Docker Installation

1. Open **PowerShell** (regular or as Administrator)

2. Verify Docker is installed and running:
   ```powershell
   docker --version
   ```
   You should see something like: `Docker version 24.x.x, build xxxxx`

3. Verify Docker Compose is available:
   ```powershell
   docker compose version
   ```
   You should see something like: `Docker Compose version v2.x.x`

4. Test Docker with a simple command:
   ```powershell
   docker run hello-world
   ```
   This should download and run a test container successfully

### Step 7: Run Your Docker Compose Command

1. **Navigate to your project directory**:
   ```powershell
   cd C:\Users\Zuhair\OneDrive\Desktop\BlueForce\BlueForce
   ```

2. **Run the Docker Compose command**:
   ```powershell
   docker compose up -d --build
   ```

3. This command will:
   - `up` - Start all services defined in docker-compose.yml
   - `-d` - Run in detached mode (background)
   - `--build` - Build images before starting containers

4. The first time will take several minutes as it:
   - Builds all your service images
   - Downloads base images (MySQL, Kafka, Zookeeper, etc.)
   - Starts all containers

### Step 8: Check Container Status

1. View running containers:
   ```powershell
   docker compose ps
   ```

2. View logs for all services:
   ```powershell
   docker compose logs
   ```

3. View logs for a specific service:
   ```powershell
   docker compose logs [service-name]
   ```
   Example: `docker compose logs eureka-server`

## Troubleshooting

### Issue: "docker: command not found" after installation

**Solution:**
- Make sure Docker Desktop is running (check system tray)
- Restart PowerShell after installing Docker Desktop
- Restart your computer if needed
- Verify Docker Desktop is installed: Check Start menu → Docker Desktop

### Issue: "WSL 2 installation is incomplete"

**Solution:**
1. Download the WSL 2 Linux kernel update package:
   https://aka.ms/wsl2kernel
2. Run the installer
3. Restart Docker Desktop

### Issue: "Docker Desktop won't start"

**Solution:**
1. Ensure virtualization is enabled in BIOS
2. Check Windows Features: Control Panel → Programs → Turn Windows features on/off
   - Ensure "Virtual Machine Platform" and "Windows Subsystem for Linux" are checked
3. Restart your computer
4. Try running Docker Desktop as Administrator

### Issue: "Port already in use" errors

**Solution:**
- Stop other services using the same ports (MySQL on 3306, etc.)
- Or modify port mappings in `docker-compose.yml`

### Issue: Containers keep restarting

**Solution:**
1. Check logs: `docker compose logs [service-name]`
2. Ensure all dependencies are running (MySQL, Eureka, Kafka, etc.)
3. Check if services are waiting for dependencies to be ready

## Useful Docker Commands

```powershell
# Stop all containers
docker compose down

# Stop and remove volumes
docker compose down -v

# View running containers
docker compose ps

# View all containers (including stopped)
docker compose ps -a

# View logs
docker compose logs -f

# Restart a specific service
docker compose restart [service-name]

# Rebuild and restart a specific service
docker compose up -d --build [service-name]

# Remove all containers and rebuild
docker compose down
docker compose up -d --build
```

## Your Application Services

Your docker-compose.yml includes these services:
- **MySQL** (Port 3306) - Database
- **Zookeeper** (Port 2181) - Kafka coordination
- **Kafka** (Port 9092) - Message broker
- **Eureka Server** (Port 8761) - Service discovery
- **API Gateway** (Port 9090) - Main entry point
- **Auth Service** (Port 8081) - Authentication
- **User Service** (Port 8082)
- **Event Service** (Port 8083)
- **Leaderboard Service** (Port 8087)
- **Badge Service** (Port 8088)
- **Notification Service** (Port 8089)
- **Media Service** (Port 8090)
- **NGO Service** (Port 8091)
- **Analytics Service** (Port 8092)
- **Certificate Service** (Port 8093)
- **Feedback Service** (Port 8094)
- **Eco Tips Service** (Port 8095)
- **Storyboard Service** (Port 8096)
- **Chat Service** (Port 8097)
- **Frontend** (Port 80) - Web interface

## Next Steps

After successfully running `docker compose up -d --build`:
1. Wait for all services to start (check with `docker compose ps`)
2. Access Eureka Dashboard: http://localhost:8761
3. Access Frontend: http://localhost
4. Access API Gateway: http://localhost:9090

Good luck! 🐳

