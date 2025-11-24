-- ==========================================
-- FIX DEFINITIVO - Limpa e Recria do Zero
-- ==========================================
-- 
-- Este script DELETA e RECRIA os usuários de teste
-- Use quando houver inconsistências entre as tabelas
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
BEGIN
    RAISE NOTICE '🧹 Iniciando limpeza completa...';
    
    -- ==========================================
    -- PASSO 1: DELETAR COMPLETAMENTE os usuários de teste
    -- (remove de AMBAS as tabelas)
    -- ==========================================
    
    DELETE FROM public.usuarios WHERE email = 'teste@exemplo.com';
    DELETE FROM auth.users WHERE email = 'teste@exemplo.com';
    RAISE NOTICE '✅ teste@exemplo.com deletado completamente';
    
    DELETE FROM public.usuarios WHERE email = 'admin@exemplo.com';
    DELETE FROM auth.users WHERE email = 'admin@exemplo.com';
    RAISE NOTICE '✅ admin@exemplo.com deletado completamente';
    
    -- ==========================================
    -- PASSO 2: CONFIRMAR todos os outros emails
    -- ==========================================
    
    UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
    RAISE NOTICE '✅ Emails restantes confirmados';
    
    -- ==========================================
    -- PASSO 3: SINCRONIZAR usuários órfãos
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
    
    RAISE NOTICE '✅ Usuários órfãos sincronizados';
    
    -- ==========================================
    -- PASSO 4: CRIAR teste@exemplo.com DO ZERO
    -- ==========================================
    
    INSERT INTO auth.users (
        instance_id, 
        id, 
        aud, 
        role, 
        email, 
        encrypted_password, 
        email_confirmed_at,
        raw_app_meta_data, 
        raw_user_meta_data, 
        created_at, 
        updated_at,
        confirmation_token, 
        email_change, 
        email_change_token_new, 
        recovery_token
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
        NOW(), 
        NOW(), 
        '', 
        '', 
        '', 
        ''
    ) RETURNING id INTO usuario_teste_id;
    
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (
        usuario_teste_id, 
        'Teste Participante', 
        'teste@exemplo.com', 
        'participante', 
        'Superior-TSI', 
        NOW()
    );
    
    RAISE NOTICE '✅ teste@exemplo.com criado com sucesso! ID: %', usuario_teste_id;
    
    -- ==========================================
    -- PASSO 5: CRIAR admin@exemplo.com DO ZERO
    -- ==========================================
    
    INSERT INTO auth.users (
        instance_id, 
        id, 
        aud, 
        role, 
        email, 
        encrypted_password, 
        email_confirmed_at,
        raw_app_meta_data, 
        raw_user_meta_data, 
        created_at, 
        updated_at,
        confirmation_token, 
        email_change, 
        email_change_token_new, 
        recovery_token
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
        NOW(), 
        NOW(), 
        '', 
        '', 
        '', 
        ''
    ) RETURNING id INTO usuario_admin_id;
    
    INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
    VALUES (
        usuario_admin_id, 
        'Administrador', 
        'admin@exemplo.com', 
        'administrador', 
        'Não Informado', 
        NOW()
    );
    
    RAISE NOTICE '✅ admin@exemplo.com criado com sucesso! ID: %', usuario_admin_id;
    
    -- ==========================================
    -- PASSO 6: VERIFICAÇÃO FINAL
    -- ==========================================
    
    RAISE NOTICE '';
    RAISE NOTICE '🎉 ==================================';
    RAISE NOTICE '🎉 FIX COMPLETO!';
    RAISE NOTICE '🎉 ==================================';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Credenciais de Login:';
    RAISE NOTICE '';
    RAISE NOTICE '   👤 PARTICIPANTE:';
    RAISE NOTICE '      Email: teste@exemplo.com';
    RAISE NOTICE '      Senha: senha123';
    RAISE NOTICE '';
    RAISE NOTICE '   🔑 ADMINISTRADOR:';
    RAISE NOTICE '      Email: admin@exemplo.com';
    RAISE NOTICE '      Senha: senha123';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Ambos os usuários foram criados do ZERO!';
    RAISE NOTICE '';
    
END $$;

-- ==========================================
-- VERIFICAÇÃO FINAL - Ver os usuários criados
-- ==========================================

SELECT 
    '🎯 USUÁRIOS CRIADOS' as status,
    u.nome,
    u.email,
    u.perfil,
    CASE 
        WHEN au.email_confirmed_at IS NOT NULL THEN '✅ Email Confirmado' 
        ELSE '❌ Email NÃO Confirmado' 
    END as status_email,
    u.id,
    u.criado_em
FROM public.usuarios u
JOIN auth.users au ON u.id = au.id
WHERE u.email IN ('teste@exemplo.com', 'admin@exemplo.com')
ORDER BY u.email;

-- ==========================================
-- VERIFICAR CONSISTÊNCIA entre tabelas
-- ==========================================

SELECT 
    '🔍 VERIFICAÇÃO DE CONSISTÊNCIA' as titulo,
    COUNT(*) FILTER (WHERE au.id IS NOT NULL AND u.id IS NOT NULL) as "✅ Sincronizados",
    COUNT(*) FILTER (WHERE au.id IS NOT NULL AND u.id IS NULL) as "⚠️ Só em auth.users",
    COUNT(*) FILTER (WHERE au.id IS NULL AND u.id IS NOT NULL) as "⚠️ Só em public.usuarios"
FROM auth.users au
FULL OUTER JOIN public.usuarios u ON au.id = u.id;

-- ==========================================
-- ✅ PRONTO!
-- 
-- Agora você pode fazer login com:
--   - teste@exemplo.com / senha123 (Participante)
--   - admin@exemplo.com / senha123 (Administrador)
--
-- Lembre-se de limpar o cache do navegador:
--   F12 → Console → cole:
--   localStorage.clear(); sessionStorage.clear(); location.reload();
--
-- ==========================================
