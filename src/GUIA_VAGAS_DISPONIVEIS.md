# 🎫 GUIA: Vagas Disponíveis

## ❌ Problema

As vagas disponíveis não estão sendo atualizadas quando usuários se inscrevem nos eventos.

---

## ✅ SOLUÇÃO COMPLETA

### **Etapa 1: Criar Trigger Automático** ⭐ **RECOMENDADO**

O trigger garante que as vagas sejam atualizadas automaticamente sempre que alguém se inscrever ou cancelar.

📄 **Execute:** `/CRIAR_TRIGGER_VAGAS.sql`

```sql
-- Copie TODO o conteúdo do arquivo
-- Cole no SQL Editor do Supabase
-- Execute: Ctrl+Enter
```

✅ **Resultado esperado:**
```
✅ TRIGGER CRIADO COM SUCESSO!
```

---

### **Etapa 2: Corrigir Vagas Existentes**

Se você já tem eventos com inscrições, precisa recalcular as vagas.

📄 **Execute:** `/CORRIGIR_VAGAS_EVENTOS.sql`

```sql
-- Copie TODO o conteúdo do arquivo
-- Cole no SQL Editor do Supabase
-- Execute: Ctrl+Enter
```

✅ **Resultado esperado:**
```
✅ VAGAS CORRIGIDAS COM SUCESSO!
📊 Eventos atualizados: X
```

---

## 🔍 COMO FUNCIONA

### **Antes (Problema):**

```
1. Usuário A se inscreve no evento → ✅ Inscrição criada
2. Vagas disponíveis: 50 → ❌ Continua 50 (errado!)
3. Usuário B faz login → ❌ Vê 50 vagas (errado!)
```

### **Depois (Solução):**

```
1. Usuário A se inscreve no evento → ✅ Inscrição criada
2. Trigger automático → ✅ Vagas: 50 → 49
3. Usuário B faz login → ✅ Vê 49 vagas (correto!)
```

---

## 📋 O QUE FOI CORRIGIDO

### **1. Código de Inscrição** ✅

Agora a função `createRegistration` em `/services/supabase.ts`:

- ✅ Verifica se há vagas disponíveis
- ✅ Cria a participação
- ✅ Decrementa as vagas automaticamente
- ✅ Mostra log: "Inscrição criada! Vagas disponíveis: X"

### **2. Trigger no Banco de Dados** ✅

O trigger `trigger_atualizar_vagas`:

- ✅ Executa automaticamente após INSERT em participacoes
- ✅ Executa automaticamente após DELETE em participacoes
- ✅ Atualiza vagas_disponiveis na tabela eventos
- ✅ Garante que vagas nunca fiquem negativas

---

## 🧪 COMO TESTAR

### **Teste 1: Verificar vagas antes**

```sql
SELECT id, nome, capacidade_maxima, vagas_disponiveis 
FROM eventos 
WHERE id = 1; -- Substitua pelo ID do seu evento
```

Anote o número de vagas.

### **Teste 2: Se inscrever no evento**

1. Abra o sistema
2. Vá para "Eventos"
3. Clique em um evento
4. Clique em "Inscrever-se"

### **Teste 3: Verificar vagas depois**

```sql
SELECT id, nome, capacidade_maxima, vagas_disponiveis 
FROM eventos 
WHERE id = 1; -- Mesmo ID do teste 1
```

**Resultado esperado:**
- ✅ Vagas diminuíram em 1
- ✅ vagas_disponiveis = (valor anterior - 1)

### **Teste 4: Trocar de usuário**

1. Faça logout
2. Crie uma nova conta ou faça login com outro usuário
3. Veja o mesmo evento
4. **Resultado esperado:** Vagas corretas aparecem

---

## 🔍 DIAGNÓSTICO

### **Como saber se o trigger está funcionando?**

Execute este SQL:

```sql
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table = 'participacoes';
```

**Deve mostrar:**
- ✅ `trigger_atualizar_vagas`
- ✅ Event: `INSERT` ou `DELETE`

### **Como ver o status atual dos eventos?**

