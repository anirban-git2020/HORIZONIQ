@echo off
setlocal
pushd "%~dp0"

echo.
echo  HorizonIQ — starting dev server...
echo.

start "HorizonIQ Dev Server" cmd /k "pushd "%~dp0" && npm run dev"

echo  Waiting for http://localhost:3000 ...
:waitloop
timeout /t 1 /nobreak >nul
netstat -an | find ":3000" | find "LISTENING" >nul
if errorlevel 1 goto waitloop

start "" http://localhost:3000

echo  Browser opened.
echo  Keep the "HorizonIQ Dev Server" window open while you work.
echo.
timeout /t 3 >nul
popd
exit /b 0
