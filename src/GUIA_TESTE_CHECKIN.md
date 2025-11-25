# 🎯 GUIA RÁPIDO: TESTAR SISTEMA DE CHECK-IN

## 📋 OBJETIVO

Criar um evento em andamento e fazer check-ins para testar o sistema completo.

---

## 🚀 PASSO A PASSO

### **PASSO 1: Criar Evento em Andamento**

Abra o SQL Editor do Supabase e execute:

📄 **Arquivo:** `/CRIAR_EVENTO_EM_ANDAMENTO.sql`

```
1. Vá para: https://app.supabase.com
2. Seu projeto → SQL Editor
3. New Query
4. Copie TODO o conteúdo de /CRIAR_EVENTO_EM_ANDAMENTO.sql
5. Execute: Ctrl+Enter (ou clique em "Run")
```

✅ **O que vai criar:**
- Evento: "Semana de Tecnologia e Inovação 2025"
- Status: 🔴 EM ANDAMENTO
- Duração: 40 horas (5 dias × 8h)
- Inscrito: joao.2019312178@aluno.iffar.edu.br
- Presenças já registradas: 24/40h (6 sessões dos dias 1, 2 e 3)

---

### **PASSO 2: Ver Status Inicial**

📄 **Arquivo:** `/VER_STATUS_CHECKIN.sql`

Execute para ver o relatório completo:

✅ **Você vai ver:**
- 📋 Resumo do evento
- 👤 Status: 24/40h (60%)
- 📅 Histórico: 6 sessões registradas
- 📊 Análise: Precisa de mais 6h para aprovar (75%)

---

### **PASSO 3: Fazer Check-in (Manhã)**

📄 **Arquivo:** `/FAZER_CHECKIN.sql`

O arquivo já vem configurado para registrar a sessão da manhã do Dia 4:

```sql
v_sessao_nome := 'Dia 4 - Manhã: Segurança da Informação (4h)';
```

Execute o arquivo completo!

✅ **Resultado:**
- Check-in registrado: +4 horas
- Total atualizado: 28/40h (70%)

---

### **PASSO 4: Ver Status Atualizado**

Execute `/VER_STATUS_CHECKIN.sql` novamente.

✅ **Agora deve mostrar:**
- 👤 Status: 28/40h (70%)
- ⚠️ Ainda precisa de 2h para aprovar

---

### **PASSO 5: Fazer Check-in (Tarde)**

Edite `/FAZER_CHECKIN.sql` e altere a linha:

```sql
-- ANTES:
v_sessao_nome := 'Dia 4 - Manhã: Segurança da Informação (4h)';

-- DEPOIS:
v_sessao_nome := 'Dia 4 - Tarde: Workshop de Ethical Hacking (4h)';
```

Execute novamente!

✅ **Resultado:**
- Check-in registrado: +4 horas
- Total atualizado: 32/40h (80%) ✅ **APROVADO!**

---

### **PASSO 6: Ver Resultado Final**

Execute `/VER_STATUS_CHECKIN.sql` uma última vez.

✅ **Agora deve mostrar:**
- 👤 Status: 32/40h (80%)
- ✅ **APROVADO** - Você SERÁ aprovado!
- 📈 Acima do mínimo de 75%

---

## 🎓 PRÓXIMOS TESTES

### **Teste 1: Registrar Dia 5 Completo**

Edite `/FAZER_CHECKIN.sql` e execute 2 vezes:

**1ª execução (Manhã):**
```sql
v_sessao_nome := 'Dia 5 - Manhã: Tendências em Tecnologia (4h)';
```

**2ª execução (Tarde):**
```sql
v_sessao_nome := 'Dia 5 - Tarde: Encerramento e Networking (4h)';
```

✅ **Resultado:** 40/40h (100%) - Evento completo!

---

### **Teste 2: Ver Histórico Completo**

Execute esta query no SQL Editor:

```sql
SELECT 
    pd.data_registro::date as data,
    pd.sessao_nome,
    pd.data_registro::time as hora
FROM presencas_detalhes pd
JOIN participacoes p ON pd.participacao_id = p.id
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br'
  AND e.nome = 'Semana de Tecnologia e Inovação 2025'
ORDER BY pd.data_registro;
```

✅ **Ver todas as sessões registradas!**

---

### **Teste 3: Simular Outro Participante**

Para testar com múltiplos participantes, você precisa:

1. **Criar outra conta de usuário** (com email diferente)
2. **Adicionar manualmente a participação:**

```sql
DO $$
DECLARE
    v_user_id uuid;
    v_evento_id integer;
BEGIN
    -- Buscar usuário
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'outro-email@exemplo.com'; -- 👈 Altere aqui
    
    -- Buscar evento
    SELECT id INTO v_evento_id
    FROM eventos
    WHERE nome = 'Semana de Tecnologia e Inovação 2025'
    ORDER BY id DESC
    LIMIT 1;
    
    -- Criar participação
    INSERT INTO participacoes (
        evento_id,
        usuario_id,
        pagamento_status,
        numero_presencas,
        is_aprovado
    ) VALUES (
        v_evento_id,
        v_user_id,
        'nao_requerido',
        0,  -- Começa com 0 horas
        false
    );
    
    RAISE NOTICE '✅ Participação criada!';
END $$;
```

