# 🚀 Guia de Configuração Local - Festeja Kids

Este guia irá ajudá-lo a configurar e executar o projeto Festeja Kids completamente em seu ambiente local no Windows.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **Node.js** (versão 18 ou superior)
   - Download: https://nodejs.org/
   - Verifique: `node --version`

2. **pnpm** (gerenciador de pacotes)
   - Instalação: `npm install -g pnpm`
   - Verifique: `pnpm --version`

3. **Banco de Dados** (escolha uma opção):
   - **Opção A - MySQL** (recomendado para produção)
     - Download: https://dev.mysql.com/downloads/installer/
   - **Opção B - SQLite** (mais simples para desenvolvimento)
     - Já incluído no projeto

## 🔧 Passo a Passo

### 1️⃣ Clonar o Repositório (se ainda não fez)

```powershell
git clone https://github.com/MSC-Consultoria/Festeja-kids.git
cd Festeja-kids
```

### 2️⃣ Instalar Dependências

```powershell
pnpm install
```

### 3️⃣ Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```powershell
copy .env.example .env
```

Abra o arquivo `.env` e configure:

#### **Opção A: Usando MySQL Local**

```env
DATABASE_URL=mysql://root:sua_senha@localhost:3306/festeja_kids
JWT_SECRET=gere_uma_chave_aleatoria_segura_aqui
NODE_ENV=development
```

#### **Opção B: Usando SQLite (Mais Simples)**

```env
DATABASE_URL=file:./festeja_kids.db
JWT_SECRET=gere_uma_chave_aleatoria_segura_aqui
NODE_ENV=development
```

> **💡 Dica:** Para gerar uma chave JWT segura, você pode usar:
> ```powershell
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 4️⃣ Configurar o Banco de Dados

#### Se estiver usando MySQL:

1. Crie o banco de dados:
```sql
CREATE DATABASE festeja_kids CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Execute as migrações:
```powershell
pnpm db:push
```

#### Se estiver usando SQLite:

Execute apenas as migrações (o arquivo será criado automaticamente):
```powershell
pnpm db:push
```

### 5️⃣ Importar Dados Iniciais (Opcional)

Se você tem dados das planilhas Excel para importar:

```powershell
node scripts/import-complete.mjs
```

### 6️⃣ Iniciar o Servidor de Desenvolvimento

```powershell
pnpm dev
```

O servidor iniciará em modo de desenvolvimento. Você verá algo como:

```
Server running on http://localhost:5000
Vite dev server running on http://localhost:5173
```

### 7️⃣ Acessar a Aplicação

Abra seu navegador e acesse:

```
http://localhost:5173
```

## 🎯 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia o servidor de desenvolvimento |
| `pnpm build` | Compila o projeto para produção |
| `pnpm start` | Inicia o servidor em modo produção |
| `pnpm check` | Verifica erros de TypeScript |
| `pnpm format` | Formata o código com Prettier |
| `pnpm test` | Executa os testes |
| `pnpm db:push` | Aplica migrações no banco de dados |

## 🔐 Autenticação Local

### Opção 1: Desabilitar Autenticação (Desenvolvimento)

Para desenvolvimento local sem OAuth, você pode modificar temporariamente o código para pular a autenticação:

1. Abra `server/_core/index.ts`
2. Comente ou modifique as verificações de autenticação

### Opção 2: Configurar OAuth Local

Se precisar de autenticação completa:

1. Configure as variáveis no `.env`:
```env
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=url_do_servidor_oauth
OWNER_OPEN_ID=seu_open_id
```

## 🗄️ Estrutura do Banco de Dados

O projeto usa as seguintes tabelas:

- **users** - Usuários do sistema
- **clientes** - Clientes/contratantes
- **festas** - Festas agendadas
- **pagamentos** - Parcelas de pagamento
- **custos_variaveis** - Custos variáveis por festa
- **custos_fixos** - Custos fixos mensais

## 🐛 Troubleshooting

### Erro: "DATABASE_URL is required"

**Solução:** Certifique-se de que o arquivo `.env` existe e contém a variável `DATABASE_URL`.

### Erro: "Cannot connect to MySQL"

**Soluções:**
1. Verifique se o MySQL está rodando
2. Confirme usuário e senha no `.env`
3. Certifique-se de que o banco `festeja_kids` foi criado

### Erro: "Port 5000 already in use"

**Solução:** Outra aplicação está usando a porta. Você pode:
1. Fechar a aplicação que está usando a porta
2. Ou modificar a porta no arquivo de configuração do servidor

### Scripts não funcionam no PowerShell

**Solução:** Os scripts usam sintaxe Unix. Para Windows, você pode:

1. Usar Git Bash (vem com Git for Windows)
2. Ou modificar os scripts no `package.json`:

```json
{
  "scripts": {
    "dev": "set NODE_ENV=development && tsx watch server/_core/index.ts"
  }
}
```

## 📦 Estrutura do Projeto

```
Festeja-kids/
├── client/           # Frontend React
│   ├── src/         # Código fonte do cliente
│   └── public/      # Arquivos estáticos
├── server/          # Backend Node.js
│   ├── _core/       # Configurações principais
│   └── routers/     # Rotas tRPC
├── drizzle/         # Schema e migrações do banco
├── scripts/         # Scripts de importação e utilidades
├── shared/          # Código compartilhado
└── .env            # Variáveis de ambiente (criar)
```

## 🚀 Próximos Passos

Após configurar o ambiente local:

1. ✅ Explore a interface em `http://localhost:5173`
2. ✅ Cadastre algumas festas de teste
3. ✅ Experimente as funcionalidades de calendário e financeiro
4. ✅ Personalize conforme suas necessidades

