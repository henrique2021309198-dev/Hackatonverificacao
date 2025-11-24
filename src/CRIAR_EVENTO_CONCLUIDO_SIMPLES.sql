-- ==========================================
-- SCRIPT SIMPLIFICADO - EVENTO CONCLUÍDO
-- ==========================================
-- 
-- ⚠️ ANTES DE EXECUTAR:
-- 1. Substitua SEU_EMAIL_AQUI pelo seu email real
-- 2. Execute TODO o script de uma vez
--
-- ==========================================

DO $$
DECLARE
    v_usuario_id UUID;
    v_evento_id INTEGER;
BEGIN
    -- 🔍 Passo 1: Buscar seu usuário
    SELECT id INTO v_usuario_id
    FROM public.usuarios
    WHERE email = 'joao.2019312178@aluno.iffar.edu.br'  -- ⚠️ SUBSTITUA AQUI!
    LIMIT 1;

    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION '❌ ERRO: Usuário não encontrado! Verifique o email.';
    END IF;

    RAISE NOTICE '✅ Usuário encontrado: %', v_usuario_id;

    -- 📅 Passo 2: Criar evento concluído
    INSERT INTO public.eventos (
        nome,
        descricao,
        data_inicio,
        data_fim,
        local,
        capacidade_maxima,
        vagas_disponiveis,
        categoria,
        gratuito,
        valor,
        imagem_capa,
        status
    ) VALUES (
        'Workshop de Python Avançado',
        'Workshop intensivo sobre técnicas avançadas de Python. Evento já finalizado com sucesso! Certificado disponível para download.',
        '2024-01-15 09:00:00',
        '2024-01-17 18:00:00',
        'Auditório Central - Campus Universitário',
        50,
        35,
        'Workshop',
        false,
        150.00,
        'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
        'Concluído'
    ) RETURNING id INTO v_evento_id;

    RAISE NOTICE '✅ Evento criado: % (ID: %)', 'Workshop de Python Avançado', v_evento_id;

    -- 🎫 Passo 3: Criar sua participação com certificado
    INSERT INTO public.participacoes (
        usuario_id,
        evento_id,
        status_pagamento,
        certificado_emitido,
        data_inscricao
    ) VALUES (
        v_usuario_id,
        v_evento_id,
        'Confirmado',
        true,
        '2024-01-10 14:30:00'
    );

    RAISE NOTICE '✅ Participação registrada com certificado emitido!';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 SUCESSO! Agora você pode:';
    RAISE NOTICE '   1. Ir em "Meus Eventos"';
    RAISE NOTICE '   2. Clicar na aba "Concluídos"';
    RAISE NOTICE '   3. Baixar seu certificado!';

END $$;

-- ==========================================
-- FIM - Script executado com sucesso! 🎉
-- ==========================================
