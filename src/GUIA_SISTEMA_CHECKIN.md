# ✅ SISTEMA DE CHECK-IN E PRESENÇA - GUIA COMPLETO

## 📋 VISÃO GERAL

O sistema de check-in permite registrar a presença dos participantes em eventos de múltiplos dias, calculando automaticamente a frequência e determinando se o participante será aprovado para receber certificado.

---

## 🗄️ ESTRUTURA DO BANCO DE DADOS

### **Tabelas Envolvidas:**

#### **1. `eventos`**
```sql
- id
- nome
- data_inicio
- duracao_horas          -- Carga horária total do evento
- limite_faltas_percentual -- % máximo de faltas permitido (ex: 25%)
```

#### **2. `participacoes`**
```sql
- id
- evento_id
- usuario_id
- numero_presencas       -- Total de horas presentes
- is_aprovado            -- true se atingiu frequência mínima
- pagamento_status
```

#### **3. `presencas_detalhes`**
```sql
- id
- participacao_id
- evento_id
- usuario_id
- data_presenca          -- Data do check-in
- hora_entrada           -- Horário de entrada
- hora_saida             -- Horário de saída
- horas_presentes        -- Horas contabilizadas neste dia
- observacoes            -- Notas adicionais
```

---

## 🔄 COMO FUNCIONA

### **Fluxo do Check-In:**

```
1. Participante se inscreve no evento
   ↓
2. Evento começa (data_inicio)
   ↓
3. A cada dia, participante faz check-in
   ↓
4. Sistema registra em presencas_detalhes
   ↓
5. Sistema atualiza numero_presencas em participacoes
   ↓
6. Ao final do evento, calcula frequência
   ↓
7. Se frequência ≥ (100% - limite_faltas_percentual)
   → is_aprovado = true
   → Certificado disponível
```

### **Exemplo:**

```
📋 Evento: Semana de Tecnologia
   • Duração: 40 horas (5 dias × 8h)
   • Limite de faltas: 25%
   • Frequência mínima: 75% (30 horas)

👤 Participante João:
   • Dia 1: 8h ✅
   • Dia 2: 8h ✅
   • Dia 3: 8h ✅
   • Dia 4: 4h ⚠️  (saiu mais cedo)
   • Dia 5: 8h ✅
   
   Total: 36/40 horas = 90% ✅ APROVADO
```

---

## 🚀 CRIAR EVENTO EM ANDAMENTO

### **Usando o Script Automatizado:**

📄 **Arquivo:** `/CRIAR_EVENTO_EM_ANDAMENTO.sql`

```
1. Abra: https://app.supabase.com
2. Vá em: SQL Editor → New Query
3. Copie o conteúdo do arquivo
4. Execute: Ctrl+Enter
```

✅ **O script cria:**
- ✅ Evento de 5 dias (40 horas)
- ✅ Começou há 3 dias (em andamento)
- ✅ Inscrição para joao.2019312178@aluno.iffar.edu.br
- ✅ 3 check-ins já registrados (24 horas)
- ✅ Faltam 2 dias para terminar (16 horas)

---

## ✅ FAZER CHECK-IN

### **Método 1: Script SQL Rápido**

📄 **Arquivo:** `/FAZER_CHECKIN.sql`

```sql
-- Edite estas variáveis no script:
v_user_email := 'joao.2019312178@aluno.iffar.edu.br';
v_evento_nome := 'Semana de Tecnologia e Inovação 2025';
v_data_presenca := NOW()::date;
v_hora_entrada := '08:00:00';
v_hora_saida := '17:00:00';
v_horas_presentes := 8;
v_observacoes := 'Check-in registrado';

-- Execute!
```

### **Método 2: SQL Direto**

```sql
-- 1. Buscar IDs
SELECT 
    p.id as participacao_id,
    e.id as evento_id,
    u.id as usuario_id
FROM participacoes p
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br'
  AND e.nome = 'Semana de Tecnologia e Inovação 2025';

-- 2. Inserir presença (substitua os IDs)
INSERT INTO presencas_detalhes (
    participacao_id,
    evento_id,
    usuario_id,
    data_presenca,
    hora_entrada,
    hora_saida,
    horas_presentes,
    observacoes
) VALUES (
    123, -- participacao_id
    456, -- evento_id
    'uuid-do-usuario',
    NOW()::date,
    '08:00:00',
    '17:00:00',
    8,
    'Check-in de hoje'
);

-- 3. Atualizar total (substitua participacao_id)
UPDATE participacoes
SET numero_presencas = (
    SELECT SUM(horas_presentes)
    FROM presencas_detalhes
    WHERE participacao_id = 123
)
WHERE id = 123;
```

