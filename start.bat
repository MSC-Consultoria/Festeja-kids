@echo off
echo ========================================
echo   FESTEJA KIDS - Inicializacao
echo ========================================
echo.

echo [1/2] Criando estrutura do banco de dados...
node node_modules\drizzle-kit\bin.cjs push
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERRO ao criar banco de dados!
    pause
    exit /b 1
)

echo.
echo [2/2] Iniciando servidor de desenvolvimento...
echo.
echo O servidor iniciara em: http://localhost:5173
echo Pressione Ctrl+C para parar o servidor
echo.

node node_modules\vite\bin\vite.js

pause
