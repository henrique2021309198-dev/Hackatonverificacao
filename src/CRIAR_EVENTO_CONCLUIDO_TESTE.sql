-- ==========================================
-- CRIAR EVENTO CONCLUÍDO PARA TESTE DE CERTIFICADO
-- ==========================================
-- 
-- Este script cria:
-- 1. Um evento que já terminou (no passado)
-- 2. Uma participação para o usuário logado
-- 3. Certificado emitido (para poder baixar)
--
-- IMPORTANTE: Antes de executar, substitua:
-- - 'SEU_EMAIL@EXEMPLO.COM' pelo seu email de login
--
-- ==========================================

-- Passo 1: Inserir evento concluído
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
    'Workshop intensivo sobre técnicas avançadas de Python, incluindo decoradores, geradores, context managers e programação assíncrona. Evento já finalizado.',
    '2024-01-15 09:00:00',  -- Evento começou em janeiro de 2024 (passado)
    '2024-01-17 18:00:00',  -- Terminou 3 dias depois
    'Auditório Central - Campus Universitário',
    50,
    35,  -- Ainda tem vagas disponíveis
    'Workshop',
    false,  -- Pago
    150.00,
    'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
    'Concluído'
) RETURNING id;

-- ==========================================
-- ATENÇÃO: Copie o ID do evento que foi retornado acima!
-- Ele será usado no próximo comando.
-- ==========================================

-- Passo 2: Buscar o ID do usuário pelo email
-- SUBSTITUA 'SEU_EMAIL@EXEMPLO.COM' pelo seu email real!
DO $$
DECLARE
    v_usuario_id UUID;
    v_evento_id INTEGER;
BEGIN
    -- Buscar ID do usuário
    SELECT id INTO v_usuario_id
    FROM public.usuarios
    WHERE email = 'SEU_EMAIL@EXEMPLO.COM'  -- ⚠️ SUBSTITUA AQUI!
    LIMIT 1;

    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION '❌ Usuário não encontrado! Verifique o email.';
    END IF;

    -- Buscar o evento recém-criado (último evento "Workshop de Python Avançado")
    SELECT id INTO v_evento_id
    FROM public.eventos
    WHERE nome = 'Workshop de Python Avançado'
    ORDER BY criado_em DESC
    LIMIT 1;

    IF v_evento_id IS NULL THEN
        RAISE EXCEPTION '❌ Evento não encontrado! Execute o INSERT acima primeiro.';
    END IF;

    -- Inserir participação
    INSERT INTO public.participacoes (
        usuario_id,
        evento_id,
        status_pagamento,
        certificado_emitido,
        data_inscricao
    ) VALUES (
        v_usuario_id,
        v_evento_id,
        'Confirmado',  -- Pagamento confirmado
        true,          -- Certificado JÁ emitido (pode baixar)
        '2024-01-10 14:30:00'  -- Inscreveu-se antes do evento
    );

    RAISE NOTICE '✅ Evento concluído criado com sucesso!';
    RAISE NOTICE '✅ Participação registrada para o usuário!';
    RAISE NOTICE '✅ Certificado emitido e disponível para download!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 IDs:';
    RAISE NOTICE '   - Usuario ID: %', v_usuario_id;
    RAISE NOTICE '   - Evento ID: %', v_evento_id;
END $$;

-- ==========================================
-- VERIFICAR SE DEU CERTO
-- ==========================================

-- Ver o evento criado
SELECT 
    id,
    nome,
    data_inicio,
    data_fim,
    status,
    categoria
FROM public.eventos
WHERE nome = 'Workshop de Python Avançado'
ORDER BY criado_em DESC
LIMIT 1;

-- Ver a participação criada
-- SUBSTITUA 'SEU_EMAIL@EXEMPLO.COM' novamente!
SELECT 
    p.id as participacao_id,
    e.nome as evento_nome,
    u.nome as usuario_nome,
    p.status_pagamento,
    p.certificado_emitido,
    p.data_inscricao
FROM public.participacoes p
JOIN public.eventos e ON p.evento_id = e.id
JOIN public.usuarios u ON p.usuario_id = u.id
WHERE u.email = 'SEU_EMAIL@EXEMPLO.COM'  -- ⚠️ SUBSTITUA AQUI!
  AND e.nome = 'Workshop de Python Avançado';

-- ==========================================
-- FIM DO SCRIPT
-- ==========================================
-- 
-- Após executar este script:
-- 1. Vá em "Meus Eventos" no sistema
-- 2. Clique na aba "Concluídos"
-- 3. Você verá o evento "Workshop de Python Avançado"
-- 4. O botão "Baixar Certificado" estará disponível!
-- 
-- ==========================================
