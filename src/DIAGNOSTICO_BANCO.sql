-- ==========================================
-- DIAGNÓSTICO DO BANCO DE DADOS
-- ==========================================
-- 
-- Execute este script para ver o status completo
-- do seu banco de dados e identificar problemas
--
-- ==========================================

-- 📊 1. LISTAR TODAS AS TABELAS
SELECT 
    '📊 TABELAS DISPONÍVEIS' as secao,
    '' as info;

SELECT 
    tablename as nome_tabela,
    CASE 
        WHEN rowsecurity THEN '🔒 RLS Ativo'
        ELSE '🔓 RLS Desabilitado'
    END as status_seguranca
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ==========================================

-- 🔐 2. VER POLÍTICAS DE SEGURANÇA ATIVAS
SELECT 
    '' as separador,
    '🔐 POLÍTICAS DE SEGURANÇA (RLS)' as secao,
    '' as info;

SELECT 
    tablename as tabela,
    policyname as nome_politica,
    cmd as comando,
    CASE 
        WHEN qual IS NULL THEN 'Todos'
        ELSE 'Com restrição'
    END as aplicacao
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Mostrar se não há políticas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public') THEN
        RAISE NOTICE '✅ Nenhuma política RLS ativa (isso é BOM para desenvolvimento!)';
    END IF;
END $$;

-- ==========================================

-- 👥 3. CONTAR REGISTROS NAS TABELAS
SELECT 
    '' as separador,
    '👥 QUANTIDADE DE REGISTROS' as secao,
    '' as info;

DO $$
DECLARE
    v_usuarios INTEGER;
    v_eventos INTEGER;
    v_participacoes INTEGER;
    v_certificados INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_usuarios FROM public.usuarios;
    SELECT COUNT(*) INTO v_eventos FROM public.eventos;
    SELECT COUNT(*) INTO v_participacoes FROM public.participacoes;
    SELECT COUNT(*) INTO v_certificados FROM public.certificados;
    
    RAISE NOTICE '👤 Usuários: %', v_usuarios;
    RAISE NOTICE '📅 Eventos: %', v_eventos;
    RAISE NOTICE '🎫 Participações: %', v_participacoes;
    RAISE NOTICE '🎓 Certificados: %', v_certificados;
END $$;

-- ==========================================

-- 🔑 4. VERIFICAR PERMISSÕES
SELECT 
    '' as separador,
    '🔑 PERMISSÕES DOS ROLES' as secao,
    '' as info;

SELECT 
    grantee as role,
    table_name as tabela,
    string_agg(privilege_type, ', ') as permissoes
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND table_name IN ('usuarios', 'eventos', 'participacoes', 'certificados', 'presencas_detalhes')
GROUP BY grantee, table_name
ORDER BY table_name, grantee;

-- ==========================================

-- 🔄 5. VERIFICAR TRIGGERS
SELECT 
    '' as separador,
    '🔄 TRIGGERS ATIVOS' as secao,
    '' as info;

SELECT 
    trigger_name as nome_trigger,
    event_object_table as tabela,
    action_timing as quando,
    event_manipulation as evento
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ==========================================

-- 📋 6. VERIFICAR ESTRUTURA DA TABELA EVENTOS
SELECT 
    '' as separador,
    '📋 ESTRUTURA DA TABELA EVENTOS' as secao,
    '' as info;

SELECT 
    column_name as coluna,
    data_type as tipo,
    CASE 
        WHEN is_nullable = 'YES' THEN 'Opcional'
        ELSE 'Obrigatório'
    END as obrigatorio,
    column_default as valor_padrao
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'eventos'
ORDER BY ordinal_position;

-- ==========================================

-- 📋 7. VERIFICAR ESTRUTURA DA TABELA USUARIOS
SELECT 
    '' as separador,
    '📋 ESTRUTURA DA TABELA USUARIOS' as secao,
    '' as info;

SELECT 
    column_name as coluna,
    data_type as tipo,
    CASE 
        WHEN is_nullable = 'YES' THEN 'Opcional'
        ELSE 'Obrigatório'
    END as obrigatorio
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'usuarios'
ORDER BY ordinal_position;

-- ==========================================

-- 🔍 8. VER ÚLTIMOS USUÁRIOS CRIADOS
SELECT 
    '' as separador,
    '🔍 ÚLTIMOS 5 USUÁRIOS CRIADOS' as secao,
    '' as info;

SELECT 
    id,
    nome,
    email,
    perfil,
    criado_em
FROM public.usuarios
ORDER BY criado_em DESC
LIMIT 5;

-- ==========================================

-- 🔍 9. VER ÚLTIMOS EVENTOS CRIADOS
SELECT 
    '' as separador,
    '🔍 ÚLTIMOS 5 EVENTOS CRIADOS' as secao,
    '' as info;

SELECT 
    id,
    nome,
    categoria,
    status,
    data_inicio,
    data_fim
FROM public.eventos
ORDER BY criado_em DESC
LIMIT 5;

-- ==========================================

-- ✅ 10. RESUMO FINAL
SELECT 
    '' as separador,
    '✅ RESUMO DO DIAGNÓSTICO' as secao,
    '' as info;

DO $$
DECLARE
    v_rls_habilitado BOOLEAN;
    v_total_usuarios INTEGER;
    v_total_eventos INTEGER;
    v_total_politicas INTEGER;
BEGIN
    -- Verificar RLS
    SELECT COUNT(*) > 0 INTO v_rls_habilitado
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename IN ('usuarios', 'eventos')
      AND rowsecurity = true;
    
    -- Contar registros
    SELECT COUNT(*) INTO v_total_usuarios FROM public.usuarios;
    SELECT COUNT(*) INTO v_total_eventos FROM public.eventos;
    
    -- Contar políticas
    SELECT COUNT(*) INTO v_total_politicas 
    FROM pg_policies 
    WHERE schemaname = 'public';
    
    RAISE NOTICE '';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    RAISE NOTICE '📊 DIAGNÓSTICO COMPLETO';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    RAISE NOTICE '';
    
    IF v_rls_habilitado THEN
        RAISE NOTICE '⚠️  RLS está HABILITADO';
        RAISE NOTICE '   Isso pode causar problemas!';
        RAISE NOTICE '   Execute: /supabase-fix-auth.sql';
    ELSE
        RAISE NOTICE '✅ RLS está DESABILITADO';
        RAISE NOTICE '   Sistema funcionando normalmente!';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '📊 Estatísticas:';
    RAISE NOTICE '   👤 % usuários cadastrados', v_total_usuarios;
    RAISE NOTICE '   📅 % eventos criados', v_total_eventos;
    RAISE NOTICE '   🔐 % políticas RLS ativas', v_total_politicas;
    
    RAISE NOTICE '';
    
    IF v_total_usuarios = 0 THEN
        RAISE NOTICE '⚠️  Nenhum usuário cadastrado ainda';
        RAISE NOTICE '   Crie sua primeira conta no sistema!';
    END IF;
    
    IF v_total_eventos = 0 THEN
        RAISE NOTICE '⚠️  Nenhum evento criado ainda';
        RAISE NOTICE '   Use o script /CRIAR_EVENTO_CONCLUIDO_SIMPLES.sql';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

-- ==========================================
-- FIM DO DIAGNÓSTICO
-- ==========================================
