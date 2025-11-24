# ⚡ TESTE RÁPIDO: Criar Usuário e Fazer Login

## 🎯 5 Minutos para Resolver!

---

## ✅ OPÇÃO 1: Criar Participante (MAIS RÁPIDO)

### **1️⃣ Abra o SQL Editor do Supabase**

https://app.supabase.com → Seu Projeto → **SQL Editor** → **New Query**

### **2️⃣ Cole este SQL e execute (Ctrl+Enter):**

```sql
-- Criar usuário participante
DO $$
DECLARE
    novo_id uuid;
BEGIN
    -- Criar no auth.users
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, confirmation_token, email_change,
        email_change_token_new, recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'participante@teste.com',
        crypt('senha123', gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Teste Participante"}',
        NOW(), NOW(), '', '', '', ''
    )
    RETURNING id INTO novo_id;
    
    -- Criar no public.usuarios
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (novo_id, 'Teste Participante', 'participante@teste.com', 'participante', 'Superior-TSI', NOW());
    
    RAISE NOTICE '✅ Usuário criado com sucesso!';
END $$;
```

### **3️⃣ Faça login:**

- **Email:** `participante@teste.com`
- **Senha:** `senha123`
- **Tipo:** Participante

---

## 👑 OPÇÃO 2: Criar Administrador

### **1️⃣ Abra o SQL Editor do Supabase**

https://app.supabase.com → Seu Projeto → **SQL Editor** → **New Query**

### **2️⃣ Cole este SQL e execute:**

```sql
-- Criar usuário administrador
DO $$
DECLARE
    novo_id uuid;
BEGIN
    -- Criar no auth.users
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, confirmation_token, email_change,
        email_change_token_new, recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'admin@teste.com',
        crypt('senha123', gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Administrador"}',
        NOW(), NOW(), '', '', '', ''
    )
    RETURNING id INTO novo_id;
    
    -- Criar no public.usuarios (com perfil administrador)
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (novo_id, 'Administrador', 'admin@teste.com', 'administrador', 'Não Informado', NOW());
    
    RAISE NOTICE '✅ Administrador criado com sucesso!';
END $$;
```

### **3️⃣ Faça login:**

- **Email:** `admin@teste.com`
- **Senha:** `senha123`
- **Tipo:** Administrador

---

## 🔍 Verificar se Funcionou

### **Execute este SQL:**

```sql
-- Ver todos os usuários criados
SELECT 
  u.nome,
  u.email,
  u.perfil,
  CASE WHEN au.email_confirmed_at IS NOT NULL THEN '✅ Confirmado' ELSE '❌ Não confirmado' END as status_email
FROM public.usuarios u
JOIN auth.users au ON u.id = au.id
ORDER BY u.criado_em DESC;
```

**Resultado esperado:**

| nome                 | email                    | perfil         | status_email    |
|----------------------|--------------------------|----------------|-----------------|
| Administrador        | admin@teste.com          | administrador  | ✅ Confirmado   |
| Teste Participante   | participante@teste.com   | participante   | ✅ Confirmado   |

---

## ⚡ ATALHO: Transformar Usuário Existente em Admin

Se você já tem um usuário cadastrado e quer torná-lo admin:

```sql
-- Transformar em admin (mude o email)
UPDATE public.usuarios
SET perfil = 'administrador'
WHERE email = 'seuemail@exemplo.com';
```

---

## 🚨 Erro "Invalid login credentials"?

### **Causa 1: Email não confirmado**

**Solução:**
```sql
-- Confirmar email
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'seuemail@exemplo.com';
```

### **Causa 2: Usuário não existe na tabela usuarios**

**Solução:**
```sql
-- Ver se existe no auth mas não no public.usuarios
SELECT au.id, au.email
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE u.id IS NULL;
```

Se retornar algum usuário, crie o registro:

```sql
-- Criar registro faltante (use o ID do resultado acima)
INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
VALUES (
  'UUID-DO-AUTH-USERS',
  'Nome do Usuário',
  'email@exemplo.com',
  'participante',
  'Não Informado',
  NOW()
);
```

### **Causa 3: Senha incorreta**

**Solução: Resetar senha**
```sql
-- Nova senha: senha123
UPDATE auth.users
SET encrypted_password = crypt('senha123', gen_salt('bf'))
WHERE email = 'seuemail@exemplo.com';
```

---

## 📋 Checklist de Verificação

Antes de testar o login:

- [ ] Executou o SQL de criação de usuário
- [ ] Viu a mensagem "✅ Usuário criado com sucesso!"
- [ ] Verificou que o usuário existe (query de verificação)
- [ ] Email está confirmado
- [ ] Limpou o cache do navegador (Ctrl+Shift+Delete)
- [ ] Reiniciou o servidor de desenvolvimento (`npm run dev`)

---

## 🎉 Resultado Esperado

Após fazer login:

**Se for Participante:**
- ✅ Será redirecionado para área de eventos
- ✅ Verá navbar com: Eventos, Meus Eventos, Perfil

**Se for Administrador:**
- ✅ Será redirecionado para dashboard administrativo
- ✅ Verá sidebar com: Dashboard, Eventos, Usuários, Configurações

---

## 🔧 Logs Detalhados

Agora o console mostra logs SUPER detalhados!

Abra o Console (F12) e procure por:

```
🔐 Tentando fazer login: {email: "...", tipo: "..."}
✅ Autenticação bem-sucedida. ID do usuário: ...
✅ Usuário encontrado: {nome: "...", perfil: "..."}
✅ Login bem-sucedido!
```

Se der erro, você verá:

```
❌ Erro no login (Auth): Invalid login credentials
```

---

## 📚 Documentação Completa

- `/SOLUCAO_ERRO_LOGIN.md` → Guia completo de troubleshooting
- `/CRIAR_USUARIO_ADMIN.md` → Como criar administradores
- `/CADASTRO_SEM_CONFIRMACAO.md` → Como desabilitar confirmação de email

---

**Pronto! Agora teste o login! 🚀**
