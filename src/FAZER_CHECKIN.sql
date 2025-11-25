-- ==========================================
-- FAZER CHECK-IN EM EVENTO (REGISTRAR PRESENÇA)
-- ==========================================
-- 
-- Use este script para registrar presença em sessões de eventos
--
-- INSTRUÇÕES:
-- 1. Altere o email do usuário (se necessário)
-- 2. Altere o nome do evento
-- 3. Altere o nome da sessão
-- 4. Execute!
--
-- NOTA: Cada sessão vale 4 horas (meio período)
--       2 sessões por dia = 8 horas
-- ==========================================

DO $$
DECLARE
    v_user_id uuid;
    v_evento_id integer;
    v_participacao_id integer;
    v_user_email text := 'joao.2019312178@aluno.iffar.edu.br'; -- 👈 ALTERE AQUI
    v_evento_nome text := 'Semana de Tecnologia e Inovação 2025'; -- 👈 ALTERE AQUI
    v_sessao_nome text := 'Dia 4 - Manhã: Segurança da Informação (4h)'; -- 👈 ALTERE AQUI
    v_horas_por_sessao numeric := 4; -- Cada sessão = 4 horas
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🔄 Registrando check-in...';
    RAISE NOTICE '';
    
    -- Buscar usuário
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = v_user_email;
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION '❌ Usuário com email % não encontrado!', v_user_email;
    END IF;
    
    -- Buscar evento
    SELECT id INTO v_evento_id
    FROM eventos
    WHERE nome = v_evento_nome
    ORDER BY id DESC
    LIMIT 1;
    
    IF v_evento_id IS NULL THEN
        RAISE EXCEPTION '❌ Evento "%" não encontrado!', v_evento_nome;
    END IF;
    
    -- Buscar participação
    SELECT id INTO v_participacao_id
    FROM participacoes
    WHERE evento_id = v_evento_id
      AND usuario_id = v_user_id;
    
    IF v_participacao_id IS NULL THEN
        RAISE EXCEPTION '❌ Participação não encontrada! O usuário não está inscrito neste evento.';
    END IF;
    
    -- Verificar se já existe esta sessão
    IF EXISTS (
        SELECT 1 
        FROM presencas_detalhes 
        WHERE participacao_id = v_participacao_id 
          AND sessao_nome = v_sessao_nome
    ) THEN
        RAISE NOTICE '⚠️  Sessão já registrada!';
        RAISE NOTICE '   "%"', v_sessao_nome;
        RAISE NOTICE '   Nenhuma alteração necessária.';
    ELSE
        -- Inserir nova presença
        INSERT INTO presencas_detalhes (
            participacao_id,
            sessao_nome,
            data_registro
        ) VALUES (
            v_participacao_id,
            v_sessao_nome,
            NOW()
        );
        
        -- Atualizar total de presenças (+4 horas)
        UPDATE participacoes
        SET numero_presencas = numero_presencas + v_horas_por_sessao
        WHERE id = v_participacao_id;
        
        RAISE NOTICE '';
        RAISE NOTICE '✅ CHECK-IN REGISTRADO COM SUCESSO!';
        RAISE NOTICE '';
        RAISE NOTICE '📋 DETALHES:';
        RAISE NOTICE '   Sessão: %', v_sessao_nome;
        RAISE NOTICE '   Horas: +%h', v_horas_por_sessao;
        RAISE NOTICE '';
    END IF;
END $$;

-- Ver total de presenças atualizado
SELECT 
    u.email as usuario,
    e.nome as evento,
    p.numero_presencas || '/' || e.duracao_horas as presenca,
    ROUND((p.numero_presencas::numeric / e.duracao_horas::numeric) * 100, 1) || '%' as percentual,
    (e.duracao_horas - p.numero_presencas) || ' horas faltantes' as restante,
    CASE 
        WHEN (p.numero_presencas::numeric / e.duracao_horas::numeric) * 100 >= (100 - e.limite_faltas_percentual)
        THEN '✅ SERÁ APROVADO'
        ELSE '❌ PRECISA DE MAIS PRESENÇA'
    END as status
FROM participacoes p
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br'
  AND e.nome = 'Semana de Tecnologia e Inovação 2025';

-- Ver histórico de sessões
SELECT 
    pd.data_registro::date as data,
    pd.sessao_nome,
    pd.data_registro::time as hora_registro
FROM presencas_detalhes pd
JOIN participacoes p ON pd.participacao_id = p.id
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br'
  AND e.nome = 'Semana de Tecnologia e Inovação 2025'
ORDER BY pd.data_registro;

-- ==========================================
-- EXEMPLOS DE NOMES DE SESSÕES
-- ==========================================

/*

ESTRUTURA: "Dia X - Período: Título da Atividade (Xh)"

DIA 4 (HOJE):
- "Dia 4 - Manhã: Segurança da Informação (4h)"
- "Dia 4 - Tarde: Workshop de Ethical Hacking (4h)"

DIA 5 (AMANHÃ):
- "Dia 5 - Manhã: Tendências em Tecnologia (4h)"
- "Dia 5 - Tarde: Encerramento e Networking (4h)"

REGISTRO RETROATIVO:
- "Dia 1 - Manhã: Abertura e Palestra de IA (4h)"
- "Dia 2 - Tarde: Workshop de Docker (4h)"

SESSÕES CUSTOMIZADAS:
- "Workshop Especial: Design de Software (4h)"
- "Palestra Extra: Carreira em TI (2h)"
- "Mesa Redonda: Futuro da IA (3h)"

*/

-- ==========================================
-- SCRIPT RÁPIDO: REGISTRAR DIA COMPLETO (2 SESSÕES)
-- ==========================================

/*

-- Para registrar um dia inteiro (manhã + tarde = 8h):

DO $$
DECLARE
    v_participacao_id integer;
BEGIN
    SELECT p.id INTO v_participacao_id
    FROM participacoes p
    JOIN eventos e ON p.evento_id = e.id
    JOIN auth.users u ON p.usuario_id = u.id
    WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br'
      AND e.nome = 'Semana de Tecnologia e Inovação 2025';
    
    -- Sessão da manhã
    INSERT INTO presencas_detalhes (participacao_id, sessao_nome, data_registro)
    VALUES (v_participacao_id, 'Dia 4 - Manhã: Segurança da Informação (4h)', NOW());
    
    -- Sessão da tarde
    INSERT INTO presencas_detalhes (participacao_id, sessao_nome, data_registro)
    VALUES (v_participacao_id, 'Dia 4 - Tarde: Workshop de Ethical Hacking (4h)', NOW());
    
    -- Atualizar total (+8 horas)
    UPDATE participacoes
    SET numero_presencas = numero_presencas + 8
    WHERE id = v_participacao_id;
    
    RAISE NOTICE '✅ Dia completo registrado! +8 horas';
END $$;

*/

-- ==========================================
-- FIM
-- ==========================================
