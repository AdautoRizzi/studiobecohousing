@echo off
title Studio Be - Robô do WhatsApp
color 0A

echo =======================================
echo    INICIANDO O ROBO DO WHATSAPP
echo    CRM STUDIO BE
echo =======================================
echo.

:: Muda para o diretório atual onde o arquivo .bat está
cd /d "%~dp0"

:: Verifica se o node está instalado e executa o bot
node whatsapp-bot.js

:: Caso de algum erro ou o bot feche, pausa a tela para leitura
echo.
pause