---

## 📊 CONSULTAS ÚTEIS

### **Ver eventos em andamento:**

```sql
SELECT 
    id,
    nome,
    data_inicio::date as inicio,
    (data_inicio + (duracao_horas || ' hours')::interval)::date as fim,
    duracao_horas || 'h' as carga_horaria,
    '🔴 EM ANDAMENTO' as status
FROM eventos
WHERE data_inicio <= NOW()
  AND data_inicio + (duracao_horas || ' hours')::interval >= NOW()
ORDER BY data_inicio;
```

### **Ver minhas inscrições em eventos em andamento:**

```sql
SELECT 
    e.nome as evento,
    p.numero_presencas || '/' || e.duracao_horas as presenca,
    ROUND((p.numero_presencas::numeric / e.duracao_horas::numeric) * 100, 1) || '%' as percentual,
    (e.duracao_horas - p.numero_presencas) || 'h restantes' as faltam
FROM participacoes p
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'seu-email@exemplo.com'
  AND e.data_inicio <= NOW()
  AND e.data_inicio + (e.duracao_horas || ' hours')::interval >= NOW();
```

### **Ver histórico de check-ins:**

```sql
SELECT 
    e.nome as evento,
    pd.data_presenca::date as data,
    pd.hora_entrada || ' - ' || pd.hora_saida as horario,
    pd.horas_presentes || 'h' as presenca,
    pd.observacoes
FROM presencas_detalhes pd
JOIN eventos e ON pd.evento_id = e.id
JOIN auth.users u ON pd.usuario_id = u.id
WHERE u.email = 'seu-email@exemplo.com'
ORDER BY pd.data_presenca DESC;
```

### **Ver quem fez check-in hoje em um evento:**

```sql
SELECT 
    u.email as participante,
    pd.hora_entrada,
    pd.hora_saida,
    pd.horas_presentes || 'h' as presenca
FROM presencas_detalhes pd
JOIN auth.users u ON pd.usuario_id = u.id
JOIN eventos e ON pd.evento_id = e.id
WHERE e.nome = 'Semana de Tecnologia e Inovação 2025'
  AND pd.data_presenca = NOW()::date
ORDER BY pd.hora_entrada;
```

### **Ver frequência de todos os participantes:**

```sql
SELECT 
    u.email as participante,
    p.numero_presencas || '/' || e.duracao_horas as presenca,
    ROUND((p.numero_presencas::numeric / e.duracao_horas::numeric) * 100, 1) || '%' as frequencia,
    CASE 
        WHEN (p.numero_presencas::numeric / e.duracao_horas::numeric) * 100 >= (100 - e.limite_faltas_percentual)
        THEN '✅ APROVADO'
        ELSE '❌ REPROVADO'
    END as status
FROM participacoes p
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE e.nome = 'Semana de Tecnologia e Inovação 2025'
ORDER BY p.numero_presencas DESC;
```

---

## 🎯 REGRAS DE APROVAÇÃO

### **Cálculo da Frequência:**

```
Frequência = (numero_presencas / duracao_horas) × 100

Exemplo:
numero_presencas = 36 horas
duracao_horas = 40 horas
Frequência = (36 / 40) × 100 = 90%
```

### **Aprovação para Certificado:**

```
✅ APROVADO se:
   Frequência ≥ (100% - limite_faltas_percentual)

Exemplo:
limite_faltas_percentual = 25%
Frequência mínima = 100% - 25% = 75%

Se participante tem 90% → ✅ APROVADO
Se participante tem 70% → ❌ REPROVADO
```

### **Atualizar Status de Aprovação:**

```sql
-- Quando o evento terminar, executar:
UPDATE participacoes p
SET is_aprovado = (
    (p.numero_presencas::numeric / e.duracao_horas::numeric) * 100 
    >= (100 - e.limite_faltas_percentual)
)
FROM eventos e
WHERE p.evento_id = e.id
  AND e.nome = 'Semana de Tecnologia e Inovação 2025';
```

