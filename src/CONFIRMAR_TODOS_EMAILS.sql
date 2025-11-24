-- ==========================================
-- CONFIRMAR TODOS OS EMAILS AUTOMATICAMENTE
-- ==========================================
-- 
-- Execute este script para confirmar TODOS os emails
-- de usuários que ainda não foram confirmados.
--
-- ✅ Use para desenvolvimento/protótipo
-- ⚠️ NÃO use em produção!
--
-- ==========================================

-- Confirmar TODOS os usuários que ainda não foram confirmados
UPDATE auth.users
SET 
    email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Ver resultado
DO $$
DECLARE
    v_confirmados INTEGER;
    v_total INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_confirmados
    FROM auth.users
    WHERE email_confirmed_at IS NOT NULL;
    
    SELECT COUNT(*) INTO v_total
    FROM auth.users;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ EMAILS CONFIRMADOS COM SUCESSO!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Estatísticas:';
    RAISE NOTICE '   ✅ Confirmados: %', v_confirmados;
    RAISE NOTICE '   📧 Total: %', v_total;
    RAISE NOTICE '';
    RAISE NOTICE '🎉 Agora todos os usuários podem fazer login!';
    RAISE NOTICE '';
END $$;

-- Listar todos os usuários e status
SELECT 
    email,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmado'
        ELSE '❌ Não confirmado'
    END as status,
    created_at as criado_em
FROM auth.users
ORDER BY created_at DESC;

-- ==========================================
-- FIM
-- ==========================================
