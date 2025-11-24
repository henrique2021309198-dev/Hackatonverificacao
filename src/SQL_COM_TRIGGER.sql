-- ==========================================
-- SCRIPT QUE FUNCIONA COM TRIGGER
-- ==========================================
-- 
-- Este script funciona com o trigger automático
-- que sincroniza auth.users → public.usuarios
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
    RAISE NOTICE '🚀 Iniciando criação de usuários...';
    RAISE NOTICE '';
    
    -- ==========================================
    -- PASSO 1: Confirmar todos os emails
    -- ==========================================
    UPDATE auth.users 
    SET email_confirmed_at = NOW() 
    WHERE email_confirmed_at IS NULL;
    
    RAISE NOTICE '✅ Emails confirmados';
    
    -- ==========================================
    -- PASSO 2: Criar PARTICIPANTE
    -- (Trigger vai criar automaticamente em public.usuarios)
    -- ==========================================
    
    -- Verificar se já existe
    SELECT id INTO usuario_teste_id 
    FROM auth.users 
    WHERE email = 'participante@exemplo.com';
    
    IF usuario_teste_id IS NOT NULL THEN
        RAISE NOTICE '⚠️  participante@exemplo.com já existe (ID: %). Atualizando...', usuario_teste_id;
        
        -- Atualizar senha
        UPDATE auth.users 
        SET encrypted_password = crypt('senha123', gen_salt('bf')),
            email_confirmed_at = NOW()
        WHERE id = usuario_teste_id;
        
        -- Atualizar perfil
        UPDATE public.usuarios 
        SET perfil = 'participante',
            perfil_academico = 'Superior-TSI',
            nome = 'Teste Participante'
        WHERE id = usuario_teste_id;
        
    ELSE
        -- Criar novo (trigger cria em public.usuarios automaticamente)
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
            '{"full_name":"Teste Participante","perfil_academico":"Superior-TSI"}',
            NOW(), NOW(), '', '', '', ''
        ) RETURNING id INTO usuario_teste_id;
        
        RAISE NOTICE '✅ participante@exemplo.com criado (ID: %)', usuario_teste_id;
        
        -- Aguardar trigger processar
        PERFORM pg_sleep(0.2);
        
        -- Atualizar dados que o trigger criou
        UPDATE public.usuarios 
        SET 
            nome = 'Teste Participante',
            perfil = 'participante',
            perfil_academico = 'Superior-TSI'
        WHERE id = usuario_teste_id;
        
        RAISE NOTICE '   └─ Perfil atualizado em public.usuarios';
    END IF;
    
    RAISE NOTICE '';
    
    -- ==========================================
    -- PASSO 3: Criar ADMINISTRADOR
    -- (Trigger vai criar automaticamente em public.usuarios)
    -- ==========================================
    
    -- Verificar se já existe
    SELECT id INTO usuario_admin_id 
    FROM auth.users 
    WHERE email = 'administrador@exemplo.com';
    
    IF usuario_admin_id IS NOT NULL THEN
        RAISE NOTICE '⚠️  administrador@exemplo.com já existe (ID: %). Atualizando...', usuario_admin_id;
        
        -- Atualizar senha
        UPDATE auth.users 
        SET encrypted_password = crypt('senha123', gen_salt('bf')),
            email_confirmed_at = NOW()
        WHERE id = usuario_admin_id;
        
        -- Atualizar perfil
        UPDATE public.usuarios 
        SET perfil = 'administrador',
            perfil_academico = 'Não Informado',
            nome = 'Administrador'
        WHERE id = usuario_admin_id;
        
    ELSE
        -- Criar novo (trigger cria em public.usuarios automaticamente)
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
        
        RAISE NOTICE '✅ administrador@exemplo.com criado (ID: %)', usuario_admin_id;
        
        -- Aguardar trigger processar
        PERFORM pg_sleep(0.2);
        
        -- Atualizar para ser administrador
        UPDATE public.usuarios 
        SET 
            nome = 'Administrador',
            perfil = 'administrador',
            perfil_academico = 'Não Informado'
        WHERE id = usuario_admin_id;
        
        RAISE NOTICE '   └─ Perfil atualizado para ADMINISTRADOR';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '🎉 ==================================';
    RAISE NOTICE '🎉 COMPLETO!';
    RAISE NOTICE '🎉 ==================================';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Use estas credenciais:';
    RAISE NOTICE '';
    RAISE NOTICE '   👤 PARTICIPANTE:';
    RAISE NOTICE '      Email: participante@exemplo.com';
    RAISE NOTICE '      Senha: senha123';
    RAISE NOTICE '';
    RAISE NOTICE '   🔑 ADMINISTRADOR:';
    RAISE NOTICE '      Email: administrador@exemplo.com';
    RAISE NOTICE '      Senha: senha123';
    RAISE NOTICE '';
    
END $$;

-- ==========================================
-- VERIFICAÇÃO FINAL
-- ==========================================
SELECT 
    '✅ USUÁRIOS' as status,
    u.nome,
    u.email,
    u.perfil,
    u.perfil_academico,
    CASE 
        WHEN au.email_confirmed_at IS NOT NULL THEN '✅ Confirmado' 
        ELSE '❌ Pendente' 
    END as email_confirmado,
    u.id
FROM public.usuarios u
JOIN auth.users au ON u.id = au.id
WHERE u.email IN ('participante@exemplo.com', 'administrador@exemplo.com')
ORDER BY u.perfil DESC;

-- ==========================================
-- VERIFICAR TRIGGERS (para entender o que aconteceu)
-- ==========================================
SELECT 
    '🔧 TRIGGERS ATIVOS' as info,
    trigger_name,
    event_manipulation as evento,
    event_object_table as tabela
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
  AND event_object_table = 'users';

-- ==========================================
-- ✅ PRONTO!
-- 
-- Agora você pode fazer login com:
--   - participante@exemplo.com / senha123 (Participante)
--   - administrador@exemplo.com / senha123 (Administrador)
--
-- Lembre-se de limpar o cache do navegador:
--   F12 → Console → cole:
--   localStorage.clear(); sessionStorage.clear(); location.reload();
--
-- ==========================================