---

## 📱 TIPOS DE CHECK-IN

### **1. Presença Completa (dia inteiro):**

```sql
hora_entrada: '08:00:00'
hora_saida: '17:00:00'
horas_presentes: 8
observacoes: 'Presente o dia todo'
```

### **2. Presença Parcial (meio período):**

```sql
-- Manhã apenas
hora_entrada: '08:00:00'
hora_saida: '12:00:00'
horas_presentes: 4
observacoes: 'Presente apenas manhã'

-- Tarde apenas
hora_entrada: '13:00:00'
hora_saida: '17:00:00'
horas_presentes: 4
observacoes: 'Presente apenas tarde'
```

### **3. Atraso:**

```sql
hora_entrada: '10:00:00'  -- Chegou 2h atrasado
hora_saida: '17:00:00'
horas_presentes: 6  -- Perdeu 2 horas
observacoes: 'Chegou atrasado'
```

### **4. Saída Antecipada:**

```sql
hora_entrada: '08:00:00'
hora_saida: '15:00:00'  -- Saiu 2h mais cedo
horas_presentes: 6
observacoes: 'Saiu mais cedo'
```

### **5. Falta (não compareceu):**

```sql
-- Opção 1: Não inserir registro

-- Opção 2: Inserir com 0 horas
hora_entrada: NULL
hora_saida: NULL
horas_presentes: 0
observacoes: 'Falta não justificada'
```

### **6. Falta Justificada:**

```sql
hora_entrada: NULL
hora_saida: NULL
horas_presentes: 0
observacoes: 'Falta justificada - atestado médico'

-- OU dar as horas mesmo sem presença física:
horas_presentes: 8
observacoes: 'Ausência justificada - horas abonadas'
```

---

## 🔔 NOTIFICAÇÕES E LEMBRETES

### **Verificar quem não fez check-in hoje:**

```sql
-- Participantes sem check-in hoje
SELECT DISTINCT
    u.email,
    e.nome as evento
FROM participacoes p
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE e.data_inicio <= NOW()
  AND e.data_inicio + (e.duracao_horas || ' hours')::interval >= NOW()
  AND NOT EXISTS (
      SELECT 1 
      FROM presencas_detalhes pd 
      WHERE pd.participacao_id = p.id 
        AND pd.data_presenca = NOW()::date
  );
```

### **Enviar lembrete para fazer check-in:**

```
💡 Isso seria implementado no backend/frontend:

1. Cron job diário às 18h
2. Verifica quem não fez check-in
3. Envia email/notificação
```

---

## 📈 RELATÓRIOS

### **Relatório de Presença por Evento:**

```sql
SELECT 
    e.nome as evento,
    COUNT(DISTINCT p.usuario_id) as total_inscritos,
    COUNT(DISTINCT pd.usuario_id) as fizeram_checkin_hoje,
    ROUND(
        (COUNT(DISTINCT pd.usuario_id)::numeric / COUNT(DISTINCT p.usuario_id)::numeric) * 100,
        1
    ) || '%' as taxa_presenca
FROM eventos e
JOIN participacoes p ON e.id = p.evento_id
LEFT JOIN presencas_detalhes pd ON p.id = pd.participacao_id 
    AND pd.data_presenca = NOW()::date
WHERE e.nome = 'Semana de Tecnologia e Inovação 2025'
GROUP BY e.nome;
```

### **Ranking de Frequência:**

```sql
SELECT 
    u.email,
    p.numero_presencas || '/' || e.duracao_horas as presenca,
    ROUND((p.numero_presencas::numeric / e.duracao_horas::numeric) * 100, 1) as percentual,
    RANK() OVER (ORDER BY p.numero_presencas DESC) as posicao
FROM participacoes p
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE e.nome = 'Semana de Tecnologia e Inovação 2025'
ORDER BY p.numero_presencas DESC;
```

### **Dias com Maior Ausência:**

