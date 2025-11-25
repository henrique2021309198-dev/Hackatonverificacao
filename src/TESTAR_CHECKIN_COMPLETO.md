# ✅ GUIA COMPLETO DE TESTES - SISTEMA DE CHECK-IN

## 🎯 OBJETIVO

Testar o sistema completo de check-in com QR Code do início ao fim.

---

## 📋 PRÉ-REQUISITOS

- [x] Evento criado no banco de dados
- [x] Usuário cadastrado
- [x] Participação registrada (inscrição)
- [x] QR Code gerado
- [x] Sistema rodando no navegador

---

## 🧪 TESTE 1: CRIAR EVENTO E INSCRIÇÃO

### **Passo 1.1: Criar Evento em Andamento**

Execute no **Supabase SQL Editor**:

```sql
-- Ver o script completo em: /CRIAR_EVENTO_EM_ANDAMENTO.sql
-- Ou execute manualmente:

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
  categoria,
  imagem_capa
) VALUES (
  'Teste Check-in - Evento em Andamento',
  'Evento para testar o sistema de check-in com QR Code',
  NOW() - INTERVAL '1 hour',  -- Começou há 1 hora
  8,                            -- Duração: 8 horas (termina daqui a 7 horas)
  0.25,                         -- 25% de faltas permitidas
  0,                            -- Gratuito
  'Certificamos que {nome_participante} participou do evento {nome_evento}.',
  'todos',
  'Campus Online - Sala Virtual',
  50,
  50,
  'Workshop',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'
) RETURNING id, nome, data_inicio, data_inicio + (duracao_horas || ' hours')::interval as data_fim;
```

**Anotar o ID retornado!** Ex: `123`

---

### **Passo 1.2: Verificar Evento Criado**

```sql
SELECT 
    id,
    nome,
    data_inicio,
    duracao_horas,
    data_inicio + (duracao_horas || ' hours')::interval as data_fim,
    CASE 
        WHEN data_inicio > NOW() THEN '⏰ Futuro'
        WHEN data_inicio + (duracao_horas || ' hours')::interval < NOW() THEN '✅ Passado'
        ELSE '🔴 EM ANDAMENTO'
    END as status
FROM eventos
WHERE id = 123;  -- Substituir pelo ID
```

**Resultado esperado:**
```
 id  | status          | data_inicio        | data_fim
-----+-----------------+--------------------+------------------
 123 | 🔴 EM ANDAMENTO | 2025-11-24 11:00  | 2025-11-24 19:00
```

---

### **Passo 1.3: Criar Participação (Inscrição)**

```sql
-- Substituir 'SEU-UUID-AQUI' pelo UUID do seu usuário
INSERT INTO participacoes (
  usuario_id,
  evento_id,
  pagamento_status,
  numero_presencas,
  is_aprovado
) VALUES (
  'SEU-UUID-AQUI',  -- Seu user ID
  123,               -- ID do evento
  'nao_requerido',   -- Gratuito
  0,                 -- Nenhuma presença ainda
  false
) RETURNING id;
```

**Para descobrir seu UUID:**
```sql
SELECT id, email, nome FROM auth.users
WHERE email = 'seu-email@exemplo.com';
```

---

## 🧪 TESTE 2: GERAR QR CODE

### **Passo 2.1: Formato do QR Code**

Para o evento ID `123`, o QR Code deve conter:
```
evento-123
```

### **Passo 2.2: Gerar usando API**

Abra no navegador:
```
https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=evento-123
```

Salve a imagem ou tire um print!

### **Passo 2.3: Verificar QR Code**

Use um leitor de QR Code e confirme que mostra:
```
evento-123
```

---

## 🧪 TESTE 3: FAZER CHECK-IN (FRONTEND)

### **Passo 3.1: Fazer Login**

1. Abra o sistema no navegador
2. Faça login com seu email
3. Aguarde carregar os dados

### **Passo 3.2: Ir para "Meus Eventos"**

1. Clique em "Meus Eventos" no menu
2. Vá para aba "Em Andamento"
3. Você deve ver o evento criado

**Esperado:**
```
┌────────────────────────────────────┐
│ Teste Check-in - Evento...         │
│ 📅 24/11/2025 - 24/11/2025         │
│ 📍 Campus Online                   │
│ ✅ Gratuito                        │
│                                    │
│ [Ver Detalhes] [Check-in 📱]      │
└────────────────────────────────────┘
```

### **Passo 3.3: Clicar em "Check-in"**

1. Clique no botão azul "Check-in"
2. Sistema abre o scanner de QR Code
3. Navegador solicita permissão de câmera
4. Clique em "Permitir"

