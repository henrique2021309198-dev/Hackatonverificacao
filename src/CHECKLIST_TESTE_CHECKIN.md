# ✅ CHECKLIST: TESTAR SISTEMA DE CHECK-IN

## 🎯 OBJETIVO
Criar evento em andamento e fazer check-ins até completar o evento.

---

## 📋 CHECKLIST DE EXECUÇÃO

### **PREPARAÇÃO**

- [ ] Supabase aberto: https://app.supabase.com
- [ ] SQL Editor aberto
- [ ] Arquivos prontos para copiar

---

### **FASE 1: CRIAR EVENTO** ⏱️ 2 min

- [ ] Abrir arquivo: `/CRIAR_EVENTO_EM_ANDAMENTO.sql`
- [ ] Copiar TODO o conteúdo
- [ ] Colar no SQL Editor
- [ ] Executar: `Ctrl+Enter`
- [ ] ✅ Ver mensagem: "Evento criado com sucesso"

**📊 Resultado esperado:**
```
✅ Evento: Semana de Tecnologia 2025
✅ Status: 🔴 EM ANDAMENTO
✅ Inscrito: joao.2019312178@aluno.iffar.edu.br
✅ Presenças: 24/40h (60%)
✅ Sessões: 6 (dias 1, 2 e 3)
```

---

### **FASE 2: VERIFICAR STATUS INICIAL** ⏱️ 1 min

- [ ] Abrir arquivo: `/VER_STATUS_CHECKIN.sql`
- [ ] Executar
- [ ] Ver 8 seções de relatório
- [ ] ✅ Confirmar: 24/40h (60%)
- [ ] ✅ Status: "Precisa de mais 6h para aprovar"

---

### **FASE 3: CHECK-IN DIA 4** ⏱️ 3 min

#### **Opção A: Sessões Separadas**

**Manhã:**
- [ ] Abrir: `/SCRIPTS_RAPIDOS_CHECKIN.sql`
- [ ] Copiar: Script 3 (Check-in Dia 4 - Manhã)
- [ ] Executar
- [ ] ✅ Ver: "+4h" registrado
- [ ] Executar: Script 2 (Ver status)
- [ ] ✅ Confirmar: 28/40h (70%)

**Tarde:**
- [ ] Copiar: Script 4 (Check-in Dia 4 - Tarde)
- [ ] Executar
- [ ] ✅ Ver: "+4h" registrado
- [ ] Executar: Script 2 (Ver status)
- [ ] ✅ Confirmar: 32/40h (80%) ✅ **APROVADO!**

#### **Opção B: Dia Completo (Mais Rápido)**

- [ ] Copiar: Script 5 (Dia 4 completo)
- [ ] Executar
- [ ] ✅ Ver: "+8h" registrado
- [ ] Executar: Script 2 (Ver status)
- [ ] ✅ Confirmar: 32/40h (80%) ✅ **APROVADO!**

---

### **FASE 4: VERIFICAR APROVAÇÃO** ⏱️ 1 min

- [ ] Executar: `/VER_STATUS_CHECKIN.sql`
- [ ] Ver seção "STATUS DA PARTICIPAÇÃO"
- [ ] ✅ Confirmar: 32/40h (80%)
- [ ] ✅ Confirmar: "✅ Aprovado"
- [ ] Ver seção "HISTÓRICO DE SESSÕES"
- [ ] ✅ Confirmar: 8 sessões listadas

---

### **FASE 5: COMPLETAR EVENTO (OPCIONAL)** ⏱️ 2 min

- [ ] Copiar: Script 8 (Dia 5 completo)
- [ ] Executar
- [ ] ✅ Ver: "+8h" registrado
- [ ] ✅ Ver mensagem: "EVENTO 100% COMPLETO!"
- [ ] Executar: Script 2 (Ver status)
- [ ] ✅ Confirmar: 40/40h (100%)

---

### **FASE 6: VERIFICAR HISTÓRICO COMPLETO** ⏱️ 1 min

