# 🎯 COMECE AQUI - Teste do Sistema de Tokens

## ⚡ 3 Passos Simples

### **1. Abra o Supabase SQL Editor**
Dashboard → SQL Editor → New Query

### **2. Cole este script:**

```sql
-- Criar evento finalizado
INSERT INTO eventos (
  nome, descricao, data_inicio, duracao_horas, 
  limite_faltas_percentual, valor_evento, texto_certificado,
  perfil_academico_foco, local, capacidade_maxima, 
  vagas_disponiveis, imagem_capa, organizador_id
) VALUES (
  'Workshop de React Avançado - Teste Token',
  'Evento de teste para validação de certificados com token único.',
  '2025-11-15 09:00:00-03', 40, 0.25, 0,
  'Certificamos que {nome} participou do evento {evento} com carga horária de {horas} horas.',
  'todos', 'Centro de Convenções', 50, 50,
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
  (SELECT id FROM usuarios WHERE perfil = 'administrador' LIMIT 1)
);

-- Inscrever participante
INSERT INTO participacoes (
  usuario_id, evento_id, inscrito_em, 
  pagamento_status, is_aprovado, numero_presencas
)
SELECT 
  (SELECT id FROM usuarios WHERE email = 'participante@exemplo.com'),
  (SELECT id FROM eventos WHERE nome = 'Workshop de React Avançado - Teste Token'),
  '2025-11-10 14:30:00-03', 'nao_requerido', true, 8
WHERE EXISTS (SELECT 1 FROM usuarios WHERE email = 'participante@exemplo.com');

-- Gerar certificado
INSERT INTO certificados (participacao_id, data_emissao, url_pdf, is_revogado)
SELECT p.id, '2025-11-21 10:00:00-03', 'https://certificado-gerado-no-sistema.pdf', false
FROM participacoes p
INNER JOIN usuarios u ON p.usuario_id = u.id
INNER JOIN eventos e ON p.evento_id = e.id
WHERE u.email = 'participante@exemplo.com'
  AND e.nome = 'Workshop de React Avançado - Teste Token';

-- COPIE O TOKEN:
SELECT 
  '🔑 COPIE:' AS instrucao,
  c.codigo_validacao AS token
FROM certificados c
INNER JOIN participacoes p ON c.participacao_id = p.id
INNER JOIN usuarios u ON p.usuario_id = u.id
INNER JOIN eventos e ON p.evento_id = e.id
WHERE u.email = 'participante@exemplo.com'
  AND e.nome = 'Workshop de React Avançado - Teste Token'
ORDER BY c.data_emissao DESC LIMIT 1;
```

Clique **RUN** ▶️

### **3. Teste no sistema:**

1. Login: `participante@exemplo.com`
2. Menu: **🛡️ Verificar Certificado**
3. Cole o token UUID
4. Clique: **Verificar**
5. ✅ **Pronto!**

---

## ⚠️ Erros Comuns

### **Erro: Admin não existe**
```sql
-- Crie um admin primeiro:
INSERT INTO usuarios (nome, email, senha_hash, perfil)
VALUES ('Admin', 'admin@teste.com', 
'$2a$10$XQqytfGpYzN5tHZNzqzXD.VYVQm5EzKZqQxqKQxK5qQxK5qQxK5qQ',
'administrador');
```

### **Erro: Participante não existe**
```sql
-- Crie o participante:
INSERT INTO usuarios (nome, email, senha_hash, perfil)
VALUES ('João Silva', 'participante@exemplo.com', 
'$2a$10$XQqytfGpYzN5tHZNzqzXD.VYVQm5EzKZqQxqKQxK5qQxK5qQxK5qQ',
'participante');
```

### **Erro: Evento já existe**
```sql
-- Limpe primeiro:
DELETE FROM certificados WHERE participacao_id IN (
  SELECT p.id FROM participacoes p
  INNER JOIN eventos e ON p.evento_id = e.id
  WHERE e.nome LIKE '%Teste%'
);
DELETE FROM participacoes WHERE evento_id IN (
  SELECT id FROM eventos WHERE nome LIKE '%Teste%'
);
DELETE FROM eventos WHERE nome LIKE '%Teste%';
```

---

## 📁 Mais Informações

- **Script completo:** `/COPIE-E-COLE-ESTE-SCRIPT.sql`
- **Guia detalhado:** `/TESTE-AGORA.md`
- **Correções aplicadas:** `/CORRECOES-APLICADAS.md`

---

**Pronto! Em menos de 5 minutos você estará testando o sistema de tokens! 🚀**