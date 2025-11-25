# 🚀 TESTE AGORA - Sistema de Tokens de Certificados

## ⚡ Script Corrigido e Pronto!

Os scripts SQL foram **corrigidos** para funcionar com a estrutura real do banco de dados.

---

## 📋 Como Testar em 3 Passos

### **1️⃣ Abra o Supabase SQL Editor**

No seu projeto Supabase:
```
Dashboard → SQL Editor → New Query
```

---

### **2️⃣ Copie e Execute o Script Rápido**

Cole o conteúdo completo do arquivo:
```
/script-rapido-teste.sql
```

**Ou copie daqui:**

```sql
-- Criar evento finalizado (no passado)
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

-- Inscrever participante
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

-- Gerar certificado
INSERT INTO certificados (participacao_id, data_emissao, url_pdf, is_revogado)
SELECT p.id, '2025-11-21 10:00:00-03', 'https://certificado-gerado-no-sistema.pdf', false
FROM participacoes p
INNER JOIN usuarios u ON p.usuario_id = u.id
INNER JOIN eventos e ON p.evento_id = e.id
WHERE u.email = 'participante@exemplo.com'
  AND e.nome = 'Workshop de React Avançado - Teste Token';

-- COPIE O TOKEN ABAIXO:
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
```

Clique em **RUN** ▶️

---

### **3️⃣ Copie o Token e Teste**

Nos resultados da última query, você verá:

```
┌──────────────────────┬─────────────────────────────────────────┐
│ instrucao            │ token                                   │
├──────────────────────┼─────────────────────────────────────────┤
│ 🔑 COPIE ESTE TOKEN: │ 550e8400-e29b-41d4-a716-446655440000   │
└──────────────────────┴─────────────────────────────────────────┘
```

**➡️ COPIE o UUID completo!**

---

## 🧪 Testar no Sistema

### **Opção A: Verificar Diretamente**

1. Faça login: `participante@exemplo.com`
2. Clique: **🛡️ Verificar Certificado** (menu superior)
3. Cole o token copiado
4. Clique: **Verificar**
5. ✅ Card verde deve aparecer com todas as informações!

### **Opção B: Baixar + Verificar**

1. Faça login: `participante@exemplo.com`
2. Vá em: **Meus Eventos**
3. Encontre: "Workshop de React Avançado - Teste Token"
4. Clique: **Baixar Certificado**
5. Abra o PDF → Veja o token no rodapé
6. Vá em: **🛡️ Verificar Certificado**
7. Cole o token do PDF
8. ✅ Verificação bem-sucedida!

---

## ⚠️ Se o usuário não existir

Execute antes do script principal:

```sql
INSERT INTO usuarios (nome, email, senha_hash, perfil)
VALUES (
  'João Silva Participante',
  'participante@exemplo.com',
  '$2a$10$XQqytfGpYzN5tHZNzqzXD.VYVQm5EzKZqQxqKQxK5qQxK5qQxK5qQ',
  'participante'
);
```

---

## ❌ Se o evento já existir

Execute para limpar:

```sql
-- Deletar tudo relacionado ao evento de teste
DELETE FROM certificados 
WHERE participacao_id IN (
  SELECT p.id FROM participacoes p
  INNER JOIN eventos e ON p.evento_id = e.id
  WHERE e.nome LIKE 'Workshop de React Avançado%Teste%'
);

DELETE FROM participacoes 
WHERE evento_id IN (
  SELECT id FROM eventos 
  WHERE nome LIKE 'Workshop de React Avançado%Teste%'
);

DELETE FROM eventos 
WHERE nome LIKE 'Workshop de React Avançado%Teste%';
```

Depois execute o script novamente.

---

## 🎯 O que Vai Acontecer

### **Ao Verificar o Token:**

```
┌─────────────────────────────────────────────┐
│ ✅ Certificado Válido                       │
│ Este certificado é autêntico                │
├─────────────────────────────────────────────┤
│                                             │
│ 🔑 Código de Validação                      │
│    550e8400-e29b-41d4-a716-446655440000    │
│                                             │
│ 👤 Participante                             │
│    João Silva Participante                  │
│    participante@exemplo.com                 │
│                                             │
│ 📄 Evento                                   │
│    Workshop de React Avançado - Teste Token│
│    Início: 15 de novembro de 2025           │
│    Duração: 40h                             │
│                                             │
│ 📅 Data de Emissão                          │
│    21 de novembro de 2025                   │
│                                             │
│ ✓ Frequência                                │
│    8 check-ins registrados                  │
│    Participação Aprovada                    │
└─────────────────────────────────────────────┘
```

---

## 🔧 Estrutura do Banco Corrigida

O banco usa:
- ✅ `data_inicio` (timestamp de início)
- ✅ `duracao_horas` (duração em horas)
- ❌ ~~`data_fim`~~ (não existe)

Data fim calculada: `data_inicio + duracao_horas`

---

## 📁 Arquivos Disponíveis

| Arquivo | Descrição |
|---------|-----------|
| `/script-rapido-teste.sql` | **Script rápido corrigido** ⭐ |
| `/SCRIPT_TESTE_CERTIFICADO.sql` | Script completo corrigido |
| `/COMO_TESTAR_TOKEN.md` | Guia detalhado |
| `/GUIA_VISUAL_TOKEN.md` | Mockups visuais |
| `/RESUMO_IMPLEMENTACAO.md` | Resumo técnico |

---

## ✅ Checklist

Antes de testar:
- [ ] Supabase Dashboard aberto
- [ ] SQL Editor acessível
- [ ] Usuário `participante@exemplo.com` existe (ou vai criar)
- [ ] Tem um admin criado no banco

Após executar:
- [ ] Script executou sem erros
- [ ] Token UUID foi gerado
- [ ] Token foi copiado
- [ ] Login funcionou
- [ ] Aba "Verificar Certificado" aparece no menu
- [ ] Token colado corretamente
- [ ] ✅ Card verde apareceu!

---

## 🎉 Pronto!

**O script está corrigido e funcionando!**

Execute agora e veja o sistema de tokens em ação! 🚀

---

**Última atualização:** 25/11/2025 - Scripts corrigidos ✅