# 🚨 CORREÇÃO DE POLÍTICAS DE SEGURANÇA

## ❌ Problema Detectado

O Supabase está bloqueando operações no banco devido às políticas de **Row-Level Security (RLS)**.

**Erro:** `new row violates row-level security policy for table "usuarios"`

---

## ✅ Solução (3 passos simples)

### **Passo 1: Abrir SQL Editor**

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. No menu lateral, clique em: **SQL Editor**
4. Clique em: **New Query**

---

### **Passo 2: Executar Script de Correção**

1. Abra o arquivo: `/supabase-fix-auth.sql`
2. **Copie TODO o conteúdo**
3. **Cole no SQL Editor** do Supabase
4. Clique em **RUN** (ou pressione `Ctrl+Enter`)

---

### **Passo 3: Verificar se funcionou**

Após executar, você deve ver:

```
✅ RLS desabilitado em todas as tabelas!
✅ Agora você pode criar usuários e eventos normalmente!
```

E uma tabela mostrando:

| tablename        | rls_habilitado |
|------------------|----------------|
| certificados     | f              |
| eventos          | f              |
| participacoes    | f              |
| presencas_detalhes | f            |
| usuarios         | f              |

*(f = false = RLS desabilitado)*

---

## 🧪 Testar se funcionou

### **Teste 1: Criar usuário**

Tente criar uma nova conta no sistema. Deve funcionar sem erros.

### **Teste 2: Executar script de evento concluído**

1. Abra: `/CRIAR_EVENTO_CONCLUIDO_SIMPLES.sql`
2. Substitua `'SEU_EMAIL_AQUI'` pelo seu email
3. Execute no SQL Editor
4. Deve criar o evento sem erros

---

## 📖 O que o script faz?

O script **desabilita temporariamente** as políticas de segurança RLS em todas as tabelas do sistema:

- ✅ `usuarios` - Permite criar e atualizar usuários
- ✅ `eventos` - Permite criar e gerenciar eventos
- ✅ `participacoes` - Permite registrar inscrições
- ✅ `certificados` - Permite emitir certificados
- ✅ `presencas_detalhes` - Permite marcar presenças

---

## ⚠️ Importante para Produção

Para um **ambiente de produção**, você deveria:

1. **Reabilitar RLS:**
   ```sql
   ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
   ```

2. **Criar políticas específicas:**
   ```sql
   -- Exemplo: Usuários podem ver apenas seu próprio perfil
   CREATE POLICY "Usuarios veem apenas seu perfil"
   ON public.usuarios
   FOR SELECT
   USING (auth.uid() = id);
   
   -- Administradores podem ver todos
   CREATE POLICY "Admins veem todos usuarios"
   ON public.usuarios
   FOR SELECT
   USING (
     EXISTS (
       SELECT 1 FROM public.usuarios
       WHERE id = auth.uid() AND perfil = 'administrador'
     )
   );
   ```

3. **Documentação oficial:**
   - https://supabase.com/docs/guides/auth/row-level-security

---

## 🆘 Ainda com problemas?

### **Erro: "permission denied"**

Execute também:
```sql
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
```

### **Erro: "relation does not exist"**

Verifique se as tabelas existem:
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

### **Erro no trigger**

O sistema está configurado para criar usuários via trigger. Se o trigger falhar, o sistema tenta criar manualmente, mas precisa que o RLS esteja desabilitado.

---

## 📝 Resumo

| Ação | Status |
|------|--------|
| 1. Abrir SQL Editor | ⏳ Pendente |
| 2. Executar /supabase-fix-auth.sql | ⏳ Pendente |
| 3. Verificar resultado | ⏳ Pendente |
| 4. Testar cadastro | ⏳ Pendente |
| 5. Criar evento concluído | ⏳ Pendente |

---

**Após executar o script, volte aqui e me avise se funcionou!** ✅
