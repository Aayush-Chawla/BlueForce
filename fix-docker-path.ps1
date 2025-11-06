# Fix Docker PATH Issue
# Run this script as Administrator to add Docker to your PATH permanently

Write-Host "Checking Docker installation..." -ForegroundColor Cyan

$dockerPath = "C:\Program Files\Docker\Docker\resources\bin"
$dockerExe = Join-Path $dockerPath "docker.exe"

if (Test-Path $dockerExe) {
    Write-Host "✓ Docker found at: $dockerPath" -ForegroundColor Green
    
    # Check if Docker is already in PATH
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    $fullPath = "$currentPath;$machinePath"
    
    if ($fullPath -notlike "*$dockerPath*") {
        Write-Host "`nDocker is NOT in your PATH. Adding it now..." -ForegroundColor Yellow
        
        # Add to User PATH (doesn't require admin)
        $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
        if ($userPath -notlike "*$dockerPath*") {
            $newUserPath = "$userPath;$dockerPath"
            [Environment]::SetEnvironmentVariable("Path", $newUserPath, "User")
            Write-Host "✓ Added Docker to User PATH" -ForegroundColor Green
        }
        
        # Also add to Machine PATH if running as admin
        $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
        if ($isAdmin) {
            $machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
            if ($machinePath -notlike "*$dockerPath*") {
                $newMachinePath = "$machinePath;$dockerPath"
                [Environment]::SetEnvironmentVariable("Path", $newMachinePath, "Machine")
                Write-Host "✓ Added Docker to System PATH" -ForegroundColor Green
            }
        } else {
            Write-Host "`nNote: Run PowerShell as Administrator to add Docker to System PATH" -ForegroundColor Yellow
        }
        
        Write-Host "`n✓ PATH updated successfully!" -ForegroundColor Green
        Write-Host "`nIMPORTANT: Close and reopen PowerShell for changes to take effect." -ForegroundColor Yellow
        Write-Host "Or run this command in your current session:" -ForegroundColor Yellow
        Write-Host '$env:Path += ";C:\Program Files\Docker\Docker\resources\bin"' -ForegroundColor Cyan
        
    } else {
        Write-Host "✓ Docker is already in your PATH!" -ForegroundColor Green
        Write-Host "If you still see 'docker not recognized', try:" -ForegroundColor Yellow
        Write-Host "1. Close and reopen PowerShell" -ForegroundColor Yellow
        Write-Host "2. Restart your computer" -ForegroundColor Yellow
        Write-Host "3. Restart Docker Desktop" -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ Docker not found at expected location: $dockerPath" -ForegroundColor Red
    Write-Host "Please check your Docker Desktop installation." -ForegroundColor Red
}

Write-Host "`nTesting Docker command..." -ForegroundColor Cyan
& $dockerExe --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Docker is working correctly!" -ForegroundColor Green
}