**Esperado:**
```
┌────────────────────────────────────┐
│ 📷 Fazer Check-in          [X]     │
├────────────────────────────────────┤
│ Evento: Teste Check-in...          │
├────────────────────────────────────┤
│  ┌──────────────────────────┐      │
│  │  [CÂMERA ATIVA]          │      │
│  └──────────────────────────┘      │
├────────────────────────────────────┤
│ 📷 Aponte para o QR Code...        │
├────────────────────────────────────┤
│ [Cancelar]                         │
└────────────────────────────────────┘
```

### **Passo 3.4: Escanear QR Code**

1. Aponte a câmera para o QR Code gerado
2. Aguarde detecção automática (2-3 segundos)
3. Scanner fecha automaticamente

**Esperado:**
- ✅ Scanner fecha
- ✅ Toast verde aparece: "Check-in realizado com sucesso! Presença 1 registrada."
- ✅ Página recarrega dados

---

## 🧪 TESTE 4: VERIFICAR NO BANCO DE DADOS

### **Passo 4.1: Verificar Presença Registrada**

```sql
SELECT 
    pd.id,
    pd.data_registro,
    pd.sessao_nome,
    u.nome as participante,
    e.nome as evento
FROM presencas_detalhes pd
JOIN participacoes p ON pd.participacao_id = p.id
JOIN auth.users u ON p.usuario_id = u.id
JOIN eventos e ON p.evento_id = e.id
WHERE e.id = 123  -- ID do evento
ORDER BY pd.data_registro DESC;
```

**Resultado esperado:**
```
 id | data_registro           | sessao_nome           | participante
----+-------------------------+-----------------------+-------------
  1 | 2025-11-24 12:30:00    | 24/11/2025 - Tarde    | João Silva
```

### **Passo 4.2: Verificar Contador de Presenças**

```sql
SELECT 
    u.nome as participante,
    e.nome as evento,
    p.numero_presencas,
    p.pagamento_status
FROM participacoes p
JOIN auth.users u ON p.usuario_id = u.id
JOIN eventos e ON p.evento_id = e.id
WHERE e.id = 123;
```

**Resultado esperado:**
```
 participante | evento                | numero_presencas | pagamento_status
--------------+-----------------------+------------------+-----------------
 João Silva   | Teste Check-in...     | 1                | nao_requerido
```

✅ **Sucesso!** O check-in foi registrado corretamente!

---

## 🧪 TESTE 5: VALIDAÇÕES (TESTES NEGATIVOS)

### **Teste 5.1: Check-in Duplicado (Mesmo Dia)**

1. Tente fazer check-in novamente
2. Escaneie o mesmo QR Code

**Resultado esperado:**
```
❌ Toast vermelho: "Você já fez check-in hoje neste evento."
```

---

### **Teste 5.2: QR Code Errado**

1. Gere QR Code com texto: `evento-999`
2. Tente escanear

**Resultado esperado:**
```
❌ Toast vermelho: "QR Code inválido para este evento. Escaneie o QR Code correto."
```

---

### **Teste 5.3: Sem Inscrição**

1. Crie um segundo usuário
2. NÃO faça inscrição no evento
3. Tente fazer check-in

**Resultado esperado:**
```
❌ Toast vermelho: "Você não está inscrito neste evento. Faça a inscrição primeiro."
```

---

### **Teste 5.4: Evento Futuro**

Crie evento que começa amanhã:

```sql
INSERT INTO eventos (
  nome, descricao, data_inicio, duracao_horas,
  limite_faltas_percentual, valor_evento,
  texto_certificado, perfil_academico_foco,
  local, capacidade_maxima, vagas_disponiveis, categoria
) VALUES (
  'Evento Futuro',
  'Teste',
  NOW() + INTERVAL '1 day',  -- Amanhã
  4,
  0.25,
  0,
  'Certificado',
  'todos',
  'Local',
  50,
  50,
  'Workshop'
) RETURNING id;
```

Tente fazer check-in:

**Resultado esperado:**
```
❌ Toast vermelho: "O evento ainda não começou. Check-in indisponível."
```

---

### **Teste 5.5: Evento Passado**

Crie evento que terminou ontem:

```sql
INSERT INTO eventos (
  nome, descricao, data_inicio, duracao_horas,
  limite_faltas_percentual, valor_evento,
  texto_certificado, perfil_academico_foco,
  local, capacidade_maxima, vagas_disponiveis, categoria
) VALUES (
  'Evento Passado',
  'Teste',
  NOW() - INTERVAL '2 days',  -- Há 2 dias
  4,                           -- Duração 4h (terminou há 2 dias)
  0.25,
  0,
  'Certificado',
  'todos',
  'Local',
  50,
  50,
  'Workshop'
) RETURNING id;
```

