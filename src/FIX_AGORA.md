# ⚡ FIX DE 3 MINUTOS - LOGIN FUNCIONANDO!

## 🚨 Você está vendo este erro?

```
❌ Email not confirmed
❌ Invalid login credentials
```

## ✅ SOLUÇÃO EM 3 PASSOS:

---

### **1️⃣ EXECUTE ESTE SQL (1 minuto)**

**Abra:** https://app.supabase.com → Seu Projeto → SQL Editor → New Query

**⚠️ IMPORTANTE: Use o arquivo `/FIX_CORRIGIDO.sql` ao invés deste código abaixo!**

**Cole e execute o conteúdo completo de `/FIX_CORRIGIDO.sql`**

OU cole este código (versão corrigida, sem erros de duplicação):

```sql
-- FIX COMPLETO - Versão Corrigida (sem erros de duplicação)
DO $$
DECLARE
    novo_id uuid;
    usuario_teste_id uuid;
    usuario_admin_id uuid;
BEGIN
    -- Confirmar todos os emails
    UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
    RAISE NOTICE '✅ Emails confirmados';
    
    -- Sincronizar usuários órfãos
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    SELECT au.id, COALESCE(au.raw_user_meta_data->>'full_name', 'Usuário'), 
           au.email, 'participante', 'Não Informado', NOW()
    FROM auth.users au LEFT JOIN public.usuarios u ON au.id = u.id
    WHERE u.id IS NULL ON CONFLICT (id) DO NOTHING;
    RAISE NOTICE '✅ Usuários sincronizados';
    
    -- Garantir teste@exemplo.com
    SELECT id INTO usuario_teste_id FROM auth.users WHERE email = 'teste@exemplo.com' LIMIT 1;
    IF usuario_teste_id IS NULL THEN
        INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, 
            updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
        VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 
            'authenticated', 'teste@exemplo.com', crypt('senha123', gen_salt('bf')), NOW(),
            '{"provider":"email","providers":["email"]}', '{"full_name":"Teste Participante"}',
            NOW(), NOW(), '', '', '', '') RETURNING id INTO usuario_teste_id;
        INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
        VALUES (usuario_teste_id, 'Teste Participante', 'teste@exemplo.com', 'participante', 'Superior-TSI', NOW());
        RAISE NOTICE '✅ teste@exemplo.com criado!';
    ELSE
        UPDATE auth.users SET email_confirmed_at = NOW(), encrypted_password = crypt('senha123', gen_salt('bf')) WHERE id = usuario_teste_id;
        INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
        VALUES (usuario_teste_id, 'Teste Participante', 'teste@exemplo.com', 'participante', 'Superior-TSI', NOW())
        ON CONFLICT (id) DO UPDATE SET perfil = 'participante';
        RAISE NOTICE '✅ teste@exemplo.com atualizado!';
    END IF;
    
    -- Garantir admin@exemplo.com
    SELECT id INTO usuario_admin_id FROM auth.users WHERE email = 'admin@exemplo.com' LIMIT 1;
    IF usuario_admin_id IS NULL THEN
        INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, 
            updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
        VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 
            'authenticated', 'admin@exemplo.com', crypt('senha123', gen_salt('bf')), NOW(),
            '{"provider":"email","providers":["email"]}', '{"full_name":"Administrador"}',
            NOW(), NOW(), '', '', '', '') RETURNING id INTO usuario_admin_id;
        INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
        VALUES (usuario_admin_id, 'Administrador', 'admin@exemplo.com', 'administrador', 'Não Informado', NOW());
        RAISE NOTICE '✅ admin@exemplo.com criado!';
    ELSE
        UPDATE auth.users SET email_confirmed_at = NOW(), encrypted_password = crypt('senha123', gen_salt('bf')) WHERE id = usuario_admin_id;
        INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
        VALUES (usuario_admin_id, 'Administrador', 'admin@exemplo.com', 'administrador', 'Não Informado', NOW())
        ON CONFLICT (id) DO UPDATE SET perfil = 'administrador';
        RAISE NOTICE '✅ admin@exemplo.com atualizado!';
    END IF;
    
    RAISE NOTICE '🎉 FIX COMPLETO! Login: teste@exemplo.com ou admin@exemplo.com / senha123';
END $$;

-- Ver resultado
SELECT u.nome, u.email, u.perfil,
  CASE WHEN au.email_confirmed_at IS NOT NULL THEN '✅' ELSE '❌' END as confirmado
FROM public.usuarios u
JOIN auth.users au ON u.id = au.id
ORDER BY u.criado_em DESC LIMIT 10;
```

---

### **2️⃣ DESABILITE CONFIRMAÇÃO DE EMAIL (30 segundos)**

**Supabase Dashboard:**
1. **Authentication** → **Providers**
2. Clique em **Email**
3. **Desmarque:** "Enable email confirmations"
4. **Save**

---

### **3️⃣ TESTE O LOGIN (30 segundos)**

**Limpe o cache primeiro:**
- F12 → Console → cole e execute:
```javascript
localStorage.clear(); sessionStorage.clear(); location.reload();
```

**Faça login com:**

| Tipo | Email | Senha |
|------|-------|-------|
| **Participante** | `teste@exemplo.com` | `senha123` |
| **Administrador** | `admin@exemplo.com` | `senha123` |

---

## ✅ PRONTO!

**Você deve ver no console (F12):**
```
🔐 Tentando fazer login...
✅ Autenticação bem-sucedida...
✅ Usuário encontrado...
✅ Login bem-sucedido!
```

---

## 🚨 AINDA NÃO FUNCIONOU?

### **Problema: "Email not confirmed"**

Execute:
```sql
UPDATE auth.users SET email_confirmed_at = NOW();
```

### **Problema: "Invalid login credentials"**

Resetar senha:
```sql
UPDATE auth.users
SET encrypted_password = crypt('senha123', gen_salt('bf'))
WHERE email = 'teste@exemplo.com';
```

### **Problema: Usuário não existe**

Verificar:
```sql
-- Ver se existe no auth.users
SELECT email FROM auth.users WHERE email = 'teste@exemplo.com';

-- Ver se existe no public.usuarios
SELECT email FROM public.usuarios WHERE email = 'teste@exemplo.com';
```

Se existir apenas em um dos dois, re-execute o SQL do PASSO 1.

---

## 📋 VERIFICAÇÃO RÁPIDA

Execute:
```sql
SELECT 
  COUNT(*) as total,
  COUNT(email_confirmed_at) as confirmados
FROM auth.users;
```

**Resultado esperado:** `total` = `confirmados`

---

## 🎯 CRIAR MEU PRÓPRIO ADMIN

Já tem um usuário? Transforme em admin:

```sql
UPDATE public.usuarios
SET perfil = 'administrador'
WHERE email = 'seuemail@exemplo.com';
```

---

## 📚 DOCUMENTAÇÃO COMPLETA

- `/LEIA_PRIMEIRO.md` - Guia completo do projeto
- `/COMO_RESOLVER_ERROS_LOGIN.md` - Troubleshooting detalhado
- `/FIX_EMAIL_CONFIRMACAO.sql` - Script completo com comentários

---

**IMPORTANTE:** Sempre limpe o cache do navegador após mudanças no banco!

```javascript
// Cole no console (F12):
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

**PRONTO! Login deve funcionar perfeitamente agora! 🚀**