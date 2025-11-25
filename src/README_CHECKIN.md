# ✅ SISTEMA DE CHECK-IN - INÍCIO RÁPIDO

## 🎯 OBJETIVO

Criar um evento em andamento e testar o sistema de check-in/presença por sessões.

---

## 🚀 INÍCIO RÁPIDO (3 PASSOS)

### **1️⃣ CRIAR EVENTO EM ANDAMENTO**

📄 Execute: `/CRIAR_EVENTO_EM_ANDAMENTO.sql`

```
1. Abra: https://app.supabase.com
2. SQL Editor → New Query
3. Copie TODO o conteúdo do arquivo
4. Execute: Ctrl+Enter
```

✅ **Cria:**
- Evento "Semana de Tecnologia e Inovação 2025"
- Duração: 5 dias (40 horas)
- Estrutura: 2 sessões por dia × 4h cada = 8h/dia
- Status: 🔴 EM ANDAMENTO (começou há 3 dias)
- Inscrito: joao.2019312178@aluno.iffar.edu.br
- Presença atual: 24/40 horas (60%)
- 6 sessões já registradas (3 dias completos)

---

### **2️⃣ FAZER CHECK-IN DE HOJE**

📄 Execute: `/FAZER_CHECKIN.sql`

```sql
-- O script já vem configurado para:
v_user_email := 'joao.2019312178@aluno.iffar.edu.br';
v_evento_nome := 'Semana de Tecnologia e Inovação 2025';
v_sessao_nome := 'Dia 4 - Manhã: Segurança da Informação (4h)';

-- Registra 1 sessão = +4 horas
-- Execute 2x para registrar dia completo (manhã + tarde = 8h)
```

✅ **Atualiza para:**
- Após 1ª sessão: 28/40 horas (70%)
- Após 2ª sessão: 32/40 horas (80%) ✅ Aprovado!

---

### **3️⃣ VERIFICAR STATUS**

```sql
-- Ver total de presença
SELECT 
    e.nome,
    p.numero_presencas || '/' || e.duracao_horas as presenca,
    ROUND((p.numero_presencas / e.duracao_horas) * 100, 1) || '%' as percentual
FROM participacoes p
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br';
```

---

## 📁 ARQUIVOS DISPONÍVEIS

| Arquivo | Descrição |
|---------|-----------|
| ⭐ `/CRIAR_EVENTO_EM_ANDAMENTO.sql` | Cria evento em andamento com sessões simuladas |
| ⭐ `/FAZER_CHECKIN.sql` | Registra check-in em sessão |
| 📖 `/README_CHECKIN.md` | Este guia (início rápido) |

---

## 📊 COMO FUNCIONA O SISTEMA

### **Estrutura do Banco:**

```
presencas_detalhes:
  - participacao_id → referência à inscrição
  - sessao_nome → nome da atividade/sessão
  - data_registro → timestamp do check-in
  - registrado_por → quem registrou (opcional)
```

### **Conceito:**

```
Evento de 40 horas = 5 dias × 8h
Cada dia = 2 sessões × 4h cada

Exemplo:
  Dia 1:
    ✅ Manhã: "Dia 1 - Manhã: Abertura (4h)"
    ✅ Tarde: "Dia 1 - Tarde: Workshop (4h)"
    = 8 horas

  Participante faz check-in em cada sessão
  Sistema soma: 4h + 4h + 4h... = total de horas
  
  Se total ≥ 75% → ✅ APROVADO para certificado
```

---

## 📊 ESTRUTURA DO EVENTO CRIADO

```
┌─────────────────────────────────────────────┐
│ Semana de Tecnologia e Inovação 2025        │
├─────────────────────────────────────────────┤
│ Status: 🔴 EM ANDAMENTO                     │
│ Duração: 5 dias (40 horas)                  │
│ Estrutura: 2 sessões/dia × 4h = 8h/dia      │
│ Limite de faltas: 25%                       │
│ Frequência mínima: 75% (30 horas)           │
│ Gratuito                                    │
└─────────────────────────────────────────────┘

CRONOGRAMA DE SESSÕES:
┌──────┬─────────────┬────────────────┬──────────┐
│ Dia  │ Data        │ Sessões        │ Status   │
├──────┼─────────────┼────────────────┼──────────┤
│ 1    │ Há 3 dias   │ Manhã + Tarde  │ ✅ Feito │
│ 2    │ Há 2 dias   │ Manhã + Tarde  │ ✅ Feito │
│ 3    │ Ontem       │ Manhã + Tarde  │ ✅ Feito │
│ 4    │ HOJE        │ Manhã + Tarde  │ 🔴 FAZER │
│ 5    │ Amanhã      │ Manhã + Tarde  │ ⏰ Futuro│
└──────┴─────────────┴────────────────┴──────────┘

PARTICIPANTE:
Email: joao.2019312178@aluno.iffar.edu.br
Sessões registradas: 6
Presença atual: 24/40 horas (60%)
Status: ⚠️ Precisa de mais 6h para ser aprovado
```

---

## ✅ EXEMPLOS DE SESSÕES

### **Estrutura do Nome:**

```
"Dia X - Período: Título da Atividade (Xh)"
```

### **Exemplos:**

