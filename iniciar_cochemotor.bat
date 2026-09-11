@echo off
chcp 65001 >nul
title CocheMotor - Servidor Local
cd /d "%~dp0"
echo ===================================================
echo   INICIANDO SERVIDOR LOCAL DE COCHEMOTOR
echo   Produccion: https://motor.cochecierto.com/
echo   Hostinger:  https://motor.cochecierto.com/
echo ===================================================
echo.
echo URL Local:      http://localhost:8000/
echo Marketplace VO: http://localhost:8000/marketplace.html
echo Coches a Carta: http://localhost:8000/demanda.html
echo Hub SaaS:       http://localhost:8000/hub.html
echo.
echo Abriendo navegador en http://localhost:8000/...
start http://localhost:8000/
python local-broker\server.py
pause
