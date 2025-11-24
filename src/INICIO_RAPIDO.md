# 🚀 INÍCIO RÁPIDO - Configure em 5 Minutos

## 🎯 O QUE FAZER

Execute **4 scripts SQL** no Supabase e uma **configuração manual**.

---

## 📋 PASSO A PASSO

### **1️⃣ Abra o Supabase**

🔗 https://app.supabase.com → Seu Projeto → **SQL Editor**

---

### **2️⃣ Execute os 4 Scripts**

Copie e cole cada arquivo abaixo, um por vez, no SQL Editor:

#### **Script 1: Corrigir RLS** ⭐

📄 Arquivo: `/supabase-fix-auth.sql`

```
1. Abra o arquivo
2. Copie TODO o conteúdo (Ctrl+A, Ctrl+C)
3. Cole no SQL Editor
4. Execute: Ctrl+Enter ou clique em "RUN"
5. Aguarde: ✅ Ver tabela com "f" (false = desabilitado)
```

**O que faz:** Remove bloqueios de segurança que impedem criar usuários.

---

#### **Script 2: Confirmar Emails** ⭐

📄 Arquivo: `/CONFIRMAR_TODOS_EMAILS.sql`

```
1. Abra o arquivo
2. Copie TODO o conteúdo
3. Cole no SQL Editor
4. Execute: Ctrl+Enter
5. Aguarde: ✅ Ver "EMAILS CONFIRMADOS COM SUCESSO!"
```

**O que faz:** Confirma todos os emails automaticamente.

---

#### **Script 3: Trigger de Vagas** ⭐

📄 Arquivo: `/CRIAR_TRIGGER_VAGAS.sql`

```
1. Abra o arquivo
2. Copie TODO o conteúdo
3. Cole no SQL Editor
4. Execute: Ctrl+Enter
5. Aguarde: ✅ Ver "TRIGGER CRIADO COM SUCESSO!"
```

**O que faz:** Atualiza vagas automaticamente quando alguém se inscreve.

---

#### **Script 4: Corrigir Vagas** ⭐

📄 Arquivo: `/CORRIGIR_VAGAS_EVENTOS.sql`

```
1. Abra o arquivo
2. Copie TODO o conteúdo
3. Cole no SQL Editor
4. Execute: Ctrl+Enter
5. Aguarde: ✅ Ver tabela com status dos eventos
```

**O que faz:** Recalcula vagas de eventos que já têm inscrições.

---

### **3️⃣ Desabilitar Confirmação de Email**

No Supabase Dashboard:

```
1. Vá em: 🔐 Authentication (menu lateral)
2. Clique em: Providers
3. Clique em: Email
4. Role até: "Confirm email"
5. DESMARQUE a caixa: ☐ Confirm email
6. Clique em: Save
```

**O que faz:** Novos usuários poderão fazer login sem confirmar email.

---

### **4️⃣ PRONTO!** 🎉

Volte para o sistema e teste:

```
✅ Criar uma conta
✅ Fazer login
✅ Criar eventos
✅ Se inscrever em eventos
✅ Ver vagas sendo atualizadas
```

---

## 🎯 RESUMO DOS SCRIPTS

| Script | O que faz | Tempo |
|--------|-----------|-------|
| 1. `/supabase-fix-auth.sql` | Remove bloqueios RLS | 5 seg |
| 2. `/CONFIRMAR_TODOS_EMAILS.sql` | Confirma emails | 5 seg |
| 3. `/CRIAR_TRIGGER_VAGAS.sql` | Atualiza vagas automaticamente | 5 seg |
| 4. `/CORRIGIR_VAGAS_EVENTOS.sql` | Corrige vagas existentes | 5 seg |
| 5. **Configuração manual** | Desabilita confirmação email | 30 seg |

**Total:** ~1 minuto

---

## ✅ VERIFICAR SE FUNCIONOU

### **Teste 1: Criar Conta**

```
1. Vá para o sistema
2. Clique em: "Cadastre-se"
3. Preencha os dados
4. Clique em: "Criar Conta"
5. Resultado esperado: ✅ "Cadastro realizado!"
```

### **Teste 2: Fazer Login**

```
1. Use o email e senha criados
2. Clique em: "Entrar"
3. Resultado esperado: ✅ Dashboard aparece
```

### **Teste 3: Vagas Atualizando**

