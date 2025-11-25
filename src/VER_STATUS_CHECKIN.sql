ento: %', v_evento_nome;
    RAISE NOTICE '';
END $$;

-- ==========================================
-- 1️⃣ RESUMO GERAL DO EVENTO
-- ==========================================

SELECT '📋 RESUMO DO EVENTO' as "════════════════════════════════════════";

SELECT 
    e.id as evento_id,
    e.nome,
    e.categoria,
    e.data_inicio::date as inicio,
    (e.data_inicio + (e.duracao_horas || ' hours')::interval)::date as fim,
    e.duracao_horas || ' horas' as carga_horaria,
    e.limite_faltas_percentual || '%' as limite_faltas,
    CASE 
        WHEN e.data_inicio > NOW() THEN '⏰ Ainda não começou'
        WHEN e.data_inicio + (e.duracao_horas || ' hours')::interval < NOW() THEN '✅ Finalizado'
        ELSE '🔴 EM ANDAMENTO'
    END as status
FROM eventos e
WHERE e.nome = 'Semana de Tecnologia e Inovação 2025' -- 👈 ALTERE SE NECESSÁRIO
ORDER BY e.id DESC
LIMIT 1;

-- ==========================================
-- 2️⃣ STATUS DA PARTICIPAÇÃO
-- ==========================================

SELECT '👤 STATUS DA PARTICIPAÇÃO' as "════════════════════════════════════════";

SELECT 
    p.id as participacao_id,
    u.email,
    p.numero_presencas || '/' || e.duracao_horas as presenca,
    ROUND((p.numero_presencas::numeric / e.duracao_horas::numeric) * 100, 1) || '%' as frequencia,
    (e.duracao_horas - p.numero_presencas) || ' horas' as faltam,
    CASE 
        WHEN (p.numero_presencas::numeric / e.duracao_horas::numeric) * 100 >= (100 - e.limite_faltas_percentual)
        THEN '✅ Aprovado'
        ELSE '❌ Reprovado (até agora)'
    END as status_aprovacao,
    p.pagamento_status as pagamento,
    p.inscrito_em::date as inscrito_em
FROM participacoes p
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br' -- 👈 ALTERE SE NECESSÁRIO
  AND e.nome = 'Semana de Tecnologia e Inovação 2025'; -- 👈 ALTERE SE NECESSÁRIO

-- ==========================================
-- 3️⃣ HISTÓRICO DE SESSÕES/CHECK-INS
-- ==========================================

SELECT '📅 HISTÓRICO DE SESSÕES' as "════════════════════════════════════════";

SELECT 
    pd.id,
    pd.data_registro::date as data,
    TO_CHAR(pd.data_registro, 'Day') as dia_semana,
    pd.data_registro::time as hora_registro,
    pd.sessao_nome,
    CASE 
        WHEN pd.sessao_nome LIKE '%4h%' OR pd.sessao_nome LIKE '%4 h%' THEN '4h'
        WHEN pd.sessao_nome LIKE '%8h%' OR pd.sessao_nome LIKE '%8 h%' THEN '8h'
        WHEN pd.sessao_nome LIKE '%2h%' OR pd.sessao_nome LIKE '%2 h%' THEN '2h'
        WHEN pd.sessao_nome LIKE '%6h%' OR pd.sessao_nome LIKE '%6 h%' THEN '6h'
        ELSE 'N/A'
    END as carga_horaria_estimada
FROM presencas_detalhes pd
JOIN participacoes p ON pd.participacao_id = p.id
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br' -- 👈 ALTERE SE NECESSÁRIO
  AND e.nome = 'Semana de Tecnologia e Inovação 2025' -- 👈 ALTERE SE NECESSÁRIO
ORDER BY pd.data_registro;

-- ==========================================
-- 4️⃣ ANÁLISE DE FREQUÊNCIA
-- ==========================================

SELECT '📊 ANÁLISE DE FREQUÊNCIA' as "════════════════════════════════════════";

