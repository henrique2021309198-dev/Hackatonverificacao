# 🚨 LEIA ISTO PRIMEIRO - ERRO DUPLICATE KEY

## ⚡ SOLUÇÃO EM 30 SEGUNDOS

### **O Problema:**
```
❌ Você deletou o usuário de auth.users
❌ MAS ele ainda existe em public.usuarios
❌ Resultado: erro "duplicate key"
```

### **A Solução:**
```
✅ Deletar de AMBAS as tabelas
✅ Recriar do ZERO
✅ Pronto!
```

---

## 📋 COLE ESTE CÓDIGO NO SUPABASE

**Abra:** https://app.supabase.com → SQL Editor → New Query

**Cole e execute (Ctrl+Enter):**

```sql
DO $$
DECLARE
    usuario_teste_id uuid;
    usuario_admin_id uuid;
BEGIN
    DELETE FROM public.usuarios WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com');
    DELETE FROM auth.users WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com');
    UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
    
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    SELECT au.id, COALESCE(au.raw_user_meta_data->>'full_name', 'Usuário'), 
           au.email, 'participante', 'Não Informado', NOW()
    FROM auth.users au LEFT JOIN public.usuarios u ON au.id = u.id
    WHERE u.id IS NULL ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, 
        updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 
        'authenticated', 'teste@exemplo.com', crypt('senha123', gen_salt('bf')), NOW(),
        '{"provider":"email","providers":["email"]}', '{"full_name":"Teste Participante"}',
        NOW(), NOW(), '', '', '', '') RETURNING id INTO usuario_teste_id;
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (usuario_teste_id, 'Teste Participante', 'teste@exemplo.com', 'participante', 'Superior-TSI', NOW());
    
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, 
        updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 
        'authenticated', 'admin@exemplo.com', crypt('senha123', gen_salt('bf')), NOW(),
        '{"provider":"email","providers":["email"]}', '{"full_name":"Administrador"}',
        NOW(), NOW(), '', '', '', '') RETURNING id INTO usuario_admin_id;
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (usuario_admin_id, 'Administrador', 'admin@exemplo.com', 'administrador', 'Não Informado', NOW());
    
    RAISE NOTICE '🎉 PRONTO!';
END $$;

SELECT u.nome, u.email, u.perfil,
  CASE WHEN au.email_confirmed_at IS NOT NULL THEN '✅' ELSE '❌' END as ok
FROM public.usuarios u JOIN auth.users au ON u.id = au.id
WHERE u.email IN ('teste@exemplo.com', 'admin@exemplo.com');
```

---

## ✅ DEPOIS DE EXECUTAR

1. **Limpe o cache:**
   ```javascript
   // F12 → Console:
   localStorage.clear(); sessionStorage.clear(); location.reload();
   ```

2. **Faça login:**
   - Email: `teste@exemplo.com` ou `admin@exemplo.com`
   - Senha: `senha123`

---

## 📚 DOCUMENTAÇÃO COMPLETA

Se quiser entender melhor, leia:

- **`/SOLUCAO_RAPIDA.md`** - Explicação detalhada do problema
- **`/FIX_DEFINITIVO.sql`** - Script com comentários completos
- **`/ERRO_DUPLICATE_KEY.md`** - Como evitar este erro no futuro

---

## 🎯 REGRA DE OURO

**Ao deletar um usuário:**

```sql
-- ✅ CORRETO (delete de AMBAS):
DELETE FROM public.usuarios WHERE email = 'usuario@email.com';
DELETE FROM auth.users WHERE email = 'usuario@email.com';

-- ❌ ERRADO (delete de apenas uma):
DELETE FROM auth.users WHERE email = 'usuario@email.com';
-- ⚠️ Isso causa o erro "duplicate key"!
```

---

**Execute o script acima e pronto! 🚀**
