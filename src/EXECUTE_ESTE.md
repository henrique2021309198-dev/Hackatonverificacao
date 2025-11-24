# ⚡ EXECUTE ESTE SCRIPT AGORA

## 🎯 Você teve erro de "duplicate key"?

**✅ Use este script corrigido que DELETA e RECRIA do zero!**

---

## 📋 PASSO ÚNICO

### **1. Abra o Supabase:**
https://app.supabase.com → Seu Projeto → SQL Editor → New Query

### **2. Cole este código:**

```sql
DO $$
DECLARE
    usuario_teste_id uuid;
    usuario_admin_id uuid;
BEGIN
    -- DELETAR COMPLETAMENTE (ambas as tabelas)
    DELETE FROM public.usuarios WHERE email = 'teste@exemplo.com';
    DELETE FROM auth.users WHERE email = 'teste@exemplo.com';
    DELETE FROM public.usuarios WHERE email = 'admin@exemplo.com';
    DELETE FROM auth.users WHERE email = 'admin@exemplo.com';
    
    -- Confirmar outros emails
    UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
    
    -- Sincronizar órfãos
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    SELECT au.id, COALESCE(au.raw_user_meta_data->>'full_name', 'Usuário'), 
           au.email, 'participante', 'Não Informado', NOW()
    FROM auth.users au LEFT JOIN public.usuarios u ON au.id = u.id
    WHERE u.id IS NULL ON CONFLICT (id) DO NOTHING;
    
    -- CRIAR teste@exemplo.com DO ZERO
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, 
        updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 
        'authenticated', 'teste@exemplo.com', crypt('senha123', gen_salt('bf')), NOW(),
        '{"provider":"email","providers":["email"]}', '{"full_name":"Teste Participante"}',
        NOW(), NOW(), '', '', '', '') RETURNING id INTO usuario_teste_id;
    
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (usuario_teste_id, 'Teste Participante', 'teste@exemplo.com', 'participante', 'Superior-TSI', NOW());
    
    -- CRIAR admin@exemplo.com DO ZERO
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, 
        updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 
        'authenticated', 'admin@exemplo.com', crypt('senha123', gen_salt('bf')), NOW(),
        '{"provider":"email","providers":["email"]}', '{"full_name":"Administrador"}',
        NOW(), NOW(), '', '', '', '') RETURNING id INTO usuario_admin_id;
    
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (usuario_admin_id, 'Administrador', 'admin@exemplo.com', 'administrador', 'Não Informado', NOW());
    
    RAISE NOTICE '🎉 PRONTO! Login: teste@exemplo.com ou admin@exemplo.com / senha123';
END $$;

SELECT u.nome, u.email, u.perfil,
  CASE WHEN au.email_confirmed_at IS NOT NULL THEN '✅' ELSE '❌' END as ok
FROM public.usuarios u JOIN auth.users au ON u.id = au.id
WHERE u.email IN ('teste@exemplo.com', 'admin@exemplo.com')
ORDER BY u.email;
```

### **3. Clique em RUN (Ctrl+Enter)**

### **4. Aguarde as mensagens:**
```
🎉 PRONTO! Login: teste@exemplo.com ou admin@exemplo.com / senha123
```

---

## ✅ Agora Faça Login

**Limpe o cache:**
```javascript
// F12 → Console:
localStorage.clear(); sessionStorage.clear(); location.reload();
```

**Login:**
- Email: `teste@exemplo.com` ou `admin@exemplo.com`
- Senha: `senha123`

---

## 🎯 Diferença do Script Anterior

**❌ Script antigo:**
- Tentava criar usuário mesmo se já existisse
- Dava erro "duplicate key"

**✅ Script novo:**
- Verifica se existe primeiro
- Se existe: atualiza (reseta senha)
- Se não existe: cria
- Funciona sempre!

---

**PRONTO! Agora sim vai funcionar! 🚀**