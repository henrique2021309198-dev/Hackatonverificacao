# 🧪 Como Testar o Sistema de Token de Certificados

## 🎯 Objetivo
Testar o sistema completo de verificação de certificados com token único.

---

## 📋 Passo a Passo Rápido

### **1️⃣ Execute o Script SQL**

1. Abra o **Supabase Dashboard**
2. Vá em: **SQL Editor**
3. Cole o conteúdo do arquivo `/SCRIPT_TESTE_CERTIFICADO.sql`
4. Clique em **RUN**

---

### **2️⃣ Copie o Token Gerado**

Após executar o script, procure nos resultados a consulta:

```
🔑 TOKEN DE VALIDAÇÃO (COPIE ESTE CÓDIGO)
───────────────────────────────────────────
550e8400-e29b-41d4-a716-446655440000
```

**➡️ COPIE este código UUID!**

---

### **3️⃣ Faça Login no Sistema**

Use as credenciais:

```
Email: participante@exemplo.com
Senha: [a senha que você cadastrou]
```

**Nota:** Se o usuário não existir, o script tem instruções para criar.

---

### **4️⃣ Opção A: Baixar o Certificado**

```
1. No menu, clique em "Meus Eventos"
2. Encontre: "Workshop de React Avançado - Edição Teste"
3. Clique em "Baixar Certificado"
4. Abra o PDF baixado
5. Procure no RODAPÉ do certificado:
   "Token de validação: 550e8400-..."
6. Confirme que o token está impresso!
```

---

### **5️⃣ Opção B: Testar a Verificação Diretamente**

```
1. No menu superior, clique em "Verificar Certificado"
2. Cole o token copiado do SQL
3. Clique em "Verificar"
4. Deve aparecer um card VERDE com:
   ✅ Certificado Válido
   👤 João Silva Participante
   📄 Workshop de React Avançado
   📅 Emitido em: 21 de novembro de 2025
   ✓ 8 check-ins registrados
```

---

## 🎨 Resultado Esperado

### **✅ Sucesso:**

```
┌─────────────────────────────────────────────┐
│ ✅ Certificado Válido                       │
│ Este certificado é autêntico e foi emitido  │
│ pela plataforma                             │
├─────────────────────────────────────────────┤
│                                             │
│ 🔑 Token de Validação:                      │
│    550e8400-e29b-41d4-a716-446655440000    │
│                                             │
│ 👤 Participante:                            │
│    João Silva Participante                  │
│    participante@exemplo.com                 │
│                                             │
│ 📄 Evento:                                  │
│    Workshop de React Avançado - Edição Teste│
│    Início: 15 de novembro de 2025           │
│    Duração: 40h                             │
│                                             │
│ 📅 Data de Emissão:                         │
│    21 de novembro de 2025                   │
│                                             │
│ ✓ Frequência:                               │
│    8 check-ins registrados                  │
│    Participação Aprovada                    │
│                                             │
│ [ Visualizar Certificado PDF ]              │
└─────────────────────────────────────────────┘
```

---

## 🧪 Testes Adicionais

### **Teste 1: Token Inválido**
```
1. Vá em "Verificar Certificado"
2. Digite: 00000000-0000-0000-0000-000000000000
3. Clique em "Verificar"
4. Deve aparecer: ❌ Certificado não encontrado
```

### **Teste 2: Certificado Revogado**
```sql
-- Execute no SQL Editor
UPDATE certificados 
SET is_revogado = true
WHERE codigo_validacao = 'SEU_TOKEN_AQUI';

-- Agora tente verificar o mesmo token
-- Deve retornar: ❌ Certificado não encontrado
```

### **Teste 3: Admin Também Pode Verificar**
```
1. Faça login como administrador
2. Menu Lateral → "Verificar Certificado"
3. Cole o mesmo token
4. Deve funcionar igualmente!
```

---

## 📊 Dados do Evento de Teste

| Campo | Valor |
|-------|-------|
| **Nome** | Workshop de React Avançado - Edição Teste |
| **Data Início** | 15/11/2025 09:00 |
| **Data Fim** | 20/11/2025 18:00 |
| **Duração** | 40 horas |
| **Local** | Centro de Convenções - Sala 201 |
| **Vagas** | 50 |
| **Valor** | Gratuito (R$ 0,00) |
| **Status** | ✅ Finalizado |

