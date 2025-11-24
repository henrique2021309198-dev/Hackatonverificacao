# ✅ SOLUÇÃO: Local e Vagas nos Cards de Eventos

## 🐛 Problema Reportado

Os cards de eventos para participantes exibiam valores fixos:
- **Local:** Sempre "A definir"
- **Vagas:** Sempre "50 vagas disponíveis"

Os dados reais do banco não estavam sendo exibidos.

---

## 🔍 Causa Raiz

A tabela `public.eventos` no Supabase não tinha as colunas necessárias:
- `local`
- `capacidade_maxima`
- `vagas_disponiveis`
- `categoria`
- `imagem_capa`
- `organizador_id`
- `status`
- `criado_em`
- `atualizado_em`

O código estava usando valores de fallback (padrões) porque esses campos não existiam.

---

## ✅ SOLUÇÃO IMPLEMENTADA

### **1. Script SQL Criado**

Arquivo: `/ADICIONAR_CAMPOS_EVENTOS.sql`

Este script:
- ✅ Adiciona todas as colunas necessárias
- ✅ Define valores padrão sensatos
- ✅ Adiciona constraints de validação
- ✅ Cria trigger para atualizar `atualizado_em` automaticamente
- ✅ Inclui verificações e exemplos

**Principais campos adicionados:**
```sql
ALTER TABLE public.eventos 
ADD COLUMN IF NOT EXISTS local TEXT DEFAULT 'A definir';

ALTER TABLE public.eventos 
ADD COLUMN IF NOT EXISTS capacidade_maxima INTEGER DEFAULT 100;

ALTER TABLE public.eventos 
ADD COLUMN IF NOT EXISTS vagas_disponiveis INTEGER DEFAULT 100;

ALTER TABLE public.eventos 
ADD COLUMN IF NOT EXISTS categoria TEXT DEFAULT 'Workshop';

-- + outros campos
```

---

### **2. Types Atualizados**

Arquivo: `/types/index.ts`

**Interface `Evento` atualizada:**
```typescript
export interface Evento {
  id: number;
  nome: string;
  descricao: string;
  data_inicio: string;
  duracao_horas: number;
  limite_faltas_percentual: number;
  chave_pix?: string | null;
  valor_evento: number;
  texto_certificado: string;
  perfil_academico_foco: string;
  // ✅ Novos campos adicionados
  local?: string;
  capacidade_maxima?: number;
  vagas_disponiveis?: number;
  categoria?: string;
  imagem_capa?: string;
  organizador_id?: string;
  status?: string;
  criado_em?: string;
  atualizado_em?: string;
}
```

**Interface `CreateEventData` atualizada:**
```typescript
export interface CreateEventData {
  nome: string;
  descricao: string;
  data_inicio: string;
  duracao_horas: number;
  limite_faltas_percentual: number;
  chave_pix?: string | null;
  valor_evento: number;
  texto_certificado: string;
  perfil_academico_foco: string;
  // ✅ Novos campos
  local?: string;
  capacidade_maxima?: number;
  vagas_disponiveis?: number;
  categoria?: string;
  imagem_capa?: string;
}
```

---

### **3. Função de Mapeamento Atualizada**

Arquivo: `/services/supabase.ts`

**Antes:**
```typescript
function mapEventoToEvent(evento: Evento): Event {
  return {
    // ...
    local: 'A definir', // ❌ Valor fixo
    capacidadeMaxima: 100, // ❌ Valor fixo
    vagas: 50, // ❌ Valor fixo
    categoria: 'Workshop', // ❌ Valor fixo
    // ...
  };
}
```

**Depois:**
```typescript
function mapEventoToEvent(evento: Evento): Event {
  return {
    // ...
    local: evento.local || 'A definir', // ✅ Usa banco
    capacidadeMaxima: evento.capacidade_maxima || 100, // ✅ Usa banco
    vagas: evento.vagas_disponiveis ?? 50, // ✅ Usa banco
    categoria: (evento.categoria as EventCategory) || 'Workshop', // ✅ Usa banco
    imagemCapa: evento.imagem_capa || 'https://...', // ✅ Usa banco
    status: (evento.status as EventStatus) || 'Publicado', // ✅ Usa banco
    organizadorId: evento.organizador_id || '1', // ✅ Usa banco
    criadoEm: evento.criado_em || evento.data_inicio, // ✅ Usa banco
    atualizadoEm: evento.atualizado_em || evento.data_inicio, // ✅ Usa banco
  };
}
```

---

### **4. Criação de Eventos Atualizada**

Arquivo: `/App.tsx` → `handleCreateEvent`

**Agora envia os novos campos:**
```typescript
const createData = {
  nome: eventData.nome!,
  descricao: eventData.descricao!,
  data_inicio: eventData.dataInicio!,
  duracao_horas: ...,
  // ...campos antigos...
  // ✅ Novos campos
  local: eventData.local || 'A definir',
  capacidade_maxima: eventData.capacidadeMaxima || 100,
  vagas_disponiveis: eventData.capacidadeMaxima || 100,
  categoria: eventData.categoria || 'Workshop',
  imagem_capa: eventData.imagemCapa,
};
```

