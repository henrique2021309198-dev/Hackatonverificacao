# 🎯 TESTAR EVENTO EM ANDAMENTO NO FRONTEND

## ✅ O QUE FOI IMPLEMENTADO

Sistema de filtros para exibir eventos na aba correta:

- **Próximos:** Eventos que ainda não começaram (data_inicio > agora)
- **Em Andamento:** Eventos acontecendo agora (data_inicio <= agora <= data_fim)
- **Concluídos:** Eventos que já terminaram (data_fim < agora)

---

## 🔍 COMO VERIFICAR SE ESTÁ FUNCIONANDO

### **1️⃣ Abrir Console do Navegador**

No Chrome/Firefox:
- Pressione `F12` ou `Ctrl+Shift+I`
- Vá para a aba "Console"

### **2️⃣ Fazer Login no Sistema**

Use o email do evento criado:
```
Email: joao.2019312178@aluno.iffar.edu.br
Senha: (a que você cadastrou)
```

### **3️⃣ Ir para "Meus Eventos"**

Você verá no console algo assim:

```javascript
🔍 MyEventsPage Debug:
Total registrations: 1  // Ou mais
Active events: 1        // ✅ Deve ser 1 se o evento está em andamento
Upcoming events: 0
Past events: 0
Exemplo de evento: {
  nome: "Semana de Tecnologia e Inovação 2025",
  dataInicio: "2025-11-21T08:00:00.000Z",  // Há 3 dias
  dataFim: "2025-11-25T16:00:00.000Z",     // Amanhã
  now: "2025-11-24T12:00:00.000Z"          // Hoje
}
```

### **4️⃣ Verificar Abas**

Você deve ver:
- ✅ **Em Andamento (1)** - Com o evento
- **Próximos (0)** - Vazio
- **Concluídos (0)** - Vazio

---

## 🐛 SE NÃO APARECER NADA

### **Problema 1: "Total registrations: 0"**

**Causa:** A participação não foi criada no banco.

**Solução:** Execute este SQL no Supabase:

```sql
-- Ver se a participação existe
SELECT 
    p.id,
    u.email,
    e.nome as evento,
    p.inscrito_em
FROM participacoes p
JOIN auth.users u ON p.usuario_id = u.id
JOIN eventos e ON p.evento_id = e.id
WHERE u.email = 'joao.2019312178@aluno.iffar.edu.br'
  AND e.nome = 'Semana de Tecnologia e Inovação 2025';
```

Se não retornar nada, a participação não existe. Execute novamente o arquivo:
```
/CRIAR_EVENTO_EM_ANDAMENTO.sql
```

---

### **Problema 2: "Active events: 0" mas "Total registrations: 1"**

**Causa:** O evento não está no período correto.

**Solução:** Verifique as datas:

```sql
SELECT 
    nome,
    data_inicio,
    data_inicio + (duracao_horas || ' hours')::interval as data_fim,
    NOW() as agora,
    CASE 
        WHEN data_inicio > NOW() THEN '⏰ Futuro'
        WHEN data_inicio + (duracao_horas || ' hours')::interval < NOW() THEN '✅ Passado'
        ELSE '🔴 EM ANDAMENTO'
    END as status
FROM eventos
WHERE nome = 'Semana de Tecnologia e Inovação 2025';
```

Se o status não for "EM ANDAMENTO", recrie o evento:

```sql
-- Deletar evento antigo
DELETE FROM participacoes WHERE evento_id IN (
    SELECT id FROM eventos 
    WHERE nome = 'Semana de Tecnologia e Inovação 2025'
);

DELETE FROM eventos 
WHERE nome = 'Semana de Tecnologia e Inovação 2025';

-- Execute novamente: /CRIAR_EVENTO_EM_ANDAMENTO.sql
```

---

### **Problema 3: Usuário não existe**

**Causa:** O email `joao.2019312178@aluno.iffar.edu.br` não está cadastrado.

**Solução:** Cadastre o usuário no sistema:

**Opção A - Pelo Frontend:**
1. Faça logout
2. Clique em "Criar conta"
3. Use o email: `joao.2019312178@aluno.iffar.edu.br`
4. Preencha os dados
5. Cadastre