```
1. Vá em: "Eventos"
2. Veja um evento com vagas (ex: 50 vagas)
3. Clique em: "Inscrever-se"
4. Faça logout
5. Entre com OUTRO usuário
6. Veja o mesmo evento
7. Resultado esperado: ✅ Vagas diminuíram (ex: 49 vagas)
```

---

## ❓ PERGUNTAS FREQUENTES

### **1. Em que ordem devo executar?**

Na ordem listada acima:
1. supabase-fix-auth.sql
2. CONFIRMAR_TODOS_EMAILS.sql
3. CRIAR_TRIGGER_VAGAS.sql
4. CORRIGIR_VAGAS_EVENTOS.sql
5. Desabilitar confirmação (manual)

### **2. Posso pular algum script?**

**Não recomendado.** Cada script corrige um problema específico:

- ❌ Pular #1 → Não consegue criar usuários
- ❌ Pular #2 → Não consegue fazer login
- ❌ Pular #3 → Vagas não atualizam
- ❌ Pular #4 → Eventos antigos com vagas erradas
- ❌ Pular #5 → Novos usuários não conseguem login

### **3. Posso executar novamente?**

**Sim!** Todos os scripts são **idempotentes** (podem ser executados várias vezes sem causar problemas).

### **4. E se der erro?**

Execute o diagnóstico:

```sql
-- Cole no SQL Editor
SELECT 
    tablename,
    rowsecurity as rls_ativo
FROM pg_tables
WHERE schemaname = 'public';
```

Me envie o resultado para análise.

### **5. Preciso fazer isso em produção?**

**Depende:**

✅ **Scripts 1, 3, 4:** Sim, são necessários.

⚠️ **Script 2 e config #5:** Apenas para desenvolvimento.

Para produção:
- Configure um servidor de email (SendGrid, Mailgun)
- Mantenha confirmação de email habilitada
- Crie políticas RLS específicas

---

## 🆘 PROBLEMAS COMUNS

### **Erro: "syntax error near RAISE"**

✅ **Solução:** Use a versão corrigida: `/supabase-fix-auth.sql`

### **Erro: "Email not confirmed"**

✅ **Solução:** 
1. Execute `/CONFIRMAR_TODOS_EMAILS.sql`
2. Desabilite confirmação (passo 3)

### **Erro: "Não há vagas disponíveis" mas há vagas**

✅ **Solução:** Execute `/CORRIGIR_VAGAS_EVENTOS.sql`

### **Vagas não atualizam ao inscrever**

✅ **Solução:** Execute `/CRIAR_TRIGGER_VAGAS.sql`

---

## 📖 DOCUMENTAÇÃO COMPLETA

Se quiser entender mais:

- 📘 `/LEIA_PRIMEIRO.md` → Índice geral
- 📗 `/GUIA_CONFIRMACAO_EMAIL.md` → Sobre confirmação de email
- 📕 `/GUIA_VAGAS_DISPONIVEIS.md` → Sobre vagas disponíveis
- 📙 `/EXECUTE_AGORA.md` → Sobre RLS

---

## ✅ CHECKLIST FINAL

Marque conforme completa:

- [ ] Executei `/supabase-fix-auth.sql`
- [ ] Executei `/CONFIRMAR_TODOS_EMAILS.sql`
- [ ] Executei `/CRIAR_TRIGGER_VAGAS.sql`
- [ ] Executei `/CORRIGIR_VAGAS_EVENTOS.sql`
- [ ] Desabilitei "Confirm email" nas configurações
- [ ] Testei criar uma conta → ✅ Funcionou
- [ ] Testei fazer login → ✅ Funcionou
- [ ] Testei inscrição → ✅ Vagas atualizaram
- [ ] **SISTEMA 100% FUNCIONAL!** 🎉

---

## 🎉 SUCESSO!

Se você completou todos os passos:

```
✅ RLS corrigido
✅ Emails confirmados
✅ Vagas atualizando automaticamente
✅ Sistema pronto para usar!
```

**Aproveite seu sistema de eventos acadêmicos!** 🚀

---

## 📞 SUPORTE

Ainda com problemas? Execute:

```sql
-- Diagnóstico completo
\i /DIAGNOSTICO_BANCO.sql
```

E me envie:
1. A mensagem de erro completa
2. Qual script você executou
3. O resultado do diagnóstico