Tente fazer check-in:

**Resultado esperado:**
```
❌ Toast vermelho: "O evento já terminou. Check-in não é mais permitido."
```

---

## 🧪 TESTE 6: CHECK-IN EM DIAS DIFERENTES

### **Passo 6.1: Fazer Check-in Hoje**

(Já feito no Teste 3)

### **Passo 6.2: Simular Check-in Amanhã**

Para testar, precisamos manipular a data no banco:

```sql
-- Deletar check-in de hoje
DELETE FROM presencas_detalhes
WHERE participacao_id IN (
  SELECT id FROM participacoes
  WHERE evento_id = 123
);

-- Resetar contador
UPDATE participacoes
SET numero_presencas = 0
WHERE evento_id = 123;
```

Agora faça check-in novamente. Deve funcionar!

---

## 📊 CONSOLE DO NAVEGADOR

Abra o console (F12) e veja os logs:

### **Logs Esperados no Check-in:**

```javascript
📝 Iniciando check-in: { eventoId: "123", usuarioId: "uuid-...", qrCode: "evento-123" }
✅ Presença registrada: { id: 1, participacao_id: 5, sessao_nome: "..." }
✅ Check-in realizado! Total de presenças: 1
```

### **Logs de Erro (se algo falhar):**

```javascript
❌ QR Code não corresponde ao evento
❌ Evento não encontrado
❌ Participação não encontrada
❌ Erro ao registrar presença
```

---

## ✅ CHECKLIST DE VALIDAÇÕES

Execute todos e marque:

- [ ] Evento criado e em andamento
- [ ] Participação/inscrição registrada
- [ ] QR Code gerado corretamente
- [ ] Scanner abre ao clicar em "Check-in"
- [ ] Permissão de câmera concedida
- [ ] QR Code detectado automaticamente
- [ ] Check-in registrado no banco
- [ ] Toast de sucesso aparece
- [ ] Contador de presenças atualizado
- [ ] Check-in duplicado bloqueado
- [ ] QR Code errado rejeitado
- [ ] Sem inscrição = erro
- [ ] Evento futuro = bloqueado
- [ ] Evento passado = bloqueado

---

## 🎉 RESULTADO FINAL

Se todos os testes passaram:

✅ **Sistema de check-in 100% funcional!**

### **Fluxo Completo Validado:**

1. ✅ Evento criado
2. ✅ Inscrição registrada
3. ✅ QR Code gerado
4. ✅ Scanner funciona
5. ✅ QR Code detectado
6. ✅ Validações OK
7. ✅ Check-in registrado
8. ✅ Banco atualizado
9. ✅ Feedback para usuário
10. ✅ Regras de negócio respeitadas

---

## 🐛 TROUBLESHOOTING

### **"Câmera não abre"**

**Soluções:**
1. Permitir câmera nas configurações do navegador
2. Usar HTTPS (não HTTP)
3. Testar em outro navegador
4. Verificar se outra aba está usando câmera

---

### **"QR Code não detecta"**

**Soluções:**
1. Aumentar iluminação
2. Limpar lente da câmera
3. Aproximar/afastar QR Code
4. Gerar QR Code maior (800x800px)
5. Aumentar contraste

---

### **"Erro ao registrar presença"**

**Verificar:**
1. Tabela `presencas_detalhes` existe?
2. RLS configurado corretamente?
3. Usuário tem permissão de escrita?
4. Ver logs no console (F12)

**SQL para verificar:**
```sql
-- Ver estrutura da tabela
\d presencas_detalhes

-- Ver políticas RLS
SELECT * FROM pg_policies
WHERE tablename = 'presencas_detalhes';
```

---

## 📚 PRÓXIMOS PASSOS

Após validar o sistema:

1. ✅ Testar em diferentes navegadores
2. ✅ Testar em mobile (Android/iOS)
3. ✅ Criar QR Codes para eventos reais
4. ✅ Imprimir e distribuir nos eventos
5. ✅ Treinar equipe de organização
6. ✅ Monitorar check-ins em tempo real

---

## 📄 RELATÓRIO DE TESTE

### **Ambiente:**
- Data: ___/___/______
- Navegador: ______________
- Dispositivo: _____________

### **Resultados:**
- [ ] ✅ Todos os testes passaram
- [ ] ⚠️ Alguns testes falharam (listar abaixo)
- [ ] ❌ Sistema não funcional

### **Observações:**
_______________________________________
_______________________________________
_______________________________________

---

**Criado em:** 24/11/2025  
**Versão:** 1.0  
**Status:** ✅ Pronto para testar!
