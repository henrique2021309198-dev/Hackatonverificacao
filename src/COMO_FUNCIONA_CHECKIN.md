# 📋 COMO FUNCIONA O SISTEMA DE CHECK-IN

## 🗄️ ESTRUTURA DO BANCO DE DADOS

### **Tabela: `presencas_detalhes`**

```typescript
{
  id: number;
  participacao_id: number;  // Referência à inscrição
  sessao_nome: string;      // Nome da atividade/sessão
  data_registro: timestamp; // Quando foi registrado
  registrado_por: uuid;     // Quem registrou (opcional)
}
```

### **Por que essa estrutura?**

✅ **Simples e flexível**
- Cada registro = 1 presença em 1 sessão
- Não precisa calcular horas (basta contar registros)
- Suporta eventos com múltiplas atividades

✅ **Rastreável**
- Sabe exatamente em quais atividades participou
- Registra quando e quem fez o check-in
- Histórico completo de participação

---

## 🔄 COMO FUNCIONA

### **Fluxo Completo:**

```
1. Evento criado com 40 horas
   └─ Dividido em sessões (ex: 10 sessões × 4h)

2. Participante se inscreve
   └─ Cria registro em participacoes

3. Participante faz check-in em cada sessão
   └─ Insere em presencas_detalhes
   └─ Atualiza numero_presencas em participacoes

4. No final, calcula frequência
   └─ numero_presencas / duracao_horas × 100%
   
5. Se frequência ≥ 75% → Aprovado ✅
```

---

## 📊 EXEMPLO PRÁTICO

### **Evento:**
```
Semana de Tecnologia
Duração: 40 horas
Estrutura: 5 dias × 8h/dia
Formato: 2 sessões/dia × 4h = 8h/dia
```

### **Sessões:**

```sql
-- Dia 1
"Dia 1 - Manhã: Abertura (4h)"
"Dia 1 - Tarde: Workshop IA (4h)"

-- Dia 2
"Dia 2 - Manhã: Cloud Computing (4h)"
"Dia 2 - Tarde: Docker (4h)"

-- Dia 3
"Dia 3 - Manhã: DevOps (4h)"
"Dia 3 - Tarde: Mesa Redonda (4h)"

-- etc...
```

### **Check-in do Participante:**

```sql
-- Participante faz check-in na sessão da manhã do Dia 1
INSERT INTO presencas_detalhes (
    participacao_id,
    sessao_nome
) VALUES (
    123, 
    'Dia 1 - Manhã: Abertura (4h)'
);

-- Atualiza total de presenças
UPDATE participacoes
SET numero_presencas = numero_presencas + 4
WHERE id = 123;

-- Resultado: numero_presencas = 4 horas
```

### **Ao longo do evento:**

```
Dia 1 Manhã  → +4h  →  4/40h (10%)
Dia 1 Tarde  → +4h  →  8/40h (20%)
Dia 2 Manhã  → +4h  → 12/40h (30%)
Dia 2 Tarde  → +4h  → 16/40h (40%)
Dia 3 Manhã  → +4h  → 20/40h (50%)
Dia 3 Tarde  → +4h  → 24/40h (60%)
Dia 4 Manhã  → +4h  → 28/40h (70%)
Dia 4 Tarde  → +4h  → 32/40h (80%) ✅ APROVADO!
```

### **Resultado Final:**

```
Total: 32/40 horas = 80%
Frequência mínima: 75%
Status: ✅ APROVADO → Certificado disponível!
```

---

## 📝 PADRÕES DE NOMES DE SESSÕES

### **Formato Recomendado:**

```
"Dia X - Período: Título (Xh)"
```

### **Exemplos:**

```
✅ "Dia 1 - Manhã: Abertura e Boas-vindas (4h)"
✅ "Dia 1 - Tarde: Workshop de Machine Learning (4h)"
✅ "Dia 2 - Manhã: Palestra sobre Cloud Computing (4h)"
✅ "Dia 2 - Tarde: Hands-on com AWS (4h)"
```

### **Sessões Especiais:**

```
✅ "Workshop Extra: Design de Software (4h)"
✅ "Palestra Adicional: Carreira em TI (2h)"
✅ "Mesa Redonda: Futuro da Tecnologia (3h)"
✅ "Atividade Prática: Projeto Final (6h)"
```

### **Flexibilidade:**

```
- Horas diferentes por sessão (2h, 3h, 4h, 6h...)
- Nomes livres (qualquer descrição)
- Múltiplas sessões no mesmo dia
- Sessões opcionais vs obrigatórias
```

---

## 💻 EXEMPLOS DE CÓDIGO

### **1. Registrar Check-in (1 sessão):**

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
    WHERE u.email = 'usuario@email.com'
      AND e.nome = 'Nome do Evento';
    
    -- Registrar presença
    INSERT INTO presencas_detalhes (
        participacao_id, 
        sessao_nome
    ) VALUES (
        v_participacao_id,
        'Dia 1 - Manhã: Abertura (4h)'
    );
    
    -- Atualizar total (+4 horas)
    UPDATE participacoes
    SET numero_presencas = numero_presencas + 4
    WHERE id = v_participacao_id;
