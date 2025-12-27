# 📋 Plano de Migração Festeja Kids 2.0 para Supabase

**Data do Documento:** 27 de Novembro de 2025  
**Projeto Supabase:** Arquimedes  
**Repositório GitHub:** https://github.com/Msc-Consultoriarj-org/arquimedes-v.0.2.0  
**Projeto:** Festeja Kids 2.0 - Sistema de Gestão de Festas Infantis  
**Status:** Planejamento  

---

## 📌 Índice

1. [Visão Geral](#visão-geral)
2. [Infraestrutura Atual](#infraestrutura-atual)
3. [Infraestrutura Supabase](#infraestrutura-supabase)
4. [Plano de Migração Detalhado](#plano-de-migração-detalhado)
5. [Cronograma](#cronograma)
6. [Riscos e Mitigação](#riscos-e-mitigação)
7. [Rollback Plan](#rollback-plan)
8. [Pós-Migração](#pós-migração)

---

## 🎯 Visão Geral

O Festeja Kids 2.0 está sendo migrado de uma arquitetura Manus (MySQL + tRPC) para Supabase (PostgreSQL + Auth + Realtime). Esta migração oferece:

- **Autenticação gerenciada** via Supabase Auth
- **Banco de dados PostgreSQL** com melhor escalabilidade
- **Realtime subscriptions** para atualizações em tempo real
- **Storage integrado** para arquivos
- **Backup automático** e disaster recovery
- **Melhor performance** e segurança

---

## 🔄 Infraestrutura Atual

### Stack Atual
- **Frontend:** React 19 + Tailwind 4 + Vite
- **Backend:** Express 4 + tRPC 11
- **Banco de Dados:** MySQL (Manus)
- **Autenticação:** Manus OAuth + JWT customizado
- **Storage:** S3 (Manus)
- **Testes:** Vitest + Playwright

### Dados Atuais
- **365 festas** importadas (2024-2026)
- **189 clientes** únicos
- **7 usuários** (admin, supervisor, 5 teste)
- **Faturamento Total:** R$ 1.600.006,65
- **Funcionários/Observações:** Tabelas criadas

### Endpoints Críticos
- `/api/trpc/*` - Todas as operações de dados
- `/api/oauth/callback` - Autenticação (será removido)
- `/api/storage/*` - Upload/download de arquivos

---

## ☁️ Infraestrutura Supabase

### Credenciais Fornecidas
```
Project: Arquimedes
Nome de Usuário: Aruimedes
Senha: Aruimedes@Msc
URL: https://nozjreykfzqokafklbsz.supabase.co
Database: postgresql://postgres:Aruimedes@Msc@db.nozjreykfzqokafklbsz.supabase.co:5432/postgres
Anon Key: [Obter do Supabase Dashboard]
Service Role Key: [Obter do Supabase Dashboard]
```

**Para obter as chaves:**
1. Acessar https://app.supabase.com
2. Fazer login com Aruimedes / Aruimedes@Msc
3. Ir para Project Settings → API
4. Copiar `anon public` e `service_role secret`

### Serviços Disponíveis
- **Supabase Auth** - Autenticação com email/senha, OAuth, etc
- **PostgreSQL Database** - Banco de dados relacional
- **Realtime** - Subscriptions em tempo real
- **Storage** - Armazenamento de arquivos
- **Edge Functions** - Funções serverless
- **Vectors** - Busca semântica com embeddings

---

## 📊 Plano de Migração Detalhado

### Fase 1: Preparação (Dia 1)

#### 1.1 Criar Estrutura Supabase
```bash
# 1. Acessar Supabase Dashboard
# 2. Criar tabelas com schema equivalente
# 3. Configurar políticas de segurança (RLS)
# 4. Criar índices para performance
```

#### 1.2 Mapear Schema MySQL → PostgreSQL

| MySQL | PostgreSQL | Tipo |
|-------|-----------|------|
| `users` | `users` | Tabela |
| `festas` | `festas` | Tabela |
| `clientes` | `clientes` | Tabela |
| `pagamentos` | `pagamentos` | Tabela |
| `visitacoes` | `visitacoes` | Tabela |
| `funcionarios_festa` | `funcionarios_festa` | Tabela |
| `observacoes_festa` | `observacoes_festa` | Tabela |

#### 1.3 Criar Tabelas no Supabase

```sql
-- Tabela Users (com Supabase Auth)
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  email TEXT UNIQUE,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  role TEXT CHECK (role IN ('admin', 'supervisor', 'atendente', 'gerente', 'cliente')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_signed_in TIMESTAMP DEFAULT NOW()
);

-- Tabela Clientes
CREATE TABLE clientes (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT,
  telefone VARCHAR(20),
  cpf VARCHAR(14) UNIQUE,
  endereco TEXT,
  cidade TEXT,
  estado VARCHAR(2),
  cep VARCHAR(10),
  data_cadastro TIMESTAMP DEFAULT NOW(),
  ativo BOOLEAN DEFAULT TRUE
);

-- Tabela Festas
CREATE TABLE festas (
  id BIGSERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  cliente_id BIGINT REFERENCES clientes(id),
  tema TEXT,
  data_evento TIMESTAMP NOT NULL,
  data_fechamento TIMESTAMP DEFAULT NOW(),
  local TEXT,
  numero_convidados INT,
  valor_total DECIMAL(10, 2),
  valor_pago DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'agendada',
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela Pagamentos
CREATE TABLE pagamentos (
  id BIGSERIAL PRIMARY KEY,
  festa_id BIGINT REFERENCES festas(id),
  valor DECIMAL(10, 2) NOT NULL,
  data_pagamento TIMESTAMP,
  metodo TEXT,
  comprovante_url TEXT,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela Visitações
CREATE TABLE visitacoes (
  id BIGSERIAL PRIMARY KEY,
  cliente_id BIGINT REFERENCES clientes(id),
  data_visita TIMESTAMP DEFAULT NOW(),
  observacoes TEXT,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela Funcionários Festa
CREATE TABLE funcionarios_festa (
  id BIGSERIAL PRIMARY KEY,
  festa_id BIGINT REFERENCES festas(id),
  nome TEXT NOT NULL,
  telefone VARCHAR(20),
  funcao TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela Observações Festa
CREATE TABLE observacoes_festa (
  id BIGSERIAL PRIMARY KEY,
  festa_id BIGINT REFERENCES festas(id),
  tipo TEXT,
  texto TEXT,
  criado_por BIGINT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 1.4 Configurar Row Level Security (RLS)

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE festas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios_festa ENABLE ROW LEVEL SECURITY;
ALTER TABLE observacoes_festa ENABLE ROW LEVEL SECURITY;

-- Políticas de exemplo (ajustar conforme necessário)
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Supervisors can view all festas"
  ON festas FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('admin', 'supervisor'));
```

### Fase 2: Migração de Dados (Dia 2)

#### 2.1 Exportar Dados do MySQL

```bash
# Exportar cada tabela como CSV
mysqldump -u root -p festeja_kids users > users.sql
mysqldump -u root -p festeja_kids clientes > clientes.sql
mysqldump -u root -p festeja_kids festas > festas.sql
# ... etc para todas as tabelas
```

#### 2.2 Importar Dados no Supabase

```sql
-- Via psql ou Supabase SQL Editor
-- 1. Desabilitar triggers temporariamente
-- 2. Importar dados
-- 3. Reabilitar triggers
-- 4. Validar integridade

-- Exemplo: Importar clientes
\COPY clientes FROM 'clientes.csv' WITH (FORMAT csv, HEADER true);

-- Validar contagem
SELECT COUNT(*) FROM clientes;  -- Deve ser 189
```

#### 2.3 Validar Integridade de Dados

```sql
-- Verificar contagens
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'clientes', COUNT(*) FROM clientes
UNION ALL
SELECT 'festas', COUNT(*) FROM festas
UNION ALL
SELECT 'pagamentos', COUNT(*) FROM pagamentos
UNION ALL
SELECT 'visitacoes', COUNT(*) FROM visitacoes
UNION ALL
SELECT 'funcionarios_festa', COUNT(*) FROM funcionarios_festa
UNION ALL
SELECT 'observacoes_festa', COUNT(*) FROM observacoes_festa;

-- Verificar chaves estrangeiras
SELECT * FROM festas WHERE cliente_id NOT IN (SELECT id FROM clientes);
SELECT * FROM pagamentos WHERE festa_id NOT IN (SELECT id FROM festas);
```

### Fase 3: Atualizar Backend (Dia 3)

#### 3.1 Instalar Dependências Supabase

```bash
pnpm add @supabase/supabase-js @supabase/auth-helpers-express
pnpm add -D @types/supabase
```

#### 3.2 Configurar Variáveis de Ambiente

```bash
# .env
SUPABASE_URL=https://nozjreykfzqokafklbsz.supabase.co
SUPABASE_ANON_KEY=[OBTER_DO_DASHBOARD]
SUPABASE_SERVICE_ROLE_KEY=[OBTER_DO_DASHBOARD]
DATABASE_URL=postgresql://postgres:Aruimedes@Msc@db.nozjreykfzqokafklbsz.supabase.co:5432/postgres
VITE_SUPABASE_URL=https://nozjreykfzqokafklbsz.supabase.co
VITE_SUPABASE_ANON_KEY=[OBTER_DO_DASHBOARD]
```

#### 3.3 Criar Cliente Supabase

```typescript
// server/_core/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
```

#### 3.4 Atualizar Procedures tRPC

```typescript
// Exemplo: Migrar procedure de festas
export const festasRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await supabase
      .from('festas')
      .select('*')
      .order('data_evento', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  }),
  
  create: protectedProcedure
    .input(z.object({ /* ... */ }))
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await supabase
        .from('festas')
        .insert([input])
        .select();
      
      if (error) throw new Error(error.message);
      return data[0];
    }),
});
```

#### 3.5 Remover Código OAuth Antigo

```bash
# Deletar arquivos não mais necessários
rm server/_core/oauth.ts
rm server/_core/context.ts  # Atualizar para usar Supabase Auth

# Atualizar imports em:
# - server/routers.ts
# - server/_core/index.ts
```

### Fase 4: Atualizar Frontend (Dia 4)

#### 4.1 Instalar Dependências Frontend

```bash
pnpm add @supabase/supabase-js @supabase/auth-helpers-react
```

#### 4.2 Criar Provider Supabase

```typescript
// client/src/contexts/SupabaseContext.tsx
import { createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const SupabaseContext = createContext(supabase);

export function SupabaseProvider({ children }) {
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  return useContext(SupabaseContext);
}
```

#### 4.3 Atualizar UserSelector para Supabase Auth

```typescript
// client/src/pages/UserSelector.tsx
// Usar Supabase Auth em vez de localStorage
// Implementar login com email/senha
// Gerenciar sessão via Supabase
```

#### 4.4 Atualizar App.tsx

```typescript
// client/src/App.tsx
import { SupabaseProvider } from './contexts/SupabaseContext';

export default function App() {
  return (
    <SupabaseProvider>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </SupabaseProvider>
  );
}
```

### Fase 5: Testes e Validação (Dia 5)

#### 5.1 Testes Unitários

```bash
pnpm test
```

#### 5.2 Testes E2E com Playwright

```bash
pnpm test:e2e
pnpm test:e2e:report
```

#### 5.3 Testes de Performance

- Verificar latência de queries
- Validar índices de banco de dados
- Testar conexões simultâneas

#### 5.4 Testes de Segurança

- Validar RLS policies
- Testar acesso não autorizado
- Verificar SQL injection prevention

### Fase 6: Deploy (Dia 6)

#### 6.1 Build para Produção

```bash
pnpm build
```

#### 6.2 Deploy no Manus

```bash
# Fazer checkpoint final
webdev_save_checkpoint

# Publicar via UI Manus
# Ou via CLI se disponível
```

#### 6.3 Validação Pós-Deploy

- Testar todas as funcionalidades
- Monitorar logs de erro
- Validar performance
- Testar backup/restore

---

## 📅 Cronograma

| Fase | Atividade | Duração | Data Prevista |
|------|-----------|---------|---------------|
| 1 | Preparação e Schema | 4h | 28/11/2025 |
| 2 | Migração de Dados | 3h | 28/11/2025 |
| 3 | Backend Supabase | 6h | 29/11/2025 |
| 4 | Frontend Supabase | 4h | 29/11/2025 |
| 5 | Testes e Validação | 4h | 30/11/2025 |
| 6 | Deploy | 2h | 30/11/2025 |
| **Total** | | **23h** | |

---

## ⚠️ Riscos e Mitigação

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|--------|-----------|
| Perda de dados durante migração | Baixa | Alto | Backup completo antes, validação pós-migração |
| Incompatibilidade de tipos | Média | Médio | Testes unitários abrangentes |
| Performance degradada | Baixa | Médio | Índices otimizados, testes de carga |
| Downtime durante migração | Baixa | Alto | Migração em horário de baixo uso |
| Problemas de autenticação | Média | Alto | Testes E2E, rollback plan |
| Limite de taxa Supabase | Baixa | Médio | Monitorar uso, escalar se necessário |

---

## 🔄 Rollback Plan

Se algo der errado durante a migração:

### Opção 1: Rollback Imediato (< 1 hora após deploy)

```bash
# 1. Reverter para checkpoint anterior
webdev_rollback_checkpoint <version_id>

# 2. Restaurar banco MySQL
mysql -u root -p festeja_kids < backup_mysql.sql

# 3. Validar funcionamento
pnpm test:e2e
```

### Opção 2: Manutenção do Supabase (1-4 horas)

```bash
# 1. Manter Supabase como backup
# 2. Voltar para MySQL em produção
# 3. Sincronizar dados
# 4. Tentar novamente após correções
```

### Opção 3: Migração Gradual (Recomendado)

```bash
# 1. Manter ambos os bancos em paralelo
# 2. Migrar usuários gradualmente
# 3. Validar cada grupo antes de prosseguir
# 4. Desativar MySQL após 100% migrado
```

---

## ✅ Pós-Migração

### Checklist de Validação

- [ ] Todos os dados migrados corretamente
- [ ] Autenticação funcionando com Supabase Auth
- [ ] Todas as telas do Supervisor funcionando
- [ ] Testes E2E passando 100%
- [ ] Performance dentro dos limites
- [ ] Backups automáticos configurados
- [ ] Monitoramento e alertas ativados
- [ ] Documentação atualizada

### Tarefas Pós-Migração

1. **Remover MySQL**
   - Desativar banco MySQL Manus
   - Arquivar backups
   - Documentar processo

2. **Otimizar Supabase**
   - Revisar índices
   - Ajustar RLS policies
   - Configurar cache

3. **Implementar Realtime** (Opcional)
   - Subscriptions para atualizações de festas
   - Notificações em tempo real
   - Sincronização automática

4. **Documentação**
   - Atualizar README
   - Criar guia de deployment
   - Documentar procedures Supabase

---

## 📚 Referências

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Drizzle ORM Supabase](https://orm.drizzle.team/docs/get-started-postgresql)

---

**Documento Preparado Por:** Sistema Manus  
**Data de Criação:** 27 de Novembro de 2025  
**Versão:** 1.0  
**Status:** Pronto para Execução
