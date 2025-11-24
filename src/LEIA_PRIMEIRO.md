# 🎯 LEIA PRIMEIRO - CORREÇÃO DE ERROS

## ❌ PROBLEMAS COMUNS

### **Problema 1: Erro de RLS (Row-Level Security)**

```
❌ new row violates row-level security policy for table "usuarios"
```

**Solução:** Execute `/supabase-fix-auth.sql`

---

### **Problema 2: Email not confirmed**

```
❌ Erro no login (Auth): AuthApiError: Email not confirmed
```

**Solução Rápida:**
1. Execute: `/CONFIRMAR_TODOS_EMAILS.sql` no Supabase
2. Desabilite confirmação: Authentication → Providers → Email → Desmarque "Confirm email"

**Guia Completo:** `/GUIA_CONFIRMACAO_EMAIL.md`

---

### **Problema 3: Vagas disponíveis não atualizam**

```
❌ Usuário se inscreve mas as vagas continuam iguais
```

**Solução Rápida:**
1. Execute: `/CRIAR_TRIGGER_VAGAS.sql` (cria sistema automático)
2. Execute: `/CORRIGIR_VAGAS_EVENTOS.sql` (corrige eventos existentes)

**Guia Completo:** `/GUIA_VAGAS_DISPONIVEIS.md`

---

## ✅ SOLUÇÃO RÁPIDA (5 MINUTOS)

### **1. Abra o Supabase:**
https://app.supabase.com → Seu Projeto → SQL Editor

### **2. Execute estes 4 scripts:**
1. `/supabase-fix-auth.sql` (corrige RLS)
2. `/CONFIRMAR_TODOS_EMAILS.sql` (confirma emails)
3. `/CRIAR_TRIGGER_VAGAS.sql` (atualiza vagas automaticamente)
4. `/CORRIGIR_VAGAS_EVENTOS.sql` (corrige vagas existentes)

### **3. Desabilite confirmação de email:**
Authentication → Providers → Email → ☐ Confirm email → Save

### **4. Pronto!**
O sistema vai funcionar normalmente.

---

## 📚 ARQUIVOS DISPONÍVEIS

### 🔧 **Arquivos de Correção** (EXECUTE NO SUPABASE)

| Arquivo | Descrição | Quando Usar |
|---------|-----------|-------------|
| `/supabase-fix-auth.sql` | ⭐ Correção principal | **USE ESTE PRIMEIRO** |
| `/CORRIGIR_PERMISSOES_COMPLETO.sql` | Correção completa com permissões | Se ainda tiver erro após o primeiro |
| `/DIAGNOSTICO_BANCO.sql` | Ver status do banco | Para entender o problema |

### 📖 **Documentação**

| Arquivo | Descrição |
|---------|-----------|
| `/EXECUTE_AGORA.md` | Guia detalhado da solução |
| `/GUIA_PASSO_A_PASSO.md` | Tutorial visual passo a passo |
| `/LEIA_PRIMEIRO.md` | Este arquivo - índice geral |

### 🧪 **Scripts de Teste**

| Arquivo | Descrição | Quando Usar |
|---------|-----------|-------------|
| `/CRIAR_EVENTO_CONCLUIDO_SIMPLES.sql` | ⭐ Criar evento para testar certificado | Depois de corrigir o erro |
| `/CRIAR_EVENTO_CONCLUIDO_TESTE.sql` | Versão alternativa (mais detalhes) | Opcional |
| `/ADICIONAR_CAMPOS_EVENTOS.sql` | Adicionar campos na tabela eventos | Se campos estiverem faltando |

---

## 🚀 PASSO A PASSO COMPLETO

### **Etapa 1: Corrigir o Erro RLS**

```
1. Abra: https://app.supabase.com
2. Vá em: SQL Editor
3. Cole: /supabase-fix-auth.sql
4. Execute: Ctrl+Enter
5. Veja: ✅ RLS desabilitado
```

### **Etapa 2: Confirmar Todos os Emails**

```
1. Abra: https://app.supabase.com
2. Vá em: SQL Editor
3. Cole: /CONFIRMAR_TODOS_EMAILS.sql
4. Execute: Ctrl+Enter
5. Veja: ✅ Emails confirmados
```

