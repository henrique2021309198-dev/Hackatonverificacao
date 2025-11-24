-- ==========================================
-- DESABILITAR CONFIRMAÇÃO DE EMAIL
-- ==========================================
-- 
-- Este script desabilita a necessidade de confirmação
-- de email no Supabase Auth.
--
-- IMPORTANTE: Este comando SQL NÃO funciona diretamente.
-- Você precisa alterar nas configurações do Supabase.
--
-- ==========================================

-- ⚠️ ESTE SCRIPT NÃO PODE SER EXECUTADO VIA SQL
-- Você precisa fazer a configuração via Dashboard do Supabase

-- ==========================================
-- INSTRUÇÕES PARA DESABILITAR CONFIRMAÇÃO:
-- ==========================================

/*

📋 PASSO A PASSO:

1️⃣ Abra o Supabase Dashboard:
   https://app.supabase.com

2️⃣ Selecione seu projeto

3️⃣ No menu lateral, clique em:
   ⚙️ Authentication → Providers

4️⃣ Clique em "Email" na lista de providers

5️⃣ Role até encontrar:
   "Confirm email"
   
6️⃣ DESABILITE a opção:
   ☐ Confirm email
   
   (Remova o check da caixa)

7️⃣ Clique em "Save" no final da página

✅ PRONTO! Agora os usuários podem fazer login sem confirmar email.

*/

-- ==========================================
-- ALTERNATIVA: CONFIRMAR EMAILS EXISTENTES
-- ==========================================

-- Se você já tem usuários cadastrados que não conseguem
-- fazer login, você pode confirmar o email deles manualmente:

-- ⚠️ ATENÇÃO: Execute este comando no SQL Editor do Supabase
-- Substitua 'email@exemplo.com' pelo email real do usuário

-- CONFIRMAR UM USUÁRIO ESPECÍFICO:
UPDATE auth.users
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = 'email@exemplo.com';  -- ⚠️ SUBSTITUA AQUI!

-- ==========================================

-- CONFIRMAR TODOS OS USUÁRIOS DE UMA VEZ:
-- (Use com cuidado! Apenas para ambiente de desenvolvimento)

UPDATE auth.users
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- ==========================================
-- VERIFICAR STATUS DOS USUÁRIOS
-- ==========================================

-- Ver quais usuários estão confirmados e quais não estão:

SELECT 
    id,
    email,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmado'
        ELSE '❌ Não confirmado'
    END as status,
    email_confirmed_at as confirmado_em,
    created_at as criado_em
FROM auth.users
ORDER BY created_at DESC;

-- ==========================================
-- RESUMO
-- ==========================================

/*

✅ SOLUÇÃO RÁPIDA (Recomendada):
   1. Vá em: Authentication → Providers → Email
   2. Desabilite: "Confirm email"
   3. Salve

✅ SOLUÇÃO ALTERNATIVA (Para usuários existentes):
   1. Execute no SQL Editor:
      UPDATE auth.users
      SET email_confirmed_at = NOW(),
          confirmed_at = NOW()
      WHERE email = 'SEU_EMAIL@exemplo.com';

⚠️ LEMBRE-SE:
   - Para produção, você DEVERIA ter confirmação de email
   - Para protótipo/desenvolvimento, pode desabilitar

*/

-- ==========================================
-- FIM
-- ==========================================
