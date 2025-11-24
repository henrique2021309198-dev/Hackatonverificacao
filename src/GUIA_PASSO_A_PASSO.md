# 🎯 GUIA PASSO A PASSO - CORRIGIR ERRO DE SEGURANÇA

## 🚨 Você está vendo este erro?

```
❌ new row violates row-level security policy for table "usuarios"
```

**Não se preocupe! Vamos resolver em 5 minutos.** ⏱️

---

## 📋 SIGA ESTES PASSOS:

### **Passo 1️⃣: Abrir Supabase**

1. Acesse: **https://app.supabase.com**
2. Faça login na sua conta
3. Clique no seu projeto

🎯 **Você deve estar na tela principal do seu projeto**

---

### **Passo 2️⃣: Abrir SQL Editor**

No menu lateral esquerdo, procure por:

```
📊 Database
   └─ 💾 SQL Editor  ← CLIQUE AQUI
```

---

### **Passo 3️⃣: Criar Nova Query**

1. Na tela do SQL Editor, clique em: **+ New Query**
2. Uma nova aba vai abrir

---

### **Passo 4️⃣: Copiar e Colar o Script**

1. **Volte para este editor de código**
2. **Abra o arquivo:** `/supabase-fix-auth.sql`
3. **Selecione TODO o conteúdo** (Ctrl+A)
4. **Copie** (Ctrl+C)
5. **Volte para o Supabase**
6. **Cole no SQL Editor** (Ctrl+V)

---

### **Passo 5️⃣: Executar o Script**

1. No SQL Editor, clique no botão **RUN** (canto inferior direito)
   - Ou pressione: **Ctrl+Enter** (Windows/Linux)
   - Ou pressione: **Cmd+Enter** (Mac)

2. Aguarde alguns segundos...

---

### **Passo 6️⃣: Verificar se Funcionou**

Você deve ver mensagens de sucesso:

```
✅ RLS desabilitado em todas as tabelas!
✅ Agora você pode criar usuários e eventos normalmente!
```

E uma tabela como esta:

```
┌────────────────────┬─────────────────┐
│ tablename          │ rls_habilitado  │
├────────────────────┼─────────────────┤
│ usuarios           │ f               │
│ eventos            │ f               │
│ participacoes      │ f               │
│ certificados       │ f               │
│ presencas_detalhes │ f               │
└────────────────────┴─────────────────┘
```

**"f" = false = RLS desabilitado = ✅ FUNCIONANDO!**

---

## 🧪 TESTAR AGORA

### **Teste 1: Criar conta nova**

1. Volte para o sistema
2. Tente criar uma conta de usuário
3. Deve funcionar **sem erros**! ✅

### **Teste 2: Criar evento concluído (para testar certificado)**

1. **Abra:** `/CRIAR_EVENTO_CONCLUIDO_SIMPLES.sql`
2. **Na linha 15**, substitua:
   ```sql
   WHERE email = 'SEU_EMAIL_AQUI'  -- ⚠️ USE SEU EMAIL REAL!
   ```
   Por exemplo:
   ```sql
   WHERE email = 'joao@email.com'  -- ✅ Seu email de login
   ```

3. **Copie TODO o script**
4. **Cole no SQL Editor do Supabase**
5. **Execute** (RUN ou Ctrl+Enter)

6. Deve ver:
   ```
   ✅ Usuário encontrado
   ✅ Evento criado
   ✅ Participação registrada com certificado emitido!
   ```

7. **No sistema:**
   - Vá em: **"Meus Eventos"**
   - Clique na aba: **"Concluídos"**
   - Veja o evento: **"Workshop de Python Avançado"**
   - Botão **"Baixar Certificado"** deve aparecer! 🎓

---

## ❌ AINDA COM ERRO?

### **Se aparecer: "permission denied"**

Execute também este script: `/CORRIGIR_PERMISSOES_COMPLETO.sql`

### **Se aparecer: "relation does not exist"**

As tabelas não foram criadas. Execute primeiro o script de criação das tabelas.

### **Se nada funcionar:**

Cole este comando no SQL Editor:

```sql
-- Ver todas as tabelas
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Ver status do RLS
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Ver políticas ativas
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

Me envie o resultado!

---

## ✅ CHECKLIST FINAL

- [ ] ✅ Abri o Supabase
- [ ] ✅ Abri o SQL Editor
- [ ] ✅ Executei `/supabase-fix-auth.sql`
- [ ] ✅ Vi as mensagens de sucesso
- [ ] ✅ Testei criar uma conta nova
- [ ] ✅ (Opcional) Criei evento concluído
- [ ] ✅ (Opcional) Testei baixar certificado

---

## 🎉 PRONTO!

Agora seu sistema está funcionando corretamente!

**Próximos passos:**
- Criar eventos
- Cadastrar participantes
- Testar inscrições
- Gerar certificados

---

**Alguma dúvida? Me avise!** 💬
