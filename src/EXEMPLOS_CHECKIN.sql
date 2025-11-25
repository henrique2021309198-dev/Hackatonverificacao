-- ==========================================
-- EXEMPLOS PRÁTICOS DE CHECK-IN
-- ==========================================
-- 
-- Exemplos prontos para copiar e usar
-- ==========================================

-- ==========================================
-- CONFIGURAÇÕES GLOBAIS
-- ==========================================

-- 👇 ALTERE AQUI:
-- Email: 'joao.2019312178@aluno.iffar.edu.br'
-- Evento: 'Semana de Tecnologia e Inovação 2025'

-- ==========================================
-- EXEMPLO 1: CHECK-IN EM 1 SESSÃO (MANHÃ)
-- ==========================================

DO $$
DECLARE
    v_participacao_id integer;
BEGIN
    -- Buscar participação
    SELECT p.id INTO v_participacao_id
    FROM participacoes p
    JOIN eventos e ON p.evento_id = e.id
    JOIN auth.users u ON p.usuario_id = u.id
    WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br'
      AND e.nome = 'Semana de Tecnologia e Inovação 2025';
    
    -- Registrar sessão da manhã
    INSERT INTO presencas_detalhes (
        participacao_id,
        sessao_nome
    ) VALUES (
        v_participacao_id,
        'Dia 4 - Manhã: Segurança da Informação (4h)'
    );
    
    -- Atualizar total (+4 horas)
    UPDATE participacoes
    SET numero_presencas = numero_presencas + 4
    WHERE id = v_participacao_id;
    
    RAISE NOTICE '✅ Check-in realizado: Manhã (+4h)';
END $$;

-- ==========================================
-- EXEMPLO 2: CHECK-IN DIA COMPLETO (MANHÃ + TARDE)
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
    
    -- Manhã
    INSERT INTO presencas_detalhes (participacao_id, sessao_nome)
    VALUES (v_participacao_id, 'Dia 4 - Manhã: Segurança da Informação (4h)');
    
    -- Tarde
    INSERT INTO presencas_detalhes (participacao_id, sessao_nome)
    VALUES (v_participacao_id, 'Dia 4 - Tarde: Workshop de Ethical Hacking (4h)');
    
    -- Atualizar total (+8 horas)
    UPDATE participacoes
    SET numero_presencas = numero_presencas + 8
    WHERE id = v_participacao_id;
    
    RAISE NOTICE '✅ Dia completo registrado: Manhã + Tarde (+8h)';
END $$;

-- ==========================================
-- EXEMPLO 3: CHECK-IN RETROATIVO (DIA PASSADO)
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
    
    -- Registrar presença de ontem
    INSERT INTO presencas_detalhes (
        participacao_id,
        sessao_nome,
        data_registro
    ) VALUES (
        v_participacao_id,
        'Dia 3 - Tarde: Atividade Extra (4h)',
        NOW() - INTERVAL '1 day'  -- Ontem
    );
    
    UPDATE participacoes
    SET numero_presencas = numero_presencas + 4
    WHERE id = v_participacao_id;
    
    RAISE NOTICE '✅ Check-in retroativo registrado';
END $$;

-- ==========================================
-- EXEMPLO 4: CHECK-IN EM LOTE (MÚLTIPLOS PARTICIPANTES)
-- ==========================================

DO $$
DECLARE
    v_sessao_nome text := 'Dia 4 - Manhã: Segurança (4h)';
    v_rows_affected integer;
BEGIN
    -- Inserir presença para TODOS os participantes do evento
    INSERT INTO presencas_detalhes (participacao_id, sessao_nome)
    SELECT 
        p.id,
        v_sessao_nome
    FROM participacoes p
    JOIN eventos e ON p.evento_id = e.id
    WHERE e.nome = 'Semana de Tecnologia e Inovação 2025'
      -- Apenas quem ainda não tem esta sessão registrada
      AND NOT EXISTS (
          SELECT 1 
          FROM presencas_detalhes pd 
          WHERE pd.participacao_id = p.id 
            AND pd.sessao_nome = v_sessao_nome
      );
    
    GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
    
    -- Atualizar total de todos
    UPDATE participacoes p
    SET numero_presencas = numero_presencas + 4
    FROM eventos e
    WHERE p.evento_id = e.id
      AND e.nome = 'Semana de Tecnologia e Inovação 2025';
    
    RAISE NOTICE '✅ % participantes registrados', v_rows_affected;
