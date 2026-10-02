@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (echo Install Node.js 20 or later first. & pause & exit /b 1)
call npm install
if errorlevel 1 (pause & exit /b 1)
call npm --prefix server install
if errorlevel 1 (pause & exit /b 1)
call npm run setup
if errorlevel 1 (pause & exit /b 1)
echo Ready. Double-click START-WINDOWS.bat.
pause