```
DIA 4 (HOJE):
✅ "Dia 4 - Manhã: Segurança da Informação (4h)"
✅ "Dia 4 - Tarde: Workshop de Ethical Hacking (4h)"

DIA 5 (AMANHÃ):
⏰ "Dia 5 - Manhã: Tendências em Tecnologia (4h)"
⏰ "Dia 5 - Tarde: Encerramento e Networking (4h)"

SESSÕES CUSTOMIZADAS:
📌 "Workshop Especial: Design de Software (4h)"
📌 "Palestra Extra: Carreira em TI (2h)"
📌 "Mesa Redonda: Futuro da IA (3h)"
```

---

## 🎯 SCRIPT RÁPIDO: DIA COMPLETO

Para registrar **manhã + tarde** de uma vez (8 horas):

```sql
DO $$
DECLARE
    v_participacao_id integer;
BEGIN
    -- Buscar participação
    SELECT p.id INTO v_participacao_id
    FROM participacoes p
    JOIN eventos e ON p.evento_id = e.id
    JOIN auth.users u ON p.usuario_id = u.id
    WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br'
      AND e.nome = 'Semana de Tecnologia e Inovação 2025';
    
    -- Manhã
    INSERT INTO presencas_detalhes (participacao_id, sessao_nome)
    VALUES (v_participacao_id, 'Dia 4 - Manhã: Segurança (4h)');
    
    -- Tarde
    INSERT INTO presencas_detalhes (participacao_id, sessao_nome)
    VALUES (v_participacao_id, 'Dia 4 - Tarde: Workshop (4h)');
    
    -- Atualizar total
    UPDATE participacoes
    SET numero_presencas = numero_presencas + 8
    WHERE id = v_participacao_id;
    
    RAISE NOTICE '✅ Dia completo registrado! +8 horas';
END $$;
```

---

## 📈 REGRAS DE APROVAÇÃO

### **Fórmula:**

```
Frequência = (numero_presencas / duracao_horas) × 100

Aprovado se:
  Frequência ≥ (100% - limite_faltas%)

Exemplo com limite de 25%:
  Frequência mínima = 75%
  
  30/40 horas = 75% → ✅ APROVADO
  28/40 horas = 70% → ❌ REPROVADO
```

### **Certificado:**

```
✅ Disponível quando:
  1. Evento terminou
  2. Frequência ≥ 75%
  3. Pagamento confirmado (se pago)

❌ Indisponível quando:
  1. Evento em andamento
  2. Frequência < 75%
  3. Pagamento pendente
```

---

## 🔍 CONSULTAS ÚTEIS

### **Ver minhas sessões:**

```sql
SELECT 
    pd.sessao_nome,
    pd.data_registro::date as data,
    pd.data_registro::time as hora
FROM presencas_detalhes pd
JOIN participacoes p ON pd.participacao_id = p.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'seu-email@exemplo.com'
ORDER BY pd.data_registro DESC;
```

### **Contar sessões por dia:**

```sql
SELECT 
    pd.data_registro::date as data,
    COUNT(*) as sessoes,
    COUNT(*) * 4 || 'h' as horas
FROM presencas_detalhes pd
JOIN participacoes p ON pd.participacao_id = p.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'seu-email@exemplo.com'
GROUP BY pd.data_registro::date
ORDER BY data DESC;
```

### **Ver frequência atual:**

```sql
SELECT 
    e.nome,
    p.numero_presencas || '/' || e.duracao_horas as presenca,
    ROUND((p.numero_presencas / e.duracao_horas) * 100, 1) || '%' as percentual,
    CASE 
        WHEN (p.numero_presencas / e.duracao_horas) * 100 >= 75
        THEN '✅ Aprovado'
        ELSE '❌ Precisa de mais ' || (30 - p.numero_presencas) || 'h'
    END as status
FROM participacoes p
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'seu-email@exemplo.com';
```

---

## 🧪 CENÁRIO DE TESTE COMPLETO

```
1. ✅ Executar: CRIAR_EVENTO_EM_ANDAMENTO.sql
   → 6 sessões (24h) já registradas

2. ✅ Executar: FAZER_CHECKIN.sql (manhã)
   → +1 sessão = 28h (70%)

3. ✅ Executar: FAZER_CHECKIN.sql (tarde)
   → +1 sessão = 32h (80%) ✅ APROVADO

4. ✅ Registrar sessões do dia 5 (futuro)
   → +2 sessões = 40h (100%)

5. ✅ Verificar certificado disponível! 🎓
```

---

## ✅ CHECKLIST

- [ ] Executei `/CRIAR_EVENTO_EM_ANDAMENTO.sql`
- [ ] Vi evento criado: 24/40h (60%)
- [ ] Executei `/FAZER_CHECKIN.sql` para manhã
- [ ] Vi atualização: 28/40h (70%)
- [ ] Executei `/FAZER_CHECKIN.sql` para tarde
- [ ] Vi atualização: 32/40h (80%) ✅
- [ ] Status: "SERÁ APROVADO"
- [ ] Entendi o sistema de sessões! ✅

---

## 🎉 PRONTO!

Agora você tem:

✅ Evento em andamento criado
✅ Sistema de check-in por sessões
✅ 6 sessões já registradas
✅ Scripts para adicionar novas sessões
✅ Cálculo automático de frequência
✅ Aprovação automática para certificados

**Execute os scripts e teste!** 🚀✅

---

**Criado em:** 24/11/2025  
**Versão:** 2.0 (Atualizado para estrutura real do banco)  
**Status:** ✅ Pronto para uso
