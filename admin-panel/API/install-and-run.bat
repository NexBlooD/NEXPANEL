@echo off
echo ======================================
echo   Instalador API Perfect World
echo ======================================
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo Por favor, instale o Node.js primeiro:
    echo https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
node --version

REM Verificar se npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm não encontrado!
    echo Por favor, instale o npm primeiro
    pause
    exit /b 1
)

echo ✅ npm encontrado
npm --version
echo.

REM Instalar dependências
echo 📦 Instalando dependências...
npm install

if %errorlevel% equ 0 (
    echo ✅ Dependências instaladas com sucesso!
    echo.
    echo 🚀 Iniciando servidor...
    echo Pressione Ctrl+C para parar o servidor
    echo.
    node app.js
) else (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)