Arquivo: `/services/supabase.ts` → `createEvent`

**INSERT atualizado:**
```typescript
.insert({
  nome: eventData.nome!,
  descricao: eventData.descricao!,
  // ...campos antigos...
  // ✅ Novos campos no INSERT
  local: eventData.local || 'A definir',
  capacidade_maxima: eventData.capacidade_maxima || 100,
  vagas_disponiveis: eventData.vagas_disponiveis || eventData.capacidade_maxima || 100,
  categoria: eventData.categoria || 'Workshop',
  imagem_capa: eventData.imagem_capa || 'https://...',
})
```

---

## 🚀 COMO USAR

### **Passo 1: Execute o Script SQL**

1. **Abra:** https://app.supabase.com → Seu Projeto
2. **Vá em:** SQL Editor → New Query
3. **Cole:** Todo o conteúdo de `/ADICIONAR_CAMPOS_EVENTOS.sql`
4. **Execute:** Ctrl+Enter

**Mensagem esperada:**
```
✅ Campos adicionados com sucesso à tabela eventos!
```

---

### **Passo 2: Execute o Script de Auto-Increment (se ainda não executou)**

**Arquivo:** `/VERIFICAR_TABELA_EVENTOS.sql`

Execute este script também para garantir que a coluna `id` tem auto-increment configurado.

---

### **Passo 3: Crie um Novo Evento de Teste**

1. Faça login como admin
2. Vá em "Criar Evento"
3. Preencha **TODOS os campos:**
   - Nome
   - Categoria (escolha uma das opções)
   - Descrição
   - Data Início e Fim
   - **Local** (ex: "Auditório Central")
   - **Capacidade Máxima** (ex: 150)
   - Valor (gratuito ou pago)

4. Clique em "Criar Evento"

---

### **Passo 4: Verifique no Supabase**

1. Abra: Table Editor → `eventos`
2. Veja o evento criado com **TODOS os campos preenchidos**:
   - ✅ `local` = "Auditório Central"
   - ✅ `capacidade_maxima` = 150
   - ✅ `vagas_disponiveis` = 150
   - ✅ `categoria` = "Workshop"
   - ✅ `status` = "Publicado"
   - ✅ `criado_em` = (timestamp)

---

### **Passo 5: Veja na Tela do Participante**

1. Faça logout
2. Faça login como participante
3. Veja os cards de eventos na tela inicial
4. ✅ **Local** deve mostrar o valor real!
5. ✅ **Vagas** deve mostrar o número correto!

---

## 📊 RESULTADO ESPERADO

### **Antes:**
```
📍 Local: A definir
👥 50 vagas disponíveis
```

### **Depois:**
```
📍 Local: Auditório Central - Campus Universitário
👥 150 vagas disponíveis
```

---

## 🎯 CONSTRAINTS ADICIONADOS

O script SQL também adiciona validações:

1. ✅ **Categoria** deve ser um dos valores permitidos:
   - Semana Acadêmica
   - Hackathon
   - Minicurso
   - Workshop
   - Palestra
   - Congresso

2. ✅ **Status** deve ser um dos valores permitidos:
   - Publicado
   - Rascunho
   - Cancelado
   - Encerrado

3. ✅ **Vagas disponíveis** não pode ser negativa

4. ✅ **Capacidade máxima** deve ser positiva

5. ✅ **Vagas disponíveis** não pode exceder capacidade máxima

---

## 📝 EVENTOS EXISTENTES

Se você já tem eventos na tabela, eles receberão os valores padrão:
- `local` = "A definir"
- `capacidade_maxima` = 100
- `vagas_disponiveis` = 100
- `categoria` = "Workshop"
- `status` = "Publicado"

Você pode atualizar manualmente esses eventos no Table Editor do Supabase.

---

## ✅ CHECKLIST

- [ ] 1. Executei `/ADICIONAR_CAMPOS_EVENTOS.sql`
- [ ] 2. Vi mensagem de sucesso
- [ ] 3. Executei `/VERIFICAR_TABELA_EVENTOS.sql` (auto-increment)
- [ ] 4. Criei um evento de teste com local e capacidade
- [ ] 5. Verifiquei no Table Editor que os campos estão lá
- [ ] 6. Visualizei como participante e vi os dados reais
- [ ] 7. Tudo funcionando! ✅

---

## 🎓 PRÓXIMOS PASSOS

Agora você pode:

1. **Adicionar validação no formulário** de criação de eventos para tornar "Local" e "Capacidade" obrigatórios
2. **Implementar edição de eventos** para atualizar esses campos
3. **Adicionar filtros** por categoria, local, vagas disponíveis
4. **Implementar sistema de reserva** que decrementa `vagas_disponiveis` ao inscrever

---

**Execute os scripts SQL e teste criando um evento com local e capacidade específicos! 🚀**
