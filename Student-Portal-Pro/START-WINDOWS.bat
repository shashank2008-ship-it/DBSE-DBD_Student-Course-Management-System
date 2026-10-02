@echo off
cd /d "%~dp0"
if not exist server\.env (echo Run SETUP-WINDOWS.bat first. & pause & exit /b 1)
if not exist node_modules (echo Run SETUP-WINDOWS.bat first. & pause & exit /b 1)
echo Open http://localhost:5000 after the server reports that it is ready.
call npm start
pause
