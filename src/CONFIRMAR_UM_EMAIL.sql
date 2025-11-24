-- ==========================================
-- CONFIRMAR EMAIL DE UM USUÁRIO ESPECÍFICO
-- ==========================================
-- 
-- Use este script para confirmar o email de um
-- usuário específico.
--
-- ⚠️ ANTES DE EXECUTAR:
-- Substitua 'SEU_EMAIL_AQUI' pelo email real!
--
-- ==========================================

-- Confirmar o usuário
UPDATE auth.users
SET 
    email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = 'SEU_EMAIL_AQUI';  -- ⚠️ SUBSTITUA AQUI!

-- Verificar se deu certo
DO $$
DECLARE
    v_email TEXT := 'SEU_EMAIL_AQUI';  -- ⚠️ SUBSTITUA AQUI TAMBÉM!
    v_confirmado TIMESTAMP;
BEGIN
    SELECT email_confirmed_at INTO v_confirmado
    FROM auth.users
    WHERE email = v_email;
    
    IF v_confirmado IS NOT NULL THEN
        RAISE NOTICE '';
        RAISE NOTICE '✅ EMAIL CONFIRMADO COM SUCESSO!';
        RAISE NOTICE '';
        RAISE NOTICE '📧 Email: %', v_email;
        RAISE NOTICE '✅ Confirmado em: %', v_confirmado;
        RAISE NOTICE '';
        RAISE NOTICE '🎉 Agora você pode fazer login!';
    ELSE
        RAISE NOTICE '';
        RAISE NOTICE '❌ USUÁRIO NÃO ENCONTRADO!';
        RAISE NOTICE '';
        RAISE NOTICE '📧 Email procurado: %', v_email;
        RAISE NOTICE '';
        RAISE NOTICE '⚠️  Verifique se:';
        RAISE NOTICE '   1. O email está correto';
        RAISE NOTICE '   2. Você substituiu SEU_EMAIL_AQUI';
        RAISE NOTICE '   3. O usuário foi criado no sistema';
    END IF;
    RAISE NOTICE '';
END $$;

-- ==========================================
-- EXEMPLO DE USO:
-- ==========================================

/*

Se seu email é: joao@email.com

Substitua as linhas 16 e 22 por:

WHERE email = 'joao@email.com';

E então execute o script completo!

*/

-- ==========================================
-- FIM
-- ==========================================
