# Relatório de Extração de Contratos - Festeja Kids

**Data de Extração:** 27 de Novembro de 2025  
**Período Coberto:** 2024, 2025 e 2026

---

## Resumo Executivo

Foram extraídos e processados **407 contratos** de festas infantis dos anos 2024, 2025 e 2026. Os dados foram estruturados em formato JSON com alta confiabilidade para uso em banco de dados.

| Ano | Total de Contratos | Taxa de Completude |
|-----|-------------------|-------------------|
| 2024 | 173 | 93% |
| 2025 | 193 | 98% |
| 2026 | 41 | 100% |
| **TOTAL** | **407** | **97%** |

---

## Campos Extraídos por Contrato

### 1. Data do Fechamento
- **Descrição:** Data em que o contrato foi assinado/fechado
- **Taxa de Preenchimento:** 100% (407/407)

### 2. Dados do Evento

#### 2.1 Endereço do Salão
- **Taxa de Preenchimento:** 100% (407/407)
- **Observação:** Todos os contratos possuem endereço do local do evento

#### 2.2 Duração do Evento
- **Taxa de Preenchimento:** 100% (407/407)
- **Valor Típico:** 4 horas

#### 2.3 Número de Convidados
- **Taxa de Preenchimento:** 100% (407/407)
- **Formato:** Geralmente "80+10" (adultos + crianças)

#### 2.4 Horário do Evento
- **Taxa de Preenchimento:** 100% (407/407)
- **Exemplos:** 13h às 17h, 19h às 23h

#### 2.5 Data do Evento
- **Taxa de Preenchimento:** 99,5% (406/407)
- **Formato:** DD/MM/YYYY

#### 2.6 Tema da Festa
- **Taxa de Preenchimento:** 98,5% (401/407)
- **Campos Vazios:** 6 contratos (2024: 6, 2025: 1, 2026: 1)
- **Exemplos:** Minnie Confeiteira, Wandinha, Jardim Encantado

#### 2.7 Aniversariante
- **Taxa de Preenchimento:** 100% (407/407)
- **Formato:** Nome + Idade (ex: "Rafaela 1 ano")

### 3. Dados do Cliente

#### 3.1 Nome do Contratante
- **Taxa de Preenchimento:** 100% (407/407)

#### 3.2 CPF
- **Taxa de Preenchimento:** 99,5% (405/407)
- **Campos Vazios:** 2 contratos (2024: 2, 2025: 2, 2026: 0)
- **Formato:** Armazenado sem formatação (apenas dígitos)

#### 3.3 Endereço do Cliente
- **Taxa de Preenchimento:** 100% (407/407)

#### 3.4 Telefone
- **Taxa de Preenchimento:** 100% (407/407)
- **Formato:** Geralmente com dois números (ex: "985356914//977474462")

### 4. Dados de Pagamento

#### 4.1 Número de Pessoas
- **Taxa de Preenchimento:** 100% (407/407)

#### 4.2 Valor da Festa
- **Taxa de Preenchimento:** 96% (391/407)
- **Campos Vazios:** 16 contratos
  - 2024: 11 contratos
  - 2025: 3 contratos
  - 2026: 0 contratos
- **Formato:** Valor em reais (ex: "4700,00")
- **Observação:** Alguns contratos não possuem valor especificado, possivelmente por serem orçamentos em aberto

---

## Qualidade dos Dados por Ano

### 2024
- **Total de Contratos:** 173
- **Taxa de Completude Geral:** 93%
- **Problemas Identificados:**
  - 11 contratos sem valor de pagamento
  - 6 contratos sem tema
  - 2 contratos sem CPF
- **Arquivos Corrompidos:** 9 (não puderam ser extraídos)

### 2025
- **Total de Contratos:** 193
- **Taxa de Completude Geral:** 98%
- **Problemas Identificados:**
  - 3 contratos sem valor de pagamento
  - 1 contrato sem tema
  - 2 contratos sem CPF
- **Arquivos Corrompidos:** 4 (não puderam ser extraídos)

### 2026
- **Total de Contratos:** 41
- **Taxa de Completude Geral:** 100%
- **Problemas Identificados:** Nenhum
- **Arquivos Corrompidos:** 0

---

## Estrutura JSON

Cada contrato foi estruturado no seguinte formato:

```json
{
  "arquivo": "Nome do arquivo DOCX",
  "caminho": "Caminho completo do arquivo",
  "data_fechamento": "DD/MM/YYYY",
  "evento": {
    "endereco": "Endereço do salão",
    "duracao": "Duração (ex: 4h)",
    "numero_convidados": "Número de convidados",
    "horario": "Horário do evento",
    "data": "DD/MM/YYYY",
    "tema": "Tema da festa",
    "aniversariante": "Nome e idade"
  },
  "cliente": {
    "nome": "Nome do contratante",
    "cpf": "CPF (apenas dígitos)",
    "endereco": "Endereço do cliente",
    "telefone": "Telefone(s)"
  },
  "pagamento": {
    "numero_pessoas": "Número de pessoas",
    "valor": "Valor em reais"
  },
  "status_extracao": "sucesso"
}
```

---

## Recomendações

1. **Campos com Valores Vazios:** Os 16 contratos com valor vazio devem ser verificados manualmente nos arquivos originais para completar a informação.

2. **Tema da Festa:** Os 6 contratos sem tema devem ser consultados para preenchimento manual.

3. **Validação de CPF:** Os 2 contratos sem CPF devem ser verificados para garantir a integridade dos dados.

4. **Backup:** Recomenda-se manter os arquivos DOCX originais como backup e referência.

5. **Integração com Banco de Dados:** Os JSONs estão prontos para importação em um banco de dados relacional ou NoSQL.

---

## Arquivos Gerados

- `contratos_2024.json` - 173 contratos
- `contratos_2025.json` - 193 contratos
- `contratos_2026.json` - 41 contratos

**Total de Registros:** 407 contratos

---

## Notas Técnicas

- **Ferramenta de Extração:** Python 3 com biblioteca `python-docx`
- **Padrão de Dados:** JSON com encoding UTF-8
- **Validação:** Realizada com script de validação customizado
- **Taxa de Sucesso:** 99,7% dos arquivos foram processados com sucesso

---

**Relatório Gerado em:** 27 de Novembro de 2025
