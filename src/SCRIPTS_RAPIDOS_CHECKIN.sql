-- ==========================================
-- SCRIPTS RÁPIDOS PARA TESTAR CHECK-IN
-- ==========================================
-- 
-- Copie e cole cada script individualmente
-- para testar o sistema de check-in
-- ==========================================

-- ==========================================
-- 📋 ÍNDICE
-- ==========================================
/*

1. ✅ Criar evento em andamento
2. 👁️ Ver status atual
3. ✅ Check-in Dia 4 - Manhã
4. ✅ Check-in Dia 4 - Tarde
5. ✅ Check-in Dia 4 - Completo (manhã + tarde)
6. ✅ Check-in Dia 5 - Manhã
7. ✅ Check-in Dia 5 - Tarde
8. ✅ Check-in Dia 5 - Completo (manhã + tarde)
9. 📊 Ver histórico de sessões
10. 📈 Ver ranking de participantes

*/

-- ==========================================
-- 1️⃣ CRIAR EVENTO EM ANDAMENTO
-- ==========================================

-- ⚠️ EXECUTE APENAS UMA VEZ!
-- Use o arquivo: /CRIAR_EVENTO_EM_ANDAMENTO.sql
-- Ele já cria o evento completo com 6 sessões

-- ==========================================
-- 2️⃣ VER STATUS ATUAL
-- ==========================================

-- Use o arquivo: /VER_STATUS_CHECKIN.sql
-- Ele mostra relatório completo com 8 seções

-- OU use este script simples:

SELECT 
    e.nome as evento,
    p.numero_presencas || '/' || e.duracao_horas as presenca,
    ROUND((p.numero_presencas / e.duracao_horas) * 100, 1) || '%' as frequencia,
    (e.duracao_horas - p.numero_presencas) || 'h faltantes' as faltam,
    CASE 
        WHEN (p.numero_presencas / e.duracao_horas) * 100 >= 75
        THEN '✅ APROVADO'
        ELSE '❌ Precisa de mais ' || (30 - p.numero_presencas) || 'h'
    END as status
FROM participacoes p
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br'
  AND e.nome = 'Semana de Tecnologia e Inovação 2025';

-- ==========================================
-- 3️⃣ CHECK-IN DIA 4 - MANHÃ
-- ==========================================

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
    
    INSERT INTO presencas_detalhes (participacao_id, sessao_nome)
    VALUES (v_participacao_id, 'Dia 4 - Manhã: Segurança da Informação (4h)');
    
    UPDATE participacoes
    SET numero_presencas = numero_presencas + 4
    WHERE id = v_participacao_id;
    
    RAISE NOTICE '✅ Check-in Dia 4 - Manhã registrado! (+4h)';
    RAISE NOTICE 'Novo total: Execute o script 2 para ver!';
END $$;

-- ==========================================
-- 4️⃣ CHECK-IN DIA 4 - TARDE
-- ==========================================

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
    
    INSERT INTO presencas_detalhes (participacao_id, sessao_nome)
    VALUES (v_participacao_id, 'Dia 4 - Tarde: Workshop de Ethical Hacking (4h)');
    
    UPDATE participacoes
    SET numero_presencas = numero_presencas + 4
    WHERE id = v_participacao_id;
    
    RAISE NOTICE '✅ Check-in Dia 4 - Tarde registrado! (+4h)';
    RAISE NOTICE 'Novo total: Execute o script 2 para ver!';
END $$;

-- ==========================================
-- 5️⃣ CHECK-IN DIA 4 - COMPLETO (MANHÃ + TARDE)
-- ==========================================

-- ⚠️ Use este OU execute os scripts 3 e 4 separadamente

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
    
    -- Manhã
    INSERT INTO presencas_detalhes (participacao_id, sessao_nome)
    VALUES (v_participacao_id, 'Dia 4 - Manhã: Segurança da Informação (4h)');
    
    -- Tarde
    INSERT INTO presencas_detalhes (participacao_id, sessao_nome)
    VALUES (v_participacao_id, 'Dia 4 - Tarde: Workshop de Ethical Hacking (4h)');
    
    -- Atualizar total
    UPDATE participacoes
    SET numero_presencas = numero_presencas + 8
    WHERE id = v_participacao_id;
    
    RAISE NOTICE '✅ Check-in DIA 4 COMPLETO registrado! (+8h)';
    RAISE NOTICE 'Manhã + Tarde = 8 horas';
    RAISE NOTICE 'Execute o script 2 para ver o novo total!';
END $$;

-- ==========================================
-- 6️⃣ CHECK-IN DIA 5 - MANHÃ
-- ==========================================

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
    
    INSERT INTO presencas_detalhes (participacao_id, sessao_nome)
    VALUES (v_participacao_id, 'Dia 5 - Manhã: Tendências em Tecnologia (4h)');
    
    UPDATE participacoes
    SET numero_presencas = numero_presencas + 4
    WHERE id = v_participacao_id;
    
    RAISE NOTICE '✅ Check-in Dia 5 - Manhã registrado! (+4h)';
END $$;

