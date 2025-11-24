# 📋 README - Sistema de Eventos Acadêmicos

## 🚨 LEIA ISTO PRIMEIRO!

Se você está vendo erros no sistema, **execute a configuração rápida abaixo**.

---

## ⚡ CONFIGURAÇÃO RÁPIDA (5 minutos)

### **Execute 4 scripts SQL no Supabase:**

1. 🔓 `/supabase-fix-auth.sql` → Permite criar usuários
2. ✅ `/CONFIRMAR_TODOS_EMAILS.sql` → Permite fazer login
3. 🎫 `/CRIAR_TRIGGER_VAGAS.sql` → Atualiza vagas automaticamente
4. 🔧 `/CORRIGIR_VAGAS_EVENTOS.sql` → Corrige vagas existentes

### **Configuração manual:**

5. 📧 Desabilitar confirmação de email:
   - Supabase → Authentication → Providers → Email
   - Desmarque "Confirm email" → Save

📖 **Guia detalhado:** `/INICIO_RAPIDO.md`

---

## 🎯 DOCUMENTAÇÃO

### **🚀 Para Começar Agora**
- ⭐ **`/INICIO_RAPIDO.md`** → Configure em 5 minutos
- 📋 **`/LEIA_PRIMEIRO.md`** → Índice completo de problemas

### **📖 Guias Específicos**
- 🔓 **`/GUIA_CONFIRMACAO_EMAIL.md`** → Solucionar "Email not confirmed"
- 🎫 **`/GUIA_VAGAS_DISPONIVEIS.md`** → Solucionar vagas não atualizando

### **🔧 Scripts SQL**

#### **Essenciais (Execute TODOS):**
1. `/supabase-fix-auth.sql` ⭐
2. `/CONFIRMAR_TODOS_EMAILS.sql` ⭐
3. `/CRIAR_TRIGGER_VAGAS.sql` ⭐
4. `/CORRIGIR_VAGAS_EVENTOS.sql` ⭐

#### **Diagnóstico:**
- `/DIAGNOSTICO_BANCO.sql` → Ver status do sistema

#### **Testes:**
- `/CRIAR_EVENTO_CONCLUIDO_SIMPLES.sql` → Testar certificados

---

## ❌ PROBLEMAS COMUNS

### **"Email not confirmed"**
✅ Execute `/CONFIRMAR_TODOS_EMAILS.sql`

### **"Row-level security policy"**
✅ Execute `/supabase-fix-auth.sql`

### **Vagas não atualizam**
✅ Execute `/CRIAR_TRIGGER_VAGAS.sql` + `/CORRIGIR_VAGAS_EVENTOS.sql`

---

## ✅ SISTEMA FUNCIONANDO?

Depois de executar tudo, você deve conseguir:

```
✅ Criar conta
✅ Fazer login
✅ Criar eventos
✅ Inscrever-se em eventos
✅ Ver vagas atualizando
✅ Gerar certificados
```

---

## 📁 ESTRUTURA DO PROJETO

```
/
├── README_IMPORTANTE.md         ← Você está aqui!
├── INICIO_RAPIDO.md            ← ⭐ Comece por aqui
├── LEIA_PRIMEIRO.md            ← Índice completo
│
├── GUIA_CONFIRMACAO_EMAIL.md   ← Solucionar login
├── GUIA_VAGAS_DISPONIVEIS.md   ← Solucionar vagas
│
├── supabase-fix-auth.sql       ← ⭐ Execute #1
├── CONFIRMAR_TODOS_EMAILS.sql  ← ⭐ Execute #2
├── CRIAR_TRIGGER_VAGAS.sql     ← ⭐ Execute #3
├── CORRIGIR_VAGAS_EVENTOS.sql  ← ⭐ Execute #4
│
├── DIAGNOSTICO_BANCO.sql       ← Diagnóstico
└── CRIAR_EVENTO_CONCLUIDO_SIMPLES.sql  ← Teste
```

---

## 🚀 COMEÇAR AGORA

### **Passo 1:** Leia o guia rápido
📄 `/INICIO_RAPIDO.md`

### **Passo 2:** Execute os scripts
```
1. Abra: https://app.supabase.com
2. SQL Editor → New Query
3. Cole cada script
4. Execute
```

