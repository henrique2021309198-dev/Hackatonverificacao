-- ==========================================
-- CRIAR EVENTO FINALIZADO PARA TESTAR CERTIFICADO
-- ==========================================
-- 
-- Este script cria:
-- 1. Um evento que já aconteceu (datas no passado)
-- 2. Uma inscrição para o usuário joao.2019312178@aluno.iffar.edu.br
-- 3. Presença suficiente para gerar certificado
--
-- Execute no SQL Editor do Supabase!
-- ==========================================

-- 🔍 PASSO 1: Encontrar o ID do usuário
DO $$
DECLARE
    v_user_id uuid;
    v_user_email text := 'joao.2019312178@aluno.iffar.edu.br';
BEGIN
    -- Buscar o usuário
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = v_user_email;
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION '❌ Usuário com email % não encontrado! Crie a conta primeiro.', v_user_email;
    ELSE
        RAISE NOTICE '';
        RAISE NOTICE '✅ Usuário encontrado!';
        RAISE NOTICE '   Email: %', v_user_email;
        RAISE NOTICE '   ID: %', v_user_id;
        RAISE NOTICE '';
    END IF;
END $$;

-- 🎯 PASSO 2: Criar evento finalizado
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
    categoria,
    imagem_capa
) VALUES (
    'Workshop de Inteligência Artificial',
    'Workshop intensivo sobre fundamentos de IA e Machine Learning, incluindo teoria e prática com Python, TensorFlow e aplicações reais. Abordamos desde conceitos básicos até implementações avançadas.',
    -- Data de início: 15 dias atrás
    NOW() - INTERVAL '15 days',
    -- Duração: 20 horas (5 dias de 4h cada)
    20,
    -- Limite de faltas: 25% (pode faltar 5h das 20h)
    25,
    -- Gratuito
    0,
    -- Texto do certificado
    'Certificamos que {nome_participante} participou do evento {nome_evento} realizado no período de {data_inicio} a {data_fim}, com carga horária total de {carga_horaria} horas.',
    -- Perfil acadêmico
    'todos',
    -- Local
    'Campus IFFar - Laboratório de Informática',
    -- Capacidade máxima
    30,
    -- Vagas disponíveis (já diminuída por 1 inscrição)
    29,
    -- Categoria
    'Workshop',
    -- Imagem de capa
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80'
)
RETURNING id, nome, data_inicio, data_inicio + (duracao_horas || ' hours')::interval as data_fim;

-- 🎫 PASSO 3: Criar participação para o usuário
DO $$
DECLARE
    v_user_id uuid;
    v_evento_id integer;
    v_user_email text := 'joao.2019312178@aluno.iffar.edu.br';
    v_participacao_id integer;
BEGIN
    -- Buscar usuário
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = v_user_email;
    
    -- Buscar o evento recém-criado
    SELECT id INTO v_evento_id
    FROM eventos
    WHERE nome = 'Workshop de Inteligência Artificial'
    ORDER BY id DESC
    LIMIT 1;
    
    -- Criar participação
    INSERT INTO participacoes (
        evento_id,
        usuario_id,
        pagamento_status,
        numero_presencas,
        is_aprovado
    ) VALUES (
        v_evento_id,
        v_user_id,
        'nao_requerido', -- Evento gratuito
        20, -- Presença completa (20h de 20h = 100%)
        true -- Aprovado para certificado
    )
    RETURNING id INTO v_participacao_id;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ Participação criada com sucesso!';
    RAISE NOTICE '   Evento ID: %', v_evento_id;
    RAISE NOTICE '   Usuário: %', v_user_email;
    RAISE NOTICE '   Presenças: 20/20 horas (100%%)';
    RAISE NOTICE '   Aprovado: SIM ✅';
    RAISE NOTICE '';
END $$;

-- 📊 PASSO 4: Verificar tudo que foi criado
SELECT 
    e.id as evento_id,
    e.nome as evento_nome,
    e.data_inicio,
    e.data_inicio + (e.duracao_horas || ' hours')::interval as data_fim,
    e.duracao_horas as carga_horaria,
    e.valor_evento,
    CASE 
        WHEN e.data_inicio + (e.duracao_horas || ' hours')::interval < NOW() 
        THEN '✅ Finalizado' 
        ELSE '⏳ Em andamento' 
    END as status,
    COUNT(p.id) as total_participantes
