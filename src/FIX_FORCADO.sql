-- ==========================================
-- FIX FORÇADO - Desabilita RLS e Força Deleção
-- ==========================================
-- 
-- Este script FORÇA a deleção mesmo com RLS ativo
-- Use quando os outros scripts não funcionarem
--
-- INSTRUÇÕES:
-- 1. Abra: https://app.supabase.com → SQL Editor → New Query
-- 2. Cole TODO este código
-- 3. Execute (Ctrl+Enter)
--
-- ==========================================

DO $$
DECLARE
    usuario_teste_id uuid;
    usuario_admin_id uuid;
    v_count integer;
BEGIN
    RAISE NOTICE '🔧 Iniciando FIX FORÇADO...';
    RAISE NOTICE '';
    
    -- ==========================================
    -- PASSO 1: DESABILITAR RLS temporariamente
    -- ==========================================
    ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ RLS desabilitado';
    
    -- ==========================================
    -- PASSO 2: DELETAR de participacoes (foreign key)
    -- ==========================================
    DELETE FROM public.participacoes 
    WHERE usuario_id IN (
        SELECT id FROM public.usuarios 
        WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com')
    );
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RAISE NOTICE '✅ Deletadas % participações', v_count;
    
    -- ==========================================
    -- PASSO 3: DELETAR de certificados (foreign key)
    -- ==========================================
    DELETE FROM public.certificados 
    WHERE usuario_id IN (
        SELECT id FROM public.usuarios 
        WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com')
    );
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RAISE NOTICE '✅ Deletados % certificados', v_count;
    
    -- ==========================================
    -- PASSO 4: DELETAR de presencas_detalhes (foreign key)
    -- ==========================================
    DELETE FROM public.presencas_detalhes 
    WHERE usuario_id IN (
        SELECT id FROM public.usuarios 
        WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com')
    );
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RAISE NOTICE '✅ Deletadas % presenças', v_count;
    
    -- ==========================================
    -- PASSO 5: AGORA SIM deletar de public.usuarios
    -- ==========================================
    DELETE FROM public.usuarios 
    WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com');
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RAISE NOTICE '✅ Deletados % usuários de public.usuarios', v_count;
    
    -- ==========================================
    -- PASSO 6: DELETAR de auth.users
    -- ==========================================
    DELETE FROM auth.users 
    WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com');
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RAISE NOTICE '✅ Deletados % usuários de auth.users', v_count;
    
    -- ==========================================
    -- PASSO 7: VERIFICAR que deletou tudo
    -- ==========================================
    SELECT COUNT(*) INTO v_count 
    FROM public.usuarios 
    WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com');
    
    IF v_count > 0 THEN
        RAISE EXCEPTION '❌ ERRO: Ainda existem % usuários em public.usuarios!', v_count;
    END IF;
    
    RAISE NOTICE '✅ Verificado: public.usuarios está limpo';
    
    SELECT COUNT(*) INTO v_count 
    FROM auth.users 
    WHERE email IN ('teste@exemplo.com', 'admin@exemplo.com');
    
    IF v_count > 0 THEN
        RAISE EXCEPTION '❌ ERRO: Ainda existem % usuários em auth.users!', v_count;
    END IF;
    
    RAISE NOTICE '✅ Verificado: auth.users está limpo';
    RAISE NOTICE '';
    
    -- ==========================================
    -- PASSO 8: CONFIRMAR outros emails
    -- ==========================================
    UPDATE auth.users 
    SET email_confirmed_at = NOW() 
    WHERE email_confirmed_at IS NULL;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RAISE NOTICE '✅ Confirmados % emails', v_count;
    
    -- ==========================================
    -- PASSO 9: SINCRONIZAR usuários órfãos
    -- ==========================================
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    SELECT 
        au.id, 
        COALESCE(au.raw_user_meta_data->>'full_name', 'Usuário'), 
        au.email, 
        'participante', 
        'Não Informado', 
        NOW()
    FROM auth.users au
    LEFT JOIN public.usuarios u ON au.id = u.id
    WHERE u.id IS NULL
    ON CONFLICT (id) DO NOTHING;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RAISE NOTICE '✅ Sincronizados % usuários órfãos', v_count;
    RAISE NOTICE '';
    
    -- ==========================================
    -- PASSO 10: CRIAR teste@exemplo.com DO ZERO
    -- ==========================================
    RAISE NOTICE '🔨 Criando teste@exemplo.com...';
    
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 
        gen_random_uuid(),
        'authenticated', 
        'authenticated', 
        'teste@exemplo.com',
        crypt('senha123', gen_salt('bf')), 
        NOW(),
        '{"provider":"email","providers":["email"]}', 
        '{"full_name":"Teste Participante"}',
        NOW(), NOW(), '', '', '', ''
    ) RETURNING id INTO usuario_teste_id;
    
    RAISE NOTICE '  ✅ Criado em auth.users com ID: %', usuario_teste_id;
    
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (
        usuario_teste_id, 
        'Teste Participante', 
        'teste@exemplo.com', 
        'participante', 
        'Superior-TSI', 
        NOW()
    );
    
    RAISE NOTICE '  ✅ Criado em public.usuarios';
    RAISE NOTICE '';
    
    -- ==========================================
    -- PASSO 11: CRIAR admin@exemplo.com DO ZERO
    -- ==========================================
    RAISE NOTICE '🔨 Criando admin@exemplo.com...';
    
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 
        gen_random_uuid(),
        'authenticated', 
        'authenticated', 
        'admin@exemplo.com',
        crypt('senha123', gen_salt('bf')), 
        NOW(),
        '{"provider":"email","providers":["email"]}', 
        '{"full_name":"Administrador"}',
        NOW(), NOW(), '', '', '', ''
    ) RETURNING id INTO usuario_admin_id;
    
    RAISE NOTICE '  ✅ Criado em auth.users com ID: %', usuario_admin_id;
    
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (
        usuario_admin_id, 
        'Administrador', 
        'admin@exemplo.com', 
        'administrador', 
        'Não Informado', 
        NOW()
    );
    
    RAISE NOTICE '  ✅ Criado em public.usuarios';
    RAISE NOTICE '';
    
    -- ==========================================
    -- PASSO 12: REABILITAR RLS
    -- ==========================================
    ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ RLS reabilitado';
    RAISE NOTICE '';
    
    -- ==========================================
    -- SUCESSO!
    -- ==========================================
    RAISE NOTICE '🎉 ==================================';
    RAISE NOTICE '🎉 FIX FORÇADO COMPLETO!';
    RAISE NOTICE '🎉 ==================================';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Credenciais:';
    RAISE NOTICE '   teste@exemplo.com / senha123';
    RAISE NOTICE '   admin@exemplo.com / senha123';
    RAISE NOTICE '';
    
END $$;

-- ==========================================
-- VERIFICAÇÃO FINAL
-- ==========================================
SELECT 
    '✅ USUÁRIOS CRIADOS' as status,
    u.nome,
    u.email,
    u.perfil,
    CASE 
        WHEN au.email_confirmed_at IS NOT NULL THEN '✅ Confirmado' 
        ELSE '❌ Pendente' 
    END as email_status,
    u.id,
    au.id as auth_id
FROM public.usuarios u
JOIN auth.users au ON u.id = au.id
WHERE u.email IN ('teste@exemplo.com', 'admin@exemplo.com')
ORDER BY u.email;

-- ==========================================
-- ✅ PRONTO!
-- 
-- Se viu a mensagem de sucesso acima:
-- 1. Limpe o cache do navegador (F12 → Console):
--    localStorage.clear(); sessionStorage.clear(); location.reload();
-- 2. Faça login com teste@exemplo.com / senha123
--
-- ==========================================
