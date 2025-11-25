-- ============================================================
-- 🎯 SCRIPT DE TESTE: Certificado com Token
-- ============================================================
-- Este script cria um evento finalizado com participação válida
-- para testar o sistema de verificação de certificados
-- 
-- Usuário: participante@exemplo.com
-- ============================================================

-- ============================================================
-- PASSO 1: Buscar o ID do usuário participante@exemplo.com
-- ============================================================

-- Primeiro, vamos ver se o usuário existe
SELECT id, nome, email, perfil
FROM usuarios 
WHERE email = 'participante@exemplo.com';

-- Se não existir, descomente as linhas abaixo para criar:
/*
INSERT INTO usuarios (nome, email, senha_hash, perfil)
VALUES (
  'João Silva Participante',
  'participante@exemplo.com',
  '$2a$10$hashdatesteaqui123456789012345678901234567890', -- Hash fictício
  'participante'
);
*/

-- ============================================================
-- PASSO 2: Criar evento finalizado (no passado)
-- ============================================================

INSERT INTO eventos (
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
  imagem_capa,
  organizador_id
) VALUES (
  'Workshop de React Avançado - Edição Teste',
  'Workshop completo sobre React com hooks, context API, performance e testes. Evento já finalizado para testes de certificado.',
  '2025-11-15 09:00:00-03', -- Data no passado (15 de novembro)
  40, -- 40 horas de duração (equivalente a 5 dias)
  0.25, -- 25% de faltas permitidas
  0, -- Evento gratuito para facilitar
  'Certificamos que {nome} participou do evento {evento} com carga horária de {horas} horas.',
  'todos',
  'Centro de Convenções - Sala 201',
  50,
  50,
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
  (SELECT id FROM usuarios WHERE perfil = 'administrador' LIMIT 1) -- Criado por um admin
)
RETURNING id, nome, data_inicio, duracao_horas;

-- ============================================================
-- PASSO 3: Inscrever o participante no evento
-- ============================================================

-- Vamos buscar os IDs necessários
WITH evento_teste AS (
  SELECT id FROM eventos 
  WHERE nome = 'Workshop de React Avançado - Edição Teste' 
  LIMIT 1
),
participante_teste AS (
  SELECT id FROM usuarios 
  WHERE email = 'participante@exemplo.com' 
  LIMIT 1
)

-- Criar a participação
INSERT INTO participacoes (
  usuario_id,
  evento_id,
  inscrito_em,
  pagamento_status,
  is_aprovado,
  numero_presencas,
  observacoes
)
SELECT 
  participante_teste.id,
  evento_teste.id,
  '2025-11-10 14:30:00-03', -- Inscrito 5 dias antes do evento
  'nao_requerido', -- Evento gratuito, sem pagamento
  TRUE, -- Aprovado
  8, -- Número de check-ins realizados (exemplo)
  'Participação completa e satisfatória'
FROM evento_teste, participante_teste
RETURNING id, usuario_id, evento_id, is_aprovado;

-- ============================================================
-- PASSO 4: Criar registros de presença detalhados (opcional)
-- ============================================================

WITH participacao_teste AS (
  SELECT p.id 
  FROM participacoes p
  INNER JOIN usuarios u ON p.usuario_id = u.id
  INNER JOIN eventos e ON p.evento_id = e.id
  WHERE u.email = 'participante@exemplo.com'
    AND e.nome = 'Workshop de React Avançado - Edição Teste'
  LIMIT 1
)

-- Inserir 8 check-ins em dias diferentes
INSERT INTO presencas_detalhes (
  participacao_id,
  checkin_em,
  sessao_nome,
  observacoes
)
SELECT 
  participacao_teste.id,
  timestamp_dia,
  'Sessão ' || dia_numero,
  'Presença confirmada'
FROM participacao_teste,
LATERAL (
  VALUES 
    ('2025-11-15 09:15:00-03'::timestamptz, 'Dia 1 - Introdução'),
    ('2025-11-16 09:10:00-03'::timestamptz, 'Dia 2 - Hooks'),
    ('2025-11-17 09:05:00-03'::timestamptz, 'Dia 3 - Context API'),
    ('2025-11-18 09:20:00-03'::timestamptz, 'Dia 4 - Performance'),
    ('2025-11-19 09:00:00-03'::timestamptz, 'Dia 5 - Testes'),
    ('2025-11-19 14:00:00-03'::timestamptz, 'Dia 5 - Testes Avançados'),
    ('2025-11-20 09:10:00-03'::timestamptz, 'Dia 6 - Projeto Final'),
    ('2025-11-20 16:00:00-03'::timestamptz, 'Dia 6 - Encerramento')
) AS presencas(timestamp_dia, dia_numero);

-- ============================================================
-- PASSO 5: Gerar o certificado com token único
-- ============================================================

WITH participacao_teste AS (
  SELECT p.id 
  FROM participacoes p
  INNER JOIN usuarios u ON p.usuario_id = u.id
  INNER JOIN eventos e ON p.evento_id = e.id
  WHERE u.email = 'participante@exemplo.com'
    AND e.nome = 'Workshop de React Avançado - Edição Teste'
  LIMIT 1
)

INSERT INTO certificados (
  participacao_id,
  data_emissao,
  url_pdf,
  is_revogado
)
SELECT 
  participacao_teste.id,
  '2025-11-21 10:00:00-03', -- Emitido no dia seguinte ao fim do evento
  'https://certificado-gerado-no-sistema.pdf', -- PDF será gerado pelo sistema
  false -- Não revogado
