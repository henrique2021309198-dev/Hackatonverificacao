# 🚀 COMECE AQUI: SISTEMA DE CHECK-IN

## ⚡ INÍCIO RÁPIDO (3 PASSOS)

### **1️⃣ CRIAR EVENTO EM ANDAMENTO** ⏱️ 2 min

📄 Arquivo: `/CRIAR_EVENTO_EM_ANDAMENTO.sql`

```
1. Abra: https://app.supabase.com
2. SQL Editor → New Query
3. Copie TODO o arquivo
4. Execute: Ctrl+Enter
```

✅ **Criado:**
- Evento: "Semana de Tecnologia 2025"
- Status: 🔴 EM ANDAMENTO (começou há 3 dias)
- Inscrito: joao.2019312178@aluno.iffar.edu.br
- Presenças: 24/40h (6 sessões já registradas)

---

### **2️⃣ FAZER CHECK-IN** ⏱️ 1 min

📄 Arquivo: `/SCRIPTS_RAPIDOS_CHECKIN.sql`

Copie e execute o **Script 5** (Check-in Dia 4 completo):

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
    
    RAISE NOTICE '✅ Check-in registrado! +8 horas';
END $$;
```

✅ **Resultado:**
- +8 horas registradas
- Total: 32/40h (80%)
- Status: ✅ **APROVADO!**

---

### **3️⃣ VER STATUS** ⏱️ 1 min

📄 Arquivo: `/VER_STATUS_CHECKIN.sql`

Execute para ver relatório completo!

✅ **Você vai ver:**
- 📋 Resumo do evento
- 👤 Status: 32/40h (80%) ✅ APROVADO
- 📅 Histórico: 8 sessões
- 📊 Análise completa

---

## 📁 ARQUIVOS DISPONÍVEIS

| Arquivo | Descrição | Quando Usar |
|---------|-----------|-------------|
| 📘 `/COMECE_AQUI_CHECKIN.md` | **Este arquivo** | Primeiro passo |
| ⭐ `/GUIA_TESTE_CHECKIN.md` | Guia passo a passo detalhado | Tutorial completo |
| ✅ `/CHECKLIST_TESTE_CHECKIN.md` | Checklist de validação | Acompanhar progresso |
| ⚡ `/SCRIPTS_RAPIDOS_CHECKIN.sql` | Scripts prontos para copiar | Testes rápidos |
| 🔧 `/CRIAR_EVENTO_EM_ANDAMENTO.sql` | Cria evento + 6 sessões | Primeira vez |
| 📝 `/FAZER_CHECKIN.sql` | Registra 1 check-in | Check-in individual |
| 📊 `/VER_STATUS_CHECKIN.sql` | Relatório completo | Ver progresso |
| 📚 `/EXEMPLOS_CHECKIN.sql` | 9 exemplos práticos | Referência |
| 📖 `/README_CHECKIN.md` | Documentação resumida | Consulta rápida |
| 📘 `/COMO_FUNCIONA_CHECKIN.md` | Documentação técnica | Entender sistema |

---

## 🎯 QUAL ARQUIVO USAR?

### **Quero testar rapidinho (5 min):**
```
1. /CRIAR_EVENTO_EM_ANDAMENTO.sql
2. /SCRIPTS_RAPIDOS_CHECKIN.sql (Script 5)
3. /VER_STATUS_CHECKIN.sql
```

### **Quero tutorial completo (15 min):**
```
1. /GUIA_TESTE_CHECKIN.md
2. Seguir passo a passo
```

### **Quero acompanhar progresso:**
```
1. /CHECKLIST_TESTE_CHECKIN.md
2. Marcar cada item conforme avança
```

### **Quero scripts para copiar e colar:**
```
1. /SCRIPTS_RAPIDOS_CHECKIN.sql
2. Copiar cada script individualmente
```

### **Quero entender como funciona:**
```
1. /COMO_FUNCIONA_CHECKIN.md
2. Documentação técnica completa
```

---

## 🔄 FLUXO BÁSICO

```
┌─────────────────────────────────────────┐
│ 1. CRIAR EVENTO                         │
│    /CRIAR_EVENTO_EM_ANDAMENTO.sql       │
│    → Cria evento com 24h registradas    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 2. FAZER CHECK-IN                       │
│    /SCRIPTS_RAPIDOS_CHECKIN.sql         │
│    → Script 5: Dia 4 completo (+8h)     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 3. VER STATUS                           │
│    /VER_STATUS_CHECKIN.sql              │
│    → 32/40h (80%) - APROVADO! ✅        │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 4. COMPLETAR (OPCIONAL)                 │
│    /SCRIPTS_RAPIDOS_CHECKIN.sql         │
│    → Script 8: Dia 5 completo (+8h)     │
│    → 40/40h (100%) - COMPLETO! 🎉       │
└─────────────────────────────────────────┘
```

---

## 📊 ESTRUTURA DO EVENTO

```
Evento: Semana de Tecnologia 2025
Duração: 40 horas (5 dias × 8h)
Estrutura: 2 sessões/dia × 4h = 8h/dia