---

## ☁️ Deploy para Supabase (Produção)

Esta seção explica como implementar o deploy efetivo na Supabase para ambientes de produção.

### 📋 Pré-requisitos para Deploy Supabase

Antes de iniciar o deploy, certifique-se de ter:

1. **Conta Supabase** criada em https://supabase.com
2. **Projeto Supabase** provisionado
3. **Node.js** e **pnpm** instalados localmente
4. **Git** configurado para controle de versão
5. **Backup completo** do banco de dados atual (se houver dados)

### 🔧 Passo a Passo do Deploy

#### 1️⃣ Criar e Configurar Projeto no Supabase

1. Acesse https://app.supabase.com
2. Clique em "New Project"
3. Preencha os dados:
   - **Name:** festeja-kids (ou nome de sua preferência)
   - **Database Password:** Escolha uma senha forte (guarde com segurança!)
   - **Region:** Escolha a região mais próxima (ex: South America - São Paulo)
   - **Pricing Plan:** Free ou Pro conforme necessidade

4. Aguarde a criação do projeto (1-2 minutos)

#### 2️⃣ Obter Credenciais do Supabase

No dashboard do projeto Supabase:

1. Vá em **Settings** → **Database**
2. Copie a **Connection String** (modo "Transaction" ou "Session"):
   ```
   postgresql://postgres.[ref]:[password]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
   ```
   
3. Vá em **Settings** → **API**
4. Copie as seguintes informações:
   - **Project URL:** `https://[ref].supabase.co`
   - **Project API Key (anon public):** chave pública
   - **Project API Key (service_role):** chave privada ⚠️ (NUNCA versione!)

5. Em **Settings** → **General**, anote o **Reference ID** do projeto

#### 3️⃣ Instalar Dependências Adicionais

Execute no terminal:

```powershell
pnpm add postgres-js drizzle-orm
```

Isso adiciona o driver PostgreSQL necessário para conexão com Supabase.

#### 4️⃣ Configurar Variáveis de Ambiente

Atualize seu arquivo `.env` com as credenciais do Supabase:

