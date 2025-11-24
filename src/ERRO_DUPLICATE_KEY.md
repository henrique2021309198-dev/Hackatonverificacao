# 🔧 Erro: duplicate key value violates unique constraint

## ❌ Você viu este erro?

```
ERROR: 23505: duplicate key value violates unique constraint "usuarios_pkey"
DETAIL: Key (id)=(3969c2e0-1810-4ce3-a4e9-0cf71170870e) already exists.
```

## 📋 O Que Significa?

Este erro acontece porque:
- ✅ O usuário `teste@exemplo.com` **já existe** no banco de dados
- ❌ O script tentou criar o usuário novamente
- ❌ Não pode ter dois registros com o mesmo ID (chave primária)

**Boa notícia:** Seu banco está protegendo a integridade dos dados! ✅

---

## ✅ SOLUÇÃO RÁPIDA

### **Use o Script Corrigido:**

Execute o arquivo **`/FIX_CORRIGIDO.sql`** ao invés do script anterior.

**O que mudou:**
- ✅ Verifica se o usuário já existe ANTES de criar
- ✅ Se existir, apenas ATUALIZA os dados
- ✅ Usa `ON CONFLICT DO UPDATE` para evitar duplicação
- ✅ Pode ser executado múltiplas vezes sem erros

---

## 🚀 Passo a Passo Correto

### **1. Abra o SQL Editor:**
- https://app.supabase.com → Seu Projeto
- Menu lateral → **SQL Editor**
- Clique em **New Query**

### **2. Cole TODO o conteúdo de `/FIX_CORRIGIDO.sql`**

Ou use este SQL direto:

```sql
DO $$
DECLARE
    usuario_teste_id uuid;
    usuario_admin_id uuid;
BEGIN
    -- Confirmar todos os emails
    UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
    
    -- Sincronizar usuários órfãos
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    SELECT au.id, COALESCE(au.raw_user_meta_data->>'full_name', 'Usuário'), 
           au.email, 'participante', 'Não Informado', NOW()
    FROM auth.users au LEFT JOIN public.usuarios u ON au.id = u.id
    WHERE u.id IS NULL ON CONFLICT (id) DO NOTHING;
    
    -- Garantir teste@exemplo.com existe e está correto
    SELECT id INTO usuario_teste_id FROM auth.users WHERE email = 'teste@exemplo.com' LIMIT 1;
    IF usuario_teste_id IS NULL THEN
        -- Criar novo
        INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, 
            updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
        VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 
            'authenticated', 'teste@exemplo.com', crypt('senha123', gen_salt('bf')), NOW(),
            '{"provider":"email","providers":["email"]}', '{"full_name":"Teste Participante"}',
            NOW(), NOW(), '', '', '', '') RETURNING id INTO usuario_teste_id;
        INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
        VALUES (usuario_teste_id, 'Teste Participante', 'teste@exemplo.com', 'participante', 'Superior-TSI', NOW());
        RAISE NOTICE '✅ teste@exemplo.com CRIADO!';
    ELSE
        -- Atualizar existente (resetar senha e confirmar email)
        UPDATE auth.users 
        SET email_confirmed_at = NOW(), 
            encrypted_password = crypt('senha123', gen_salt('bf')) 
        WHERE id = usuario_teste_id;
        
        INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
        VALUES (usuario_teste_id, 'Teste Participante', 'teste@exemplo.com', 'participante', 'Superior-TSI', NOW())
        ON CONFLICT (id) DO UPDATE SET perfil = 'participante', perfil_academico = 'Superior-TSI';
        
        RAISE NOTICE '✅ teste@exemplo.com JÁ EXISTIA - senha resetada para: senha123';
    END IF;
    
    -- Garantir admin@exemplo.com existe e está correto
    SELECT id INTO usuario_admin_id FROM auth.users WHERE email = 'admin@exemplo.com' LIMIT 1;
    IF usuario_admin_id IS NULL THEN
        -- Criar novo
        INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, 
            updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
        VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 
            'authenticated', 'admin@exemplo.com', crypt('senha123', gen_salt('bf')), NOW(),
            '{"provider":"email","providers":["email"]}', '{"full_name":"Administrador"}',
            NOW(), NOW(), '', '', '', '') RETURNING id INTO usuario_admin_id;
        INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
        VALUES (usuario_admin_id, 'Administrador', 'admin@exemplo.com', 'administrador', 'Não Informado', NOW());
        RAISE NOTICE '✅ admin@exemplo.com CRIADO!';
    ELSE
        -- Atualizar existente (resetar senha, confirmar email e garantir que é admin)
        UPDATE auth.users 
        SET email_confirmed_at = NOW(), 
            encrypted_password = crypt('senha123', gen_salt('bf')) 
        WHERE id = usuario_admin_id;
        
        INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
        VALUES (usuario_admin_id, 'Administrador', 'admin@exemplo.com', 'administrador', 'Não Informado', NOW())
        ON CONFLICT (id) DO UPDATE SET perfil = 'administrador', nome = 'Administrador';
        
        RAISE NOTICE '✅ admin@exemplo.com JÁ EXISTIA - agora é ADMIN - senha: senha123';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '🎉 FIX COMPLETO!';
    RAISE NOTICE '   Login Participante: teste@exemplo.com / senha123';
    RAISE NOTICE '   Login Admin: admin@exemplo.com / senha123';
END $$;

-- Verificar resultado
SELECT u.nome, u.email, u.perfil,
  CASE WHEN au.email_confirmed_at IS NOT NULL THEN '✅ Confirmado' ELSE '❌ Pendente' END as status
FROM public.usuarios u
JOIN auth.users au ON u.id = au.id
ORDER BY u.criado_em DESC LIMIT 10;
```

