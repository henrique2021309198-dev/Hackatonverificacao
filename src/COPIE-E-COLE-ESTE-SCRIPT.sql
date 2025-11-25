-- ============================================================
-- 🎯 COPIE E COLE ESTE SCRIPT COMPLETO NO SUPABASE
-- ============================================================
-- Cria evento + participação + certificado para teste
-- Usuário: participante@exemplo.com
-- ============================================================

-- 1️⃣ Criar evento finalizado
INSERT INTO eventos (
  nome, descricao, data_inicio, duracao_horas, 
  limite_faltas_percentual, valor_evento, texto_certificado,
  perfil_academico_foco, local, capacidade_maxima, 
  vagas_disponiveis, imagem_capa, organizador_id
) VALUES (
  'Workshop de React Avançado - Teste Token',
  'Evento de teste para validação de certificados com token único.',
  '2025-11-15 09:00:00-03',
  40,
  0.25,
  0,
  'Certificamos que {nome} participou do evento {evento} com carga horária de {horas} horas.',
  'todos',
  'Centro de Convenções',
  50, 50,
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
  (SELECT id FROM usuarios WHERE perfil = 'administrador' LIMIT 1)
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
INSERT INTO certificados (participacao_id, data_emissao, url_pdf, is_revogado)
SELECT 
  p.id, 
  '2025-11-21 10:00:00-03',
  'https://certificado-gerado-no-sistema.pdf',
  false
FROM participacoes p
INNER JOIN usuarios u ON p.usuario_id = u.id
INNER JOIN eventos e ON p.evento_id = e.id
WHERE u.email = 'participante@exemplo.com'
  AND e.nome = 'Workshop de React Avançado - Teste Token';

-- 4️⃣ COPIE O TOKEN ABAIXO:
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
