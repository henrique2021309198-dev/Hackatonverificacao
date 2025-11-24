# 🔧 Solução: Erro de Login

## ✅ Problemas Corrigidos

1. **Multiple GoTrueClient instances** → Agora usando singleton pattern
2. **Invalid login credentials** → Mensagens de erro mais claras

---

## 🔍 Por Que o Erro "Invalid login credentials"?

Este erro acontece quando:

1. ❌ O usuário **não existe** no banco de dados
2. ❌ A **senha está incorreta**
3. ❌ O email **não foi confirmado** (se a confirmação estiver habilitada)
4. ❌ O usuário foi criado mas **não está na tabela `usuarios`**

---

## ✅ Soluções Rápidas

### **Solução 1: Criar Usuário de Teste**

#### **Passo 1: Cadastre um usuário pelo site**

1. Acesse o site → Clique em "Cadastre-se"
2. Preencha:
   - Nome: "Teste Participante"
   - Email: "teste@exemplo.com"
   - Perfil: "Superior-TSI"
   - Senha: "senha123"
3. Clique em "Criar Conta"

#### **Passo 2: Verifique se foi criado**

Abra o SQL Editor do Supabase e execute:

```sql
-- Ver se o usuário existe no Auth
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
WHERE email = 'teste@exemplo.com';

-- Ver se o usuário existe na tabela usuarios
SELECT id, nome, email, perfil
FROM public.usuarios
WHERE email = 'teste@exemplo.com';
```

#### **Passo 3: Se não existir na tabela `usuarios`, crie manualmente**

```sql
-- Pegar o ID do auth.users (copie o UUID retornado acima)
INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
VALUES (
  'UUID-DO-AUTH-USERS', -- Cole o ID aqui
  'Teste Participante',
  'teste@exemplo.com',
  'participante',
  'Superior-TSI',
  NOW()
);
```

#### **Passo 4: Faça login**

- Email: `teste@exemplo.com`
- Senha: `senha123`
- Tipo: **Participante**

---

### **Solução 2: Criar Administrador**

Siga as instruções do arquivo `/CRIAR_USUARIO_ADMIN.md`

**Resumo rápido:**

```sql
-- 1. Cadastre um usuário normal pelo site
-- 2. Execute este SQL:

UPDATE public.usuarios
SET perfil = 'administrador'
WHERE email = 'admin@exemplo.com';
```

---

### **Solução 3: Resetar Senha**

Se você esqueceu a senha ou acha que está incorreta:

#### **Método 1: Pelo Supabase Dashboard**

1. Abra: https://app.supabase.com → Seu Projeto
2. Vá em: **Authentication** → **Users**
3. Encontre o usuário
4. Clique nos 3 pontinhos → **Send password reset email**

#### **Método 2: Criar Nova Senha via SQL**

⚠️ **Cuidado:** Isso cria uma nova senha diretamente

```sql
-- Resetar senha para "senha123"
-- IMPORTANTE: Mude 'teste@exemplo.com' para o email do usuário

UPDATE auth.users
SET encrypted_password = crypt('senha123', gen_salt('bf'))
WHERE email = 'teste@exemplo.com';
```

Agora faça login com a senha: `senha123`

---

### **Solução 4: Verificar Confirmação de Email**

Se o erro for "Email not confirmed", você tem duas opções:

#### **Opção A: Desabilitar Confirmação de Email (RECOMENDADO)**

1. Abra: https://app.supabase.com → Seu Projeto
2. Vá em: **Authentication** → **Settings** → **Email Auth**
3. Desmarque: **Enable email confirmations**
4. Salve as alterações

#### **Opção B: Confirmar Email Manualmente**

```sql
-- Confirmar email de um usuário específico
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'teste@exemplo.com';
```

---

## 🔧 Verificações Importantes

### **1. Verificar se o usuário existe**

```sql
-- Verificar auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'seuemail@exemplo.com';

-- Verificar public.usuarios
SELECT 
  id,
  nome,
  email,
  perfil,
  criado_em
FROM public.usuarios
WHERE email = 'seuemail@exemplo.com';
```

**Resultado esperado:** Deve retornar 1 linha em cada query, com o **mesmo ID** (UUID)

### **2. Verificar políticas de segurança (RLS)**

```sql
-- Ver políticas da tabela usuarios
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'usuarios';
```

Se não retornar nenhuma política, você precisa criar as políticas. Execute o script `/supabase-fix-auth.sql`

### **3. Limpar cache do navegador**

Às vezes o problema é cache:

1. Abra o Console do Navegador (F12)
2. Clique com botão direito no ícone de reload → **Empty Cache and Hard Reload**
3. Ou use: Ctrl+Shift+Delete → Limpar cookies e cache

---

## 🎯 Teste Completo: Criar Usuário e Fazer Login

### **Script SQL Completo:**

```sql
-- ==========================================
-- TESTE COMPLETO: CRIAR PARTICIPANTE
-- ==========================================

-- 1. Criar usuário no auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'teste.participante@exemplo.com',
  crypt('senha123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Teste Participante"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
)
RETURNING id;

-- 2. Copie o UUID retornado acima e use aqui:
-- (Substitua 'UUID-AQUI' pelo ID retornado)

INSERT INTO public.usuarios (id, nome, email, perfil, perfil_academico, criado_em)
VALUES (
  'UUID-AQUI', -- Cole o ID aqui
  'Teste Participante',
  'teste.participante@exemplo.com',
  'participante',
  'Superior-TSI',
  NOW()
);

-- 3. Verificar se foi criado
SELECT u.id, u.nome, u.email, u.perfil, au.email_confirmed_at
FROM public.usuarios u
JOIN auth.users au ON u.id = au.id
WHERE u.email = 'teste.participante@exemplo.com';

-- ✅ Agora faça login com:
-- Email: teste.participante@exemplo.com
-- Senha: senha123
-- Tipo: Participante
```

---

## 🚨 Ainda Com Problemas?

### **Verifique o Console do Navegador (F12)**

Procure por:

- ✅ Logs com emoji 🔐, ✅, ❌
- ❌ Erros em vermelho
- ⚠️ Warnings em amarelo

**Os logs agora são MUITO mais detalhados!**

Exemplo de log de sucesso:
```
🔐 Tentando fazer login: {email: "teste@exemplo.com", tipo: "participante"}
✅ Autenticação bem-sucedida. ID do usuário: abc-123-def
✅ Usuário encontrado: {nome: "Teste", perfil: "participante"}
✅ Login bem-sucedido!
```

Exemplo de log de erro:
```
🔐 Tentando fazer login: {email: "teste@exemplo.com", tipo: "participante"}
❌ Erro no login (Auth): Invalid login credentials
```

---

## 📋 Checklist Final

Antes de fazer login, verifique:

- [ ] Usuário existe no `auth.users`
- [ ] Usuário existe no `public.usuarios`
- [ ] Os IDs são iguais nas duas tabelas
- [ ] Email está confirmado (`email_confirmed_at` não é null) OU confirmação desabilitada
- [ ] Perfil correto: `participante` ou `administrador`
- [ ] Senha correta (se esqueceu, resete via SQL)
- [ ] Cache do navegador limpo
- [ ] Selecionou o tipo correto de login (Participante ou Administrador)

---

## ✅ Resultado Esperado

Após seguir estas instruções:

1. ✅ Warnings de "Multiple GoTrueClient" devem sumir
2. ✅ Login deve funcionar com mensagens claras
3. ✅ Console mostrará logs detalhados do processo
4. ✅ Você será redirecionado para a tela correta (Dashboard Admin ou Área do Usuário)

**Agora tente fazer login! 🚀**
