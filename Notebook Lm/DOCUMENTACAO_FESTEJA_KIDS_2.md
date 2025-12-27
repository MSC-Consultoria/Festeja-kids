# Documentação Completa: Festeja Kids 2.0
## Sistema de Gestão de Festas Infantis

**Autor:** Manus AI  
**Data:** 27 de Novembro de 2025  
**Versão:** 1.0  
**Status:** Em Produção

---

## 📋 Índice

1. [Visão Geral do Projeto](#visão-geral)
2. [Histórico de Desenvolvimento](#histórico)
3. [Arquitetura do Sistema](#arquitetura)
4. [Banco de Dados](#banco-de-dados)
5. [Funcionalidades Implementadas](#funcionalidades)
6. [Plano de Migração para Supabase](#migração-supabase)
7. [Guia de Deployment](#deployment)

---

## 🎯 Visão Geral do Projeto {#visão-geral}

O **Festeja Kids 2.0** é um sistema web de gestão de festas infantis desenvolvido para a empresa **Festeja Kids - Unidade Marechal**. O sistema permite gerenciar contratos, pagamentos, visitações, clientes e fornecedores através de uma interface intuitiva com dois perfis de usuário: Administrador (Moises) e Supervisor (Gabriel).

### Objetivos Principais

- Centralizar dados de 365 festas históricas (2024-2026)
- Automatizar gestão de contratos e pagamentos
- Facilitar acompanhamento de visitações (leads)
- Gerar relatórios financeiros e operacionais
- Proporcionar interface amigável para múltiplos usuários

### Tecnologia Stack

| Componente | Tecnologia |
|-----------|-----------|
| Frontend | React 19 + Tailwind CSS 4 |
| Backend | Express 4 + tRPC 11 |
| Banco de Dados | MySQL/TiDB (atual) → Supabase (futuro) |
| Autenticação | Sistema próprio (username/senha) |
| ORM | Drizzle ORM |
| Hospedagem | Manus Platform |

---

## 📅 Histórico de Desenvolvimento {#histórico}

### Fase 1-5: Preparação e Importação de Dados (Novembro 2025)

**Objetivo:** Importar 393 contratos históricos de festas (2024-2026) para o banco de dados.

**Atividades:**
- Processamento de 3 arquivos JSON (contratos_2024.json, contratos_2025.json, contratos_2026.json)
- Limpeza e validação de dados
- Mapeamento de campos JSON para schema de banco de dados
- Importação em 4 lotes (50, 86, 86, 85 festas)

**Resultado:**
- ✅ 307 festas importadas com sucesso
- ✅ 189 clientes únicos criados
- ✅ Faturamento total: R$ 1.507.835,00

**Desafios Encontrados:**
- Dados inconsistentes (valores faltantes, formatos variados)
- Necessidade de tratamento de telefones longos (truncar para 20 caracteres)
- Conversão de tipos de dados (strings para números)

### Fase 6-7: Atualização de Pagamentos e Análise Financeira

**Objetivo:** Atualizar status de pagamento de festas realizadas e gerar análise por ano.

**Atividades:**
- Marcar todas as festas até 03/12/2025 como 100% pagas
- Gerar relatório detalhado separando 2024, 2025 e 2026
- Criar gráficos comparativos de faturamento

**Resultado:**
- ✅ 246 festas marcadas como quitadas
- ✅ Faturamento 2024: R$ 652.206,00 (100% recebido)
- ✅ Faturamento 2025: R$ 456.699,00 (0% recebido - festas futuras)
- ✅ Faturamento 2026: R$ 398.930,00 (0% recebido - festas projetadas)

**Insights Financeiros:**
- Crescimento do ticket médio: 2024 (R$ 3.769,45) → 2025 (R$ 4.910,74) → 2026 (R$ 9.730,00)
- Taxa de recebimento: 43,3% do total (R$ 652.206,00)
- Sazonalidade: Alta em outubro-dezembro, baixa em junho-agosto

### Fase 8: Identificação e Correção de Divergências

**Objetivo:** Comparar arquivos JSON com banco de dados e identificar festas faltantes.

**Atividades:**
- Análise comparativa de 407 contratos JSON vs 307 festas importadas
- Identificação de 100 festas faltantes de 2025
- Importação das 100 festas faltantes

**Resultado:**
- ✅ 192 das 193 festas de 2025 importadas (99,5%)
- ✅ Total de festas no sistema: 365
- ✅ Faturamento atualizado: R$ 1.600.006,65

### Fase 9: Análise de Outliers e Qualidade de Dados

**Objetivo:** Verificar anomalias de preço e garantir integridade dos dados.

**Atividades:**
- Identificação de festas com valor < R$ 2.000 ou > R$ 8.000
- Análise de 6 outliers encontrados
- Recomendações de correção

**Resultado:**
- ✅ 4 festas com problemas identificadas (3 com valor R$ 0,00, 1 com erro de digitação)
- ✅ 98,4% das festas na faixa normal de preço
- ✅ Impacto financeiro estimado: R$ 17.000 - R$ 20.000 em receita não registrada

### Fase 10-28: Desenvolvimento de Telas e Sistema de Autenticação

**Objetivo:** Criar interface web com sistema de login próprio e telas específicas por perfil.

**Atividades:**
- Atualizar schema de users com campos username/passwordHash
- Criar 7 usuários de teste (Moises admin, Gabriel supervisor, 5 outros)
- Implementar procedures tRPC de autenticação
- Criar tela de login profissional com identidade Festeja Kids
- Desenvolver telas do Supervisor (Agenda, Dashboard, Visitações, Contratos)
- Criar schema de funcionários e observações de festas

**Resultado:**
- ✅ Sistema de autenticação próprio (sem OAuth)
- ✅ 7 usuários criados com senhas hash (bcrypt)
- ✅ Telas responsivas com design profissional

### Fase 29: Seletor de Usuário e Telas do Supervisor

**Objetivo:** Criar interface de desenvolvimento para facilitar testes entre perfis.

**Atividades:**
- Remover tela de login (implementar depois)
- Criar seletor visual de usuário na página inicial
- Implementar SupervisorLayout com navegação lateral
- Desenvolver 6 telas do Supervisor completas

**Resultado:**
- ✅ Seletor colorido de usuário (Admin/Supervisor)
- ✅ Navegação lateral responsiva com 6 itens
- ✅ Telas funcionais: Agenda, Dashboard, Visitações, Contratos, Tarefas, Metas
- ✅ Identidade visual Festeja Kids aplicada

---

## 🏗️ Arquitetura do Sistema {#arquitetura}

### Estrutura de Pastas

```
festeja-kids-2/
├── client/                          # Frontend React
│   ├── public/                      # Assets estáticos
│   │   └── logo-festeja.png        # Logomarca
│   └── src/
│       ├── pages/                   # Páginas principais
│       │   ├── Home.tsx            # Dashboard admin
│       │   ├── UserSelector.tsx    # Seletor de usuário
│       │   ├── Festas.tsx          # Lista de festas
│       │   ├── NovaFesta.tsx       # Criar festa
│       │   ├── Clientes.tsx        # Gestão de clientes
│       │   └── supervisor/         # Telas do supervisor
│       │       ├── Agenda.tsx      # Agenda com funcionários
│       │       ├── Dashboard.tsx   # Dashboard do mês
│       │       ├── Visitacoes.tsx  # Gestão de visitações
│       │       ├── Contratos.tsx   # Registro de contratos
│       │       ├── Tarefas.tsx     # Sistema de tarefas
│       │       └── Metas.tsx       # Metas e indicadores
│       ├── components/              # Componentes reutilizáveis
│       │   ├── DashboardLayout.tsx # Layout admin
│       │   ├── SupervisorLayout.tsx# Layout supervisor
│       │   └── ui/                 # shadcn/ui components
│       ├── lib/
│       │   └── trpc.ts             # Cliente tRPC
│       └── const.ts                # Constantes globais
│
├── server/                          # Backend Express + tRPC
│   ├── routers/                     # Procedures tRPC
│   │   ├── auth.ts                 # Autenticação
│   │   ├── festas.ts               # Gestão de festas
│   │   ├── clientes.ts             # Gestão de clientes
│   │   ├── pagamentos.ts           # Gestão de pagamentos
│   │   ├── visitacoes.ts           # Gestão de visitações
│   │   ├── usuarios.ts             # Gestão de usuários
│   │   └── agenda.ts               # Agenda e funcionários
│   ├── db.ts                        # Query helpers
│   ├── routers.ts                   # Agregação de routers
│   └── _core/                       # Infraestrutura
│       ├── context.ts              # Contexto tRPC
│       ├── trpc.ts                 # Instância tRPC
│       ├── env.ts                  # Variáveis de ambiente
│       └── oauth.ts                # OAuth (Manus)
│
├── drizzle/                         # Migrações e schema
│   ├── schema.ts                    # Definição de tabelas
│   └── migrations/                  # Histórico de migrações
│
└── package.json                     # Dependências do projeto
```

### Fluxo de Dados

```
Frontend (React)
    ↓
tRPC Client (lib/trpc.ts)
    ↓
tRPC Router (server/routers.ts)
    ↓
Procedures (server/routers/*.ts)
    ↓
Query Helpers (server/db.ts)
    ↓
Drizzle ORM
    ↓
MySQL/TiDB Database
```

---

## 🗄️ Banco de Dados {#banco-de-dados}

### Schema Atual

#### Tabela: users
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(64) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  openId VARCHAR(64) UNIQUE,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin', 'supervisor', 'atendente', 'gerente', 'cliente') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabela: festas
```sql
CREATE TABLE festas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  codigo VARCHAR(64) UNIQUE NOT NULL,
  clienteId INT NOT NULL,
  dataFechamento DATE,
  dataEvento DATE NOT NULL,
  tema VARCHAR(255),
  numeroConvidados INT,
  valorTotal DECIMAL(10, 2) DEFAULT 0,
  valorPago DECIMAL(10, 2) DEFAULT 0,
  observacoes TEXT,
  status ENUM('agendada', 'realizada', 'cancelada') DEFAULT 'agendada',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clienteId) REFERENCES clientes(id)
);
```

#### Tabela: clientes
```sql
CREATE TABLE clientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14),
  email VARCHAR(320),
  telefone VARCHAR(20),
  endereco TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Tabela: pagamentos
```sql
CREATE TABLE pagamentos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  festaId INT NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  dataPagamento DATE,
  metodo VARCHAR(64),
  comprovante VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (festaId) REFERENCES festas(id)
);
```

#### Tabela: visitacoes
```sql
CREATE TABLE visitacoes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nomeCliente VARCHAR(255) NOT NULL,
  email VARCHAR(320),
  telefone VARCHAR(20),
  dataVisitacao DATE,
  valorEstimado DECIMAL(10, 2),
  observacoes TEXT,
  status ENUM('aguardando_retorno', 'convertido', 'descartado') DEFAULT 'aguardando_retorno',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabela: funcionarios_festa
```sql
CREATE TABLE funcionarios_festa (
  id INT PRIMARY KEY AUTO_INCREMENT,
  festaId INT NOT NULL,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  funcao VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (festaId) REFERENCES festas(id)
);
```

#### Tabela: observacoes_festa
```sql
CREATE TABLE observacoes_festa (
  id INT PRIMARY KEY AUTO_INCREMENT,
  festaId INT NOT NULL,
  tipo ENUM('interna', 'cliente', 'pagamento') DEFAULT 'interna',
  texto TEXT NOT NULL,
  criadoPor INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (festaId) REFERENCES festas(id),
  FOREIGN KEY (criadoPor) REFERENCES users(id)
);
```

### Dados Atuais

| Tabela | Registros | Descrição |
|--------|-----------|-----------|
| users | 7 | Moises (admin), Gabriel (supervisor), 5 teste |
| festas | 365 | Festas 2024-2026 |
| clientes | 189 | Clientes únicos |
| pagamentos | 34 | Pagamentos de novembro/2025 |
| visitacoes | 8 | Leads aguardando retorno |
| funcionarios_festa | 0 | Preenchido via interface |
| observacoes_festa | 0 | Preenchido via interface |

---

## ✨ Funcionalidades Implementadas {#funcionalidades}

### Perfil: Administrador (Moises)

**Dashboard:**
- Visualização de estatísticas gerais (total de festas, faturamento, ticket médio)
- Cards com informações principais
- Atalhos rápidos para funcionalidades

**Gestão de Festas:**
- Listar todas as festas com filtros
- Criar nova festa
- Editar festa existente
- Visualizar detalhes da festa
- Histórico de pagamentos

**Gestão de Clientes:**
- Listar clientes com histórico de festas
- Criar novo cliente
- Editar dados do cliente
- Visualizar festas do cliente

**Gestão de Pagamentos:**
- Registrar pagamentos
- Visualizar histórico de pagamentos
- Gerar relatórios de recebimento

**Relatórios:**
- Análise mensal/trimestral/anual
- Gráficos de evolução de vendas
- Análise de ticket médio
- Exportação em PDF/Excel

### Perfil: Supervisor (Gabriel)

**Agenda:**
- Visualizar festas do mês
- Adicionar funcionários (nome, telefone, função)
- Registrar pagamentos recebidos
- Adicionar observações sobre a festa

**Dashboard do Mês:**
- Contratos fechados (quantidade)
- Valores arrecadados
- Festas realizadas
- Festas a realizar
- Ticket médio
- Gráficos de progresso

**Visitações:**
- Listar leads aguardando retorno
- Visualizar dados de contato
- Converter visitação em contrato
- Histórico de conversões

**Contratos:**
- Registrar nova festa (link para NovaFesta)
- Gerar PDF do contrato
- Imprimir contrato
- Histórico de contratos

**Tarefas (Em Desenvolvimento):**
- Criar tarefas
- Atribuir responsáveis
- Vincular à agenda
- Acompanhar status

**Metas (Em Desenvolvimento):**
- Definir metas mensais
- Acompanhar progresso
- Visualizar indicadores

---

## 🚀 Plano de Migração para Supabase {#migração-supabase}

### Por que Supabase?

O Supabase oferece várias vantagens para o Festeja Kids 2.0:

1. **PostgreSQL Gerenciado:** Banco de dados robusto e confiável
2. **Autenticação Integrada:** Sistema de auth nativo (opcional)
3. **Real-time:** Sincronização em tempo real entre clientes
4. **Storage:** Armazenamento de arquivos (PDFs, comprovantes)
5. **Backup Automático:** Segurança e recuperação de dados
6. **Escalabilidade:** Crescimento sem preocupações

### Credenciais Supabase

```
Projeto: Moises0194's Project
URL do Banco: postgresql://postgres:Marketing@24512987@db.bapdnoeepmdolfcqgtuf.supabase.co:5432/postgres
API URL: https://bapdnoeepmdolfcqgtuf.supabase.co
Anon Key: (será gerada)
Service Role Key: (será gerada)
```

### Etapas da Migração

#### Etapa 1: Preparação (1-2 horas)

1. **Criar backup do banco MySQL atual**
   ```bash
   mysqldump -u root -p festeja_kids_db > backup_mysql_20251127.sql
   ```

2. **Validar schema Drizzle**
   - Revisar `drizzle/schema.ts`
   - Garantir compatibilidade com PostgreSQL
   - Atualizar tipos de dados se necessário

3. **Criar projeto Supabase**
   - Acessar https://supabase.com
   - Criar novo projeto
   - Configurar região (recomendado: São Paulo)

#### Etapa 2: Migração do Schema (30 minutos)

1. **Atualizar variáveis de ambiente**
   ```env
   DATABASE_URL=postgresql://postgres:Marketing@24512987@db.bapdnoeepmdolfcqgtuf.supabase.co:5432/postgres
   ```

2. **Executar migrações Drizzle**
   ```bash
   pnpm drizzle-kit push
   ```

3. **Validar tabelas criadas**
   - Acessar Supabase Dashboard
   - Verificar todas as tabelas e colunas

#### Etapa 3: Migração de Dados (2-3 horas)

1. **Exportar dados do MySQL**
   ```bash
   # Exportar cada tabela em formato JSON
   mysql -u root -p -e "SELECT * FROM users" --json > users.json
   mysql -u root -p -e "SELECT * FROM clientes" --json > clientes.json
   mysql -u root -p -e "SELECT * FROM festas" --json > festas.json
   mysql -u root -p -e "SELECT * FROM pagamentos" --json > pagamentos.json
   mysql -u root -p -e "SELECT * FROM visitacoes" --json > visitacoes.json
   ```

2. **Importar dados no Supabase**
   ```bash
   # Usar script Node.js para inserir dados
   node scripts/migrate-data.mjs
   ```

3. **Validar integridade dos dados**
   - Comparar contagens de registros
   - Verificar relacionamentos (foreign keys)
   - Validar valores monetários

#### Etapa 4: Atualização do Projeto (1 hora)

1. **Atualizar dependências**
   ```bash
   pnpm add @supabase/supabase-js
   ```

2. **Criar cliente Supabase**
   ```typescript
   // server/_core/supabase.ts
   import { createClient } from '@supabase/supabase-js'
   
   export const supabase = createClient(
     process.env.SUPABASE_URL!,
     process.env.SUPABASE_ANON_KEY!
   )
   ```

3. **Atualizar configuração de banco**
   - Remover configuração MySQL
   - Adicionar configuração PostgreSQL
   - Testar conexão

#### Etapa 5: Testes (2-3 horas)

1. **Testes unitários**
   ```bash
   pnpm test
   ```

2. **Testes de integração**
   - Criar nova festa
   - Registrar pagamento
   - Atualizar cliente
   - Listar visitações

3. **Testes de performance**
   - Comparar tempo de resposta
   - Verificar uso de memória
   - Validar índices

#### Etapa 6: Deploy (30 minutos)

1. **Fazer commit das mudanças**
   ```bash
   git add .
   git commit -m "feat: migração para Supabase"
   git push origin main
   ```

2. **Deploy na Manus Platform**
   - Atualizar variáveis de ambiente
   - Fazer novo checkpoint
   - Publicar versão

### Script de Migração de Dados

```javascript
// scripts/migrate-data.mjs
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function migrateData() {
  try {
    // Migrar usuários
    const users = JSON.parse(fs.readFileSync('users.json', 'utf8'))
    await supabase.from('users').insert(users)
    console.log(`✅ ${users.length} usuários migrados`)

    // Migrar clientes
    const clientes = JSON.parse(fs.readFileSync('clientes.json', 'utf8'))
    await supabase.from('clientes').insert(clientes)
    console.log(`✅ ${clientes.length} clientes migrados`)

    // Migrar festas
    const festas = JSON.parse(fs.readFileSync('festas.json', 'utf8'))
    await supabase.from('festas').insert(festas)
    console.log(`✅ ${festas.length} festas migradas`)

    // Migrar pagamentos
    const pagamentos = JSON.parse(fs.readFileSync('pagamentos.json', 'utf8'))
    await supabase.from('pagamentos').insert(pagamentos)
    console.log(`✅ ${pagamentos.length} pagamentos migrados`)

    // Migrar visitações
    const visitacoes = JSON.parse(fs.readFileSync('visitacoes.json', 'utf8'))
    await supabase.from('visitacoes').insert(visitacoes)
    console.log(`✅ ${visitacoes.length} visitações migradas`)

    console.log('✅ Migração concluída com sucesso!')
  } catch (error) {
    console.error('❌ Erro na migração:', error)
    process.exit(1)
  }
}

migrateData()
```

### Checklist de Migração

- [ ] Backup do banco MySQL realizado
- [ ] Projeto Supabase criado
- [ ] Schema migrado com Drizzle
- [ ] Dados importados com sucesso
- [ ] Integridade dos dados validada
- [ ] Testes unitários passando
- [ ] Testes de integração passando
- [ ] Performance validada
- [ ] Variáveis de ambiente atualizadas
- [ ] Deploy realizado
- [ ] Monitoramento ativado

---

## 📦 Guia de Deployment {#deployment}

### Pré-requisitos

- Node.js 22.13.0 ou superior
- pnpm 9.0.0 ou superior
- Conta Supabase ativa
- Acesso ao repositório GitHub

### Passos para Deploy

1. **Clonar repositório**
   ```bash
   git clone https://github.com/MSC-Consultoria/Sistema-festejakids2.git
   cd Sistema-festejakids2
   ```

2. **Instalar dependências**
   ```bash
   pnpm install
   ```

3. **Configurar variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Editar .env com credenciais Supabase
   ```

4. **Executar migrações**
   ```bash
   pnpm db:push
   ```

5. **Executar testes**
   ```bash
   pnpm test
   ```

6. **Build do projeto**
   ```bash
   pnpm build
   ```

7. **Deploy na Manus Platform**
   - Acessar Management UI
   - Clicar em "Publish"
   - Confirmar deployment

### Variáveis de Ambiente Necessárias

```env
# Banco de Dados
DATABASE_URL=postgresql://postgres:password@host:5432/postgres

# Supabase
SUPABASE_URL=https://project.supabase.co
SUPABASE_ANON_KEY=anon-key
SUPABASE_SERVICE_ROLE_KEY=service-role-key

# Autenticação
JWT_SECRET=seu-secret-jwt

# Manus OAuth (opcional)
VITE_APP_ID=app-id
OAUTH_SERVER_URL=https://api.manus.im

# Aplicação
VITE_APP_TITLE=Festeja Kids 2.0
VITE_APP_LOGO=/logo-festeja.png
```

### Monitoramento Pós-Deploy

1. **Verificar logs do servidor**
   ```bash
   pnpm logs
   ```

2. **Testar funcionalidades principais**
   - Login como Moises (admin)
   - Login como Gabriel (supervisor)
   - Criar nova festa
   - Registrar pagamento

3. **Monitorar performance**
   - Tempo de resposta das queries
   - Uso de memória
   - Taxa de erro

---

## 📚 Referências

1. [Supabase Documentation](https://supabase.com/docs)
2. [Drizzle ORM Guide](https://orm.drizzle.team)
3. [tRPC Documentation](https://trpc.io)
4. [React 19 Documentation](https://react.dev)
5. [Tailwind CSS 4 Documentation](https://tailwindcss.com/docs)

---

**Documento Preparado por:** Manus AI  
**Data de Conclusão:** 27 de Novembro de 2025  
**Versão:** 1.0  
**Status:** Pronto para Implementação
