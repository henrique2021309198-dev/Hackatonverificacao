# 🎓 GUIA: Testar Certificados

## 🎯 OBJETIVO

Criar um evento finalizado e testar a geração de certificados.

---

## 📋 PRÉ-REQUISITOS

✅ Ter uma conta criada com o email: `joao.2019312178@aluno.iffar.edu.br`

Se ainda não tem, crie a conta:
1. Abra o sistema
2. Clique em "Cadastre-se"
3. Use o email: `joao.2019312178@aluno.iffar.edu.br`
4. Preencha os outros dados
5. Crie a conta

---

## 🚀 PASSO A PASSO

### **1️⃣ Executar Script SQL**

Você tem 2 opções:

#### **Opção A: Script Completo** (Recomendado)
📄 Arquivo: `/CRIAR_EVENTO_FINALIZADO_CERTIFICADO.sql`

```
1. Abra: https://app.supabase.com
2. Vá em: SQL Editor → New Query
3. Copie TODO o conteúdo do arquivo
4. Cole no SQL Editor
5. Execute: Ctrl+Enter
6. Aguarde as mensagens no painel "Messages"
```

✅ **Você deve ver:**
```
✅ Usuário encontrado!
✅ Participação criada com sucesso!
✅ EVENTO CRIADO COM SUCESSO!
```

#### **Opção B: Script Simples**
📄 Arquivo: `/EVENTO_TESTE_CERTIFICADO_SIMPLES.sql`

Mesmos passos, mas mais rápido e sem mensagens detalhadas.

---

### **2️⃣ Fazer Login no Sistema**

```
1. Abra o sistema
2. Email: joao.2019312178@aluno.iffar.edu.br
3. Senha: (a que você criou)
4. Clique em: "Entrar"
```

---

### **3️⃣ Ir para "Meus Eventos"**

```
1. No menu superior, clique em: "Meus Eventos"
2. Você deve ver: "Workshop de Inteligência Artificial"
   (ou "Workshop de IA" se usou o script simples)
3. Status: "Concluído" ou "Finalizado"
```

---

### **4️⃣ Baixar Certificado**

```
1. Encontre o evento "Workshop de Inteligência Artificial"
2. Deve ter um botão: "Baixar Certificado" 🎓
3. Clique no botão
4. O certificado deve ser gerado/baixado
```

---

## 📊 O QUE FOI CRIADO

### **Evento:**
- **Nome:** Workshop de Inteligência Artificial
- **Duração:** 20 horas
- **Início:** Há 15 dias atrás
- **Fim:** Há 10 dias atrás
- **Status:** ✅ Finalizado
- **Valor:** Gratuito

### **Participação:**
- **Usuário:** joao.2019312178@aluno.iffar.edu.br
- **Presença:** 20/20 horas (100%)
- **Aprovado:** ✅ SIM
- **Certificado:** ✅ Disponível

---

## 🔍 VERIFICAR NO BANCO

### **Ver o evento criado:**

```sql
SELECT 
    e.id,
    e.nome,
    e.data_inicio,
    e.duracao_horas,
    e.data_inicio + (e.duracao_horas || ' hours')::interval as data_fim,
    CASE 
        WHEN e.data_inicio + (e.duracao_horas || ' hours')::interval < NOW() 
        THEN '✅ Finalizado' 
        ELSE '⏳ Em andamento' 
    END as status
FROM eventos e
WHERE e.nome LIKE '%Workshop%IA%'
ORDER BY e.id DESC;
```

### **Ver a participação:**

```sql
SELECT 
    p.id,
    u.email,
    e.nome as evento,
    p.numero_presencas || '/' || e.duracao_horas as presenca,
    p.is_aprovado as aprovado,
    p.pagamento_status
FROM participacoes p
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br';
```

---

## ❓ TROUBLESHOOTING

### **❌ "Usuário não encontrado"**

**Causa:** A conta não foi criada ainda.

**Solução:**
1. Crie a conta no sistema
2. Use exatamente o email: `joao.2019312178@aluno.iffar.edu.br`
3. Execute o script novamente

---

### **❌ Evento não aparece em "Meus Eventos"**

**Causa:** A participação não foi criada.

**Verificar:**
```sql
SELECT COUNT(*) 
FROM participacoes p
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br';
```

**Se retornar 0:**
```sql
-- Criar participação manualmente
INSERT INTO participacoes (evento_id, usuario_id, pagamento_status, numero_presencas, is_aprovado)
SELECT 
    (SELECT id FROM eventos WHERE nome LIKE '%Workshop%IA%' ORDER BY id DESC LIMIT 1),
    (SELECT id FROM auth.users WHERE email = 'joao.2019312178@aluno.iffar.edu.br'),
    'nao_requerido',
    20,
    true;
```

---

### **❌ Botão "Baixar Certificado" não aparece**

