-- ==========================================
-- CRIAR TRIGGER PARA ATUALIZAR VAGAS
-- ==========================================
-- 
-- Este trigger garante que as vagas disponíveis sejam
-- automaticamente atualizadas quando alguém:
-- - Se inscreve em um evento (decrementa vagas)
-- - Cancela a inscrição (incrementa vagas)
--
-- Execute no SQL Editor do Supabase!
-- ==========================================

-- 🔄 Função que atualiza as vagas
CREATE OR REPLACE FUNCTION atualizar_vagas_evento()
RETURNS TRIGGER AS $$
BEGIN
    -- Quando uma nova participação é criada (INSERT)
    IF (TG_OP = 'INSERT') THEN
        UPDATE eventos
        SET vagas_disponiveis = GREATEST(vagas_disponiveis - 1, 0)
        WHERE id = NEW.evento_id;
        
        RAISE NOTICE 'Vaga ocupada no evento %', NEW.evento_id;
        RETURN NEW;
    END IF;
    
    -- Quando uma participação é deletada (DELETE)
    IF (TG_OP = 'DELETE') THEN
        UPDATE eventos
        SET vagas_disponiveis = LEAST(vagas_disponiveis + 1, capacidade_maxima)
        WHERE id = OLD.evento_id;
        
        RAISE NOTICE 'Vaga liberada no evento %', OLD.evento_id;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 🎯 Criar o trigger
DROP TRIGGER IF EXISTS trigger_atualizar_vagas ON participacoes;

CREATE TRIGGER trigger_atualizar_vagas
    AFTER INSERT OR DELETE ON participacoes
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_vagas_evento();

-- ✅ Verificar se foi criado
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ TRIGGER CRIADO COM SUCESSO!';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Agora as vagas serão atualizadas automaticamente quando:';
    RAISE NOTICE '   - Alguém se inscrever em um evento';
    RAISE NOTICE '   - Alguém cancelar a inscrição';
    RAISE NOTICE '';
END $$;

-- 📊 Ver triggers criados
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table = 'participacoes';

-- ==========================================
-- TESTE DO TRIGGER
-- ==========================================

/*

Para testar se funcionou:

1. Veja quantas vagas tem em um evento:
   SELECT id, nome, vagas_disponiveis FROM eventos;

2. Inscreva-se nesse evento pelo sistema

3. Veja novamente:
   SELECT id, nome, vagas_disponiveis FROM eventos;
   
   As vagas devem ter diminuído em 1!

*/

-- ==========================================
-- FIM
-- ==========================================