**Opção B - Pelo SQL:**
```sql
-- Ver se usuário existe
SELECT id, email FROM auth.users
WHERE email = 'joao.2019312178@aluno.iffar.edu.br';

-- Se não existe, o script CRIAR_EVENTO_EM_ANDAMENTO.sql
-- já cria automaticamente. Execute-o novamente.
```

---

## 📊 EXEMPLO DE SAÍDA ESPERADA NO CONSOLE

```javascript
🔍 MyEventsPage Debug:
Total registrations: 1
Active events: 1
Upcoming events: 0
Past events: 0
Exemplo de evento: {
  nome: "Semana de Tecnologia e Inovação 2025",
  dataInicio: "2025-11-21T08:00:00.000Z",
  dataFim: "2025-11-25T16:00:00.000Z",
  now: "2025-11-24T15:30:00.000Z"
}
```

E você verá na tela:

```
┌─────────────────────────────────────┐
│ Meus Eventos                        │
│ Gerencie suas inscrições e...      │
├─────────────────────────────────────┤
│ [Próximos (0)] [Em Andamento (1)]  │
│ [Concluídos (0)]                    │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 📷 Semana de Tecnologia...      │ │
│ │                                 │ │
│ │ Descrição: Evento de 5 dias...  │ │
│ │ 📅 21/11/2025 - 25/11/2025      │ │
│ │ 📍 Campus IFFAR                 │ │
│ │                                 │ │
│ │ ✅ Pagamento: Não Requerido     │ │
│ │ 💚 Gratuito                     │ │
│ │                                 │ │
│ │ [Ver Detalhes]                  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## ✅ CHECKLIST DE VERIFICAÇÃO

- [ ] Console do navegador aberto (F12)
- [ ] Login com email correto
- [ ] Ir para "Meus Eventos"
- [ ] Ver logs no console
- [ ] Conferir: "Active events: 1"
- [ ] Aba "Em Andamento" mostra 1 evento
- [ ] Evento aparece na tela

---

## 🎯 PRÓXIMOS PASSOS

Se tudo estiver funcionando:

1. ✅ **Sistema de filtros OK!**
2. ✅ **Eventos em andamento aparecem!**
3. 🚀 **Próximo:** Implementar tela de check-in

---

## 🔧 DEBUG AVANÇADO

Se precisar investigar mais, adicione estes logs no console do navegador:

```javascript
// Ver todas as inscrições
console.table(registrations);

// Ver datas dos eventos
registrations.forEach(reg => {
  const inicio = new Date(reg.evento.dataInicio);
  const fim = new Date(reg.evento.dataFim);
  const agora = new Date();
  
  console.log({
    evento: reg.evento.nome,
    inicio: inicio.toLocaleString('pt-BR'),
    fim: fim.toLocaleString('pt-BR'),
    agora: agora.toLocaleString('pt-BR'),
    emAndamento: inicio <= agora && fim >= agora
  });
});
```

---

## 📝 OBSERVAÇÕES IMPORTANTES

### **Cálculo da data_fim:**

No código, a data final é calculada assim:

```javascript
// Em /services/supabase.ts, linha 43-44
const dataFim = new Date(evento.data_inicio);
dataFim.setHours(dataFim.getHours() + evento.duracao_horas);
```

**Exemplo:**
```
data_inicio = 2025-11-21 08:00:00 (Há 3 dias)
duracao_horas = 40
data_fim = 2025-11-21 08:00:00 + 40 horas
         = 2025-11-23 00:00:00 (Ontem à meia-noite)
```

### **Filtro de eventos em andamento:**

```javascript
// Em /components/MyEventsPage.tsx, linha 27-30
const activeEvents = registrations.filter(
  (reg) =>
    new Date(reg.evento.dataInicio) <= now && 
    new Date(reg.evento.dataFim) >= now
);
```

Significa:
- ✅ `dataInicio <= agora` - Evento já começou
- ✅ `dataFim >= agora` - Evento ainda não terminou
- ✅ Ambos = Evento está **EM ANDAMENTO!**

---

## 🎉 RESULTADO ESPERADO

Após seguir todos os passos:

✅ Console mostra: `Active events: 1`  
✅ Aba "Em Andamento" tem badge: `(1)`  
✅ Evento aparece na tela  
✅ Card do evento é clicável  
✅ Informações corretas exibidas  

**Sistema funcionando perfeitamente!** 🚀

---

**Criado em:** 24/11/2025  
**Versão:** 1.0