**Possíveis causas:**

1. **Evento ainda não finalizou**
   ```sql
   -- Verificar se finalizou
   SELECT 
       nome,
       data_inicio + (duracao_horas || ' hours')::interval as data_fim,
       NOW() as agora,
       CASE 
           WHEN data_inicio + (duracao_horas || ' hours')::interval < NOW() 
           THEN 'Finalizado' 
           ELSE 'Em andamento' 
       END as status
   FROM eventos
   WHERE nome LIKE '%Workshop%IA%';
   ```

2. **Participante não foi aprovado**
   ```sql
   -- Verificar aprovação
   SELECT is_aprovado 
   FROM participacoes p
   JOIN auth.users u ON p.usuario_id = u.id
   WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br';
   
   -- Se retornar 'false', corrigir:
   UPDATE participacoes
   SET is_aprovado = true
   WHERE usuario_id = (SELECT id FROM auth.users WHERE email = 'joao.2019312178@aluno.iffar.edu.br');
   ```

3. **Presença insuficiente**
   ```sql
   -- Verificar presença
   SELECT 
       p.numero_presencas,
       e.duracao_horas,
       ROUND((p.numero_presencas::numeric / e.duracao_horas::numeric) * 100, 2) as percentual
   FROM participacoes p
   JOIN eventos e ON p.evento_id = e.id
   JOIN auth.users u ON p.usuario_id = u.id
   WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br';
   
   -- Deve estar acima de 75% geralmente
   ```

---

## 🎨 PERSONALIZAR EVENTO

Você pode editar o script antes de executar para personalizar:

### **Mudar nome do evento:**
```sql
nome, -- Linha ~43 do script
'Seu Nome de Evento Aqui',
```

### **Mudar duração:**
```sql
duracao_horas, -- Linha ~45
40, -- 40 horas em vez de 20
```

### **Mudar data de início:**
```sql
data_inicio, -- Linha ~44
NOW() - INTERVAL '30 days', -- Há 30 dias em vez de 15
```

### **Evento pago:**
```sql
valor_evento, -- Linha ~47
50.00, -- R$ 50,00 em vez de gratuito

-- E mudar:
pagamento_status, -- Linha ~105
'confirmado', -- em vez de 'nao_requerido'
```

---

## 📋 CRIAR MÚLTIPLOS EVENTOS

Para testar melhor, crie vários eventos:

```sql
-- Copie e adapte este bloco:

-- Evento 1: Workshop finalizado
INSERT INTO eventos (...) VALUES (...);
INSERT INTO participacoes (...) VALUES (...);

-- Evento 2: Palestra finalizada
INSERT INTO eventos (...) VALUES (...);
INSERT INTO participacoes (...) VALUES (...);

-- Evento 3: Seminário em andamento
INSERT INTO eventos (...) VALUES (...);
INSERT INTO participacoes (...) VALUES (...);
```

Exemplo no script completo (comentado, para desabilitar):
- Linha ~150: Evento 2 - Palestra

---

## ✅ CHECKLIST DE TESTE

- [ ] Criei conta com email `joao.2019312178@aluno.iffar.edu.br`
- [ ] Executei `/CRIAR_EVENTO_FINALIZADO_CERTIFICADO.sql`
- [ ] Vi mensagens: ✅ Usuário encontrado, ✅ Participação criada
- [ ] Fiz login no sistema
- [ ] Fui em "Meus Eventos"
- [ ] Vi "Workshop de Inteligência Artificial"
- [ ] Status: "Concluído"
- [ ] Vi botão "Baixar Certificado" 🎓
- [ ] Cliquei e gerou/baixou o certificado ✅

---

## 🎉 SUCESSO!

Se você completou todos os passos:

```
✅ Evento finalizado criado
✅ Participação aprovada
✅ Certificado disponível
✅ Sistema funcionando!
```

Agora você pode testar:
- Design do certificado
- Download/visualização
- Dados corretos (nome, evento, datas, carga horária)

---

## 📞 PRÓXIMOS PASSOS

Depois de testar:

1. **Melhorar o certificado:**
   - Adicionar logo da instituição
   - Melhorar design
   - Adicionar assinaturas

2. **Criar mais eventos de teste:**
   - Diferentes categorias
   - Diferentes durações
   - Eventos pagos vs gratuitos

3. **Testar edge cases:**
   - Reprovado por faltas
   - Evento ainda não finalizado
   - Múltiplos certificados

---

## 📁 ARQUIVOS

- ⭐ `/CRIAR_EVENTO_FINALIZADO_CERTIFICADO.sql` → Script completo
- ⭐ `/EVENTO_TESTE_CERTIFICADO_SIMPLES.sql` → Script rápido
- 📖 `/GUIA_TESTAR_CERTIFICADOS.md` → Este guia

---

**Execute o script e teste agora!** 🚀🎓
