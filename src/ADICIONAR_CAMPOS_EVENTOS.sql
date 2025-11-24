-- ==========================================
-- ADICIONAR CAMPOS FALTANTES NA TABELA EVENTOS
-- ==========================================
--
-- Este script adiciona os campos necessários para:
-- 1. Local do evento
-- 2. Capacidade máxima
-- 3. Vagas disponíveis
-- 4. Categoria do evento
--
-- ==========================================

-- 1. ADICIONAR COLUNA: local
ALTER TABLE public.eventos 
ADD COLUMN IF NOT EXISTS local TEXT DEFAULT 'A definir';

-- 2. ADICIONAR COLUNA: capacidade_maxima
ALTER TABLE public.eventos 
ADD COLUMN IF NOT EXISTS capacidade_maxima INTEGER DEFAULT 100;

-- 3. ADICIONAR COLUNA: vagas_disponiveis
-- (inicialmente igual à capacidade máxima)
ALTER TABLE public.eventos 
ADD COLUMN IF NOT EXISTS vagas_disponiveis INTEGER DEFAULT 100;

-- 4. ADICIONAR COLUNA: categoria
ALTER TABLE public.eventos 
ADD COLUMN IF NOT EXISTS categoria TEXT DEFAULT 'Workshop';

-- 5. ADICIONAR COLUNA: imagem_capa (URL da imagem)
ALTER TABLE public.eventos 
ADD COLUMN IF NOT EXISTS imagem_capa TEXT DEFAULT 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80';

-- 6. ADICIONAR COLUNA: organizador_id (quem criou o evento)
ALTER TABLE public.eventos 
ADD COLUMN IF NOT EXISTS organizador_id UUID;

-- 7. ADICIONAR COLUNA: status
ALTER TABLE public.eventos 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Publicado';

-- 8. ADICIONAR COLUNA: criado_em
ALTER TABLE public.eventos 
ADD COLUMN IF NOT EXISTS criado_em TIMESTAMPTZ DEFAULT NOW();

-- 9. ADICIONAR COLUNA: atualizado_em
ALTER TABLE public.eventos 
ADD COLUMN IF NOT EXISTS atualizado_em TIMESTAMPTZ DEFAULT NOW();

-- ==========================================
-- ADICIONAR CONSTRAINTS E VALIDAÇÕES
-- ==========================================

-- Categoria deve ser um dos valores permitidos
ALTER TABLE public.eventos 
DROP CONSTRAINT IF EXISTS eventos_categoria_check;

ALTER TABLE public.eventos 
ADD CONSTRAINT eventos_categoria_check 
CHECK (categoria IN ('Semana Acadêmica', 'Hackathon', 'Minicurso', 'Workshop', 'Palestra', 'Congresso'));

-- Status deve ser um dos valores permitidos
ALTER TABLE public.eventos 
DROP CONSTRAINT IF EXISTS eventos_status_check;

ALTER TABLE public.eventos 
ADD CONSTRAINT eventos_status_check 
CHECK (status IN ('Publicado', 'Rascunho', 'Cancelado', 'Encerrado'));

-- Vagas disponíveis não pode ser negativa
ALTER TABLE public.eventos 
DROP CONSTRAINT IF EXISTS eventos_vagas_disponiveis_check;

ALTER TABLE public.eventos 
ADD CONSTRAINT eventos_vagas_disponiveis_check 
CHECK (vagas_disponiveis >= 0);

-- Capacidade máxima deve ser positiva
ALTER TABLE public.eventos 
DROP CONSTRAINT IF EXISTS eventos_capacidade_maxima_check;

ALTER TABLE public.eventos 
ADD CONSTRAINT eventos_capacidade_maxima_check 
CHECK (capacidade_maxima > 0);

-- Vagas disponíveis não pode exceder capacidade máxima
ALTER TABLE public.eventos 
DROP CONSTRAINT IF EXISTS eventos_vagas_capacidade_check;

ALTER TABLE public.eventos 
ADD CONSTRAINT eventos_vagas_capacidade_check 
CHECK (vagas_disponiveis <= capacidade_maxima);

-- ==========================================
-- CRIAR TRIGGER PARA ATUALIZAR atualizado_em
-- ==========================================

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_atualizado_em_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar automaticamente
DROP TRIGGER IF EXISTS set_atualizado_em ON public.eventos;

CREATE TRIGGER set_atualizado_em
BEFORE UPDATE ON public.eventos
FOR EACH ROW
EXECUTE FUNCTION update_atualizado_em_column();

-- ==========================================
-- ATUALIZAR EVENTOS EXISTENTES
-- ==========================================

-- Atualizar vagas_disponiveis dos eventos existentes
-- (definir como capacidade_maxima)
UPDATE public.eventos 
SET vagas_disponiveis = capacidade_maxima 
WHERE vagas_disponiveis IS NULL OR vagas_disponiveis = 100;

-- ==========================================
-- VERIFICAR ESTRUTURA FINAL
-- ==========================================

SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'eventos'
ORDER BY ordinal_position;

-- ==========================================
-- EXEMPLO DE INSERÇÃO COM NOVOS CAMPOS
-- ==========================================

/*
INSERT INTO public.eventos (
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
    status
) VALUES (
    'Semana de Tecnologia 2024',
    'Evento anual de tecnologia com palestras e workshops',
    NOW() + INTERVAL '30 days',
    16,
    25,
    0,
    'Certificamos que {nome_participante} participou do evento {nome_evento}',
    'todos',
    'Auditório Central - Campus Universitário',
    150,
    150,
    'Semana Acadêmica',
    'Publicado'
) RETURNING *;
*/

-- ==========================================
-- FIM DO SCRIPT
-- ==========================================

SELECT '✅ Campos adicionados com sucesso à tabela eventos!' as status;
