@echo off
echo ========================================
echo   FESTEJA KIDS - Instalacao
echo ========================================
echo.

echo [1/2] Instalando dependencias do projeto...
echo (Isso pode levar alguns minutos)
echo.

cmd /c pnpm install --shamefully-hoist 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERRO ao instalar com pnpm!
    echo Tentando com npm...
    echo.
    cmd /c npm install 2>&1
    
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ERRO: Nao foi possivel instalar as dependencias!
        pause
        exit /b 1
    )
)

echo.
echo [2/2] Criando banco de dados...
echo.

node node_modules\drizzle-kit\bin.cjs push 2>&1

echo.
echo ========================================
echo   Instalacao concluida!
echo ========================================
echo.
echo Proximos passos:
echo   1. Execute: start.bat
echo   2. Acesse: http://localhost:5173
echo.
pause
