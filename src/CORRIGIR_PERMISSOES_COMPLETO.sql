-- ==========================================
-- CORREÇÃO COMPLETA DE PERMISSÕES E RLS
-- ==========================================
-- 
-- Execute este script se ainda tiver problemas
-- após executar o supabase-fix-auth.sql
--
-- ==========================================

-- 🔓 Passo 1: Desabilitar RLS em TODAS as tabelas
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', r.tablename);
        RAISE NOTICE '✅ RLS desabilitado em: %', r.tablename;
    END LOOP;
END $$;

-- 🔐 Passo 2: Garantir permissões para todos os roles
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

RAISE NOTICE '';
RAISE NOTICE '✅ Permissões concedidas para todos os roles!';

-- 🗑️ Passo 3: Remover TODAS as políticas existentes
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
        RAISE NOTICE '🗑️  Política removida: % em %', r.policyname, r.tablename;
    END LOOP;
END $$;

-- ==========================================
-- VERIFICAÇÃO FINAL
-- ==========================================

RAISE NOTICE '';
RAISE NOTICE '🎉 CORREÇÃO COMPLETA!';
RAISE NOTICE '';
RAISE NOTICE '📊 Status das Tabelas:';

-- Ver status do RLS
SELECT 
    tablename,
    CASE 
        WHEN rowsecurity THEN '🔒 Habilitado'
        ELSE '🔓 Desabilitado'
    END as status_rls
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Ver permissões
RAISE NOTICE '';
RAISE NOTICE '🔑 Permissões configuradas para:';
RAISE NOTICE '   - postgres (superuser)';
RAISE NOTICE '   - anon (usuários não autenticados)';
RAISE NOTICE '   - authenticated (usuários logados)';
RAISE NOTICE '   - service_role (sistema)';
RAISE NOTICE '';
RAISE NOTICE '✅ Tudo pronto! Teste o sistema agora.';

-- ==========================================
-- FIM
-- ==========================================
