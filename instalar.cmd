@echo off
REM ============================================
REM INSTALACAO SIMPLIFICADA - Festeja Kids
REM Execute este arquivo com duplo clique!
REM ============================================

echo.
echo ========================================
echo  FESTEJA KIDS - Instalacao Simplificada
echo ========================================
echo.

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado!
    echo.
    echo Por favor, instale o Node.js primeiro:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado: 
node --version
echo.

REM Verificar/Instalar pnpm
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [INSTALANDO] pnpm...
    call npm install -g pnpm
    echo.
)

echo [OK] pnpm pronto!
echo.

REM Instalar dependencias
echo ========================================
echo  Instalando dependencias do projeto...
echo  (Isso pode levar alguns minutos)
echo ========================================
echo.

call pnpm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERRO] Falha ao instalar dependencias
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Criando arquivo de configuracao .env
echo ========================================
echo.

if not exist .env (
    if exist .env.example (
        copy .env.example .env
        echo [OK] Arquivo .env criado!
    ) else (
        (
            echo DATABASE_URL=file:./festeja_kids.db
            echo JWT_SECRET=festeja_kids_secret_2024
            echo NODE_ENV=development
        ) > .env
        echo [OK] Arquivo .env criado com configuracoes padrao!
    )
    echo.
) else (
    echo [OK] Arquivo .env ja existe!
    echo.
)

echo ========================================
echo  Inicializando banco de dados...
echo ========================================
echo.

call pnpm db:push

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [AVISO] Erro ao criar banco de dados
    echo Verifique as configuracoes no arquivo .env
    echo.
)

echo.
echo ========================================
echo  INSTALACAO CONCLUIDA COM SUCESSO!
echo ========================================
echo.
echo Proximos passos:
echo.
echo 1. Verifique o arquivo .env (se necessario)
echo 2. Para iniciar o servidor, execute:
echo    iniciar.cmd
echo.
pause