3. **Fazer check-ins para este novo participante:**

Altere o email em `/FAZER_CHECKIN.sql`:
```sql
v_user_email := 'outro-email@exemplo.com';
```

---

## 📊 VISUALIZAÇÕES ÚTEIS

### **Ver todos os participantes:**

```sql
SELECT 
    u.email,
    p.numero_presencas || '/' || e.duracao_horas as presenca,
    ROUND((p.numero_presencas / e.duracao_horas) * 100, 1) || '%' as frequencia,
    CASE 
        WHEN (p.numero_presencas / e.duracao_horas) * 100 >= 75
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

### **Ver quem fez check-in hoje:**

```sql
SELECT DISTINCT
    u.email,
    COUNT(pd.id) as sessoes_hoje
FROM presencas_detalhes pd
JOIN participacoes p ON pd.participacao_id = p.id
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE e.nome = 'Semana de Tecnologia e Inovação 2025'
  AND pd.data_registro::date = NOW()::date
GROUP BY u.email;
```

---

### **Sessões por dia:**

```sql
SELECT 
    pd.data_registro::date as data,
    COUNT(*) as total_sessoes,
    STRING_AGG(u.email, ', ') as participantes
FROM presencas_detalhes pd
JOIN participacoes p ON pd.participacao_id = p.id
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE e.nome = 'Semana de Tecnologia e Inovação 2025'
GROUP BY pd.data_registro::date
ORDER BY data;
```

---

## 🧪 CENÁRIO DE TESTE COMPLETO

```
1. ✅ Executar: CRIAR_EVENTO_EM_ANDAMENTO.sql
   → Evento criado com 24h já registradas (dias 1, 2, 3)

2. ✅ Executar: VER_STATUS_CHECKIN.sql
   → Ver status: 24/40h (60%) - Reprovado

3. ✅ Executar: FAZER_CHECKIN.sql (Dia 4 - Manhã)
   → +4h = 28/40h (70%) - Ainda reprovado

4. ✅ Executar: VER_STATUS_CHECKIN.sql
   → Ver progresso atualizado

5. ✅ Executar: FAZER_CHECKIN.sql (Dia 4 - Tarde)
   → +4h = 32/40h (80%) - APROVADO! ✅

6. ✅ Executar: VER_STATUS_CHECKIN.sql
   → Confirmar aprovação

7. ✅ Executar: FAZER_CHECKIN.sql (Dia 5 - Manhã)
   → +4h = 36/40h (90%)

8. ✅ Executar: FAZER_CHECKIN.sql (Dia 5 - Tarde)
   → +4h = 40/40h (100%) - Completo! 🎉

9. ✅ Executar: VER_STATUS_CHECKIN.sql
   → Ver todas as 10 sessões registradas
```

---

## 📝 NOMES DE SESSÕES SUGERIDOS

### **Dia 4 (HOJE):**
```
✅ "Dia 4 - Manhã: Segurança da Informação (4h)"
✅ "Dia 4 - Tarde: Workshop de Ethical Hacking (4h)"
```

### **Dia 5 (AMANHÃ):**
```
⏰ "Dia 5 - Manhã: Tendências em Tecnologia (4h)"
⏰ "Dia 5 - Tarde: Encerramento e Networking (4h)"
```

### **Sessões Extras/Opcionais:**
```
📌 "Workshop Extra: Design de Software (4h)"
📌 "Palestra Adicional: Carreira em TI (2h)"
📌 "Mesa Redonda: Inteligência Artificial (3h)"
📌 "Atividade Prática: Projeto Final (6h)"
```

---

## ⚡ ATALHOS RÁPIDOS

### **Script rápido: Registrar dia completo (8h):**

```sql
DO $$
DECLARE
    v_participacao_id integer;
BEGIN
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

## ✅ CHECKLIST DE TESTES

- [ ] Evento criado com sucesso
- [ ] Status inicial visualizado (24/40h)
- [ ] Check-in manhã registrado (+4h)
- [ ] Status atualizado (28/40h)
- [ ] Check-in tarde registrado (+4h)
- [ ] Status aprovado (32/40h - 80%)
- [ ] Histórico de 8 sessões visualizado
- [ ] Dia 5 registrado (opcional)
- [ ] Sistema 100% funcional! 🎉

---

## 🎉 RESULTADO ESPERADO

Após seguir todos os passos, você terá:

✅ **Evento em andamento** criado  
✅ **6 sessões retroativas** (dias 1, 2, 3)  
✅ **2 sessões de hoje** (dia 4)  
✅ **Total: 32/40h (80%)**  
✅ **Status: APROVADO** ✅  
✅ **Sistema de check-in funcionando perfeitamente!**  

---

## 📞 DÚVIDAS?

Consulte:
- `/README_CHECKIN.md` - Guia de início rápido
- `/COMO_FUNCIONA_CHECKIN.md` - Documentação técnica
- `/EXEMPLOS_CHECKIN.sql` - 9 exemplos práticos

---

**Bons testes!** 🚀✅
