-- ==========================================
-- FIX CORRIGIDO - Sem Erros de Duplicação
-- ==========================================
-- 
-- Este script foi corrigido para lidar com usuários existentes
-- Não vai dar erro mesmo se você executar múltiplas vezes
--
-- INSTRUÇÕES:
-- 1. Abra: https://app.supabase.com → SQL Editor → New Query
-- 2. Cole TODO este código
-- 3. Execute (Ctrl+Enter)
-- 4. Aguarde mensagem de sucesso
--
-- ==========================================

DO $$
DECLARE
    novo_id uuid;
    usuario_teste_id uuid;
    usuario_admin_id uuid;
BEGIN
    -- ==========================================
    -- PASSO 1: Confirmar TODOS os emails existentes
    -- ==========================================
    UPDATE auth.users 
    SET email_confirmed_at = NOW()
    WHERE email_confirmed_at IS NULL;
    
    RAISE NOTICE '✅ Passo 1: Emails confirmados';

    -- ==========================================
    -- PASSO 2: Sincronizar usuários órfãos
    -- (existem no auth.users mas não no public.usuarios)
    -- ==========================================
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    SELECT 
        au.id, 
        COALESCE(au.raw_user_meta_data->>'full_name', 'Usuário'), 
        au.email, 
        'participante', 
        COALESCE(au.raw_user_meta_data->>'perfil_academico', 'Não Informado'), 
        NOW()
    FROM auth.users au
    LEFT JOIN public.usuarios u ON au.id = u.id
    WHERE u.id IS NULL
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE '✅ Passo 2: Usuários sincronizados';

    -- ==========================================
    -- PASSO 3: Garantir que teste@exemplo.com existe
    -- ==========================================
    
    -- Verificar se já existe no auth.users
    SELECT id INTO usuario_teste_id 
    FROM auth.users 
    WHERE email = 'teste@exemplo.com' 
    LIMIT 1;
    
    IF usuario_teste_id IS NULL THEN
        -- Criar no auth.users
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
            confirmation_token, email_change, email_change_token_new, recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
            'authenticated', 'authenticated', 'teste@exemplo.com',
            crypt('senha123', gen_salt('bf')), NOW(),
            '{"provider":"email","providers":["email"]}', 
            '{"full_name":"Teste Participante"}',
            NOW(), NOW(), '', '', '', ''
        ) RETURNING id INTO usuario_teste_id;
        
        -- Criar no public.usuarios
        INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
        VALUES (usuario_teste_id, 'Teste Participante', 'teste@exemplo.com', 'participante', 'Superior-TSI', NOW());
        
        RAISE NOTICE '✅ Passo 3a: Usuário teste@exemplo.com criado!';
    ELSE
        -- Usuário já existe, apenas garantir que está correto
        UPDATE auth.users 
        SET email_confirmed_at = NOW(),
            encrypted_password = crypt('senha123', gen_salt('bf'))
        WHERE id = usuario_teste_id;
        
        -- Garantir que existe no public.usuarios
        INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
        VALUES (usuario_teste_id, 'Teste Participante', 'teste@exemplo.com', 'participante', 'Superior-TSI', NOW())
        ON CONFLICT (id) DO UPDATE SET
            perfil = 'participante',
            perfil_academico = 'Superior-TSI';
        
        RAISE NOTICE '✅ Passo 3b: Usuário teste@exemplo.com atualizado (senha resetada para: senha123)';
    END IF;

    -- ==========================================
    -- PASSO 4: Garantir que admin@exemplo.com existe
    -- ==========================================
    
    -- Verificar se já existe no auth.users
    SELECT id INTO usuario_admin_id 
    FROM auth.users 
    WHERE email = 'admin@exemplo.com' 
    LIMIT 1;
    
    IF usuario_admin_id IS NULL THEN
        -- Criar no auth.users
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
            confirmation_token, email_change, email_change_token_new, recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
            'authenticated', 'authenticated', 'admin@exemplo.com',
            crypt('senha123', gen_salt('bf')), NOW(),
            '{"provider":"email","providers":["email"]}', 
            '{"full_name":"Administrador"}',
            NOW(), NOW(), '', '', '', ''
        ) RETURNING id INTO usuario_admin_id;
        
        -- Criar no public.usuarios
        INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
        VALUES (usuario_admin_id, 'Administrador', 'admin@exemplo.com', 'administrador', 'Não Informado', NOW());
        
        RAISE NOTICE '✅ Passo 4a: Admin admin@exemplo.com criado!';
    ELSE
        -- Admin já existe, apenas garantir que está correto
        UPDATE auth.users 
        SET email_confirmed_at = NOW(),
            encrypted_password = crypt('senha123', gen_salt('bf'))
        WHERE id = usuario_admin_id;
        
        -- Garantir que existe no public.usuarios e é admin
        INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
        VALUES (usuario_admin_id, 'Administrador', 'admin@exemplo.com', 'administrador', 'Não Informado', NOW())
        ON CONFLICT (id) DO UPDATE SET
            perfil = 'administrador',
            nome = 'Administrador';
        
        RAISE NOTICE '✅ Passo 4b: Admin admin@exemplo.com atualizado (senha resetada para: senha123)';
    END IF;

    -- ==========================================
    -- PASSO 5: Confirmar emails novamente (garantia)
    -- ==========================================
    UPDATE auth.users 
    SET email_confirmed_at = NOW() 
    WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com');
    
    RAISE NOTICE '✅ Passo 5: Confirmação final dos emails';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 FIX COMPLETO! Agora você pode fazer login com:';
    RAISE NOTICE '';
    RAISE NOTICE '   Participante: teste@exemplo.com / senha123';
    RAISE NOTICE '   Admin: admin@exemplo.com / senha123';
    RAISE NOTICE '';
END $$;

-- ==========================================
-- VERIFICAÇÃO FINAL
-- ==========================================
SELECT 
  u.nome,
  u.email,
  u.perfil,
  CASE 
    WHEN au.email_confirmed_at IS NOT NULL THEN '✅ Confirmado' 
    ELSE '❌ NÃO CONFIRMADO' 
  END as status_email,
  u.criado_em
FROM public.usuarios u
JOIN auth.users au ON u.id = au.id
ORDER BY u.criado_em DESC
LIMIT 10;

-- ==========================================
-- ✅ PRONTO! Veja a tabela acima
-- Deve mostrar pelo menos:
--   - Administrador | admin@exemplo.com | administrador | ✅
--   - Teste Participante | teste@exemplo.com | participante | ✅
--
-- Agora teste o login!
-- ==========================================