END $$;
```

### **2. Registrar Dia Completo (2 sessões):**

```sql
DO $$
DECLARE
    v_participacao_id integer;
BEGIN
    SELECT p.id INTO v_participacao_id
    FROM participacoes p
    JOIN eventos e ON p.evento_id = e.id
    JOIN auth.users u ON p.usuario_id = u.id
    WHERE u.email = 'usuario@email.com'
      AND e.nome = 'Nome do Evento';
    
    -- Manhã
    INSERT INTO presencas_detalhes (participacao_id, sessao_nome)
    VALUES (v_participacao_id, 'Dia 1 - Manhã: Abertura (4h)');
    
    -- Tarde
    INSERT INTO presencas_detalhes (participacao_id, sessao_nome)
    VALUES (v_participacao_id, 'Dia 1 - Tarde: Workshop (4h)');
    
    -- Atualizar total (+8 horas)
    UPDATE participacoes
    SET numero_presencas = numero_presencas + 8
    WHERE id = v_participacao_id;
END $$;
```

### **3. Ver Histórico de Sessões:**

```sql
SELECT 
    pd.sessao_nome,
    pd.data_registro::date as data,
    pd.data_registro::time as hora
FROM presencas_detalhes pd
JOIN participacoes p ON pd.participacao_id = p.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'usuario@email.com'
ORDER BY pd.data_registro;
```

### **4. Calcular Frequência:**

```sql
SELECT 
    e.nome as evento,
    p.numero_presencas || '/' || e.duracao_horas as presenca,
    ROUND((p.numero_presencas / e.duracao_horas) * 100, 1) || '%' as frequencia,
    CASE 
        WHEN (p.numero_presencas / e.duracao_horas) * 100 >= (100 - e.limite_faltas_percentual)
        THEN '✅ APROVADO'
        ELSE '❌ REPROVADO'
    END as status
FROM participacoes p
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'usuario@email.com';
```

---

## 🎯 VANTAGENS DESSE SISTEMA

### **✅ Flexibilidade:**
- Suporta eventos com estruturas diferentes
- Sessões podem ter durações variadas
- Fácil adicionar/remover sessões

### **✅ Rastreabilidade:**
- Histórico completo de participação
- Sabe exatamente quais atividades fez
- Registro de quando foi feito o check-in

### **✅ Simplicidade:**
- Inserir = fazer check-in
- Não precisa calcular horas manualmente
- Fácil de entender e manter

### **✅ Escalabilidade:**
- Funciona para eventos pequenos e grandes
- Suporta múltiplas atividades simultâneas
- Pode ter sessões opcionais e obrigatórias

---

## 🚀 IMPLEMENTAÇÃO FUTURA (Frontend)

### **Possíveis Funcionalidades:**

```
1. QR Code por Sessão
   → Participante escaneia na entrada da sala
   → Registra automaticamente

2. Lista de Sessões
   → Ver todas as sessões do evento
   → Marcar presença com 1 clique

3. Timeline Visual
   → Ver progresso ao longo dos dias
   → Sessões faltantes destacadas

4. Notificações
   → Lembrete antes de cada sessão
   → Alerta se frequência baixa

5. Certificado Parcial
   → Ver quais sessões faltam
   → Calcular se ainda pode ser aprovado
```

---

## 📊 COMPARAÇÃO: ANTES vs AGORA

### **❌ Sistema que EU tentei implementar (errado):**

```sql
presencas_detalhes {
  participacao_id,
  evento_id,           // ❌ Redundante!
  usuario_id,          // ❌ Redundante!
  data_presenca,       // ❌ Não existe!
  hora_entrada,        // ❌ Não existe!
  hora_saida,          // ❌ Não existe!
  horas_presentes,     // ❌ Não existe!
  observacoes
}
```

### **✅ Sistema REAL (correto):**

```sql
presencas_detalhes {
  id,
  participacao_id,     // ✅ Único ID necessário
  sessao_nome,         // ✅ Nome da atividade
  data_registro,       // ✅ Timestamp do check-in
  registrado_por       // ✅ Quem registrou
}
```

---

## 🎓 RESUMO

1. **Cada sessão = 1 registro** em `presencas_detalhes`
2. **Nome da sessão** define a atividade (ex: "Dia 1 - Manhã (4h)")
3. **Horas são extraídas** do nome ou calculadas manualmente
4. **Total de presenças** é atualizado em `participacoes.numero_presencas`
5. **Frequência** = total de presenças / duração do evento
6. **Aprovação** = frequência ≥ limite mínimo (ex: 75%)

---

**Sistema simples, flexível e escalável!** ✅

Execute `/CRIAR_EVENTO_EM_ANDAMENTO.sql` para testar! 🚀
