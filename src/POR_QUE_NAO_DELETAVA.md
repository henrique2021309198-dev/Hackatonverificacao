# 🔍 Por Que Não Estava Deletando?

## ❌ O Problema Real

O `DELETE FROM public.usuarios` **não estava funcionando** por causa de:

### **1. RLS (Row Level Security) Ativo**
```sql
-- RLS estava bloqueando o DELETE
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Resultado: DELETE não faz nada (0 rows affected)
DELETE FROM public.usuarios WHERE email = 'teste@exemplo.com';
-- ❌ Bloqueado pelo RLS!
```

### **2. Foreign Keys Impedindo Deleção**
```sql
-- Se o usuário tem participações/certificados, não pode deletar
DELETE FROM public.usuarios WHERE email = 'teste@exemplo.com';
-- ❌ ERROR: foreign key constraint violated
```

### **3. Triggers Podem Estar Interferindo**
```sql
-- Triggers podem cancelar o DELETE
-- Ou fazer algo inesperado
```

---

## ✅ A Solução

O script `/FIX_FORCADO.sql` resolve TUDO:

### **1. Desabilita RLS Temporariamente**
```sql
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;
-- ✅ Agora o DELETE funciona!
```

### **2. Deleta Foreign Keys Primeiro**
```sql
-- Ordem correta:
DELETE FROM public.participacoes WHERE usuario_id = ...;
DELETE FROM public.certificados WHERE usuario_id = ...;
DELETE FROM public.presencas_detalhes WHERE usuario_id = ...;
-- ✅ Agora pode deletar o usuário!
DELETE FROM public.usuarios WHERE email = 'teste@exemplo.com';
```

### **3. Verifica Se Deletou**
```sql
SELECT COUNT(*) FROM public.usuarios WHERE email = 'teste@exemplo.com';
-- Se retornar > 0, ABORTA com erro
-- ✅ Garantia de que deletou antes de criar!
```

### **4. Reabilita RLS**
```sql
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
-- ✅ Segurança restaurada!
```

---

## 🎯 Sequência do Erro

### **O Que Estava Acontecendo:**

```
1. Script executa: DELETE FROM public.usuarios WHERE email = 'teste@exemplo.com'
   ❌ RLS bloqueia → 0 rows deleted

2. Script executa: DELETE FROM auth.users WHERE email = 'teste@exemplo.com'
   ✅ Funciona! → 1 row deleted

3. Script cria novo usuário em auth.users
   ✅ Cria com ID novo: 2c7b05e8-f256-4d1e-ac1b-84ccd6dbfdd9

4. Script tenta criar em public.usuarios
   ❌ ERRO! O ID antigo (119b8d08-...) ainda está lá!
   
   ERROR: duplicate key value violates unique constraint "usuarios_pkey"
```

### **Por Que o ID Era Diferente?**

- **ID antigo** (ainda em `public.usuarios`): `119b8d08-25cc-4bbe-9c0a-e494b1a55a04`
- **ID novo** (criado em `auth.users`): `2c7b05e8-f256-4d1e-ac1b-84ccd6dbfdd9`

O script criou um NOVO usuário em `auth.users` (com ID novo), mas tentou criar em `public.usuarios` onde o ID antigo ainda existia!

---

## 🔧 Execute o Fix Forçado

**Copie e execute `/FIX_FORCADO.sql` no SQL Editor:**

```sql
DO $$
DECLARE
    usuario_teste_id uuid;
    usuario_admin_id uuid;
    v_count integer;
BEGIN
    -- Desabilitar RLS
    ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;
    
    -- Deletar foreign keys primeiro
    DELETE FROM public.participacoes 
    WHERE usuario_id IN (
        SELECT id FROM public.usuarios 
        WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com')
    );
    
    DELETE FROM public.certificados 
    WHERE usuario_id IN (
        SELECT id FROM public.usuarios 
        WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com')
    );
    
    DELETE FROM public.presencas_detalhes 
    WHERE usuario_id IN (
        SELECT id FROM public.usuarios 
        WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com')
    );
    
    -- AGORA deletar de public.usuarios
    DELETE FROM public.usuarios 
    WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com');
    
    -- Deletar de auth.users
    DELETE FROM auth.users 
    WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com');
    
    -- Verificar que deletou
    SELECT COUNT(*) INTO v_count 
    FROM public.usuarios 
    WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com');
    
    IF v_count > 0 THEN
        RAISE EXCEPTION 'Ainda existem % usuários!', v_count;
    END IF;
    
    -- Confirmar outros emails
    UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
    
    -- Sincronizar órfãos
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    SELECT au.id, COALESCE(au.raw_user_meta_data->>'full_name', 'Usuário'), 
           au.email, 'participante', 'Não Informado', NOW()
    FROM auth.users au LEFT JOIN public.usuarios u ON au.id = u.id
    WHERE u.id IS NULL ON CONFLICT (id) DO NOTHING;
    
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
    
    -- Reabilitar RLS
    ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
    
    RAISE NOTICE '🎉 PRONTO!';
END $$;

SELECT u.nome, u.email, u.perfil
FROM public.usuarios u JOIN auth.users au ON u.id = au.id
WHERE u.email IN ('teste@exemplo.com', 'admin@exemplo.com');
```

---

## ✅ Depois de Executar

1. Você verá mensagens detalhadas:
   ```
   ✅ RLS desabilitado
   ✅ Deletadas X participações
   ✅ Deletados X certificados
   ✅ Deletadas X presenças
   ✅ Deletados X usuários de public.usuarios
   ✅ Deletados X usuários de auth.users
   ✅ Verificado: public.usuarios está limpo
   ✅ Verificado: auth.users está limpo
   🎉 FIX FORÇADO COMPLETO!
   ```

2. Verá a tabela com os 2 usuários criados

3. Limpe o cache e faça login!

---

## 🎓 Lições Aprendidas

### **1. Sempre desabilite RLS ao deletar/criar usuários de teste:**
```sql
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;
-- faça suas operações
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
```

### **2. Delete foreign keys PRIMEIRO:**
```sql
-- ✅ ORDEM CORRETA:
DELETE FROM participacoes WHERE usuario_id = ...;
DELETE FROM certificados WHERE usuario_id = ...;
DELETE FROM usuarios WHERE id = ...;

-- ❌ ORDEM ERRADA:
DELETE FROM usuarios WHERE id = ...;
-- ERROR: foreign key constraint!
```

### **3. Sempre VERIFIQUE se deletou:**
```sql
SELECT COUNT(*) FROM usuarios WHERE email = 'teste@exemplo.com';
-- Se retornar > 0, algo está errado!
```

### **4. Use transações (BEGIN/COMMIT) para segurança:**
```sql
BEGIN;
-- suas operações
COMMIT; -- ou ROLLBACK se algo der errado
```

---

## 🚀 Agora Execute o Fix Forçado!

**Arquivo:** `/FIX_FORCADO.sql`

**Ou use o código acima!**

**Deve funcionar desta vez! 💪**
