-- ==========================================
-- CORRIGIR RLS - VERSÃO SUPER SIMPLES
-- ==========================================
-- 
-- Este script desabilita o RLS (Row-Level Security)
-- que está bloqueando a criação de usuários.
--
-- Copie e cole TUDO no SQL Editor do Supabase!
-- ==========================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Permitir leitura de usuários autenticados" ON public.usuarios;
DROP POLICY IF EXISTS "Permitir inserção de novos usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Permitir atualização do próprio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Service role pode inserir usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Permitir select para todos" ON public.usuarios;

-- Desabilitar RLS em todas as tabelas
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.participacoes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificados DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.presencas_detalhes DISABLE ROW LEVEL SECURITY;

-- Ver resultado (deve mostrar "f" = false = desabilitado)
SELECT 
    tablename,
    rowsecurity as rls_habilitado
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('usuarios', 'eventos', 'participacoes', 'certificados', 'presencas_detalhes')
ORDER BY tablename;

-- ==========================================
-- PRONTO! ✅
-- 
-- Se você vir uma tabela com "f" na coluna rls_habilitado,
-- significa que funcionou!
-- 
-- Agora teste criar uma conta no sistema.
-- ==========================================