FROM participacao_teste
RETURNING 
  id, 
  participacao_id, 
  codigo_validacao AS token_validacao, 
  data_emissao,
  is_revogado;

-- ============================================================
-- PASSO 6: Consultar o token gerado para teste
-- ============================================================

-- 🎯 COPIE ESTE TOKEN PARA TESTAR A VERIFICAÇÃO!
SELECT 
  c.codigo_validacao AS "🔑 TOKEN DE VALIDAÇÃO (COPIE ESTE CÓDIGO)",
  c.data_emissao AS "Data de Emissão",
  u.nome AS "Participante",
  u.email AS "Email",
  e.nome AS "Evento",
  e.data_inicio AS "Início do Evento",
  e.duracao_horas AS "Carga Horária",
  p.numero_presencas AS "Check-ins",
  p.is_aprovado AS "Aprovado",
  c.is_revogado AS "Revogado"
FROM certificados c
INNER JOIN participacoes p ON c.participacao_id = p.id
INNER JOIN usuarios u ON p.usuario_id = u.id
INNER JOIN eventos e ON p.evento_id = e.id
WHERE u.email = 'participante@exemplo.com'
  AND e.nome = 'Workshop de React Avançado - Edição Teste'
ORDER BY c.data_emissao DESC
LIMIT 1;

-- ============================================================
-- VERIFICAÇÕES ADICIONAIS
-- ============================================================

-- Verificar se a participação está pronta para gerar certificado
SELECT 
  '✅ PRONTO PARA CERTIFICADO' AS status,
  u.nome AS participante,
  e.nome AS evento,
  p.pagamento_status,
  p.is_aprovado,
  p.numero_presencas AS presencas,
  CASE 
    WHEN (e.data_inicio + (e.duracao_horas || ' hours')::INTERVAL) < NOW() THEN '✅ Evento finalizado'
    ELSE '❌ Evento ainda não finalizou'
  END AS status_evento,
  CASE 
    WHEN p.is_aprovado THEN '✅ Aprovado'
    ELSE '❌ Não aprovado'
  END AS status_aprovacao,
  CASE 
    WHEN c.id IS NOT NULL THEN '✅ Certificado gerado'
    ELSE '⚠️ Certificado não gerado'
  END AS status_certificado
FROM participacoes p
INNER JOIN usuarios u ON p.usuario_id = u.id
INNER JOIN eventos e ON p.evento_id = e.id
LEFT JOIN certificados c ON c.participacao_id = p.id
WHERE u.email = 'participante@exemplo.com'
  AND e.nome = 'Workshop de React Avançado - Edição Teste';

-- ============================================================
-- LIMPEZA (Execute apenas se quiser remover tudo)
-- ============================================================

/*
-- ⚠️ ATENÇÃO: Isso remove TODOS os dados de teste!
-- Descomente apenas se tiver certeza

-- 1. Deletar certificados
DELETE FROM certificados 
WHERE participacao_id IN (
  SELECT p.id FROM participacoes p
  INNER JOIN eventos e ON p.evento_id = e.id
  WHERE e.nome = 'Workshop de React Avançado - Edição Teste'
);

-- 2. Deletar presenças
DELETE FROM presencas_detalhes 
WHERE participacao_id IN (
  SELECT p.id FROM participacoes p
  INNER JOIN eventos e ON p.evento_id = e.id
  WHERE e.nome = 'Workshop de React Avançado - Edição Teste'
);

-- 3. Deletar participações
DELETE FROM participacoes 
WHERE evento_id IN (
  SELECT id FROM eventos 
  WHERE nome = 'Workshop de React Avançado - Edição Teste'
);

-- 4. Deletar evento
DELETE FROM eventos 
WHERE nome = 'Workshop de React Avançado - Edição Teste';
*/

-- ============================================================
-- 📋 INSTRUÇÕES DE USO
-- ============================================================

/*
✅ PASSO A PASSO PARA TESTAR:

1. Execute este script completo no Supabase SQL Editor

2. Após executar, procure a consulta "PASSO 6" nos resultados

3. COPIE o valor do campo "🔑 TOKEN DE VALIDAÇÃO"
   Exemplo: 550e8400-e29b-41d4-a716-446655440000

4. No sistema, faça login com: participante@exemplo.com

5. Vá em: "Meus Eventos" → Encontre o evento "Workshop de React Avançado"

6. Clique em "Baixar Certificado" (o certificado terá o token no rodapé)

7. Vá em: "Verificar Certificado"

8. COLE o token copiado

9. Clique em "Verificar"

10. Deve aparecer: ✅ Certificado Válido com todas as informações!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧪 TESTE ALTERNATIVO (Verificar sem baixar certificado):

1. Execute este script

2. Copie o TOKEN do PASSO 6

3. Faça login como qualquer usuário (admin ou participante)

4. Vá em "Verificar Certificado"

5. Cole o token

6. Veja todas as informações do certificado aparecerem!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 TROUBLESHOOTING:

❌ Erro: "violates foreign key constraint"
   → O usuário participante@exemplo.com não existe
   → Descomente e execute a seção "Se não existir" do PASSO 1

❌ Erro: "duplicate key value"
   → O evento já existe
   → Execute a seção de LIMPEZA primeiro
   → Ou mude o nome do evento

❌ Certificado não aparece em "Meus Eventos"
   → Verifique se o evento realmente finalizou (data_fim no passado)
   → Verifique se is_aprovado = true
   → Verifique se pagamento_status != 'pendente'

*/