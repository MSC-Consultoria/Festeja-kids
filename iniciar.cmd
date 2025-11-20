@echo off
REM ============================================
REM INICIAR SERVIDOR - Festeja Kids
REM Execute este arquivo com duplo clique!
REM ============================================

echo.
echo ========================================
echo  FESTEJA KIDS - Iniciando Servidor
echo ========================================
echo.

REM Verificar se .env existe
if not exist .env (
    echo [ERRO] Arquivo .env nao encontrado!
    echo Execute primeiro: instalar.cmd
    echo.
    pause
    exit /b 1
)

REM Verificar se node_modules existe
if not exist node_modules (
    echo [ERRO] Dependencias nao instaladas!
    echo Execute primeiro: instalar.cmd
    echo.
    pause
    exit /b 1
)

echo [OK] Tudo pronto! Iniciando servidor...
echo.
echo ========================================
echo  Servidor rodando em:
echo  http://localhost:5000
echo ========================================
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

set NODE_ENV=development
call pnpm dev

pause
