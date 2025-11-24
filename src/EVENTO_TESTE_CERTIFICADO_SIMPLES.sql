-- ==========================================
-- VERSÃO SIMPLES - EVENTO FINALIZADO
-- ==========================================
-- 
-- Execute este script para criar um evento finalizado
-- e testar certificados rapidamente.
--
-- Email: joao.2019312178@aluno.iffar.edu.br
-- ==========================================

-- 1️⃣ CRIAR EVENTO FINALIZADO
WITH novo_evento AS (
    INSERT INTO eventos (
        nome,
        descricao,
        data_inicio,
        duracao_horas,
        limite_faltas_percentual,
        valor_evento,
        texto_certificado,
        perfil_academico_foco,
        local,
        capacidade_maxima,
        vagas_disponiveis,
        categoria
    ) VALUES (
        'Workshop de IA',
        'Workshop intensivo sobre Inteligência Artificial e Machine Learning.',
        NOW() - INTERVAL '15 days',  -- Começou há 15 dias
        20,                           -- 20 horas de duração
        25,                           -- 25% de faltas permitidas
        0,                            -- Gratuito
        'Certificamos que {nome_participante} participou do evento {nome_evento} com carga horária de {carga_horaria} horas.',
        'todos',
        'Campus IFFar',
        30,
        29,
        'Workshop'
    )
    RETURNING id
)
-- 2️⃣ CRIAR PARTICIPAÇÃO APROVADA
INSERT INTO participacoes (
    evento_id,
    usuario_id,
    pagamento_status,
    numero_presencas,
    is_aprovado
)
SELECT 
    (SELECT id FROM novo_evento),
    (SELECT id FROM auth.users WHERE email = 'joao.2019312178@aluno.iffar.edu.br'),
    'nao_requerido',
    20,   -- Presença completa
    true  -- Aprovado
RETURNING 
    id as participacao_id,
    evento_id,
    numero_presencas;

-- 3️⃣ VERIFICAR
SELECT 
    '✅ Evento criado!' as status,
    e.nome,
    e.duracao_horas || ' horas' as carga_horaria,
    p.numero_presencas || ' horas presentes' as presenca,
    CASE WHEN p.is_aprovado THEN '✅ Aprovado' ELSE '❌ Reprovado' END as certificado
FROM eventos e
JOIN participacoes p ON e.id = p.evento_id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br'
  AND e.nome = 'Workshop de IA';

-- ==========================================
-- TESTE NO SISTEMA:
-- 1. Login com: joao.2019312178@aluno.iffar.edu.br
-- 2. Vá em: "Meus Eventos"
-- 3. Veja: "Workshop de IA" (Concluído)
-- 4. Baixe o certificado! 🎓
-- ==========================================