```sql
SELECT 
    generate_series(
        e.data_inicio::date,
        (e.data_inicio + (e.duracao_horas || ' hours')::interval)::date,
        '1 day'::interval
    )::date as data,
    COUNT(DISTINCT p.id) as total_inscritos,
    COUNT(DISTINCT pd.id) as total_presentes,
    (COUNT(DISTINCT p.id) - COUNT(DISTINCT pd.id)) as total_ausentes
FROM eventos e
JOIN participacoes p ON e.id = p.evento_id
LEFT JOIN presencas_detalhes pd ON p.id = pd.participacao_id 
    AND pd.data_presenca = generate_series(
        e.data_inicio::date,
        (e.data_inicio + (e.duracao_horas || ' hours')::interval)::date,
        '1 day'::interval
    )::date
WHERE e.nome = 'Semana de Tecnologia e Inovação 2025'
GROUP BY e.data_inicio, e.duracao_horas, data
ORDER BY data;
```

---

## ⚙️ AUTOMAÇÕES SUGERIDAS

### **1. Trigger para Atualizar Total de Presenças:**

```sql
CREATE OR REPLACE FUNCTION atualizar_total_presencas()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE participacoes
    SET numero_presencas = (
        SELECT COALESCE(SUM(horas_presentes), 0)
        FROM presencas_detalhes
        WHERE participacao_id = NEW.participacao_id
    )
    WHERE id = NEW.participacao_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_presencas
AFTER INSERT OR UPDATE OR DELETE ON presencas_detalhes
FOR EACH ROW
EXECUTE FUNCTION atualizar_total_presencas();
```

### **2. Trigger para Aprovar Automaticamente:**

```sql
CREATE OR REPLACE FUNCTION verificar_aprovacao()
RETURNS TRIGGER AS $$
DECLARE
    v_duracao_horas numeric;
    v_limite_faltas numeric;
    v_frequencia numeric;
BEGIN
    -- Buscar dados do evento
    SELECT duracao_horas, limite_faltas_percentual
    INTO v_duracao_horas, v_limite_faltas
    FROM eventos
    WHERE id = NEW.evento_id;
    
    -- Calcular frequência
    v_frequencia := (NEW.numero_presencas / v_duracao_horas) * 100;
    
    -- Verificar se evento terminou
    IF (SELECT data_inicio + (duracao_horas || ' hours')::interval FROM eventos WHERE id = NEW.evento_id) < NOW() THEN
        -- Aprovar se frequência for suficiente
        NEW.is_aprovado := v_frequencia >= (100 - v_limite_faltas);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_verificar_aprovacao
BEFORE UPDATE ON participacoes
FOR EACH ROW
EXECUTE FUNCTION verificar_aprovacao();
```

---

## 🧪 TESTANDO O SISTEMA

### **Cenário Completo:**

```
1. ✅ Criar evento em andamento
   Execute: /CRIAR_EVENTO_EM_ANDAMENTO.sql

2. ✅ Fazer login no sistema
   Email: joao.2019312178@aluno.iffar.edu.br

3. ✅ Ver evento em "Meus Eventos" → "Em Andamento"
   Deve mostrar: 24/40 horas (60%)

4. ✅ Fazer check-in de hoje
   Execute: /FAZER_CHECKIN.sql

5. ✅ Verificar atualização
   Deve mostrar: 32/40 horas (80%)

6. ✅ Fazer check-in de amanhã (simular)
   Alterar data no script

7. ✅ Verificar aprovação final
   Deve mostrar: 40/40 horas (100%) ✅ APROVADO
```

---

## 📁 ARQUIVOS

- ⭐ `/CRIAR_EVENTO_EM_ANDAMENTO.sql` → Script completo
- ⭐ `/FAZER_CHECKIN.sql` → Script de check-in rápido
- 📖 `/GUIA_SISTEMA_CHECKIN.md` → Este guia

---

## 🚀 PRÓXIMAS IMPLEMENTAÇÕES

### **Frontend - Interface de Check-In:**

```
1. Página "Fazer Check-In"
2. QR Code para check-in rápido
3. Geolocalização (verificar se está no local)
4. Notificações de lembrete
5. Histórico de presenças
6. Gráfico de frequência
```

### **Backend - APIs:**

```
POST /api/checkin
GET /api/presencas/:participacao_id
GET /api/eventos/:id/presencas-hoje
PUT /api/presencas/:id
```

---

**Execute os scripts e teste o sistema de check-in!** ✅🚀
