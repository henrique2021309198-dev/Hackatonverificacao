# 🎯 PROBLEMA REAL: Trigger Automático!

## 🔍 O Que Está Acontecendo

Você tem um **TRIGGER** na tabela `auth.users` que automaticamente cria o registro em `public.usuarios` quando um usuário é criado!

```
1. Script: INSERT INTO auth.users ... → ID gerado: 61eb7b27-...
2. TRIGGER dispara automaticamente
3. TRIGGER: INSERT INTO public.usuarios com o mesmo ID
4. Script tenta: INSERT INTO public.usuarios ...
5. ❌ ERRO: ID 61eb7b27-... já existe! (criado pelo trigger)
```

---

## ✅ SOLUÇÃO 1: Deixar o Trigger Trabalhar (MAIS SIMPLES)

Não faça INSERT manual em `public.usuarios`. Deixe o trigger fazer isso automaticamente!

### **Cole este código:**

```sql
DO $$
DECLARE
    usuario_teste_id uuid;
    usuario_admin_id uuid;
BEGIN
    -- Confirmar emails
    UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
    
    -- Criar PARTICIPANTE (só em auth.users - trigger cria em public.usuarios)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
        'authenticated', 'authenticated', 'participante@exemplo.com',
        crypt('senha123', gen_salt('bf')), NOW(),
        '{"provider":"email","providers":["email"]}', 
        '{"full_name":"Teste Participante","perfil_academico":"Superior-TSI"}',
        NOW(), NOW(), '', '', '', ''
    ) RETURNING id INTO usuario_teste_id;
    
    -- Aguardar trigger processar (pequeno delay)
    PERFORM pg_sleep(0.1);
    
    -- ATUALIZAR dados em public.usuarios (que o trigger criou)
    UPDATE public.usuarios 
    SET 
        nome = 'Teste Participante',
        perfil = 'participante',
        perfil_academico = 'Superior-TSI'
    WHERE id = usuario_teste_id;
    
    -- Criar ADMINISTRADOR (só em auth.users - trigger cria em public.usuarios)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
        'authenticated', 'authenticated', 'administrador@exemplo.com',
        crypt('senha123', gen_salt('bf')), NOW(),
        '{"provider":"email","providers":["email"]}', 
        '{"full_name":"Administrador"}',
        NOW(), NOW(), '', '', '', ''
    ) RETURNING id INTO usuario_admin_id;
    
    -- Aguardar trigger processar
    PERFORM pg_sleep(0.1);
    
    -- ATUALIZAR para ser administrador
    UPDATE public.usuarios 
    SET 
        nome = 'Administrador',
        perfil = 'administrador',
        perfil_academico = 'Não Informado'
    WHERE id = usuario_admin_id;
    
    RAISE NOTICE '🎉 SUCESSO!';
    RAISE NOTICE '   Participante: participante@exemplo.com / senha123';
    RAISE NOTICE '   Admin: administrador@exemplo.com / senha123';
END $$;

-- Ver resultado
SELECT u.nome, u.email, u.perfil
FROM public.usuarios u JOIN auth.users au ON u.id = au.id
WHERE u.email IN ('participante@exemplo.com', 'administrador@exemplo.com');
```

---

## ✅ SOLUÇÃO 2: Usar a UI do Supabase (AINDA MAIS SIMPLES)

### **Opção A: Criar via Authentication**

1. **Abra:** https://app.supabase.com → **Authentication** → **Users**
2. **Clique em:** "Add user" → "Create new user"
3. **Preencha:**
   - Email: `participante@exemplo.com`
   - Password: `senha123`
   - Auto Confirm User: ✅ **MARQUE ESTA OPÇÃO**
4. **Repita para:** `administrador@exemplo.com`
5. **Depois, vá em Table Editor → usuarios e edite o perfil:**
   - `participante@exemplo.com` → perfil: `participante`
   - `administrador@exemplo.com` → perfil: `administrador`

---

## ✅ SOLUÇÃO 3: Deletar Via UI e Usar Script Simples

### **Passo 1: Deletar no Table Editor**

1. **Abra:** https://app.supabase.com → **Table Editor** → `usuarios`
2. **Encontre:** `participante@exemplo.com` e `administrador@exemplo.com`
3. **Delete:** Clique nos três pontinhos → Delete

### **Passo 2: Deletar no Authentication**

1. **Abra:** https://app.supabase.com → **Authentication** → **Users**
2. **Encontre:** `participante@exemplo.com` e `administrador@exemplo.com`
3. **Delete:** Clique nos três pontinhos → Delete user

### **Passo 3: Use o Script da Solução 1**

---

## 🔍 VERIFICAR SE TEM TRIGGER

Execute este SQL para ver os triggers:

```sql
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
  AND event_object_table = 'users';
```

Se retornar algo, você TEM um trigger!

---

## 🎯 QUAL SOLUÇÃO USAR?

### **Use SOLUÇÃO 2 (UI)** ⭐ RECOMENDO
- Mais visual
- Menos chance de erro
- Supabase cuida de tudo

### **Use SOLUÇÃO 1 (SQL com UPDATE)**
- Se preferir fazer por SQL
- Funciona com o trigger

### **Use SOLUÇÃO 3 (Deletar + Script)**
- Se quiser começar do zero
- Garantia de limpeza total

---

## 💡 POR QUE TEM ESSE TRIGGER?

O trigger foi criado para **automaticamente** adicionar novos usuários de `auth.users` em `public.usuarios`. Isso é bom! Significa que você tem sincronização automática.

Mas significa que seus scripts não devem fazer INSERT manual em `public.usuarios` - apenas UPDATE.

---

**Qual solução você prefere tentar? 😊**
