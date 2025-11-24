-- ==========================================
-- FIX COMPLETO: Confirmar Emails e Resolver Login
-- ==========================================
-- 
-- INSTRUÇÕES:
-- 1. Abra: https://app.supabase.com → Seu Projeto
-- 2. Vá em: SQL Editor → New Query
-- 3. Cole TODO este código
-- 4. Clique em RUN (Ctrl+Enter)
-- 5. Aguarde a mensagem de sucesso
-- 6. Tente fazer login novamente
--
-- ==========================================

-- PASSO 1: Confirmar TODOS os emails existentes
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- PASSO 2: Verificar e sincronizar usuários órfãos
-- (usuários que existem no auth.users mas não no public.usuarios)
DO $$
DECLARE
    usuario_record RECORD;
BEGIN
    FOR usuario_record IN 
        SELECT au.id, au.email, au.raw_user_meta_data
        FROM auth.users au
        LEFT JOIN public.usuarios u ON au.id = u.id
        WHERE u.id IS NULL
    LOOP
        INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
        VALUES (
            usuario_record.id,
            COALESCE(usuario_record.raw_user_meta_data->>'full_name', 'Usuário'),
            usuario_record.email,
            'participante',
            COALESCE(usuario_record.raw_user_meta_data->>'perfil_academico', 'Não Informado'),
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;
        
        RAISE NOTICE 'Usuário sincronizado: %', usuario_record.email;
    END LOOP;
END $$;

-- PASSO 3: Criar usuário de teste se não existir
DO $$
DECLARE
    novo_id uuid;
    existe boolean;
BEGIN
    -- Verificar se já existe
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'teste@exemplo.com') INTO existe;
    
    IF NOT existe THEN
        -- Criar no auth.users
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password,
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
            created_at, updated_at, confirmation_token, email_change,
            email_change_token_new, recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'teste@exemplo.com',
            crypt('senha123', gen_salt('bf')),
            NOW(), -- Email JÁ CONFIRMADO
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"Teste Participante"}',
            NOW(), NOW(), '', '', '', ''
        )
        RETURNING id INTO novo_id;
        
        -- Criar no public.usuarios
        INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
        VALUES (novo_id, 'Teste Participante', 'teste@exemplo.com', 'participante', 'Superior-TSI', NOW());
        
        RAISE NOTICE '✅ Usuário teste@exemplo.com criado com sucesso!';
    ELSE
        RAISE NOTICE '⚠️ Usuário teste@exemplo.com já existe';
        
        -- Garantir que está confirmado
        UPDATE auth.users
        SET email_confirmed_at = NOW()
        WHERE email = 'teste@exemplo.com';
    END IF;
END $$;

-- PASSO 4: Criar usuário admin se não existir
DO $$
DECLARE
    novo_id uuid;
    existe boolean;
BEGIN
    -- Verificar se já existe
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'admin@exemplo.com') INTO existe;
    
    IF NOT existe THEN
        -- Criar no auth.users
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password,
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
            created_at, updated_at, confirmation_token, email_change,
            email_change_token_new, recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'admin@exemplo.com',
            crypt('senha123', gen_salt('bf')),
            NOW(), -- Email JÁ CONFIRMADO
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"Administrador"}',
            NOW(), NOW(), '', '', '', ''
        )
        RETURNING id INTO novo_id;
        
        -- Criar no public.usuarios (perfil administrador)
        INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
        VALUES (novo_id, 'Administrador', 'admin@exemplo.com', 'administrador', 'Não Informado', NOW());
        
        RAISE NOTICE '✅ Admin admin@exemplo.com criado com sucesso!';
    ELSE
        RAISE NOTICE '⚠️ Admin admin@exemplo.com já existe';
        
        -- Garantir que está confirmado
        UPDATE auth.users
        SET email_confirmed_at = NOW()
        WHERE email = 'admin@exemplo.com';
        
        -- Garantir que é administrador
        UPDATE public.usuarios
        SET perfil = 'administrador'
        WHERE email = 'admin@exemplo.com';
    END IF;
END $$;

-- PASSO 5: Verificação final - mostrar todos os usuários
SELECT 
  u.nome,
  u.email,
  u.perfil,
  CASE 
    WHEN au.email_confirmed_at IS NOT NULL THEN '✅ Confirmado' 
    ELSE '❌ Não confirmado' 
  END as status_email,
  u.criado_em
FROM public.usuarios u
JOIN auth.users au ON u.id = au.id
ORDER BY u.criado_em DESC;

-- ==========================================
-- ✅ PRONTO! Agora você pode fazer login com:
--
-- PARTICIPANTE:
--   Email: teste@exemplo.com
--   Senha: senha123
--   Tipo: Participante
--
-- ADMINISTRADOR:
--   Email: admin@exemplo.com
--   Senha: senha123
--   Tipo: Administrador
--
-- ==========================================