```env
# ============================================
# SUPABASE - PRODUÇÃO
# ============================================

# Connection String do PostgreSQL (obtenha no Supabase Dashboard)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres

# Credenciais do projeto Supabase
SUPABASE_PROJECT_ID=seu-project-id
SUPABASE_URL=https://seu-project-ref.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima-publica
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-privada

# Autenticação
JWT_SECRET=sua_chave_jwt_segura_aqui

# Ambiente
NODE_ENV=production
```

> ⚠️ **IMPORTANTE:** Nunca versione o arquivo `.env` com credenciais reais!
> Use `.env.example` apenas com placeholders.

#### 5️⃣ Converter Schema para PostgreSQL

⚠️ **ATENÇÃO:** O schema atual está configurado para MySQL. Para deploy no Supabase (PostgreSQL), você precisa:

**Opção A: Criar schema PostgreSQL (Recomendado)**

Crie um novo arquivo `drizzle/schema-postgres.ts`:

```typescript
import { pgTable, serial, varchar, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";

// Definir enums
export const roleEnum = pgEnum('role', ['user', 'admin']);
export const statusFestaEnum = pgEnum('status_festa', ['agendada', 'realizada', 'cancelada']);
export const statusVisitaEnum = pgEnum('status_visita', ['agendada', 'realizada', 'cancelada', 'noshow']);

// Tabela de usuários
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default('user').notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// Tabela de clientes
export const clientes = pgTable("clientes", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  endereco: text("endereco"),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ... continue com as demais tabelas seguindo o mesmo padrão
```

**Opção B: Usar ferramenta de conversão**

Execute o script de conversão automática (em desenvolvimento):
```powershell
node scripts/convert-schema-to-postgres.mjs
```

#### 6️⃣ Executar Deploy Automático

Execute o script de deploy que valida e aplica as migrações:

```powershell
node scripts/deploy-supabase.mjs
```

Este script irá:
- ✅ Validar variáveis de ambiente
- ✅ Testar conexão com Supabase
- ✅ Gerar migrações do Drizzle
- ✅ Aplicar migrações no banco
- ✅ Validar criação das tabelas

**Ou manualmente:**

```powershell
# Gerar migrações
pnpm drizzle-kit generate

# Aplicar migrações
pnpm drizzle-kit migrate

# Ou usar o comando combinado
pnpm db:push
```

#### 7️⃣ Validar Deploy

Execute o script de validação:

```powershell
node scripts/validate-supabase.mjs
```

Este script verifica:
- ✅ Estrutura das tabelas
- ✅ Índices e constraints
- ✅ Relacionamentos (foreign keys)
- ✅ Integridade dos dados
- ✅ Contagem de registros

#### 8️⃣ Migrar Dados Existentes (Se Aplicável)

Se você tem dados no MySQL/SQLite para migrar:

```powershell
# 1. Exportar dados do banco antigo
node scripts/export-data.mjs

# 2. Importar para Supabase
node scripts/import-complete.mjs
```

> 💡 **Dica:** Faça a migração em horários de baixo movimento e mantenha backup!

#### 9️⃣ Configurar Row Level Security (RLS)

No Supabase Dashboard, configure políticas de segurança:

1. Acesse **Authentication** → **Policies**
2. Para cada tabela, crie políticas de acesso:

```sql
-- Exemplo: Permitir leitura para usuários autenticados
CREATE POLICY "Allow authenticated read" ON festas
  FOR SELECT
  TO authenticated
  USING (true);

-- Exemplo: Permitir escrita apenas para admins
CREATE POLICY "Allow admin write" ON festas
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
```

#### 🔟 Testar Aplicação em Produção

```powershell
# Executar em modo produção
pnpm build
pnpm start
```

Acesse `http://localhost:5000` e teste:
- ✅ Login/autenticação
- ✅ Listagem de festas
- ✅ Criação de novo cliente
- ✅ Agendamento de festa
- ✅ Registro de pagamento
- ✅ Dashboard financeiro