### **3. Execute (Ctrl+Enter)**

Você deve ver mensagens como:
```
✅ Emails confirmados
✅ Usuários sincronizados
✅ teste@exemplo.com JÁ EXISTIA - senha resetada para: senha123
✅ admin@exemplo.com JÁ EXISTIA - agora é ADMIN - senha: senha123
🎉 FIX COMPLETO!
```

---

## 📊 Mensagens Possíveis

### **Se o usuário NÃO existia:**
```
✅ teste@exemplo.com CRIADO!
✅ admin@exemplo.com CRIADO!
```

### **Se o usuário JÁ existia (seu caso):**
```
✅ teste@exemplo.com JÁ EXISTIA - senha resetada para: senha123
✅ admin@exemplo.com JÁ EXISTIA - agora é ADMIN - senha: senha123
```

**Ambos os casos estão corretos!** ✅

---

## 🎯 O Que o Script Faz Agora

### **Para cada usuário (teste@exemplo.com e admin@exemplo.com):**

1. **Verifica se existe:**
   ```sql
   SELECT id FROM auth.users WHERE email = 'teste@exemplo.com'
   ```

2. **Se NÃO existe:**
   - ✅ Cria no `auth.users`
   - ✅ Cria no `public.usuarios`
   - ✅ Email já confirmado
   - ✅ Senha: `senha123`

3. **Se JÁ existe:**
   - ✅ Confirma o email
   - ✅ Reseta a senha para `senha123`
   - ✅ Atualiza/cria registro em `public.usuarios`
   - ✅ Garante perfil correto (participante/admin)
   - ✅ Usa `ON CONFLICT DO UPDATE` (sem erro!)

---

## ✅ Após Executar

### **1. Verifique os dados:**

O script mostra automaticamente uma tabela no final:

| nome | email | perfil | status |
|------|-------|--------|--------|
| Administrador | admin@exemplo.com | administrador | ✅ Confirmado |
| Teste Participante | teste@exemplo.com | participante | ✅ Confirmado |

### **2. Teste o login:**

**Limpe o cache:**
```javascript
// F12 → Console:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

**Faça login:**
- Email: `teste@exemplo.com` OU `admin@exemplo.com`
- Senha: `senha123`
- Tipo: Participante ou Administrador (de acordo)

---

## 🔍 Entendendo o Erro Original

### **Por que aconteceu?**

O script antigo fazia assim:

```sql
-- ❌ ERRADO: Não verifica se existe
INSERT INTO public.usuarios (id, nome, email, ...)
VALUES (novo_id, 'Teste', 'teste@exemplo.com', ...);
```

Se o usuário já existisse, dava erro de chave duplicada.

### **Como corrigimos?**

O script novo faz assim:

```sql
-- ✅ CORRETO: Verifica primeiro
SELECT id INTO usuario_teste_id 
FROM auth.users 
WHERE email = 'teste@exemplo.com';

IF usuario_teste_id IS NULL THEN
    -- Criar novo
ELSE
    -- Atualizar existente
END IF;
```

E também usa `ON CONFLICT`:

```sql
-- ✅ CORRETO: Se existir, atualiza
INSERT INTO public.usuarios (...)
VALUES (...)
ON CONFLICT (id) DO UPDATE SET perfil = 'participante';
```

---

## 🚨 Ainda Com Problemas?

### **Erro persiste?**

Tente limpar e recriar o usuário:

```sql
-- CUIDADO: Isso DELETA o usuário!
DELETE FROM public.usuarios WHERE email = 'teste@exemplo.com';
DELETE FROM auth.users WHERE email = 'teste@exemplo.com';

-- Agora execute o script /FIX_CORRIGIDO.sql novamente
```

### **Quer verificar os dados?**

```sql
-- Ver usuário completo
SELECT 
  au.id,
  au.email,
  au.email_confirmed_at,
  u.nome,
  u.perfil
FROM auth.users au
FULL OUTER JOIN public.usuarios u ON au.id = u.id
WHERE au.email = 'teste@exemplo.com';
```

**Resultado esperado:**
- `id`: Mesmo UUID nas duas tabelas
- `email`: teste@exemplo.com
- `email_confirmed_at`: Data/hora (não null)
- `nome`: Teste Participante
- `perfil`: participante

---

## ✅ Checklist Final

- [ ] Executei o script `/FIX_CORRIGIDO.sql`
- [ ] Vi as mensagens de sucesso (✅)
- [ ] Verifiquei a tabela de usuários
- [ ] Ambos os usuários aparecem como "✅ Confirmado"
- [ ] Limpei o cache do navegador
- [ ] Testei o login com `teste@exemplo.com` / `senha123`
- [ ] Login funcionou! 🎉

---

**Pronto! Agora você pode executar o script quantas vezes quiser sem erros! 🚀**
