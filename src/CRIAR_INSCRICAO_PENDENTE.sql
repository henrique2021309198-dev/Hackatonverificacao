-- ================================================================
-- SCRIPT: Criar Inscrição com Pagamento PENDENTE para Teste
-- ================================================================
-- Use este script para criar rapidamente uma inscrição de teste
-- com status "pendente" para testar os botões de aprovar/reprovar
-- ================================================================

-- PASSO 1: Ver eventos disponíveis
SELECT 
  id,
  nome,
  valor_evento,
  vagas_disponiveis
FROM eventos
ORDER BY criado_em DESC
LIMIT 5;

-- PASSO 2: Ver usuários disponíveis
SELECT 
  id,
  nome,
  email,
  perfil
FROM usuarios
WHERE perfil = 'participante'
ORDER BY criado_em DESC
LIMIT 5;

-- ================================================================
-- PASSO 3: INSIRA OS VALORES AQUI
-- ================================================================
-- Substitua os valores abaixo pelos IDs reais:
-- - COLOQUE_ID_DO_EVENTO: ID do evento (número)
-- - 'COLOQUE_UUID_DO_USUARIO': UUID do usuário (entre aspas)

INSERT INTO participacoes (
  evento_id,
  usuario_id,
  pagamento_status,
  numero_presencas,
  is_aprovado
)
VALUES (
  COLOQUE_ID_DO_EVENTO,           -- Ex: 1, 2, 3...
  'COLOQUE_UUID_DO_USUARIO',       -- Ex: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  'pendente',                      -- STATUS PENDENTE (vai aparecer os botões!)
  0,
  false
);

-- ================================================================
-- EXEMPLO COMPLETO:
-- ================================================================
-- Copie e cole este exemplo, substituindo pelos valores reais:

/*
INSERT INTO participacoes (
  evento_id,
  usuario_id,
  pagamento_status,
  numero_presencas,
  is_aprovado
)
VALUES (
  1,                                          -- ID do evento
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',   -- UUID do usuário
  'pendente',
  0,
  false
);
*/

-- ================================================================
-- VERIFICAR SE FOI CRIADO
-- ================================================================
SELECT 
  p.id,
  p.evento_id,
  e.nome AS evento_nome,
  u.nome AS usuario_nome,
  u.email AS usuario_email,
  p.pagamento_status,
  p.inscrito_em
FROM participacoes p
JOIN eventos e ON e.id = p.evento_id
JOIN usuarios u ON u.id = p.usuario_id
WHERE p.pagamento_status = 'pendente'
ORDER BY p.inscrito_em DESC;

-- ================================================================
-- CRIAR MÚLTIPLAS INSCRIÇÕES PENDENTES DE UMA VEZ
-- ================================================================
-- Se você quiser criar várias inscrições de teste:

/*
INSERT INTO participacoes (evento_id, usuario_id, pagamento_status, numero_presencas, is_aprovado)
VALUES 
  (1, 'uuid-usuario-1', 'pendente', 0, false),
  (1, 'uuid-usuario-2', 'pendente', 0, false),
  (1, 'uuid-usuario-3', 'pendente', 0, false);
*/

-- ================================================================
-- RESETAR STATUS PARA PENDENTE (se já existe)
-- ================================================================
-- Se você já tem inscrições mas quer testar os botões:

/*
UPDATE participacoes
SET pagamento_status = 'pendente'
WHERE evento_id = 1  -- ID do seu evento
  AND usuario_id = 'seu-uuid';
*/

-- ================================================================
-- SCRIPT RÁPIDO: Criar 3 inscrições pendentes automaticamente
-- ================================================================
-- Este script cria 3 inscrições pendentes para o primeiro evento
-- usando os 3 primeiros usuários participantes:

/*
WITH primeiro_evento AS (
  SELECT id FROM eventos ORDER BY criado_em DESC LIMIT 1
),
tres_usuarios AS (
  SELECT id FROM usuarios WHERE perfil = 'participante' LIMIT 3
)
INSERT INTO participacoes (evento_id, usuario_id, pagamento_status, numero_presencas, is_aprovado)
SELECT 
  (SELECT id FROM primeiro_evento),
  id,
  'pendente',
  0,
  false
FROM tres_usuarios
ON CONFLICT DO NOTHING;  -- Ignora se já existe
*/

-- ================================================================
-- DICAS DE TESTE
-- ================================================================
/*
TESTE 1: Criar inscrição pendente
  1. Execute o INSERT acima
  2. Faça login como admin
  3. Vá em "Eventos" → "Ver Inscritos"
  4. Verá os botões ✅ e ❌

TESTE 2: Aprovar pagamento
  1. Clique no botão ✅ verde
  2. Status muda para "Confirmado"
  3. Botões ✅ e ❌ desaparecem
  4. Card "Pagamentos Confirmados" aumenta

TESTE 3: Reprovar pagamento
  1. Clique no botão ❌ vermelho
  2. Status muda para "Cancelado"
  3. Botões ✅ e ❌ desaparecem
  4. Card "Cancelamentos" aumenta

TESTE 4: Resetar para pendente
  UPDATE participacoes
  SET pagamento_status = 'pendente'
  WHERE id = 123;  -- ID da participação
*/

-- ================================================================
-- VALORES POSSÍVEIS PARA pagamento_status
-- ================================================================
-- 'pendente'       → Mostra botões ✅ e ❌
-- 'confirmado'     → Badge verde "Confirmado", sem botões
-- 'cancelado'      → Badge vermelho "Cancelado", sem botões
-- 'nao_requerido'  → Badge verde "Gratuito", sem botões

-- ================================================================
-- FIM DO SCRIPT
-- ================================================================
