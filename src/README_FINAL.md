# 🎯 SOLUÇÃO FINAL - ENTENDEMOS O PROBLEMA!

## 🔍 O QUE ESTAVA ACONTECENDO

Você tem um **TRIGGER** que automaticamente cria registros em `public.usuarios` quando você cria em `auth.users`.

```
1. Script: INSERT INTO auth.users → cria ID: 61eb7b27-...
2. TRIGGER dispara automaticamente
3. TRIGGER: INSERT INTO public.usuarios com ID: 61eb7b27-...
4. Script tenta: INSERT INTO public.usuarios com ID: 61eb7b27-...
5. ❌ ERRO: duplicate key (o trigger já criou!)
```

**Por isso todos os scripts davam erro "duplicate key"!**

---

## ✅ ESCOLHA UMA SOLUÇÃO

---

### **SOLUÇÃO 1: Via Interface (RECOMENDADO)** ⭐⭐⭐

**Arquivo:** `/CRIAR_VIA_UI.md`

**Como fazer:**
1. Vá em **Authentication** → **Users** → **Add user**
2. Crie `participante@exemplo.com` / `senha123` (marque "Auto Confirm User")
3. Crie `administrador@exemplo.com` / `senha123` (marque "Auto Confirm User")
4. Vá em **Table Editor** → **usuarios**
5. Edite os perfis:
   - `participante@exemplo.com` → perfil: `participante`
   - `administrador@exemplo.com` → perfil: `administrador`

**Por quê escolher:**
- ✅ Mais fácil
- ✅ Visual
- ✅ Sem erros
- ✅ Funciona com o trigger

---

### **SOLUÇÃO 2: SQL que Funciona com Trigger** ⭐⭐

**Arquivo:** `/SQL_COM_TRIGGER.sql`

**Cole este código no SQL Editor:**

```sql
DO $$
DECLARE
    usuario_teste_id uuid;
    usuario_admin_id uuid;
BEGIN
    UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
    
    -- Criar participante (trigger cria em public.usuarios automaticamente)
    SELECT id INTO usuario_teste_id FROM auth.users WHERE email = 'participante@exemplo.com';
    
    IF usuario_teste_id IS NULL THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
            confirmation_token, email_change, email_change_token_new, recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
            'authenticated', 'authenticated', 'participante@exemplo.com',
            crypt('senha123', gen_salt('bf')), NOW(),
            '{"provider":"email","providers":["email"]}', 
            '{"full_name":"Teste Participante"}',
            NOW(), NOW(), '', '', '', ''
        ) RETURNING id INTO usuario_teste_id;
        
        PERFORM pg_sleep(0.2); -- Aguardar trigger
        
        -- Apenas UPDATE (não INSERT, pois trigger já criou)
        UPDATE public.usuarios 
        SET perfil = 'participante', perfil_academico = 'Superior-TSI', nome = 'Teste Participante'
        WHERE id = usuario_teste_id;
    ELSE
        UPDATE auth.users SET encrypted_password = crypt('senha123', gen_salt('bf')) WHERE id = usuario_teste_id;
        UPDATE public.usuarios SET perfil = 'participante' WHERE id = usuario_teste_id;
    END IF;
    
    -- Criar admin
    SELECT id INTO usuario_admin_id FROM auth.users WHERE email = 'administrador@exemplo.com';
    
    IF usuario_admin_id IS NULL THEN
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
        
        PERFORM pg_sleep(0.2); -- Aguardar trigger
        
        UPDATE public.usuarios 
        SET perfil = 'administrador', nome = 'Administrador'
        WHERE id = usuario_admin_id;
    ELSE
        UPDATE auth.users SET encrypted_password = crypt('senha123', gen_salt('bf')) WHERE id = usuario_admin_id;
        UPDATE public.usuarios SET perfil = 'administrador' WHERE id = usuario_admin_id;
    END IF;
    
    RAISE NOTICE '🎉 Usuários criados/atualizados com sucesso!';
END $$;

SELECT u.nome, u.email, u.perfil
FROM public.usuarios u JOIN auth.users au ON u.id = au.id
WHERE u.email IN ('participante@exemplo.com', 'administrador@exemplo.com');
```

**Por quê escolher:**
- ✅ Funciona via SQL
- ✅ Inteligente (verifica se existe)
- ✅ Usa UPDATE ao invés de INSERT

---

## 📋 CREDENCIAIS

Depois de criar:
- 👤 **Participante:** `participante@exemplo.com` / `senha123`
- 🔑 **Admin:** `administrador@exemplo.com` / `senha123`

---

## 🚀 DEPOIS DE CRIAR

**Limpe o cache:**
```javascript
// F12 → Console:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

**Faça login!**

---

## 🎓 O QUE APRENDEMOS

1. **Você tem um trigger** que sincroniza `auth.users` → `public.usuarios`
2. **Isso é BOM!** Sincronização automática
3. **Scripts não devem** fazer INSERT duplo em ambas tabelas
4. **Solução correta:**
   - INSERT apenas em `auth.users`
   - Deixar trigger criar em `public.usuarios`
   - Usar UPDATE para ajustar dados

---

## 🎯 MINHA RECOMENDAÇÃO

Use a **SOLUÇÃO 1 (Interface UI)** ⭐

**Por quê:**
- Mais simples
- Mais visual
- Menos chance de erro
- O Supabase cuida de tudo

**Como:**
1. Leia `/CRIAR_VIA_UI.md`
2. Siga o passo a passo
3. Pronto em 2 minutos!

---

## 📚 ARQUIVOS ÚTEIS

- **`/CRIAR_VIA_UI.md`** ⭐ Criar via interface (RECOMENDADO)
- **`/SQL_COM_TRIGGER.sql`** - Script SQL que funciona com trigger
- **`/SOLUCAO_TRIGGER.md`** - Explicação completa do problema
- **`/SOLUCAO_SIMPLES.md`** - Outras opções

---

**Escolha uma das soluções acima e me avise como foi! 🚀**
