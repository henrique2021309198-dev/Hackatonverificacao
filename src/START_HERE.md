# 🚀 COMECE AQUI - SOLUÇÃO INTELIGENTE

## 💡 A Solução Mais Simples

Ao invés de deletar e recriar usuários (que pode dar erro por causa de RLS e foreign keys), **use emails diferentes**!

---

## ⚡ COLE ESTE CÓDIGO (30 segundos)

### **1️⃣ Abra o Supabase**
https://app.supabase.com → Seu Projeto → **SQL Editor** → **New Query**

---

### **2️⃣ Cole e Execute (Ctrl+Enter)**

```sql
DO $$
DECLARE
    usuario_teste_id uuid;
    usuario_admin_id uuid;
BEGIN
    -- Confirmar todos os emails
    UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
    
    -- Criar PARTICIPANTE
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
    
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (usuario_teste_id, 'Teste Participante', 'participante@exemplo.com', 
            'participante', 'Superior-TSI', NOW());
    
    -- Criar ADMINISTRADOR
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
    
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (usuario_admin_id, 'Administrador', 'administrador@exemplo.com', 
            'administrador', 'Não Informado', NOW());
    
    RAISE NOTICE '🎉 SUCESSO!';
    RAISE NOTICE '   Participante: participante@exemplo.com / senha123';
    RAISE NOTICE '   Admin: administrador@exemplo.com / senha123';
END $$;

SELECT u.nome, u.email, u.perfil
FROM public.usuarios u JOIN auth.users au ON u.id = au.id
WHERE u.email IN ('participante@exemplo.com', 'administrador@exemplo.com');
```

---

### **3️⃣ Faça Login**

**Limpe o cache (F12 → Console):**
```javascript
localStorage.clear(); sessionStorage.clear(); location.reload();
```

**Use estas credenciais:**
- 👤 Participante: `participante@exemplo.com` / `senha123`
- 🔑 Admin: `administrador@exemplo.com` / `senha123`

---

## ✅ PRONTO! 

Sem erros, sem complicação! 🎉

---

## 🎯 Por Que Esta Solução É Melhor?

| Problema das Soluções Anteriores | Solução Inteligente |
|----------------------------------|---------------------|
| ❌ DELETE bloqueado por RLS | ✅ Não precisa deletar |
| ❌ Foreign keys impedindo | ✅ Sem conflitos |
| ❌ Scripts complexos | ✅ Script simples |
| ❌ Erro "duplicate key" | ✅ Emails novos! |
| ❌ 15 minutos debugando | ✅ 30 segundos |

---

## 📚 Quer Outras Opções?

Veja **`/SOLUCAO_SIMPLES.md`** para:
- Deletar manualmente via UI
- Deletar via SQL
- Usar outros emails

---

## 🆘 Ainda Teve Erro?

Se o script acima deu erro:

1. **Erro "duplicate key" com participante@exemplo.com:**
   - Use `user1@exemplo.com` e `admin1@exemplo.com`
   - Ou delete manualmente via Table Editor

2. **Erro de permissão:**
   - Verifique se está usando o SQL Editor como admin
   - Veja `/SOLUCAO_SIMPLES.md` para alternativas

3. **Outro erro:**
   - Leia `/COMO_RESOLVER_ERROS_LOGIN.md`

---

## 💡 Dica Para o Futuro

Se quiser criar mais usuários de teste:

```sql
-- Basta usar emails diferentes:
user1@exemplo.com
user2@exemplo.com
admin2@exemplo.com
participante2@exemplo.com
```

**Simples assim! 😊**

---

**Execute o código acima e comece a usar o sistema! 🚀**
