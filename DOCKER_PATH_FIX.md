# Fix "Docker Not Recognized" Issue

Since Docker Desktop is installed and running, but PowerShell can't find the `docker` command, the issue is that Docker is not in your PATH environment variable.

## Quick Fix (Temporary - Current Session Only)

Run this command in your current PowerShell session:

```powershell
$env:Path += ";C:\Program Files\Docker\Docker\resources\bin"
```

Then test:
```powershell
docker --version
```

**Note:** This only works for the current PowerShell session. Close and reopen PowerShell, and you'll need to run it again.

## Permanent Fix (Recommended)

### Method 1: Automatic Fix Script

1. **Run the fix script** (no admin required for user PATH):
   ```powershell
   .\fix-docker-path.ps1
   ```

2. **Close and reopen PowerShell** (or restart your computer)

3. **Test Docker**:
   ```powershell
   docker --version
   ```

### Method 2: Manual Fix via Windows Settings

1. **Open System Properties**:
   - Press `Win + X` and select **System**
   - Or: Right-click **This PC** → **Properties** → **Advanced system settings**

2. **Open Environment Variables**:
   - Click **Environment Variables...** button

3. **Edit User PATH**:
   - Under **User variables**, select **Path** and click **Edit**
   - Click **New** and add: `C:\Program Files\Docker\Docker\resources\bin`
   - Click **OK** on all dialogs

4. **Restart PowerShell** (or restart your computer)

### Method 3: Add via PowerShell (User PATH - No Admin Required)

Run these commands in PowerShell:

```powershell
$dockerPath = "C:\Program Files\Docker\Docker\resources\bin"
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
$newPath = "$currentPath;$dockerPath"
[Environment]::SetEnvironmentVariable("Path", $newPath, "User")
```

Then **close and reopen PowerShell**.

### Method 4: Add via PowerShell (System PATH - Requires Admin)

1. **Open PowerShell as Administrator** (Right-click → Run as Administrator)

2. Run these commands:
   ```powershell
   $dockerPath = "C:\Program Files\Docker\Docker\resources\bin"
   $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
   $newPath = "$currentPath;$dockerPath"
   [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
   ```

3. **Restart PowerShell** or your computer

## Verify the Fix

After applying any of the above methods:

1. **Close and reopen PowerShell** (important!)

2. **Test Docker**:
   ```powershell
   docker --version
   ```
   Should show: `Docker version 24.0.5, build ced0996`

3. **Test Docker Compose**:
   ```powershell
   docker compose version
   ```

4. **Navigate to your project and run**:
   ```powershell
   cd C:\Users\Zuhair\OneDrive\Desktop\BlueForce\BlueForce
   docker compose up -d --build
   ```

## Why This Happens

Docker Desktop typically adds itself to PATH during installation, but sometimes:
- The PATH wasn't updated during installation
- PowerShell was already open when Docker was installed
- Windows PATH refresh didn't occur
- User permissions prevented PATH modification

## Still Not Working?

If Docker still isn't recognized after trying the above:

1. **Restart Docker Desktop**:
   - Right-click Docker Desktop icon in system tray → **Quit Docker Desktop**
   - Launch Docker Desktop again from Start menu

2. **Restart your computer** (this ensures PATH is fully refreshed)

3. **Check if Docker Desktop is actually running**:
   - Look for the Docker whale icon in your system tray (bottom-right)
   - It should show "Docker Desktop is running" when you hover

4. **Verify Docker installation location**:
   ```powershell
   Test-Path "C:\Program Files\Docker\Docker\resources\bin\docker.exe"
   ```
   Should return `True`

5. **Try running Docker directly**:
   ```powershell
   & "C:\Program Files\Docker\Docker\resources\bin\docker.exe" --version
   ```
   If this works, it confirms Docker is installed but just not in PATH.

## Quick Reference Commands

```powershell
# Temporary fix (current session only)
$env:Path += ";C:\Program Files\Docker\Docker\resources\bin"

# Check if Docker is in PATH
$env:PATH -split ';' | Select-String -Pattern "Docker"

# Test Docker directly (bypasses PATH)
& "C:\Program Files\Docker\Docker\resources\bin\docker.exe" --version

# View current PATH
$env:Path
```

Good luck! 🐳