END $$;

-- ==========================================
-- EXEMPLO 5: REMOVER CHECK-IN DUPLICADO
-- ==========================================

DO $$
DECLARE
    v_participacao_id integer;
    v_rows_deleted integer;
BEGIN
    SELECT p.id INTO v_participacao_id
    FROM participacoes p
    JOIN eventos e ON p.evento_id = e.id
    JOIN auth.users u ON p.usuario_id = u.id
    WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br'
      AND e.nome = 'Semana de Tecnologia e Inovação 2025';
    
    -- Deletar sessão específica
    DELETE FROM presencas_detalhes
    WHERE participacao_id = v_participacao_id
      AND sessao_nome = 'Dia 4 - Manhã: Segurança da Informação (4h)';
    
    GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
    
    -- Recalcular total de presenças
    UPDATE participacoes
    SET numero_presencas = numero_presencas - (v_rows_deleted * 4)
    WHERE id = v_participacao_id;
    
    RAISE NOTICE '✅ % sessão(ões) removida(s)', v_rows_deleted;
END $$;

-- ==========================================
-- EXEMPLO 6: LISTAR QUEM NÃO FEZ CHECK-IN HOJE
-- ==========================================

SELECT 
    au.email,
    u.nome,
    p.numero_presencas || '/' || e.duracao_horas as presenca_total
FROM participacoes p
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users au ON p.usuario_id = au.id
JOIN public.usuarios u ON au.id = u.id
WHERE e.nome = 'Semana de Tecnologia e Inovação 2025'
  AND e.data_inicio <= NOW()
  AND e.data_inicio + (e.duracao_horas || ' hours')::interval >= NOW()
  -- Quem NÃO tem check-in hoje
  AND NOT EXISTS (
      SELECT 1 
      FROM presencas_detalhes pd 
      WHERE pd.participacao_id = p.id 
        AND pd.data_registro::date = NOW()::date
  )
ORDER BY u.nome;

-- ==========================================
-- EXEMPLO 7: VER SESSÕES DE UM USUÁRIO
-- ==========================================

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
-- EXEMPLO 8: RECALCULAR TOTAL DE PRESENÇAS
-- ==========================================

-- Útil se os totais ficarem desatualizados
DO $$
BEGIN
    UPDATE participacoes p
    SET numero_presencas = (
        SELECT COUNT(*) * 4  -- Cada sessão = 4h
        FROM presencas_detalhes pd
        WHERE pd.participacao_id = p.id
    )
    WHERE p.evento_id IN (
        SELECT id FROM eventos 
        WHERE nome = 'Semana de Tecnologia e Inovação 2025'
    );
    
    RAISE NOTICE '✅ Totais recalculados!';
END $$;

-- ==========================================
-- EXEMPLO 9: VER FREQUÊNCIA DE TODOS
-- ==========================================

SELECT 
    u.email,
    p.numero_presencas || '/' || e.duracao_horas as presenca,
    ROUND((p.numero_presencas / e.duracao_horas) * 100, 1) || '%' as frequencia,
    COUNT(pd.id) as total_sessoes,
    CASE 
        WHEN (p.numero_presencas / e.duracao_horas) * 100 >= (100 - e.limite_faltas_percentual)
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
-- FIM DOS EXEMPLOS
-- ==========================================

/*

📝 DICAS:

1. Sempre atualizar numero_presencas após inserir/deletar

2. Padrão de nome de sessão:
   "Dia X - Período: Título (Xh)"
   
3. Cada sessão normalmente = 4 horas
   Dia completo = 2 sessões = 8 horas

4. Use transações para operações em lote:
   BEGIN;
   INSERT ...
   UPDATE ...
   COMMIT;

*/