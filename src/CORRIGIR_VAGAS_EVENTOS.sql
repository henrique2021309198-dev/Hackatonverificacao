-- ==========================================
-- CORRIGIR VAGAS DOS EVENTOS EXISTENTES
-- ==========================================
-- 
-- Este script recalcula as vagas disponíveis de todos
-- os eventos baseado no número de inscrições.
--
-- Execute no SQL Editor do Supabase!
-- ==========================================

-- 🔄 Atualizar vagas de todos os eventos
UPDATE eventos e
SET vagas_disponiveis = e.capacidade_maxima - COALESCE(
    (SELECT COUNT(*) 
     FROM participacoes p 
     WHERE p.evento_id = e.id),
    0
)
WHERE e.id IN (
    SELECT DISTINCT evento_id 
    FROM participacoes
);

-- ✅ Ver resultado
DO $$
DECLARE
    v_eventos_atualizados INTEGER;
BEGIN
    SELECT COUNT(DISTINCT evento_id) INTO v_eventos_atualizados
    FROM participacoes;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ VAGAS CORRIGIDAS COM SUCESSO!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Eventos atualizados: %', v_eventos_atualizados;
    RAISE NOTICE '';
END $$;

-- 📊 Mostrar situação atual dos eventos
SELECT 
    e.id,
    e.nome,
    e.capacidade_maxima,
    COALESCE(COUNT(p.id), 0) as inscricoes,
    e.vagas_disponiveis,
    CASE 
        WHEN e.vagas_disponiveis = 0 THEN '🔴 Lotado'
        WHEN e.vagas_disponiveis < 10 THEN '🟡 Poucas vagas'
        ELSE '🟢 Disponível'
    END as status
FROM eventos e
LEFT JOIN participacoes p ON e.id = p.evento_id
GROUP BY e.id, e.nome, e.capacidade_maxima, e.vagas_disponiveis
ORDER BY e.id;

-- ==========================================
-- CORREÇÃO ADICIONAL: Eventos sem inscrições
-- ==========================================

-- Garantir que eventos sem inscrições tenham vagas = capacidade
UPDATE eventos
SET vagas_disponiveis = capacidade_maxima
WHERE id NOT IN (
    SELECT DISTINCT evento_id 
    FROM participacoes
)
AND vagas_disponiveis != capacidade_maxima;

-- ==========================================
-- FIM
-- ==========================================
