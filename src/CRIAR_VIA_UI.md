# ⚡ SOLUÇÃO DEFINITIVA: Criar Via UI

## 🎯 A Forma MAIS SIMPLES (sem SQL!)

Use a interface do Supabase. É visual, rápido e não tem erro!

---

## 📋 PASSO A PASSO (2 minutos)

### **Passo 1: Criar Usuário Participante**

1. **Abra:** https://app.supabase.com
2. **Vá em:** **Authentication** → **Users** (menu lateral)
3. **Clique:** "Add user" (botão verde)
4. **Escolha:** "Create new user"
5. **Preencha:**
   - **Email:** `participante@exemplo.com`
   - **Password:** `senha123`
   - **✅ IMPORTANTE:** Marque "**Auto Confirm User**"
6. **Clique:** "Create user"

### **Passo 2: Criar Usuário Admin**

1. **Clique:** "Add user" novamente
2. **Escolha:** "Create new user"
3. **Preencha:**
   - **Email:** `administrador@exemplo.com`
   - **Password:** `senha123`
   - **✅ IMPORTANTE:** Marque "**Auto Confirm User**"
4. **Clique:** "Create user"

### **Passo 3: Ajustar Perfis na Tabela**

1. **Vá em:** **Table Editor** → **usuarios** (menu lateral)
2. **Encontre:** `participante@exemplo.com`
   - Clique na linha para editar
   - **perfil:** mude para `participante`
   - **perfil_academico:** `Superior-TSI`
   - Salve
3. **Encontre:** `administrador@exemplo.com`
   - Clique na linha para editar
   - **perfil:** mude para `administrador`
   - **perfil_academico:** `Não Informado`
   - Salve

---

## ✅ PRONTO!

Agora você pode fazer login:
- 👤 Participante: `participante@exemplo.com` / `senha123`
- 🔑 Admin: `administrador@exemplo.com` / `senha123`

---

## 🔧 Limpe o Cache Antes de Testar

**F12 → Console:**
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## 🎯 POR QUE ESTA É A MELHOR SOLUÇÃO?

| Problema com SQL | Solução via UI |
|------------------|----------------|
| ❌ Triggers interferindo | ✅ UI usa os triggers corretamente |
| ❌ RLS bloqueando | ✅ UI tem permissões admin |
| ❌ Foreign keys | ✅ UI trata automaticamente |
| ❌ Erros técnicos | ✅ Interface amigável |
| ❌ Precisa saber SQL | ✅ Apenas clicar |

---

## 📸 SCREENSHOTS (Onde Clicar)

### **1. Authentication → Users → Add user**
```
┌─────────────────────────────────────┐
│ Authentication                      │
│   └─ Users              [Add user] │ ← Clique aqui
└─────────────────────────────────────┘
```

### **2. Preencher Formulário**
```
┌─────────────────────────────────────┐
│ Create new user                     │
│                                     │
│ Email:                              │
│ [participante@exemplo.com         ] │
│                                     │
│ Password:                           │
│ [senha123                         ] │
│                                     │
│ ☑ Auto Confirm User  ← IMPORTANTE! │
│                                     │
│           [Create user]             │
└─────────────────────────────────────┘
```

### **3. Table Editor → usuarios**
```
┌──────────────────────────────────────────────────┐
│ Table Editor                                     │
│   └─ usuarios                                    │
│                                                  │
│ id  | nome | email              | perfil        │
│ ... | ...  | participante@...   | participante  │ ← Clique para editar
│ ... | ...  | administrador@...  | administrador │
└──────────────────────────────────────────────────┘
```

---

## 🆘 SE AINDA HOUVER PROBLEMAS

### **Se os emails já existem:**

**Deletar via Authentication:**
1. **Authentication** → **Users**
2. Encontre o usuário
3. Três pontinhos → **Delete user**

**Deletar via Table Editor:**
1. **Table Editor** → **usuarios**
2. Encontre o usuário
3. Três pontinhos → **Delete**

Depois crie novamente seguindo os passos acima.

---

## 💡 DICA: Criar Mais Usuários no Futuro

Sempre que precisar criar usuários de teste:
1. Use a UI do Supabase (Authentication → Users)
2. Marque "Auto Confirm User"
3. Ajuste o perfil no Table Editor

**Simples assim! 😊**

---

## 🎓 O QUE APRENDEMOS

1. Você tem um **trigger** que sincroniza `auth.users` → `public.usuarios`
2. Isso é **bom** (sincronização automática)
3. Por isso scripts SQL que fazem INSERT duplo dão erro
4. A **UI do Supabase** usa os triggers corretamente
5. Sempre use a UI para criar usuários de teste!

---

**Siga os passos acima e me avise se funcionou! 🚀**