### 🔍 Monitoramento Pós-Deploy

#### Dashboard Supabase

Monitore no Supabase Dashboard:

1. **Database** → **Logs:** Logs de queries
2. **Database** → **Replication:** Status de replicação
3. **Reports:** Uso de recursos
4. **API** → **Logs:** Requisições da API

#### Métricas Importantes

- **Conexões ativas:** Máximo de 60 no plano Free
- **Tamanho do banco:** Limite de 500MB no plano Free
- **Largura de banda:** 5GB/mês no plano Free

### 🔐 Segurança em Produção

**Checklist de Segurança:**

- [ ] Credenciais fora do controle de versão
- [ ] RLS habilitado em todas as tabelas
- [ ] Backup automático configurado
- [ ] Variáveis sensíveis em secrets (não em .env versionado)
- [ ] HTTPS configurado (automático no Supabase)
- [ ] Rate limiting configurado
- [ ] Logs de auditoria habilitados

### 📊 Backup e Recuperação

#### Backup Manual

No Supabase Dashboard:
1. Vá em **Database** → **Backups**
2. Clique em **Start a backup**

#### Backup Automático

- **Free Plan:** 1 backup por dia (7 dias de retenção)
- **Pro Plan:** Backups a cada 6 horas (30 dias de retenção)

#### Restaurar Backup

```powershell
# Via SQL direto no Supabase
# ou usar pg_restore localmente
```

### 🐛 Troubleshooting Supabase

#### Erro: "Too many connections"

**Solução:** 
- Limite de conexões no plano Free é 60
- Use connection pooling (já habilitado na connection string)
- Feche conexões não utilizadas

#### Erro: "Permission denied for table"

**Solução:**
- Verifique políticas RLS
- Confirme se usuário tem permissões adequadas
- No SQL Editor, execute como `postgres` role

#### Erro: "SSL connection required"

**Solução:**
- Adicione `?sslmode=require` na connection string
- Ou use a connection string com SSL já configurado

#### Erro: "Database migration failed"

**Solução:**
1. Verifique o schema PostgreSQL está correto
2. Execute migrações manualmente no SQL Editor
3. Verifique logs: `pnpm drizzle-kit migrate --verbose`

#### Performance Lenta

**Soluções:**
- Adicione índices em colunas frequentemente consultadas
- Use `EXPLAIN ANALYZE` para queries lentas
- Considere upgrade para plano Pro
- Otimize queries com muitos JOINs

### 📚 Recursos Adicionais

- **Documentação Supabase:** https://supabase.com/docs
- **Drizzle + Supabase:** https://orm.drizzle.team/docs/get-started-postgresql
- **Plano de Migração Completo:** [Plano de Migração Festeja Kids 2.0 para Supabase.md](./Plano%20de%20Migração%20Festeja%20Kids%202.0%20para%20Supabase.md)
- **Issues de Migração:** [MIGRATION_ISSUES.md](./MIGRATION_ISSUES.md)

### ✅ Checklist de Deploy Completo

Antes de considerar o deploy concluído, verifique:

- [ ] Projeto Supabase criado e configurado
- [ ] Credenciais obtidas e armazenadas com segurança
- [ ] Schema PostgreSQL criado e validado
- [ ] Migrações aplicadas sem erros
- [ ] Dados migrados (se aplicável)
- [ ] Validação executada com sucesso
- [ ] RLS configurado em todas as tabelas
- [ ] Testes funcionais executados
- [ ] Backup inicial criado
- [ ] Monitoramento configurado
- [ ] Documentação de operação atualizada
- [ ] Plano de rollback preparado

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique a seção de Troubleshooting acima
2. Consulte o arquivo `TIMELINE.md` para histórico do projeto
3. Revise os logs do console para mensagens de erro
4. Para issues do Supabase, consulte https://supabase.com/docs

---

**Desenvolvido com ❤️ para Festeja Kids**
