# ⚡ COLE ISTO AGORA - SEM COMPLICAÇÃO

## 🎯 Solução Inteligente: Use Emails Diferentes!

Ao invés de ficar deletando e recriando, **simplesmente use emails que não existem**.

---

## 📋 PASSO ÚNICO

### **Abra:** https://app.supabase.com → SQL Editor → New Query

### **Cole e execute (Ctrl+Enter):**

```sql
DO $$
DECLARE
    usuario_teste_id uuid;
    usuario_admin_id uuid;
BEGIN
    -- Confirmar todos os emails
    UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
    
    -- Criar PARTICIPANTE com email novo
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 
        gen_random_uuid(),
        'authenticated', 
        'authenticated', 
        'participante@exemplo.com',
        crypt('senha123', gen_salt('bf')), 
        NOW(),
        '{"provider":"email","providers":["email"]}', 
        '{"full_name":"Teste Participante"}',
        NOW(), NOW(), '', '', '', ''
    ) RETURNING id INTO usuario_teste_id;
    
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (
        usuario_teste_id, 
        'Teste Participante', 
        'participante@exemplo.com', 
        'participante', 
        'Superior-TSI', 
        NOW()
    );
    
    -- Criar ADMINISTRADOR com email novo
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 
        gen_random_uuid(),
        'authenticated', 
        'authenticated', 
        'administrador@exemplo.com',
        crypt('senha123', gen_salt('bf')), 
        NOW(),
        '{"provider":"email","providers":["email"]}', 
        '{"full_name":"Administrador"}',
        NOW(), NOW(), '', '', '', ''
    ) RETURNING id INTO usuario_admin_id;
    
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (
        usuario_admin_id, 
        'Administrador', 
        'administrador@exemplo.com', 
        'administrador', 
        'Não Informado', 
        NOW()
    );
    
    RAISE NOTICE '';
    RAISE NOTICE '🎉 SUCESSO!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Use estas credenciais:';
    RAISE NOTICE '   👤 Participante: participante@exemplo.com / senha123';
    RAISE NOTICE '   🔑 Admin: administrador@exemplo.com / senha123';
    RAISE NOTICE '';
END $$;

-- Ver os usuários criados
SELECT 
    '✅ USUÁRIOS CRIADOS' as status,
    u.nome,
    u.email,
    u.perfil,
    '✅' as email_confirmado
FROM public.usuarios u
JOIN auth.users au ON u.id = au.id
WHERE u.email IN ('participante@exemplo.com', 'administrador@exemplo.com')
ORDER BY u.perfil DESC;
```

---

## ✅ Resultado Esperado

Você verá:

```
🎉 SUCESSO!

📋 Use estas credenciais:
   👤 Participante: participante@exemplo.com / senha123
   🔑 Admin: administrador@exemplo.com / senha123
```

**+ Tabela:**

| status | nome | email | perfil | email_confirmado |
|--------|------|-------|--------|------------------|
| ✅ USUÁRIOS CRIADOS | Administrador | administrador@exemplo.com | administrador | ✅ |
| ✅ USUÁRIOS CRIADOS | Teste Participante | participante@exemplo.com | participante | ✅ |

---

## 🚀 Agora Faça Login

### **1. Limpe o cache (F12 → Console):**
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### **2. Use estas credenciais:**
- 👤 **Participante:** `participante@exemplo.com` / `senha123`
- 🔑 **Admin:** `administrador@exemplo.com` / `senha123`

---

## 🎯 Por Que Esta É a Melhor Solução?

| Problema Anterior | Solução Nova |
|------------------|--------------|
| ❌ Tentava deletar usuários | ✅ Usa emails novos |
| ❌ RLS bloqueava DELETE | ✅ Não precisa deletar nada |
| ❌ Foreign keys impediam | ✅ Não tem conflito |
| ❌ Scripts complexos | ✅ Script simples |
| ❌ Erros de "duplicate key" | ✅ Sem duplicação! |
| ❌ 15 minutos debugando | ✅ 30 segundos! |

---

## 💡 Dica Extra

Se quiser criar mais usuários de teste no futuro:

```sql
-- Basta usar emails diferentes:
-- user1@exemplo.com
-- user2@exemplo.com
-- admin2@exemplo.com
-- etc.
```

---

## 📚 Se Quiser Deletar os Antigos Depois

**Opção 1: Via UI (mais fácil)**
1. Vá em Table Editor → `usuarios`
2. Encontre `teste@exemplo.com` e `admin@exemplo.com`
3. Clique na lixeira e delete

**Opção 2: Via SQL**
```sql
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;
DELETE FROM public.usuarios WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com');
DELETE FROM auth.users WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com');
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
```

---

## ✅ Checklist Final

- [ ] Executei o script acima
- [ ] Vi a mensagem "🎉 SUCESSO!"
- [ ] Vi a tabela com os 2 usuários
- [ ] Limpei o cache do navegador
- [ ] Fiz login com `participante@exemplo.com` / `senha123`
- [ ] Funcionou! 🎉

---

**Pronto! Simples, rápido e sem erros! 🚀**
