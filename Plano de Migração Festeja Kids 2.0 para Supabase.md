# Plano de Migração Festeja Kids 2.0 para Supabase

## Objetivo
Migrar o backend do Festeja Kids 2.0 para o PostgreSQL gerenciado pelo Supabase, garantindo continuidade operacional, integridade dos dados de festas/pagamentos/clientes e alinhamento com a arquitetura atual (Express/tRPC + Drizzle ORM).

## Escopo e Premissas
- Escopo: banco de dados (PostgreSQL Supabase) e integrações do backend; armazenamento de arquivos e autenticação só serão ajustados se impactarem os fluxos existentes.
- Premissas: acesso ao projeto Supabase já provisionado, uso de variáveis de ambiente para segredos, backups exportáveis do banco atual e ferramentas de migração SQL disponíveis.
- Fora de escopo: refatorações de UX do frontend e mudanças de regra de negócio.

## Linha do Tempo Recomendada
1. Preparação (1 a 2 dias): inventário de dados, backup e validação de conectividade.
2. Configuração Supabase (1 dia): roles, policies, extensões e variáveis `.env` atualizadas.
3. Adequação do schema (1 a 2 dias): ajustes Drizzle, migrações e seed inicial controlado.
4. Migração e validação (2 a 3 dias): cargas históricas/atuais, checks financeiros e de integridade.
5. Go-live e monitoramento (1 dia): troca de conexão, smoke tests e plano de rollback ativo.

## Fases e Entregáveis
### 1) Preparação
- Levantar tabelas, volumes e relacionamentos críticos (festas, clientes, pagamentos, custos, agenda).
- Exportar backup completo do banco atual (dump SQL) e armazenar em local seguro.
- Definir janela de migração e responsáveis por aprovação/rollback.

### 2) Configuração do Supabase
- Criar roles/usuários mínimos com princípio de menor privilégio (app, admin).
- Habilitar extensões necessárias (pgcrypto/uuid-ossp) e revisar limites de conexão.
- Registrar variáveis de ambiente no repositório apenas como placeholders; segredos ficam fora do versionamento.

### 3) Adequação de Schema
- Revisar modelo Drizzle para garantir compatibilidade com Postgres Supabase (tipos, defaults, índices).
- Gerar migrações faltantes e sincronizar no Supabase via `pnpm db:push` ou `pnpm db:migrate`.
- Preparar scripts de seed consistentes com dados obrigatórios (ex.: status, categorias).

### 4) Migração de Dados
- Executar importação histórica (2024 e 2025) e das festas futuras com scripts idempotentes.
- Registrar logs de execução (tempo, contagens por tabela, erros) e salvar evidências.
- Validar chaves estrangeiras, unicidade de clientes e status financeiros após a carga.

### 5) Validação Funcional e Financeira
- Comparar totais de faturamento, recebimentos e saldos com planilhas de referência.
- Rodar consultas de amostragem (contrato, parcelas, datas) e checar consistência de agenda.
- Executar smoke tests na aplicação apontando para o Supabase (login, listagem, criação de festa/pagamento).

### 6) Go-live e Rollback
- Alternar variáveis de conexão para Supabase no ambiente de produção/homologação.
- Manter backup pronto para rollback e instruções claras para revertê-lo.
- Monitorar logs de erro, consumo de conexões e métricas de disponibilidade nas primeiras 24h.

### 7) Encerramento
- Documentar resultados, problemas encontrados e ajustes aplicados.
- Atualizar guia de operação/manutenção com instruções do novo ambiente.
- Formalizar aceite com stakeholders e desativar recursos antigos se seguro.
