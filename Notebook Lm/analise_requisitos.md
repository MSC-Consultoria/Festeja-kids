# Análise de Requisitos - Sistema Festeja Kids 2.0

## 1. Visão Geral do Negócio

O **Festeja Kids** é um negócio de organização de festas infantis que necessita de um sistema de controle completo para gerenciar suas operações. Atualmente, o controle é feito através de planilhas Excel, com dados distribuídos em múltiplos arquivos.

## 2. Estrutura de Dados Identificada

### 2.1 Festas
A entidade central do sistema, com as seguintes informações:

- **Código do contrato**: Identificador único (formato: DDMMYYXX, ex: 010425AN)
- **Nome do cliente**: Nome completo do contratante
- **Data de fechamento**: Quando o contrato foi fechado
- **Data da festa**: Quando a festa será realizada
- **Valor da festa**: Valor total contratado
- **Valor pago/recebido**: Quanto já foi pago pelo cliente
- **Número de convidados**: Quantidade de pessoas esperadas
- **Telefone/Contato**: Informações de contato do cliente
- **Tema**: Tema da festa (opcional)
- **Horário**: Horário da festa (opcional)
- **Pagamentos**: Múltiplos pagamentos parcelados

**Volumes identificados**:
- 2024: 167 festas realizadas
- 2025: 173 festas (já realizadas e agendadas)
- Próximas festas: 60+ festas futuras

### 2.2 Custos

O sistema possui dois tipos de custos:

#### Custos Variáveis (por festa):
- Equipe: R$ 830,00
- Compras: R$ 500,00
- Decoração: R$ 400,00
- Animação: R$ 200,00
- Salgados: R$ 420,00
- Bolo Fake: R$ 40,00
- Uber: R$ 50,00
- Açaí: R$ 50,00
- Bolo: R$ 200,00
- Assado: R$ 200,00
- Comissão GB: R$ 101,20 (2% do valor)
- Refrigerante: R$ 300,00
- **Total por festa**: R$ 3.291,20

#### Custos Fixos Mensais:
- Água: R$ 1.000,00
- Luz: R$ 6.000,00
- Gás: R$ 800,00
- IPTU: R$ 2.000,00
- Contador: R$ 400,00
- Faxina: R$ 600,00
- Escritório: R$ 600,00
- Detetização: R$ 400,00
- Marketing: R$ 1.000,00
- Anúncio: R$ 1.000,00
- Imóvel: R$ 7.000,00
- **Total mensal**: R$ 20.800,00

### 2.3 Análises Necessárias

O sistema atual já realiza análises importantes:

- **Análise Mensal**: Festas vendidas, valor vendido, valor recebido, convidados, valor por convidado, ticket médio, festas realizadas
- **Análise Trimestral**: Agregação dos dados mensais
- **Análise Anual**: Visão consolidada do ano
- **Controle de Recebimentos**: Valor a receber vs valor recebido

## 3. Funcionalidades Identificadas

### 3.1 Gestão de Festas
- Cadastro de novas festas
- Edição de festas existentes
- Visualização de festas (próximas, realizadas, por período)
- Controle de status (agendada, realizada, cancelada)
- Filtros por data, cliente, valor, status

### 3.2 Gestão Financeira
- Registro de pagamentos parciais
- Controle de valores a receber
- Cálculo automático de saldo devedor
- Histórico de pagamentos por festa
- Relatórios de inadimplência

### 3.3 Gestão de Custos
- Cadastro e edição de custos variáveis
- Cadastro e edição de custos fixos
- Cálculo automático de custo por festa
- Cálculo de margem de lucro
- Ponto de equilíbrio mensal

### 3.4 Relatórios e Análises
- Dashboard com indicadores principais
- Análise mensal, trimestral e anual
- Gráficos de evolução de vendas
- Análise de ticket médio
- Análise de valor por convidado
- Previsão de faturamento
- Análise de lucratividade

### 3.5 Gestão de Clientes
- Cadastro de clientes
- Histórico de festas por cliente
- Informações de contato
- Clientes recorrentes

## 4. Requisitos Técnicos

### 4.1 Funcionalidades Essenciais
- Sistema web responsivo (desktop e mobile)
- Banco de dados relacional
- Autenticação e controle de acesso
- Backup automático de dados
- Exportação de relatórios (PDF, Excel)
- Interface intuitiva e fácil de usar

### 4.2 Segurança
- Login com senha
- Criptografia de dados sensíveis
- Logs de auditoria
- Backup periódico

### 4.3 Performance
- Carregamento rápido de páginas
- Busca eficiente de festas
- Geração rápida de relatórios

## 5. Métricas Importantes

Com base nos dados históricos:

- **Ticket Médio 2024**: R$ 4.820,00
- **Ticket Médio 2025**: R$ 5.060,00
- **Valor médio por convidado**: R$ 47-50
- **Custo variável por festa**: R$ 3.291,20
- **Custo fixo mensal**: R$ 20.800,00
- **Média de festas por mês**: ~15 festas
- **Margem bruta aproximada**: 35-40%

## 6. Prioridades para o Sistema

1. **Alta Prioridade**:
   - Cadastro e gestão de festas
   - Controle financeiro (pagamentos e recebimentos)
   - Dashboard com indicadores principais
   - Relatórios mensais

2. **Média Prioridade**:
   - Gestão de custos
   - Análise de lucratividade
   - Gestão de clientes
   - Exportação de relatórios

3. **Baixa Prioridade**:
   - Integração com calendário
   - Notificações automáticas
   - Gestão de fornecedores
   - Controle de estoque

## 7. Próximos Passos

1. Validar requisitos com o usuário
2. Definir arquitetura do sistema
3. Modelar banco de dados
4. Desenvolver protótipo
5. Implementar funcionalidades core
6. Testes e ajustes
7. Migração de dados históricos
8. Treinamento e implantação
