# 👤 Como Criar um Usuário Administrador

## 📋 Nomenclatura Correta

No banco de dados, o campo `perfil` na tabela `usuarios` aceita dois valores:

- ✅ **`'administrador'`** → Para usuários admin
- ✅ **`'participante'`** → Para usuários normais

⚠️ **IMPORTANTE:** Use **`administrador`** (com "dor" no final), NÃO "adm" ou "admin"!

---

## 🛠️ Método 1: Criar Admin via SQL (RECOMENDADO)

### Passo a Passo:

1. **Abra o Supabase:**
   - https://app.supabase.com → Seu Projeto
   - Vá em: **SQL Editor** → **New Query**

2. **Primeiro, crie o usuário no Auth:**

```sql
-- Substitua os valores abaixo pelos seus dados
-- ATENÇÃO: Guarde bem esta senha!

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@exemplo.com', -- MUDE AQUI: Seu email
  crypt('senha123', gen_salt('bf')), -- MUDE AQUI: Sua senha
  NOW(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NULL,
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Administrador"}',
  NULL,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL,
  false,
  NULL
)
RETURNING id;
```

3. **Copie o ID retornado** e use no próximo comando:

```sql
-- ATENÇÃO: Substitua 'SEU-UUID-AQUI' pelo ID retornado acima

INSERT INTO public.usuarios (
  id,
  nome,
  email,
  perfil,
  perfil_academico,
  criado_em
) VALUES (
  'SEU-UUID-AQUI', -- ID do usuário criado acima
  'Administrador', -- Nome do admin
  'admin@exemplo.com', -- Mesmo email usado acima
  'administrador', -- IMPORTANTE: use 'administrador'
  'Não Informado',
  NOW()
);
```

4. **Execute os comandos** (clique em RUN ou Ctrl+Enter)

5. **Pronto!** Agora você pode fazer login com:
   - Email: `admin@exemplo.com`
   - Senha: `senha123`
   - Tipo: **Administrador**

---

## 🛠️ Método 2: Criar via Interface (Mais Simples)

### Passo a Passo:

1. **Cadastre um usuário normal primeiro:**
   - Acesse o site
   - Clique em "Cadastre-se"
   - Preencha:
     - Nome: "Administrador"
     - Email: "admin@exemplo.com"
     - Perfil: "Superior-TSI" (qualquer um)
     - Senha: "senha123"
   - Clique em "Criar Conta"

2. **Transforme em Admin via SQL:**
   - Abra: https://app.supabase.com → Seu Projeto
   - Vá em: **SQL Editor** → **New Query**
   - Cole e execute:

```sql
-- Mude apenas o email para o que você cadastrou
UPDATE public.usuarios
SET perfil = 'administrador'
WHERE email = 'admin@exemplo.com';
```

3. **Pronto!** Faça login como administrador:
   - Email: `admin@exemplo.com`
   - Senha: `senha123`
   - Tipo: **Administrador**

---

## 🛠️ Método 3: Transformar Usuário Existente em Admin

Se você já tem um usuário cadastrado e quer torná-lo admin:

```sql
-- Substitua o email pelo do usuário que quer tornar admin
UPDATE public.usuarios
SET perfil = 'administrador'
WHERE email = 'seuemail@exemplo.com';
```

---

## ✅ Como Verificar se Deu Certo

### **Opção 1: Via SQL**

```sql
-- Listar todos os administradores
SELECT id, nome, email, perfil, criado_em
FROM public.usuarios
WHERE perfil = 'administrador';
```

### **Opção 2: Fazer Login**

1. Acesse o site
2. Clique em "Entrar"
3. Selecione tipo: **Administrador**
4. Digite email e senha
5. Se der certo, você verá o **Dashboard Administrativo** com:
   - Estatísticas de eventos
   - Menu lateral com: Dashboard, Eventos, Usuários, Configurações

---

## 🚨 Problemas Comuns

### **Erro: "Tipo de usuário incorreto"**

**Causa:** O perfil no banco não é `'administrador'`

**Solução:**
```sql
-- Verifique o perfil atual
SELECT email, perfil FROM public.usuarios WHERE email = 'seuemail@exemplo.com';

-- Se não for 'administrador', corrija:
UPDATE public.usuarios
SET perfil = 'administrador'
WHERE email = 'seuemail@exemplo.com';
```

### **Erro: "Credenciais inválidas"**

**Causa:** Email ou senha incorretos

**Solução:** Verifique se usou o email e senha corretos ao criar o usuário

---

## 📋 Resumo Rápido

**Para criar um ADMIN:**

1. ✅ Crie usuário normalmente pelo site
2. ✅ Execute este SQL no Supabase:

```sql
UPDATE public.usuarios
SET perfil = 'administrador'
WHERE email = 'seu-email@exemplo.com';
```

3. ✅ Faça login selecionando tipo: **Administrador**

**Valores do campo `perfil`:**
- ✅ `'administrador'` → Admin (acesso total)
- ✅ `'participante'` → Usuário normal

**NÃO use:** "adm", "admin", "Administrador" (com maiúscula), etc.

---

## 🎯 Pronto para Testar!

Agora você pode:
- ✅ Criar eventos
- ✅ Gerenciar inscrições
- ✅ Ver estatísticas
- ✅ Administrar o sistema completo

**Boa sorte! 🚀**