| Campo | Valor |
|-------|-------|
| **Participante** | João Silva Participante |
| **Email** | participante@exemplo.com |
| **Status Pagamento** | nao_requerido (gratuito) |
| **Aprovado** | ✅ Sim |
| **Check-ins** | 8 presenças registradas |
| **Certificado** | ✅ Emitido em 21/11/2025 |

---

## ⚠️ Troubleshooting

### **Problema: Usuário não existe**
```sql
-- Execute no SQL Editor para criar o usuário
INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario)
VALUES (
  'João Silva Participante',
  'participante@exemplo.com',
  '$2a$10$XQqytfGpYzN5tHZNzqzXD.VYVQm5EzKZqQxqKQxK5qQxK5qQxK5qQ',
  'participante'
);
```

### **Problema: Evento já existe**
```sql
-- Delete o evento antigo primeiro
DELETE FROM certificados 
WHERE participacao_id IN (
  SELECT p.id FROM participacoes p
  INNER JOIN eventos e ON p.evento_id = e.id
  WHERE e.nome = 'Workshop de React Avançado - Edição Teste'
);

DELETE FROM presencas_detalhes 
WHERE participacao_id IN (
  SELECT p.id FROM participacoes p
  INNER JOIN eventos e ON p.evento_id = e.id
  WHERE e.nome = 'Workshop de React Avançado - Edição Teste'
);

DELETE FROM participacoes 
WHERE evento_id IN (
  SELECT id FROM eventos 
  WHERE nome = 'Workshop de React Avançado - Edição Teste'
);

DELETE FROM eventos 
WHERE nome = 'Workshop de React Avançado - Edição Teste';
```

### **Problema: Certificado não aparece em "Meus Eventos"**

Verifique:
```sql
-- Verificar se tudo está correto
SELECT 
  e.data_fim < NOW() AS evento_finalizado,
  p.is_aprovado AS aprovado,
  p.pagamento_status,
  c.codigo_validacao AS token
FROM participacoes p
INNER JOIN eventos e ON p.evento_id = e.id
INNER JOIN usuarios u ON p.usuario_id = u.id
LEFT JOIN certificados c ON c.participacao_id = p.id
WHERE u.email = 'participante@exemplo.com'
  AND e.nome = 'Workshop de React Avançado - Edição Teste';
```

Deve retornar:
- `evento_finalizado` = `true`
- `aprovado` = `true`
- `pagamento_status` = `nao_requerido` ou `confirmado`
- `token` = UUID válido

---

## 🎯 Checklist de Teste

Use este checklist para validar tudo:

- [ ] Script SQL executado sem erros
- [ ] Token UUID foi gerado (consulta PASSO 6)
- [ ] Login com participante@exemplo.com funcionou
- [ ] Evento aparece em "Meus Eventos"
- [ ] Botão "Baixar Certificado" está visível
- [ ] PDF do certificado foi baixado
- [ ] Token aparece no rodapé do PDF
- [ ] Página "Verificar Certificado" carrega
- [ ] Token colado corretamente
- [ ] Verificação retorna: ✅ Certificado Válido
- [ ] Todas as informações são exibidas corretamente
- [ ] Teste com token inválido retorna erro

---

## 🚀 Próximos Passos Após Teste

Se tudo funcionou:

1. ✅ **Sistema está operacional!**
2. 🎨 Ajuste visual se necessário
3. 🔐 Configure RLS do Supabase
4. 📦 Implemente storage para PDFs
5. 🌐 Deploy em produção

---

## 📞 Suporte

Se algo não funcionar:

1. Verifique os logs do navegador (F12 → Console)
2. Verifique o SQL Editor do Supabase (erros em vermelho)
3. Revise a documentação completa: `/SISTEMA_VERIFICACAO_CERTIFICADOS.md`
4. Verifique as permissões RLS do Supabase

---

**Criado em:** 25/11/2025  
**Status:** ✅ Pronto para teste  
**Duração estimada:** 5-10 minutos