```sql
SELECT 
    e.id,
    e.nome,
    e.capacidade_maxima,
    COUNT(p.id) as total_inscricoes,
    e.vagas_disponiveis,
    e.capacidade_maxima - COUNT(p.id) as vagas_calculadas,
    CASE 
        WHEN e.vagas_disponiveis = e.capacidade_maxima - COUNT(p.id) THEN '✅ Correto'
        ELSE '❌ Incorreto'
    END as status
FROM eventos e
LEFT JOIN participacoes p ON e.id = p.evento_id
GROUP BY e.id
ORDER BY e.id;
```

---

## ❓ PERGUNTAS FREQUENTES

### **1. O trigger vai atualizar eventos antigos?**

**Não.** O trigger funciona apenas para novas inscrições.

Para eventos antigos, execute: `/CORRIGIR_VAGAS_EVENTOS.sql`

### **2. E se alguém cancelar a inscrição?**

O trigger também funciona para DELETE. As vagas são **incrementadas** automaticamente.

### **3. As vagas podem ficar negativas?**

**Não.** O código verifica antes de criar a inscrição:

```typescript
if (evento.vagas_disponiveis <= 0) {
  return { error: 'Não há mais vagas disponíveis' };
}
```

E o trigger usa `GREATEST(vagas - 1, 0)` para garantir.

### **4. Preciso executar isso toda vez?**

**Não!** Execute apenas uma vez:

1. `/CRIAR_TRIGGER_VAGAS.sql` → Cria o sistema automático
2. `/CORRIGIR_VAGAS_EVENTOS.sql` → Corrige eventos existentes

Depois disso, funciona automaticamente! ✅

### **5. Como desativar o trigger?**

Se precisar remover o trigger:

```sql
DROP TRIGGER IF EXISTS trigger_atualizar_vagas ON participacoes;
DROP FUNCTION IF EXISTS atualizar_vagas_evento();
```

---

## 🚀 PASSO A PASSO COMPLETO

### **1️⃣ Criar Trigger**

```
1. Abra: https://app.supabase.com
2. Vá em: SQL Editor → New Query
3. Cole: /CRIAR_TRIGGER_VAGAS.sql
4. Execute: Ctrl+Enter
5. Veja: ✅ TRIGGER CRIADO
```

### **2️⃣ Corrigir Vagas Existentes**

```
1. Abra: SQL Editor → New Query
2. Cole: /CORRIGIR_VAGAS_EVENTOS.sql
3. Execute: Ctrl+Enter
4. Veja: ✅ VAGAS CORRIGIDAS
```

### **3️⃣ Testar**

```
1. Faça login no sistema
2. Inscreva-se em um evento
3. Faça logout
4. Entre com outro usuário
5. Veja o mesmo evento
6. Resultado: ✅ Vagas atualizadas!
```

---

## 📊 RESUMO

| Problema | Solução | Arquivo |
|----------|---------|---------|
| ❌ Vagas não atualizam | Criar trigger automático | `/CRIAR_TRIGGER_VAGAS.sql` |
| ❌ Eventos antigos incorretos | Recalcular vagas | `/CORRIGIR_VAGAS_EVENTOS.sql` |
| ✅ Funciona automaticamente | Código + Trigger | Já implementado |

---

## ✅ CHECKLIST

- [ ] Executei `/CRIAR_TRIGGER_VAGAS.sql`
- [ ] Vi mensagem: "✅ TRIGGER CRIADO COM SUCESSO!"
- [ ] Executei `/CORRIGIR_VAGAS_EVENTOS.sql`
- [ ] Vi tabela com status dos eventos
- [ ] Testei inscrever em um evento
- [ ] Troquei de usuário
- [ ] Vagas estão corretas! 🎉

---

## 🎯 ARQUIVOS CRIADOS

- ✅ `/services/supabase.ts` → Código atualizado
- ✅ `/CRIAR_TRIGGER_VAGAS.sql` → Trigger automático
- ✅ `/CORRIGIR_VAGAS_EVENTOS.sql` → Correção de eventos
- ✅ `/GUIA_VAGAS_DISPONIVEIS.md` → Este guia

---

**Execute os 2 scripts SQL agora e teste!** 🚀