WITH stats AS (
    SELECT 
        e.duracao_horas as total_horas,
        e.limite_faltas_percentual,
        p.numero_presencas,
        COUNT(pd.id) as total_sessoes,
        ROUND(e.duracao_horas * (100 - e.limite_faltas_percentual) / 100, 0) as horas_minimas
    FROM participacoes p
    JOIN eventos e ON p.evento_id = e.id
    JOIN auth.users u ON p.usuario_id = u.id
    LEFT JOIN presencas_detalhes pd ON p.id = pd.participacao_id
    WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br' -- 👈 ALTERE SE NECESSÁRIO
      AND e.nome = 'Semana de Tecnologia e Inovação 2025' -- 👈 ALTERE SE NECESSÁRIO
    GROUP BY e.duracao_horas, e.limite_faltas_percentual, p.numero_presencas
)
SELECT 
    total_horas || 'h' as carga_horaria_total,
    numero_presencas || 'h' as horas_presentes,
    (total_horas - numero_presencas) || 'h' as horas_ausentes,
    ROUND((numero_presencas::numeric / total_horas::numeric) * 100, 1) || '%' as frequencia_atual,
    (100 - limite_faltas_percentual) || '%' as frequencia_minima,
    horas_minimas || 'h' as horas_minimas_necessarias,
    CASE 
        WHEN (numero_presencas::numeric / total_horas::numeric) * 100 >= (100 - limite_faltas_percentual)
        THEN '✅ Você SERÁ aprovado!'
        ELSE '❌ Você NÃO será aprovado ainda. Faltam ' || (horas_minimas - numero_presencas) || 'h'
    END as previsao,
    total_sessoes || ' sessões' as total_sessoes_registradas
FROM stats;

-- ==========================================
-- 5️⃣ PRÓXIMOS PASSOS
-- ==========================================

SELECT '🎯 PRÓXIMOS PASSOS' as "════════════════════════════════════════";

WITH stats AS (
    SELECT 
        e.data_inicio + (e.duracao_horas || ' hours')::interval as data_fim,
        e.duracao_horas,
        e.limite_faltas_percentual,
        p.numero_presencas,
        EXTRACT(day FROM (e.data_inicio + (e.duracao_horas || ' hours')::interval) - NOW()) as dias_restantes,
        ROUND(e.duracao_horas * (100 - e.limite_faltas_percentual) / 100, 0) as horas_minimas
    FROM participacoes p
    JOIN eventos e ON p.evento_id = e.id
    JOIN auth.users u ON p.usuario_id = u.id
    WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br' -- 👈 ALTERE SE NECESSÁRIO
      AND e.nome = 'Semana de Tecnologia e Inovação 2025' -- 👈 ALTERE SE NECESSÁRIO
)
SELECT 
    CASE 
        WHEN data_fim < NOW() THEN '✅ Evento já terminou!'
        WHEN dias_restantes >= 1 THEN dias_restantes || ' dias restantes'
        ELSE '🔴 ÚLTIMO DIA!'
    END as tempo_restante,
    (duracao_horas - numero_presencas) || 'h' as horas_para_completar,
    horas_minimas || 'h' as minimo_necessario_para_aprovar,
    CASE 
        WHEN numero_presencas >= horas_minimas
        THEN '✅ Você já atingiu o mínimo! Continue assim!'
        ELSE '⚠️ Você ainda precisa de ' || (horas_minimas - numero_presencas) || 'h para ser aprovado!'
    END as orientacao
FROM stats;

-- ==========================================
-- 6️⃣ COMPARAÇÃO COM OUTROS PARTICIPANTES
-- ==========================================

SELECT '📈 RANKING DE FREQUÊNCIA' as "════════════════════════════════════════";

