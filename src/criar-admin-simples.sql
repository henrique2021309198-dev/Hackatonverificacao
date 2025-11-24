-- ==========================================
-- SCRIPT RÁPIDO: Transformar Usuário em ADMIN
-- ==========================================
-- 
-- INSTRUÇÕES:
-- 1. Primeiro, crie um usuário normal pelo site (cadastro normal)
-- 2. Depois, execute este SQL no Supabase para torná-lo admin
-- 3. Substitua 'seuemail@exemplo.com' pelo email que você cadastrou
--
-- Como executar:
-- - Supabase → SQL Editor → New Query
-- - Cole este código
-- - MUDE O EMAIL na linha abaixo
-- - Clique em RUN (ou Ctrl+Enter)
--

-- ⬇️ MUDE APENAS O EMAIL AQUI ⬇️
UPDATE public.usuarios
SET perfil = 'administrador'
WHERE email = 'seuemail@exemplo.com';

-- ✅ Pronto! Agora faça login como Administrador


-- ==========================================
-- VERIFICAR SE DEU CERTO
-- ==========================================
-- Execute este comando para ver todos os admins:

SELECT 
  nome,
  email,
  perfil,
  perfil_academico,
  criado_em
FROM public.usuarios
WHERE perfil = 'administrador';


-- ==========================================
-- EXTRA: Listar Todos os Usuários
-- ==========================================

SELECT 
  nome,
  email,
  perfil,
  criado_em
FROM public.usuarios
ORDER BY criado_em DESC;
