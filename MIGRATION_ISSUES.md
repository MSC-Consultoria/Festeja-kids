# Roteiro de Issues para Migração (Supabase)

Issues sugeridas com base no [Plano de Migração Festeja Kids 2.0 para Supabase](./Plano%20de%20Migração%20Festeja%20Kids%202.0%20para%20Supabase.md). Cada issue cobre uma fase do plano e traz entregáveis/validações claras.

## 1. Preparação e Backup
- **Título sugerido:** Inventariar dados e gerar backup seguro
- **Descrição:** Levantar tabelas críticas (festas, clientes, pagamentos, custos, agenda), volumes e relacionamentos; gerar dump completo do banco atual e armazenar de forma segura; registrar janela de migração e responsáveis pelo go/no-go.
- **Critérios de aceite:**
  - Inventário de tabelas/volumes compartilhado no issue ou anexo.
  - Backup completo gerado e validado com restauração de teste.
  - Janela de migração, responsáveis e plano de rollback preliminar documentados.

## 2. Configuração do Supabase
- **Título sugerido:** Provisionar instância e roles mínimas no Supabase
- **Descrição:** Criar roles/usuários com menor privilégio (app/admin), habilitar extensões requeridas (pgcrypto/uuid-ossp) e revisar limites de conexão. Atualizar `.env.example` apenas com placeholders (sem segredos) e validar acesso usando `pnpm db:push` ou ferramenta SQL.
- **Critérios de aceite:**
  - Roles/usuários criados e documentados (perfis de acesso). 
  - Extensões necessárias habilitadas e conexão validada.
  - Placeholders de variáveis incluídos/ajustados no repositório; segredos fora do versionamento.

## 3. Adequação de Schema
- **Título sugerido:** Ajustar schema Drizzle para Postgres Supabase
- **Descrição:** Revisar tipos/defaults/índices para compatibilidade com Supabase, gerar migrações faltantes e sincronizar com `pnpm db:push` ou `pnpm db:migrate`. Preparar seeds mínimos (status, categorias) garantindo idempotência.
- **Critérios de aceite:**
  - Migrações novas versionadas em `drizzle/` quando necessário.
  - Execução bem-sucedida das migrações no Supabase.
  - Seeds validados e repetíveis sem duplicações.

## 4. Migração de Dados
- **Título sugerido:** Importar históricos 2024/2025 e eventos futuros
- **Descrição:** Executar scripts idempotentes para cargas históricas e próximas festas; salvar logs de execução (tempo, contagens por tabela, erros) e validar chaves estrangeiras/unicidade pós-carga.
- **Critérios de aceite:**
  - Dados de 2024, 2025 e eventos futuros presentes e reconciliados.
  - Logs de carga anexados ao issue.
  - Validação de chaves estrangeiras e unicidade de clientes concluída.

## 5. Validação Funcional e Financeira
- **Título sugerido:** Validar totais financeiros e fluxos críticos
- **Descrição:** Comparar totais de faturamento/recebimentos/saldos com planilhas; realizar amostragens de contratos/parcelas/datas; rodar smoke tests da aplicação apontando para Supabase (login, listagem, criação de festa/pagamento).
- **Critérios de aceite:**
  - Totais financeiros batendo com referências documentadas.
  - Amostragens aprovadas e queries anexadas.
  - Smoke tests executados e evidenciados (prints/logs).

## 6. Go-live e Rollback
- **Título sugerido:** Virada de conexão e monitoramento inicial
- **Descrição:** Alternar variáveis de conexão para Supabase em produção/homologação, manter backup pronto para rollback e definir passos claros de reversão. Ativar monitoramento inicial (logs, conexões, disponibilidade) nas primeiras 24h.
- **Critérios de aceite:**
  - Ambientes apontando para Supabase e funcionando.
  - Plano de rollback testado ou simulado.
  - Monitoramento ativo com responsáveis definidos.

## 7. Encerramento
- **Título sugerido:** Documentar resultados e desativar ambiente antigo
- **Descrição:** Consolidar lições aprendidas, evidências de testes e atualizações de operação/manutenção. Formalizar aceite com stakeholders e desativar recursos antigos quando seguro.
- **Critérios de aceite:**
  - Documentação atualizada e anexada ao repositório ou wiki.
  - Aceite formal registrado (comentário ou ata).
  - Recursos antigos desativados ou plano de desativação definido.
