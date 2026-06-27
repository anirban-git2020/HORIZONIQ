@echo off
setlocal EnableExtensions
pushd "%~dp0"

echo.
echo  HorizonIQ — starting dev server...
echo.

REM --- Free port 3000 if a stale dev server is still running ---
echo  Checking port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
ping -n 2 127.0.0.1 >nul

REM --- Ensure dependencies are installed ---
if not exist "node_modules\" (
    echo  Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo.
        echo  npm install failed. Fix errors above and try again.
        popd
        exit /b 1
    )
)

REM --- Clear stale Next.js cache (prevents ENOENT / 500 errors) ---
if exist ".next\" (
    echo  Clearing .next cache...
    rmdir /s /q ".next" 2>nul
)

REM --- Start dev server in a dedicated window on port 3000 ---
start "HorizonIQ Dev Server" cmd /k "cd /d ""%~dp0"" && npm run dev:clean"

echo  Waiting for http://localhost:3000 to respond...
set /a WAIT_COUNT=0

:waitloop
ping -n 3 127.0.0.1 >nul
set /a WAIT_COUNT+=1
if %WAIT_COUNT% GTR 60 (
    echo.
    echo  Timed out after 2 minutes. Check the "HorizonIQ Dev Server" window for errors.
    echo  Try running: npm run dev:clean
    popd
    exit /b 1
)

powershell -NoProfile -Command "$ErrorActionPreference='Stop'; try { $r = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 10; exit [int]($r.StatusCode -ne 200) } catch { exit 1 }" >nul 2>&1
if errorlevel 1 goto waitloop

start "" http://localhost:3000

echo.
echo  Browser opened at http://localhost:3000
echo  Keep the "HorizonIQ Dev Server" window open while you work.
echo.
ping -n 4 127.0.0.1 >nul
popd
exit /b 0