┌─────┬──────────┬────────────────┬──────────┐
│ Dia │ Data     │ Sessões        │ Status   │
├─────┼──────────┼────────────────┼──────────┤
│ 1   │ Há 3d    │ Manhã + Tarde  │ ✅ Feito │
│ 2   │ Há 2d    │ Manhã + Tarde  │ ✅ Feito │
│ 3   │ Ontem    │ Manhã + Tarde  │ ✅ Feito │
│ 4   │ HOJE     │ Manhã + Tarde  │ 🎯 FAZER │
│ 5   │ Amanhã   │ Manhã + Tarde  │ ⏰ Depois│
└─────┴──────────┴────────────────┴──────────┘

Status atual: 24/40h (60%) ❌ Reprovado
Após Dia 4:   32/40h (80%) ✅ APROVADO!
Após Dia 5:   40/40h (100%) 🎉 Completo
```

---

## 🎓 CONCEITOS-CHAVE

### **Sistema de Sessões:**
```
Cada sessão = 1 registro em presencas_detalhes
Cada sessão = 4 horas (padrão)
2 sessões/dia = 8 horas/dia

Check-in:
  1. Inserir registro em presencas_detalhes
  2. Atualizar numero_presencas em participacoes
  3. Calcular frequência automaticamente
```

### **Aprovação:**
```
Frequência = (numero_presencas / duracao_horas) × 100%
Mínimo = 75% (pode faltar 25%)

Exemplos:
  30/40h = 75% → ✅ Aprovado (limite)
  32/40h = 80% → ✅ Aprovado (confortável)
  28/40h = 70% → ❌ Reprovado
```

---

## ⚡ TESTE AGORA!

### **Caminho mais rápido (5 min):**

```bash
# 1. Criar evento
Execute: /CRIAR_EVENTO_EM_ANDAMENTO.sql

# 2. Check-in Dia 4
Copie Script 5 de /SCRIPTS_RAPIDOS_CHECKIN.sql
Execute

# 3. Ver resultado
Execute: /VER_STATUS_CHECKIN.sql

# 🎉 PRONTO! Sistema funcionando!
```

---

## 🐛 PROBLEMAS COMUNS

### **Erro: "Usuário não encontrado"**
✅ Solução: Email deve ser `joao.2019312178@aluno.iffar.edu.br`

### **Erro: "Evento não encontrado"**
✅ Solução: Execute `/CRIAR_EVENTO_EM_ANDAMENTO.sql` primeiro

### **Erro: "Sessão já registrada"**
✅ Solução: Normal! Não execute o mesmo check-in 2x

### **Comando \set não funciona**
✅ Solução: Use os arquivos atualizados (já corrigidos!)

---

## 📞 PRECISA DE AJUDA?

Consulte:

- 📖 **Tutorial completo:** `/GUIA_TESTE_CHECKIN.md`
- ✅ **Checklist:** `/CHECKLIST_TESTE_CHECKIN.md`
- 📚 **Exemplos:** `/EXEMPLOS_CHECKIN.sql`
- 📘 **Documentação:** `/COMO_FUNCIONA_CHECKIN.md`

---

## 🎯 PRÓXIMOS PASSOS

Após testar o sistema:

1. ✅ Implementar tela de check-in no frontend
2. ✅ Criar sistema de QR Code
3. ✅ Adicionar lista de sessões
4. ✅ Dashboard de presença em tempo real
5. ✅ Notificações de check-in

---

## ✅ RESULTADO FINAL ESPERADO

Após seguir este guia:

✅ Evento em andamento criado  
✅ 8 sessões registradas  
✅ 32/40 horas (80%)  
✅ Status: APROVADO ✅  
✅ Sistema 100% funcional  
✅ Pronto para usar! 🎉  

---

**Tempo total:** ~5 minutos  
**Dificuldade:** ⭐☆☆☆☆ (Muito Fácil)

---

## 🚀 COMECE AGORA!

```
1. Abra: https://app.supabase.com
2. Execute: /CRIAR_EVENTO_EM_ANDAMENTO.sql
3. Execute: Script 5 de /SCRIPTS_RAPIDOS_CHECKIN.sql
4. Execute: /VER_STATUS_CHECKIN.sql
5. ✅ PRONTO!
```

**Boa sorte!** 🎉✅🚀
