@echo off
title CocheMotor - Servidor Local
cd /d "%~dp0"
echo ===================================================
echo   INICIANDO SERVIDOR LOCAL DE COCHEMOTOR
echo ===================================================
echo.
echo URL Local: http://localhost:8000/index.html
echo Hub SaaS:  http://localhost:8000/hub.html
echo.
echo Abriendo navegador automaticamente...
start http://localhost:8000/index.html
python local-broker\server.py
pause
