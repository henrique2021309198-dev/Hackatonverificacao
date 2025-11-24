-- ==========================================
-- CORRIGIR POLÍTICAS DE SEGURANÇA (RLS)
-- ==========================================
-- 
-- Este script corrige as políticas de Row-Level Security
-- para permitir que o sistema funcione corretamente.
--
-- Execute este script no SQL Editor do Supabase!
-- ==========================================

-- 🔓 Passo 1: Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Permitir leitura de usuários autenticados" ON public.usuarios;
DROP POLICY IF EXISTS "Permitir inserção de novos usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Permitir atualização do próprio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Service role pode inserir usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Permitir select para todos" ON public.usuarios;

-- 🔓 Passo 2: DESABILITAR RLS temporariamente
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.participacoes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificados DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.presencas_detalhes DISABLE ROW LEVEL SECURITY;

-- Mensagens de sucesso
DO $$
BEGIN
    RAISE NOTICE '✅ RLS desabilitado em todas as tabelas!';
    RAISE NOTICE '✅ Agora você pode criar usuários e eventos normalmente!';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANTE: Para ambiente de produção, você deve:';
    RAISE NOTICE '   - Reabilitar RLS';
    RAISE NOTICE '   - Criar políticas específicas por perfil (usuário/administrador)';
    RAISE NOTICE '   - Documentação: https://supabase.com/docs/guides/auth/row-level-security';
END $$;

-- ==========================================
-- VERIFICAR SE DEU CERTO
-- ==========================================

-- Ver status do RLS nas tabelas
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_habilitado
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('usuarios', 'eventos', 'participacoes', 'certificados', 'presencas_detalhes')
ORDER BY tablename;

-- ==========================================
-- FIM - Agora você pode usar o sistema! 🎉
-- ==========================================