### **Passo 3:** Configure manualmente
```
Authentication → Providers → Email
Desmarque "Confirm email"
```

### **Passo 4:** Teste!
```
Criar conta → Login → Inscrever em evento
```

---

## 📊 RESUMO DOS ARQUIVOS

| Tipo | Arquivo | Descrição |
|------|---------|-----------|
| 📖 Guia | `/INICIO_RAPIDO.md` | ⭐ Comece aqui |
| 📖 Guia | `/LEIA_PRIMEIRO.md` | Índice completo |
| 📖 Guia | `/GUIA_CONFIRMACAO_EMAIL.md` | Sobre login |
| 📖 Guia | `/GUIA_VAGAS_DISPONIVEIS.md` | Sobre vagas |
| 🔧 SQL | `/supabase-fix-auth.sql` | ⭐ Corrige RLS |
| 🔧 SQL | `/CONFIRMAR_TODOS_EMAILS.sql` | ⭐ Confirma emails |
| 🔧 SQL | `/CRIAR_TRIGGER_VAGAS.sql` | ⭐ Trigger vagas |
| 🔧 SQL | `/CORRIGIR_VAGAS_EVENTOS.sql` | ⭐ Corrige vagas |
| 🔍 SQL | `/DIAGNOSTICO_BANCO.sql` | Diagnóstico |
| 🧪 SQL | `/CRIAR_EVENTO_CONCLUIDO_SIMPLES.sql` | Teste |

---

## 🎯 ARQUIVOS IMPORTANTES

### **Para Configuração Inicial:**
1. ⭐⭐⭐ `/INICIO_RAPIDO.md`
2. ⭐⭐⭐ `/supabase-fix-auth.sql`
3. ⭐⭐⭐ `/CONFIRMAR_TODOS_EMAILS.sql`
4. ⭐⭐⭐ `/CRIAR_TRIGGER_VAGAS.sql`
5. ⭐⭐⭐ `/CORRIGIR_VAGAS_EVENTOS.sql`

### **Para Problemas Específicos:**
- Login não funciona → `/GUIA_CONFIRMACAO_EMAIL.md`
- Vagas não atualizam → `/GUIA_VAGAS_DISPONIVEIS.md`
- Ver tudo → `/LEIA_PRIMEIRO.md`

---

## ⚡ ORDEM DE EXECUÇÃO

**Siga EXATAMENTE esta ordem:**

```
1. supabase-fix-auth.sql           (RLS)
2. CONFIRMAR_TODOS_EMAILS.sql      (Login)
3. CRIAR_TRIGGER_VAGAS.sql         (Sistema automático)
4. CORRIGIR_VAGAS_EVENTOS.sql      (Correção)
5. Desabilitar confirmação (manual) (Configuração)
```

---

## 💡 DICA IMPORTANTE

**Todos os scripts são seguros e podem ser executados múltiplas vezes.**

Se algo der errado, basta executar novamente!

---

## 🆘 PRECISA DE AJUDA?

### **Execute o diagnóstico:**

```sql
-- Cole no SQL Editor do Supabase
SELECT 
    tablename,
    rowsecurity as rls_ativo
FROM pg_tables
WHERE schemaname = 'public';
```

### **Me envie:**
1. ✉️ Mensagem de erro completa
2. 📄 Qual script você executou
3. 📊 Resultado do diagnóstico

---

## ✅ CHECKLIST RÁPIDO

- [ ] Li `/INICIO_RAPIDO.md`
- [ ] Executei os 4 scripts SQL
- [ ] Desabilitei confirmação de email
- [ ] Testei criar conta → ✅
- [ ] Testei fazer login → ✅
- [ ] Sistema funcionando! 🎉

---

## 🎉 PRONTO PARA USAR!

Depois de executar tudo:

```
🎯 Sistema de Eventos Acadêmicos
✅ 100% Funcional
✅ RLS configurado
✅ Login funcionando
✅ Vagas atualizando automaticamente
✅ Certificados funcionando

🚀 Aproveite!
```

---

## 📞 CONTATO

Se precisar de suporte adicional:
- Execute `/DIAGNOSTICO_BANCO.sql`
- Me envie os erros + resultado do diagnóstico

---

**⭐ COMECE AGORA: Abra `/INICIO_RAPIDO.md`** 🚀
