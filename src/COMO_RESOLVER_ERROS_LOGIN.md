# 🚨 RESOLVER ERROS DE LOGIN - GUIA DEFINITIVO

## ⚡ Solução Rápida (5 Minutos)

Você está vendo estes erros?
```
❌ Erro no login (Auth): AuthApiError: Email not confirmed
❌ Erro no login (Auth): AuthApiError: Invalid login credentials
```

### ✅ Siga este passo a passo:

---

## 📋 PASSO 1: Execute o Script de Correção

### **1.1 Abra o SQL Editor do Supabase**
- https://app.supabase.com
- Selecione seu projeto
- Menu lateral → **SQL Editor**
- Clique em **New Query**

### **1.2 Cole TODO o conteúdo do arquivo:**
- Abra o arquivo: `/FIX_EMAIL_CONFIRMACAO.sql`
- Copie TODO o conteúdo
- Cole no SQL Editor
- Clique em **RUN** (ou Ctrl+Enter)

### **1.3 Aguarde os logs de sucesso:**
```
✅ Usuário teste@exemplo.com criado com sucesso!
✅ Admin admin@exemplo.com criado com sucesso!
```

---

## 📋 PASSO 2: Desabilite a Confirmação de Email

### **2.1 Abra as configurações de Auth**
- Supabase Dashboard → **Authentication**
- Clique em **Providers**
- Procure por **Email** e clique para expandir

### **2.2 Desabilite a confirmação**
- Desmarque: **"Enable email confirmations"**
- OU mude: **"Confirm email"** para **Disabled/OFF**
- Clique em **Save** ou **Update**

**Isso garante que novos usuários não precisarão confirmar email.**

---

## 📋 PASSO 3: Teste o Login

### **3.1 Limpe o cache do navegador**
- Pressione: `Ctrl + Shift + Delete`
- Ou F12 → Console → cole:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### **3.2 Tente fazer login com:**

**Usuário Participante:**
- Email: `teste@exemplo.com`
- Senha: `senha123`
- Tipo: **Participante**

**OU**

**Administrador:**
- Email: `admin@exemplo.com`
- Senha: `senha123`
- Tipo: **Administrador**

### **3.3 Verifique os logs no console (F12):**

**✅ Login bem-sucedido:**
```
🔐 Tentando fazer login: {email: "teste@exemplo.com", tipo: "participante"}
✅ Autenticação bem-sucedida. ID do usuário: ...
✅ Usuário encontrado: {nome: "Teste Participante", perfil: "participante"}
✅ Login bem-sucedido!
```

**❌ Se ainda houver erro, vá para o PASSO 4**

---

## 📋 PASSO 4: Verificações Adicionais

### **4.1 Verificar se os usuários foram criados**

Execute no SQL Editor:

```sql
-- Ver todos os usuários
SELECT 
  u.nome,
  u.email,
  u.perfil,
  CASE 
    WHEN au.email_confirmed_at IS NOT NULL THEN '✅ Confirmado' 
    ELSE '❌ NÃO CONFIRMADO' 
  END as status_email
FROM public.usuarios u
JOIN auth.users au ON u.id = au.id
ORDER BY u.criado_em DESC;
```

**Resultado esperado:**
| nome | email | perfil | status_email |
|------|-------|--------|--------------|
| Administrador | admin@exemplo.com | administrador | ✅ Confirmado |
| Teste Participante | teste@exemplo.com | participante | ✅ Confirmado |

**Se aparecer "❌ NÃO CONFIRMADO", execute:**

```sql
UPDATE auth.users
SET email_confirmed_at = NOW();
```

### **4.2 Verificar se há usuários órfãos**

Usuários órfãos são aqueles que existem no `auth.users` mas não no `public.usuarios`:

```sql
-- Encontrar usuários órfãos
SELECT au.id, au.email, au.created_at
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE u.id IS NULL;
```

**Se encontrar algum, sincronize com:**

```sql
-- Sincronizar usuários órfãos
DO $$
DECLARE usuario_record RECORD;
BEGIN
    FOR usuario_record IN 
        SELECT au.id, au.email, au.raw_user_meta_data
        FROM auth.users au
        LEFT JOIN public.usuarios u ON au.id = u.id
        WHERE u.id IS NULL
    LOOP
        INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
        VALUES (
            usuario_record.id,
            COALESCE(usuario_record.raw_user_meta_data->>'full_name', 'Usuário'),
            usuario_record.email,
            'participante',
            'Não Informado',
            NOW()
        );
        RAISE NOTICE 'Sincronizado: %', usuario_record.email;
    END LOOP;
END $$;
```

### **4.3 Verificar políticas de segurança (RLS)**

```sql
-- Ver políticas da tabela usuarios
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'usuarios';
```

**Deve retornar pelo menos estas políticas:**
- Usuários podem ver seu próprio perfil
- Usuários podem inserir seu próprio perfil
- Admins podem ver todos os usuários

**Se não retornar nada, você precisa criar as políticas.**

---

## 🔧 Troubleshooting Avançado

