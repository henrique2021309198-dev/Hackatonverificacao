-- =====================================================
-- ADICIONAR CAMPO CHAVE_PIX NA TABELA EVENTOS
-- =====================================================
-- Execute este script no Supabase SQL Editor
-- para adicionar o campo de chave PIX nos eventos

-- Adicionar coluna chave_pix
ALTER TABLE eventos
ADD COLUMN IF NOT EXISTS chave_pix TEXT;

-- Adicionar comentário
COMMENT ON COLUMN eventos.chave_pix IS 'Chave PIX para recebimento de pagamentos (CPF, CNPJ, E-mail, Telefone ou Chave Aleatória)';

-- Verificar se foi adicionado
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'eventos' AND column_name = 'chave_pix';

-- =====================================================
-- EXEMPLO DE ATUALIZAÇÃO DE EVENTO EXISTENTE
-- =====================================================

-- Atualizar evento com chave PIX (exemplo)
-- UPDATE eventos
-- SET chave_pix = 'admin@evento.com.br'
-- WHERE id = 1;

-- =====================================================
-- VERIFICAR EVENTOS COM CHAVE PIX
-- =====================================================

SELECT 
    id,
    nome,
    valor_evento,
    chave_pix,
    CASE 
        WHEN valor_evento = 0 THEN '💚 Gratuito'
        WHEN valor_evento > 0 AND chave_pix IS NOT NULL THEN '💰 Pago (PIX configurado)'
        WHEN valor_evento > 0 AND chave_pix IS NULL THEN '⚠️ Pago (PIX não configurado)'
    END as status_pagamento
FROM eventos
ORDER BY id DESC;

-- =====================================================
-- VALIDAÇÃO
-- =====================================================

-- Verificar eventos pagos sem chave PIX
SELECT 
    id,
    nome,
    valor_evento,
    chave_pix
FROM eventos
WHERE valor_evento > 0 
  AND chave_pix IS NULL;

-- =====================================================
-- CONCLUÍDO! ✅
-- =====================================================

/*
NOTAS:
- Campo chave_pix aceita: CPF, CNPJ, E-mail, Telefone ou Chave Aleatória
- Eventos gratuitos (valor = 0) não precisam de chave PIX
- Eventos pagos devem ter chave PIX configurada
- Validação de formato será feita no frontend
*/
