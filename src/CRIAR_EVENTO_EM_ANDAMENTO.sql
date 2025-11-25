-- ==========================================
-- CRIAR EVENTO EM ANDAMENTO PARA TESTAR CHECK-IN
-- ==========================================
-- 
-- Este script cria:
-- 1. Um evento que está acontecendo agora (em andamento)
-- 2. Uma inscrição para o usuário joao.2019312178@aluno.iffar.edu.br
-- 3. Alguns registros de presença como exemplo
--
-- Execute no SQL Editor do Supabase!
-- ==========================================

-- 🔍 PASSO 1: Verificar se o usuário existe
DO $$
DECLARE
    v_user_id uuid;
    v_user_email text := 'joao.2019312178@aluno.iffar.edu.br';
BEGIN
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

-- 🎯 PASSO 2: Criar evento em andamento
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
    'Semana de Tecnologia e Inovação 2025',
    'Evento completo com palestras, workshops e mesas redondas sobre as principais tendências tecnológicas. Inclui sessions sobre IA, Cloud Computing, DevOps, Segurança da Informação e muito mais. Networking com profissionais da área.',
    -- Começou há 3 dias
    NOW() - INTERVAL '3 days',
    -- Duração total: 40 horas (5 dias de 8h cada)
    -- Já passaram 3 dias (24h), faltam 2 dias (16h)
    40,
    -- Limite de faltas: 25% (pode faltar 10h das 40h)
    25,
    -- Gratuito
    0,
    -- Texto do certificado
    'Certificamos que {nome_participante} participou da {nome_evento}, realizada no período de {data_inicio} a {data_fim}, com carga horária de {carga_horaria} horas.',
    -- Perfil acadêmico
    'todos',
    -- Local
    'Campus IFFar - Auditório Principal e Labs',
    -- Capacidade máxima
    100,
    -- Vagas disponíveis
    99,
    -- Categoria
    'Semana Acadêmica',
    -- Imagem de capa
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80'
)
RETURNING 
    id,
    nome,
    data_inicio,
    data_inicio + (duracao_horas || ' hours')::interval as data_fim,
    duracao_horas;

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
    WHERE nome = 'Semana de Tecnologia e Inovação 2025'
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
        24, -- 24 horas de presença (3 dias completos de 8h cada)
        false -- Ainda não aprovado (evento não terminou)
    )
    RETURNING id INTO v_participacao_id;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ Participação criada!';
    RAISE NOTICE '   Participação ID: %', v_participacao_id;
    RAISE NOTICE '   Evento ID: %', v_evento_id;
    RAISE NOTICE '   Presenças até agora: 24/40 horas (60%%)';
    RAISE NOTICE '';
END $$;

-- 📝 PASSO 4: Criar registros de presença detalhados
-- Sistema simples: cada registro = presença em uma sessão/dia
DO $$
DECLARE
    v_user_id uuid;
    v_evento_id integer;
    v_participacao_id integer;
    v_user_email text := 'joao.2019312178@aluno.iffar.edu.br';
BEGIN
    -- Buscar IDs
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_user_email;
    SELECT id INTO v_evento_id FROM eventos WHERE nome = 'Semana de Tecnologia e Inovação 2025' ORDER BY id DESC LIMIT 1;
    SELECT id INTO v_participacao_id FROM participacoes WHERE evento_id = v_evento_id AND usuario_id = v_user_id;
    
    -- DIA 1 (há 3 dias) - Manhã (4h)
    INSERT INTO presencas_detalhes (
        participacao_id,
        sessao_nome,
        data_registro
    ) VALUES (
        v_participacao_id,
        'Dia 1 - Manhã: Abertura e Palestra de IA (4h)',
        NOW() - INTERVAL '3 days'
    );
    
    -- DIA 1 (há 3 dias) - Tarde (4h)
    INSERT INTO presencas_detalhes (
        participacao_id,
        sessao_nome,
        data_registro
    ) VALUES (
        v_participacao_id,
        'Dia 1 - Tarde: Workshop de Machine Learning (4h)',
        NOW() - INTERVAL '3 days'
    );
    
    -- DIA 2 (há 2 dias) - Manhã (4h)
    INSERT INTO presencas_detalhes (
        participacao_id,
        sessao_nome,
        data_registro
    ) VALUES (
        v_participacao_id,
        'Dia 2 - Manhã: Cloud Computing e AWS (4h)',
        NOW() - INTERVAL '2 days'
    );
    
    -- DIA 2 (há 2 dias) - Tarde (4h)
    INSERT INTO presencas_detalhes (
        participacao_id,
        sessao_nome,
        data_registro
    ) VALUES (
        v_participacao_id,
        'Dia 2 - Tarde: Workshop de Docker e Kubernetes (4h)',
        NOW() - INTERVAL '2 days'
    );
    
    -- DIA 3 (ontem) - Manhã (4h)
    INSERT INTO presencas_detalhes (
        participacao_id,
        sessao_nome,
        data_registro
    ) VALUES (
        v_participacao_id,
        'Dia 3 - Manhã: DevOps e CI/CD (4h)',
        NOW() - INTERVAL '1 day'
    );
    
    -- DIA 3 (ontem) - Tarde (4h)
    INSERT INTO presencas_detalhes (
        participacao_id,
        sessao_nome,
        data_registro
    ) VALUES (
        v_participacao_id,
        'Dia 3 - Tarde: Mesa Redonda sobre Desenvolvimento Ágil (4h)',
        NOW() - INTERVAL '1 day'
    );
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ Registros de presença criados!';
    RAISE NOTICE '   Dia 1: 2 sessões (manhã + tarde) = 8h ✅';
    RAISE NOTICE '   Dia 2: 2 sessões (manhã + tarde) = 8h ✅';
    RAISE NOTICE '   Dia 3: 2 sessões (manhã + tarde) = 8h ✅';
    RAISE NOTICE '   Total: 6 sessões = 24 horas';
    RAISE NOTICE '';
    RAISE NOTICE '📌 Faltam ainda:';
    RAISE NOTICE '   Dia 4: HOJE - fazer check-in nas sessões!';
    RAISE NOTICE '   Dia 5: Amanhã - fazer check-in nas sessões!';
    RAISE NOTICE '';