WITH ranking AS (
    SELECT 
        u.email,
        p.numero_presencas,
        e.duracao_horas,
        ROUND((p.numero_presencas::numeric / e.duracao_horas::numeric) * 100, 1) as frequencia,
        RANK() OVER (ORDER BY p.numero_presencas DESC) as posicao,
        COUNT(*) OVER () as total_participantes
    FROM participacoes p
    JOIN eventos e ON p.evento_id = e.id
    JOIN auth.users u ON p.usuario_id = u.id
    WHERE e.nome = 'Semana de Tecnologia e Inovação 2025' -- 👈 ALTERE SE NECESSÁRIO
)
SELECT 
    posicao || 'º lugar' as sua_posicao,
    total_participantes || ' participantes' as total,
    numero_presencas || '/' || duracao_horas || 'h' as sua_presenca,
    frequencia || '%' as sua_frequencia,
    (SELECT MAX(frequencia) FROM ranking) || '%' as melhor_frequencia,
    (SELECT ROUND(AVG(frequencia), 1) FROM ranking) || '%' as frequencia_media
FROM ranking
WHERE email = 'joao.2019312178@aluno.iffar.edu.br'; -- 👈 ALTERE SE NECESSÁRIO

-- ==========================================
-- 7️⃣ SESSÕES POR DIA
-- ==========================================

SELECT '📅 SESSÕES POR DIA' as "════════════════════════════════════════";

SELECT 
    pd.data_registro::date as data,
    TO_CHAR(pd.data_registro::date, 'Day') as dia_semana,
    COUNT(*) as total_sessoes,
    STRING_AGG(pd.sessao_nome, CHR(10)) as sessoes
FROM presencas_detalhes pd
JOIN participacoes p ON pd.participacao_id = p.id
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br' -- 👈 ALTERE SE NECESSÁRIO
  AND e.nome = 'Semana de Tecnologia e Inovação 2025' -- 👈 ALTERE SE NECESSÁRIO
GROUP BY pd.data_registro::date
ORDER BY pd.data_registro::date;

-- ==========================================
-- 8️⃣ CHECK-IN DE HOJE
-- ==========================================

SELECT '✅ CHECK-IN DE HOJE' as "════════════════════════════════════════";

WITH hoje AS (
    SELECT 
        COUNT(pd.id) as sessoes_hoje,
        STRING_AGG(pd.sessao_nome, CHR(10)) as detalhes
    FROM presencas_detalhes pd
    JOIN participacoes p ON pd.participacao_id = p.id
    JOIN eventos e ON p.evento_id = e.id
    JOIN auth.users u ON p.usuario_id = u.id
    WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br' -- 👈 ALTERE SE NECESSÁRIO
      AND e.nome = 'Semana de Tecnologia e Inovação 2025' -- 👈 ALTERE SE NECESSÁRIO
      AND pd.data_registro::date = NOW()::date
)
SELECT 
    CASE 
        WHEN sessoes_hoje > 0 THEN '✅ Você fez ' || sessoes_hoje || ' check-in(s) hoje!'
        ELSE '❌ Você AINDA NÃO fez check-in hoje!'
    END as status_hoje,
    COALESCE(detalhes, 'Nenhuma sessão registrada hoje') as sessoes_registradas
FROM hoje;

-- ==========================================
-- FIM DO RELATÓRIO
-- ==========================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════';
    RAISE NOTICE '✅ RELATÓRIO COMPLETO GERADO!';
    RAISE NOTICE '═══════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE 'Para registrar nova presença:';
    RAISE NOTICE '→ Execute /FAZER_CHECKIN.sql';
    RAISE NOTICE '';
END $$;

-- ==========================================
-- NOTAS DE USO
-- ==========================================

/*

📝 COMO USAR:

1. Altere os valores marcados com 👈 no início do arquivo:
   - Email do usuário
   - Nome do evento

2. Execute todo o script (Ctrl+Enter)

3. Veja 8 seções de relatório:
   ✅ Resumo do evento
   ✅ Status da participação
   ✅ Histórico de sessões
   ✅ Análise de frequência
   ✅ Próximos passos
   ✅ Ranking vs outros
   ✅ Sessões por dia
   ✅ Check-in de hoje

*/