### **Erro: "Email not confirmed"**

**Causa:** Email não foi confirmado no banco de dados

**Solução:**
```sql
-- Confirmar email específico
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'seuemail@exemplo.com';

-- OU confirmar TODOS
UPDATE auth.users
SET email_confirmed_at = NOW();
```

### **Erro: "Invalid login credentials"**

**Causas possíveis:**
1. Senha incorreta
2. Email não existe
3. Usuário existe no auth.users mas não no public.usuarios

**Solução 1: Verificar se usuário existe**
```sql
SELECT id, email FROM auth.users WHERE email = 'seuemail@exemplo.com';
SELECT id, email FROM public.usuarios WHERE email = 'seuemail@exemplo.com';
```

**Solução 2: Resetar senha**
```sql
UPDATE auth.users
SET encrypted_password = crypt('senha123', gen_salt('bf'))
WHERE email = 'seuemail@exemplo.com';
```

**Solução 3: Criar usuário faltante no public.usuarios**
```sql
INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
SELECT id, 'Nome do Usuário', email, 'participante', 'Não Informado', NOW()
FROM auth.users
WHERE email = 'seuemail@exemplo.com';
```

### **Erro: "Tipo de usuário incorreto"**

**Causa:** Você selecionou "Administrador" mas o usuário é "participante" (ou vice-versa)

**Solução:** Selecione o tipo correto na tela de login

**OU transforme em admin:**
```sql
UPDATE public.usuarios
SET perfil = 'administrador'
WHERE email = 'seuemail@exemplo.com';
```

---

## 📚 Arquivos de Ajuda

- **`/FIX_EMAIL_CONFIRMACAO.sql`** → Script completo de correção (EXECUTE PRIMEIRO!)
- **`/DESABILITAR_CONFIRMACAO_EMAIL.md`** → Como desabilitar confirmação
- **`/SOLUCAO_ERRO_LOGIN.md`** → Guia completo de troubleshooting
- **`/TESTE_LOGIN_RAPIDO.md`** → Scripts rápidos de teste
- **`/CRIAR_USUARIO_ADMIN.md`** → Como criar administradores

---

## ✅ Checklist Final

Antes de testar novamente:

- [ ] Executei o script `/FIX_EMAIL_CONFIRMACAO.sql`
- [ ] Vi as mensagens de sucesso no SQL Editor
- [ ] Desabilitei confirmação de email no Dashboard
- [ ] Limpei cache do navegador
- [ ] Verifiquei que os usuários existem (SQL)
- [ ] Todos os emails estão confirmados
- [ ] Não há usuários órfãos
- [ ] Reiniciei o servidor de dev (`npm run dev`)

---

## 🎉 Resultado Esperado

**Após seguir todos os passos:**

1. ✅ Login com `teste@exemplo.com` / `senha123` funciona
2. ✅ Login com `admin@exemplo.com` / `senha123` funciona
3. ✅ Console mostra logs detalhados com ✅ e 🔐
4. ✅ Sem erros de "Email not confirmed"
5. ✅ Sem erros de "Invalid login credentials"
6. ✅ Redirecionamento correto após login

---

## 🆘 Ainda não funcionou?

1. **Verifique o console do navegador (F12)**
   - Procure por mensagens com ❌
   - Anote o erro exato

2. **Verifique os dados no banco:**
   ```sql
   -- Este query mostra TUDO sobre um usuário
   SELECT 
     au.id,
     au.email,
     au.email_confirmed_at,
     u.nome,
     u.perfil,
     u.perfil_academico
   FROM auth.users au
   FULL OUTER JOIN public.usuarios u ON au.id = u.id
   WHERE au.email = 'seuemail@exemplo.com';
   ```

3. **Recrie o usuário do zero:**
   ```sql
   -- Deletar tudo (CUIDADO!)
   DELETE FROM public.usuarios WHERE email = 'teste2@exemplo.com';
   DELETE FROM auth.users WHERE email = 'teste2@exemplo.com';
   
   -- Criar novamente
   DO $$
   DECLARE novo_id uuid;
   BEGIN
       INSERT INTO auth.users (
           instance_id, id, aud, role, email, encrypted_password,
           email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
           created_at, updated_at, confirmation_token, email_change,
           email_change_token_new, recovery_token
       ) VALUES (
           '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
           'authenticated', 'authenticated', 'teste2@exemplo.com',
           crypt('senha123', gen_salt('bf')), NOW(),
           '{"provider":"email","providers":["email"]}',
           '{"full_name":"Teste 2"}',
           NOW(), NOW(), '', '', '', ''
       ) RETURNING id INTO novo_id;
       
       INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
       VALUES (novo_id, 'Teste 2', 'teste2@exemplo.com', 'participante', 'Superior-TSI', NOW());
   END $$;
   ```

---

**Pronto! Agora o login DEVE funcionar! 🚀**

**Se ainda houver problemas, compartilhe:**
1. A mensagem de erro EXATA do console
2. O resultado do SQL de verificação
3. Print da tela de configuração do Auth