- [ ] Copiar: Script 9 (Histórico)
- [ ] Executar
- [ ] ✅ Ver: 10 sessões listadas
- [ ] ✅ Confirmar todas as datas

**Lista esperada:**
```
1. Dia 1 - Manhã (há 3 dias)
2. Dia 1 - Tarde (há 3 dias)
3. Dia 2 - Manhã (há 2 dias)
4. Dia 2 - Tarde (há 2 dias)
5. Dia 3 - Manhã (ontem)
6. Dia 3 - Tarde (ontem)
7. Dia 4 - Manhã (hoje)
8. Dia 4 - Tarde (hoje)
9. Dia 5 - Manhã (hoje)
10. Dia 5 - Tarde (hoje)
```

---

## 🎓 CHECKLIST DE VALIDAÇÃO

### **Dados do Evento**
- [ ] Nome: "Semana de Tecnologia e Inovação 2025"
- [ ] Status: 🔴 EM ANDAMENTO
- [ ] Duração: 40 horas
- [ ] Estrutura: 5 dias × 8h
- [ ] Limite de faltas: 25%
- [ ] Frequência mínima: 75% (30h)

### **Participação**
- [ ] Email: joao.2019312178@aluno.iffar.edu.br
- [ ] Pagamento: "nao_requerido" (gratuito)
- [ ] Presença inicial: 24h
- [ ] Após Dia 4: 32h ✅ Aprovado
- [ ] Após Dia 5: 40h (100%)

### **Sessões Registradas**
- [ ] Total de sessões: 10
- [ ] Dia 1: 2 sessões (8h)
- [ ] Dia 2: 2 sessões (8h)
- [ ] Dia 3: 2 sessões (8h)
- [ ] Dia 4: 2 sessões (8h)
- [ ] Dia 5: 2 sessões (8h)

### **Cálculos**
- [ ] 24/40h = 60% ❌ Reprovado
- [ ] 28/40h = 70% ❌ Reprovado
- [ ] 32/40h = 80% ✅ Aprovado
- [ ] 40/40h = 100% ✅ Completo

---

## 📊 PROGRESS TRACKER

Marque conforme avança:

```
┌─────────────────────────────────────┐
│ PROGRESSO DO EVENTO                 │
├─────────────────────────────────────┤
│ Dia 1: ✅✅ 8h/8h                    │
│ Dia 2: ✅✅ 8h/8h                    │
│ Dia 3: ✅✅ 8h/8h                    │
│ Dia 4: ⬜⬜ 0h/8h → 🎯 FAZER AGORA  │
│ Dia 5: ⬜⬜ 0h/8h → ⏰ Depois       │
├─────────────────────────────────────┤
│ Total: 24/40h (60%)                 │
│ Status: ❌ Reprovado (precisa 75%)  │
└─────────────────────────────────────┘
```

**Após Dia 4:**
```
┌─────────────────────────────────────┐
│ PROGRESSO DO EVENTO                 │
├─────────────────────────────────────┤
│ Dia 1: ✅✅ 8h/8h                    │
│ Dia 2: ✅✅ 8h/8h                    │
│ Dia 3: ✅✅ 8h/8h                    │
│ Dia 4: ✅✅ 8h/8h → ✅ FEITO!       │
│ Dia 5: ⬜⬜ 0h/8h → ⏰ Opcional     │
├─────────────────────────────────────┤
│ Total: 32/40h (80%)                 │
│ Status: ✅ APROVADO! 🎉             │
└─────────────────────────────────────┘
```

**Após Dia 5:**
```
┌─────────────────────────────────────┐
│ PROGRESSO DO EVENTO                 │
├─────────────────────────────────────┤
│ Dia 1: ✅✅ 8h/8h                    │
│ Dia 2: ✅✅ 8h/8h                    │
│ Dia 3: ✅✅ 8h/8h                    │
│ Dia 4: ✅✅ 8h/8h                    │
│ Dia 5: ✅✅ 8h/8h → ✅ FEITO!       │
├─────────────────────────────────────┤
│ Total: 40/40h (100%)                │
│ Status: 🎉 COMPLETO! 100%           │
└─────────────────────────────────────┘
```