-- ==========================================
-- 7️⃣ CHECK-IN DIA 5 - TARDE
-- ==========================================

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
    
    INSERT INTO presencas_detalhes (participacao_id, sessao_nome)
    VALUES (v_participacao_id, 'Dia 5 - Tarde: Encerramento e Networking (4h)');
    
    UPDATE participacoes
    SET numero_presencas = numero_presencas + 4
    WHERE id = v_participacao_id;
    
    RAISE NOTICE '✅ Check-in Dia 5 - Tarde registrado! (+4h)';
    RAISE NOTICE '🎉 EVENTO COMPLETO! 40/40 horas (100%%)';
END $$;

-- ==========================================
-- 8️⃣ CHECK-IN DIA 5 - COMPLETO (MANHÃ + TARDE)
-- ==========================================

-- ⚠️ Use este OU execute os scripts 6 e 7 separadamente

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
    
    -- Manhã
    INSERT INTO presencas_detalhes (participacao_id, sessao_nome)
    VALUES (v_participacao_id, 'Dia 5 - Manhã: Tendências em Tecnologia (4h)');
    
    -- Tarde
    INSERT INTO presencas_detalhes (participacao_id, sessao_nome)
    VALUES (v_participacao_id, 'Dia 5 - Tarde: Encerramento e Networking (4h)');
    
    -- Atualizar total
    UPDATE participacoes
    SET numero_presencas = numero_presencas + 8
    WHERE id = v_participacao_id;
    
    RAISE NOTICE '✅ Check-in DIA 5 COMPLETO registrado! (+8h)';
    RAISE NOTICE '🎉 EVENTO 100%% COMPLETO! 40/40 horas!';
END $$;

-- ==========================================
-- 9️⃣ VER HISTÓRICO DE SESSÕES
-- ==========================================

SELECT 
    ROW_NUMBER() OVER (ORDER BY pd.data_registro) as "#",
    pd.data_registro::date as data,
    TO_CHAR(pd.data_registro, 'Day') as dia_semana,
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
-- 🔟 VER RANKING DE PARTICIPANTES
-- ==========================================

SELECT 
    ROW_NUMBER() OVER (ORDER BY p.numero_presencas DESC) as posicao,
    u.email,
    p.numero_presencas || '/' || e.duracao_horas as presenca,
    ROUND((p.numero_presencas / e.duracao_horas) * 100, 1) || '%' as frequencia,
    COUNT(pd.id) as total_sessoes,
    CASE 
        WHEN (p.numero_presencas / e.duracao_horas) * 100 >= 75
        THEN '✅ APROVADO'
        ELSE '❌ REPROVADO'
    END as status
FROM participacoes p
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
LEFT JOIN presencas_detalhes pd ON p.id = pd.participacao_id
WHERE e.nome = 'Semana de Tecnologia e Inovação 2025'
GROUP BY u.email, p.numero_presencas, e.duracao_horas, e.limite_faltas_percentual
ORDER BY p.numero_presencas DESC;

-- ==========================================
-- 🎯 FLUXO DE TESTE RECOMENDADO
-- ==========================================

/*

ORDEM DE EXECUÇÃO:

1. ✅ Execute: /CRIAR_EVENTO_EM_ANDAMENTO.sql
   → Cria evento com 24h já registradas

2. 👁️ Execute: Script 2 (Ver status)
   → Deve mostrar: 24/40h (60%)

3. ✅ Execute: Script 5 (Dia 4 completo)
   → +8h = 32/40h (80%) - APROVADO! ✅

4. 👁️ Execute: Script 2 (Ver status)
   → Deve mostrar: 32/40h (80%) - APROVADO

5. ✅ Execute: Script 9 (Histórico)
   → Ver 8 sessões registradas

6. ✅ Execute: Script 8 (Dia 5 completo)
   → +8h = 40/40h (100%) - COMPLETO! 🎉

7. 👁️ Execute: Script 2 (Ver status)
   → Deve mostrar: 40/40h (100%)

8. ✅ Execute: Script 9 (Histórico)
   → Ver 10 sessões registradas

9. ✅ Execute: Script 10 (Ranking)
   → Ver ranking completo

10. 🎉 SUCESSO! Sistema testado!

*/

-- ==========================================
-- 📊 EXTRAS: CONSULTAS ÚTEIS
-- ==========================================

-- Ver sessões de hoje
SELECT COUNT(*) as sessoes_hoje
FROM presencas_detalhes pd
JOIN participacoes p ON pd.participacao_id = p.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br'
  AND pd.data_registro::date = NOW()::date;

-- Ver sessões por dia
SELECT 
    pd.data_registro::date as data,
    COUNT(*) as sessoes,
    SUM(4) || 'h' as total_horas
FROM presencas_detalhes pd
JOIN participacoes p ON pd.participacao_id = p.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br'
GROUP BY pd.data_registro::date
ORDER BY data;

-- Ver última sessão registrada
SELECT 
    pd.sessao_nome,
    pd.data_registro
FROM presencas_detalhes pd
JOIN participacoes p ON pd.participacao_id = p.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br'
ORDER BY pd.data_registro DESC
LIMIT 1;

-- ==========================================
-- FIM DOS SCRIPTS
-- ==========================================

/*

📝 DICAS:

✅ Execute os scripts na ordem recomendada
✅ Use Script 2 após cada check-in para ver o progresso
✅ Use Script 9 para ver o histórico completo
✅ Cada sessão = 4 horas
✅ Dia completo = 8 horas (manhã + tarde)
✅ Mínimo para aprovar: 30/40h (75%)

*/