FROM eventos e
LEFT JOIN participacoes p ON e.id = p.evento_id
WHERE e.nome = 'Workshop de Inteligência Artificial'
GROUP BY e.id, e.nome, e.data_inicio, e.duracao_horas, e.valor_evento
ORDER BY e.id DESC
LIMIT 1;

-- 📋 PASSO 5: Ver detalhes da participação
SELECT 
    p.id as participacao_id,
    u.email as usuario,
    e.nome as evento,
    p.numero_presencas as horas_presentes,
    e.duracao_horas as total_horas,
    ROUND((p.numero_presencas::numeric / e.duracao_horas::numeric) * 100, 2) as percentual_presenca,
    p.is_aprovado as aprovado,
    p.pagamento_status,
    CASE 
        WHEN p.is_aprovado THEN '✅ Pode gerar certificado'
        ELSE '❌ Não pode gerar certificado'
    END as status_certificado
FROM participacoes p
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE e.nome = 'Workshop de Inteligência Artificial'
  AND u.email = 'joao.2019312178@aluno.iffar.edu.br';

-- ==========================================
-- INSTRUÇÕES PARA TESTAR
-- ==========================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════';
    RAISE NOTICE '✅ EVENTO CRIADO COM SUCESSO!';
    RAISE NOTICE '═══════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '📋 O QUE FOI CRIADO:';
    RAISE NOTICE '   • Evento: Workshop de Inteligência Artificial';
    RAISE NOTICE '   • Duração: 20 horas';
    RAISE NOTICE '   • Status: Finalizado (15 dias atrás)';
    RAISE NOTICE '   • Valor: Gratuito';
    RAISE NOTICE '   • Participante: joao.2019312178@aluno.iffar.edu.br';
    RAISE NOTICE '   • Presença: 20/20 horas (100%%)';
    RAISE NOTICE '   • Aprovado: SIM ✅';
    RAISE NOTICE '';
    RAISE NOTICE '🧪 COMO TESTAR:';
    RAISE NOTICE '';
    RAISE NOTICE '1. Faça login com: joao.2019312178@aluno.iffar.edu.br';
    RAISE NOTICE '2. Vá em: "Meus Eventos"';
    RAISE NOTICE '3. Procure por: "Workshop de Inteligência Artificial"';
    RAISE NOTICE '4. Status deve ser: "Concluído" ou "Finalizado"';
    RAISE NOTICE '5. Deve ter botão: "Baixar Certificado" 🎓';
    RAISE NOTICE '6. Clique e veja se gera o certificado!';
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════';
    RAISE NOTICE '';
END $$;

-- ==========================================
-- CRIAR MAIS EVENTOS DE TESTE (OPCIONAL)
-- ==========================================

-- Se quiser criar mais eventos finalizados, execute:

/*

-- Evento 2: Palestra finalizada há 30 dias
INSERT INTO eventos (
    nome, descricao, data_inicio, duracao_horas, 
    limite_faltas_percentual, valor_evento, texto_certificado,
    perfil_academico_foco, local, capacidade_maxima, 
    vagas_disponiveis, categoria
) VALUES (
    'Palestra sobre Segurança da Informação',
    'Palestra sobre os principais conceitos e práticas de segurança da informação.',
    NOW() - INTERVAL '30 days',
    4,
    25,
    0,
    'Certificamos que {nome_participante} participou do evento {nome_evento}.',
    'todos',
    'Auditório Principal',
    100,
    99,
    'Palestra'
);

-- Criar participação
INSERT INTO participacoes (evento_id, usuario_id, pagamento_status, numero_presencas, is_aprovado)
SELECT 
    (SELECT id FROM eventos WHERE nome = 'Palestra sobre Segurança da Informação' ORDER BY id DESC LIMIT 1),
    (SELECT id FROM auth.users WHERE email = 'joao.2019312178@aluno.iffar.edu.br'),
    'nao_requerido',
    4,
    true;

*/

-- ==========================================
-- DIAGNÓSTICO
-- ==========================================

-- Ver todos os eventos finalizados do usuário:
/*
SELECT 
    e.nome,
    e.data_inicio,
    e.duracao_horas,
    p.numero_presencas,
    p.is_aprovado,
    CASE 
        WHEN e.data_inicio + (e.duracao_horas || ' hours')::interval < NOW() 
        THEN 'Finalizado'
        ELSE 'Em andamento'
    END as status
FROM participacoes p
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br'
ORDER BY e.data_inicio DESC;
*/

-- ==========================================
-- FIM
-- ==========================================