---

## ⏱️ TEMPO ESTIMADO

| Fase | Tempo | Acumulado |
|------|-------|-----------|
| 1. Criar evento | 2 min | 2 min |
| 2. Ver status | 1 min | 3 min |
| 3. Check-in Dia 4 | 3 min | 6 min |
| 4. Verificar aprovação | 1 min | 7 min |
| 5. Completar evento | 2 min | 9 min |
| 6. Ver histórico | 1 min | **10 min** |

**Total: ~10 minutos** ⚡

---

## 🎯 CENÁRIOS DE TESTE

### **Cenário 1: Teste Mínimo (APROVAÇÃO)**
```
✅ Criar evento (24h)
✅ Dia 4 - Manhã (+4h = 28h)
✅ Dia 4 - Tarde (+4h = 32h) ✅ APROVADO
⏱️ Tempo: ~6 minutos
```

### **Cenário 2: Teste Completo (100%)**
```
✅ Criar evento (24h)
✅ Dia 4 completo (+8h = 32h) ✅ APROVADO
✅ Dia 5 completo (+8h = 40h) 🎉 COMPLETO
⏱️ Tempo: ~9 minutos
```

### **Cenário 3: Teste Detalhado (TODAS SESSÕES)**
```
✅ Criar evento (24h)
✅ Dia 4 - Manhã (+4h = 28h)
✅ Ver status (70%)
✅ Dia 4 - Tarde (+4h = 32h)
✅ Ver status (80% - APROVADO)
✅ Dia 5 - Manhã (+4h = 36h)
✅ Ver status (90%)
✅ Dia 5 - Tarde (+4h = 40h)
✅ Ver status (100% - COMPLETO)
✅ Ver histórico completo
⏱️ Tempo: ~15 minutos
```

---

## 🐛 TROUBLESHOOTING

### **Erro: "Usuário não encontrado"**
- [ ] Verificar email correto: `joao.2019312178@aluno.iffar.edu.br`
- [ ] Conta criada no sistema?
- [ ] Executou o script de criação de evento?

### **Erro: "Evento não encontrado"**
- [ ] Nome exato: "Semana de Tecnologia e Inovação 2025"
- [ ] Executou `/CRIAR_EVENTO_EM_ANDAMENTO.sql`?

### **Erro: "Participação não encontrada"**
- [ ] Script de criação executado completamente?
- [ ] Verificar participação criada:
```sql
SELECT * FROM participacoes p
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br';
```

### **Erro: "Sessão já registrada"**
- [ ] Normal! Não execute o mesmo check-in 2x
- [ ] Use nomes de sessões diferentes
- [ ] Ou delete a sessão duplicada

---

## ✅ CHECKLIST FINAL

Após completar todos os testes:

- [ ] Evento criado ✅
- [ ] 10 sessões registradas ✅
- [ ] Status de 24h → 32h → 40h ✅
- [ ] Aprovação em 80% ✅
- [ ] Histórico completo visualizado ✅
- [ ] Sistema 100% funcional ✅

---

## 🎉 SUCESSO!

Se você marcou todos os itens acima:

✅ **Sistema de check-in está funcionando perfeitamente!**  
✅ **Você entendeu como funciona o fluxo!**  
✅ **Pronto para implementar no frontend!**  

---

## 📚 PRÓXIMOS PASSOS

1. Implementar tela de check-in no frontend
2. Criar QR Code por sessão
3. Adicionar notificações de check-in
4. Dashboard de presença em tempo real
5. Relatórios de frequência

---

**Bons testes!** 🚀✅

**Tempo total:** ~10 minutos  
**Dificuldade:** ⭐⭐☆☆☆ (Fácil)