END $$;

-- 📊 PASSO 5: Visualizar o evento criado
SELECT 
    e.id as evento_id,
    e.nome,
    e.data_inicio::date as inicio,
    (e.data_inicio + (e.duracao_horas || ' hours')::interval)::date as fim,
    e.duracao_horas as total_horas,
    CASE 
        WHEN e.data_inicio > NOW() THEN '⏰ Futuro'
        WHEN e.data_inicio + (e.duracao_horas || ' hours')::interval < NOW() THEN '✅ Finalizado'
        ELSE '🔴 EM ANDAMENTO'
    END as status,
    e.vagas_disponiveis || '/' || e.capacidade_maxima as vagas
FROM eventos e
WHERE e.nome = 'Semana de Tecnologia e Inovação 2025'
ORDER BY e.id DESC
LIMIT 1;

-- 📋 PASSO 6: Ver participação do usuário
SELECT 
    p.id as participacao_id,
    u.email,
    e.nome as evento,
    p.numero_presencas || '/' || e.duracao_horas as presenca,
    ROUND((p.numero_presencas::numeric / e.duracao_horas::numeric) * 100, 1) || '%' as percentual,
    p.pagamento_status,
    p.is_aprovado as aprovado,
    CASE 
        WHEN p.is_aprovado THEN '✅ Aprovado'
        ELSE '⏳ Aguardando término'
    END as status_certificado
FROM participacoes p
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE e.nome = 'Semana de Tecnologia e Inovação 2025'
  AND u.email = 'joao.2019312178@aluno.iffar.edu.br';

-- 📅 PASSO 7: Ver histórico de presenças
SELECT 
    pd.data_registro::date as data,
    pd.sessao_nome,
    pd.data_registro::time as hora_registro
FROM presencas_detalhes pd
JOIN participacoes p ON pd.participacao_id = p.id
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE e.nome = 'Semana de Tecnologia e Inovação 2025'
  AND u.email = 'joao.2019312178@aluno.iffar.edu.br'
ORDER BY pd.data_registro;

-- ==========================================
-- RESUMO E INSTRUÇÕES
-- ==========================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '✅ EVENTO EM ANDAMENTO CRIADO COM SUCESSO!';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '📋 RESUMO DO EVENTO:';
    RAISE NOTICE '';
    RAISE NOTICE '   📌 Nome: Semana de Tecnologia e Inovação 2025';
    RAISE NOTICE '   📅 Duração: 5 dias (40 horas total)';
    RAISE NOTICE '   🕐 Carga: 8h por dia (2 sessões de 4h cada)';
    RAISE NOTICE '   📍 Status: EM ANDAMENTO 🔴';
    RAISE NOTICE '   💰 Valor: Gratuito';
    RAISE NOTICE '';
    RAISE NOTICE '👤 PARTICIPANTE:';
    RAISE NOTICE '';
    RAISE NOTICE '   Email: joao.2019312178@aluno.iffar.edu.br';
    RAISE NOTICE '   Presenças: 24/40 horas (60%%)';
    RAISE NOTICE '   Sessões registradas: 6';
    RAISE NOTICE '   Status: Em andamento';
    RAISE NOTICE '';
    RAISE NOTICE '📅 CRONOGRAMA:';
    RAISE NOTICE '';
    RAISE NOTICE '   ✅ Dia 1 (há 3 dias): Manhã + Tarde = 8h';
    RAISE NOTICE '   ✅ Dia 2 (há 2 dias): Manhã + Tarde = 8h';
    RAISE NOTICE '   ✅ Dia 3 (ontem):     Manhã + Tarde = 8h';
    RAISE NOTICE '   🔴 Dia 4 (HOJE):      FAZER CHECK-IN!';
    RAISE NOTICE '   ⏰ Dia 5 (amanhã):    Pendente';
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '🧪 PRÓXIMO PASSO:';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE 'Use /FAZER_CHECKIN.sql para registrar presença de hoje!';
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
END $$;

-- ==========================================
-- FIM
-- ==========================================