### **Etapa 3: Desabilitar Confirmação de Email**

```
1. Abra: https://app.supabase.com
2. Vá em: Authentication → Providers → Email
3. Desmarque: "Confirm email"
4. Salve: Save
5. Veja: ✅ Confirmação de email desabilitada
```

### **Etapa 4: Testar o Sistema**

```
1. Volte para o sistema
2. Tente criar uma conta
3. Deve funcionar! ✅
```

### **Etapa 5: Criar Evento para Testar Certificado**

```
1. Abra: /CRIAR_EVENTO_CONCLUIDO_SIMPLES.sql
2. Linha 15: Substitua 'SEU_EMAIL_AQUI' pelo seu email
3. Cole no SQL Editor do Supabase
4. Execute
5. Veja: ✅ Evento criado
```

### **Etapa 6: Baixar Certificado**

```
1. No sistema, vá em: "Meus Eventos"
2. Clique na aba: "Concluídos"
3. Veja: "Workshop de Python Avançado"
4. Clique: "Baixar Certificado" 🎓
```

---

## 🔍 ENTENDENDO O PROBLEMA

### **O que é RLS?**

RLS = **Row-Level Security** (Segurança em Nível de Linha)

É um recurso do Supabase/PostgreSQL que controla **quem pode ver e modificar cada linha** de uma tabela.

### **Por que está bloqueando?**

O sistema está tentando criar usuários, mas o RLS está configurado incorretamente e está bloqueando todas as operações.

### **A solução é segura?**

✅ **Para desenvolvimento/protótipo:** SIM! Desabilitar RLS é normal.

⚠️ **Para produção:** Você deveria configurar políticas RLS específicas.

---

## ❓ PERGUNTAS FREQUENTES

### **1. É seguro desabilitar o RLS?**

Para um protótipo ou ambiente de desenvolvimento, **sim!** 

Para produção, você deve criar políticas específicas depois.

### **2. Vou perder meus dados?**

**Não!** Estes scripts apenas alteram permissões, não deletam dados.

### **3. Posso reverter depois?**

**Sim!** Para reabilitar o RLS:

```sql
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
```

### **4. O que fazer se continuar com erro?**

1. Execute: `/DIAGNOSTICO_BANCO.sql`
2. Me envie o resultado
3. Execute: `/CORRIGIR_PERMISSOES_COMPLETO.sql`

### **5. Preciso fazer isso toda vez?**

**Não!** Apenas uma vez. Depois disso o sistema funciona normalmente.

---

## 📞 SUPORTE

### **Erro ainda persiste?**

Execute `/DIAGNOSTICO_BANCO.sql` e me envie:
- Mensagens de erro completas
- Resultado do diagnóstico
- Qual arquivo você executou

### **Tudo funcionou?**

Ótimo! Agora você pode:
- ✅ Criar usuários
- ✅ Criar eventos
- ✅ Fazer inscrições
- ✅ Gerar certificados

---

## ✅ CHECKLIST

- [ ] Li este arquivo (LEIA_PRIMEIRO.md)
- [ ] Executei `/supabase-fix-auth.sql` no Supabase
- [ ] Vi a mensagem "✅ RLS desabilitado"
- [ ] Executei `/CONFIRMAR_TODOS_EMAILS.sql` no Supabase
- [ ] Desabilitei confirmação de email
- [ ] Testei criar uma conta no sistema
- [ ] (Opcional) Criei evento concluído
- [ ] (Opcional) Testei baixar certificado
- [ ] Sistema funcionando! 🎉

---

## 🎯 RESUMO

| Problema | Solução |
|----------|---------|
| ❌ Erro RLS | Execute `/supabase-fix-auth.sql` |
| ❌ Email not confirmed | Execute `/CONFIRMAR_TODOS_EMAILS.sql` e desabilite confirmação |
| ✅ Sistema funcionando | Teste criar conta |
| 🎓 Testar certificado | Execute `/CRIAR_EVENTO_CONCLUIDO_SIMPLES.sql` |

---

**Começe agora! Execute `/supabase-fix-auth.sql` e `/CONFIRMAR_TODOS_EMAILS.sql` no Supabase.** 🚀