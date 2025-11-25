-- ============================================================
-- 🚀 SCRIPT RÁPIDO - Criar Evento + Certificado para Teste
-- ============================================================
-- Usuário: participante@exemplo.com
-- ============================================================

-- 1️⃣ Criar evento finalizado
INSERT INTO eventos (
  nome, descricao, data_inicio, data_fim, local, 
  vagas_disponiveis, duracao_horas, valor_inscricao, imagem_url, criado_por
) VALUES (
  'Workshop de React Avançado - Teste Token',
  'Evento de teste para validação de certificados com token único.',
  '2025-11-15 09:00:00-03',
  '2025-11-20 18:00:00-03',
  'Centro de Convenções',
  50, 40, 0,
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
  (SELECT id FROM usuarios WHERE tipo_usuario = 'administrador' LIMIT 1)
);

-- 2️⃣ Inscrever participante
INSERT INTO participacoes (
  usuario_id, evento_id, inscrito_em, 
  pagamento_status, is_aprovado, numero_presencas
)
SELECT 
  (SELECT id FROM usuarios WHERE email = 'participante@exemplo.com'),
  (SELECT id FROM eventos WHERE nome = 'Workshop de React Avançado - Teste Token'),
  '2025-11-10 14:30:00-03',
  'nao_requerido', true, 8
WHERE EXISTS (SELECT 1 FROM usuarios WHERE email = 'participante@exemplo.com');

-- 3️⃣ Gerar certificado com token
INSERT INTO certificados (participacao_id, data_emissao, is_revogado)
SELECT 
  p.id,
  '2025-11-21 10:00:00-03',
  false
FROM participacoes p
INNER JOIN usuarios u ON p.usuario_id = u.id
INNER JOIN eventos e ON p.evento_id = e.id
WHERE u.email = 'participante@exemplo.com'
  AND e.nome = 'Workshop de React Avançado - Teste Token';

-- ============================================================
-- 🎯 COPIE O TOKEN ABAIXO:
-- ============================================================
SELECT 
  '🔑 COPIE ESTE TOKEN:' AS instrucao,
  c.codigo_validacao AS token,
  u.nome AS participante,
  e.nome AS evento
FROM certificados c
INNER JOIN participacoes p ON c.participacao_id = p.id
INNER JOIN usuarios u ON p.usuario_id = u.id
INNER JOIN eventos e ON p.evento_id = e.id
WHERE u.email = 'participante@exemplo.com'
  AND e.nome = 'Workshop de React Avançado - Teste Token'
ORDER BY c.data_emissao DESC
LIMIT 1;

-- ============================================================
-- 💡 COMO TESTAR:
-- ============================================================
-- 1. Execute este script no Supabase SQL Editor
-- 2. Copie o TOKEN da última consulta
-- 3. Login: participante@exemplo.com
-- 4. Vá em: Verificar Certificado
-- 5. Cole o token e clique em Verificar
-- 6. ✅ Deve exibir: Certificado Válido!
-- ============================================================
