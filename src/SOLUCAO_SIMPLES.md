# ✅ SOLUÇÃO SIMPLES - Sem Complicação

## 🎯 Você está certo!

Não precisa de scripts complexos. Existem **2 soluções SIMPLES**:

---

## **OPÇÃO 1: Deletar Manualmente no Supabase UI** ⭐ MAIS FÁCIL

### **Passo 1: Abra a tabela**
https://app.supabase.com → Seu Projeto → **Table Editor** → `usuarios`

### **Passo 2: Encontre as linhas**
- Procure por `teste@exemplo.com`
- Procure por `admin@exemplo.com`

### **Passo 3: Delete as linhas**
- Clique no ícone de **lixeira** (ou três pontinhos) na linha
- Clique em **Delete**
- Confirme

### **Passo 4: Execute o script simples**

```sql
-- Agora que deletou manualmente, crie os usuários:
DO $$
DECLARE
    usuario_teste_id uuid;
    usuario_admin_id uuid;
BEGIN
    -- Confirmar emails
    UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
    
    -- Criar teste@exemplo.com
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, 
        updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 
        'authenticated', 'teste@exemplo.com', crypt('senha123', gen_salt('bf')), NOW(),
        '{"provider":"email","providers":["email"]}', '{"full_name":"Teste Participante"}',
        NOW(), NOW(), '', '', '', '') RETURNING id INTO usuario_teste_id;
    
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (usuario_teste_id, 'Teste Participante', 'teste@exemplo.com', 'participante', 'Superior-TSI', NOW());
    
    -- Criar admin@exemplo.com
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, 
        updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 
        'authenticated', 'admin@exemplo.com', crypt('senha123', gen_salt('bf')), NOW(),
        '{"provider":"email","providers":["email"]}', '{"full_name":"Administrador"}',
        NOW(), NOW(), '', '', '', '') RETURNING id INTO usuario_admin_id;
    
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (usuario_admin_id, 'Administrador', 'admin@exemplo.com', 'administrador', 'Não Informado', NOW());
    
    RAISE NOTICE '✅ PRONTO!';
END $$;
```

---

## **OPÇÃO 2: Usar Emails Diferentes** ⭐ AINDA MAIS FÁCIL

### **Use emails que não existem:**

```sql
DO $$
DECLARE
    usuario_teste_id uuid;
    usuario_admin_id uuid;
BEGIN
    -- Confirmar emails
    UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
    
    -- Criar participante@exemplo.com (novo email!)
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, 
        updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 
        'authenticated', 'participante@exemplo.com', crypt('senha123', gen_salt('bf')), NOW(),
        '{"provider":"email","providers":["email"]}', '{"full_name":"Teste Participante"}',
        NOW(), NOW(), '', '', '', '') RETURNING id INTO usuario_teste_id;
    
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (usuario_teste_id, 'Teste Participante', 'participante@exemplo.com', 'participante', 'Superior-TSI', NOW());
    
    -- Criar administrador@exemplo.com (novo email!)
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, 
        updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 
        'authenticated', 'administrador@exemplo.com', crypt('senha123', gen_salt('bf')), NOW(),
        '{"provider":"email","providers":["email"]}', '{"full_name":"Administrador"}',
        NOW(), NOW(), '', '', '', '') RETURNING id INTO usuario_admin_id;
    
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (usuario_admin_id, 'Administrador', 'administrador@exemplo.com', 'administrador', 'Não Informado', NOW());
    
    RAISE NOTICE '✅ Usuários criados!';
    RAISE NOTICE '   Login Participante: participante@exemplo.com / senha123';
    RAISE NOTICE '   Login Admin: administrador@exemplo.com / senha123';
END $$;

SELECT u.nome, u.email, u.perfil
FROM public.usuarios u JOIN auth.users au ON u.id = au.id
WHERE u.email IN ('participante@exemplo.com', 'administrador@exemplo.com');
```

**Credenciais:**
- 👤 Participante: `participante@exemplo.com` / `senha123`
- 🔑 Admin: `administrador@exemplo.com` / `senha123`

---

## **OPÇÃO 3: Script SQL Que Deleta Direto (sem foreign keys)**

Se você quer usar SQL mas sem complicação:

```sql
-- Desabilitar RLS
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;

-- Deletar direto
DELETE FROM public.usuarios WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com');
DELETE FROM auth.users WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com');

-- Reabilitar RLS
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Agora criar os usuários (use o script da Opção 1 ou 2 acima)
```

---

## 🎯 Qual Escolher?

### **Use OPÇÃO 2** (emails diferentes) ⭐ RECOMENDO
- ✅ Mais rápido (1 minuto)
- ✅ Sem risco de erro
- ✅ Não precisa deletar nada
- ✅ Funciona SEMPRE

### **Use OPÇÃO 1** (deletar manual)
- Se você REALMENTE quer usar `teste@exemplo.com`
- Se você gosta da interface visual

### **Use OPÇÃO 3** (script delete)
- Se você quer fazer tudo por SQL
- Se RLS não está bloqueando

---

## ✅ Minha Recomendação: OPÇÃO 2

**Cole este código e pronto:**

```sql
DO $$
DECLARE
    usuario_teste_id uuid;
    usuario_admin_id uuid;
BEGIN
    UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
    
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, 
        updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 
        'authenticated', 'participante@exemplo.com', crypt('senha123', gen_salt('bf')), NOW(),
        '{"provider":"email","providers":["email"]}', '{"full_name":"Teste Participante"}',
        NOW(), NOW(), '', '', '', '') RETURNING id INTO usuario_teste_id;
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (usuario_teste_id, 'Teste Participante', 'participante@exemplo.com', 'participante', 'Superior-TSI', NOW());
    
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, 
        updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 
        'authenticated', 'administrador@exemplo.com', crypt('senha123', gen_salt('bf')), NOW(),
        '{"provider":"email","providers":["email"]}', '{"full_name":"Administrador"}',
        NOW(), NOW(), '', '', '', '') RETURNING id INTO usuario_admin_id;
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (usuario_admin_id, 'Administrador', 'administrador@exemplo.com', 'administrador', 'Não Informado', NOW());
    
    RAISE NOTICE '🎉 PRONTO!';
END $$;

SELECT u.nome, u.email, u.perfil
FROM public.usuarios u JOIN auth.users au ON u.id = au.id
WHERE u.email IN ('participante@exemplo.com', 'administrador@exemplo.com');
```

**Login:**
- `participante@exemplo.com` / `senha123`
- `administrador@exemplo.com` / `senha123`

---

## 🚀 Depois de Executar

1. Limpe o cache: `localStorage.clear(); sessionStorage.clear(); location.reload();`
2. Faça login!

---

**MUITO mais simples, não é? 😊**
