@echo off
REM ============================================
REM Script de Configuração Inicial - Festeja Kids
REM ============================================

echo.
echo ========================================
echo  FESTEJA KIDS - Configuracao Inicial
echo ========================================
echo.

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Por favor, instale o Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js encontrado: 
node --version
echo.

REM Verificar se pnpm está instalado
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] pnpm nao encontrado. Instalando...
    npm install -g pnpm
    if %ERRORLEVEL% NEQ 0 (
        echo [ERRO] Falha ao instalar pnpm
        pause
        exit /b 1
    )
)

echo [OK] pnpm encontrado:
pnpm --version
echo.

REM Instalar dependências
echo ========================================
echo  Instalando dependencias...
echo ========================================
echo.
pnpm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao instalar dependencias
    pause
    exit /b 1
)

echo.
echo [OK] Dependencias instaladas com sucesso!
echo.

REM Verificar se .env existe
if not exist .env (
    echo ========================================
    echo  Configurando arquivo .env
    echo ========================================
    echo.
    
    if exist .env.example (
        copy .env.example .env
        echo [OK] Arquivo .env criado a partir de .env.example
        echo.
        echo [IMPORTANTE] Edite o arquivo .env e configure:
        echo   - DATABASE_URL (conexao com banco de dados)
        echo   - JWT_SECRET (chave secreta para autenticacao)
        echo.
    ) else (
        echo [AVISO] Arquivo .env.example nao encontrado
        echo Criando .env basico...
        (
            echo DATABASE_URL=file:./festeja_kids.db
            echo JWT_SECRET=change_this_secret_key
            echo NODE_ENV=development
        ) > .env
        echo [OK] Arquivo .env criado
        echo.
    )
) else (
    echo [OK] Arquivo .env ja existe
    echo.
)

echo ========================================
echo  Configuracao concluida!
echo ========================================
echo.
echo Proximos passos:
echo.
echo 1. Edite o arquivo .env com suas configuracoes
echo 2. Execute: pnpm db:push (para criar o banco de dados)
echo 3. Execute: pnpm dev (para iniciar o servidor)
echo.
echo Consulte SETUP_LOCAL.md para mais informacoes
echo.
pause
