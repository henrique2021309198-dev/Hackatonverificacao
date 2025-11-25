# 🚀 Guia Rápido de Setup

Este guia o ajudará a configurar o sistema em **menos de 10 minutos**.

---

## ✅ Checklist

- [ ] Node.js 18+ instalado
- [ ] Conta no Supabase criada
- [ ] Projeto Supabase criado
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados configurado
- [ ] Primeiro administrador criado

---

## 📋 Passo a Passo

### 1️⃣ Clonar e Instalar

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/sistema-eventos-academicos.git
cd sistema-eventos-academicos

# Instale as dependências
npm install
```

### 2️⃣ Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em **New Project**
4. Preencha:
   - **Name**: Nome do projeto (ex: eventos-academicos)
   - **Database Password**: Crie uma senha forte e guarde!
   - **Region**: Escolha a mais próxima (ex: South America)
5. Clique em **Create New Project** e aguarde ~2 minutos

### 3️⃣ Configurar Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais:

1. No Supabase, vá em **Settings** → **API**
2. Copie a **URL** do projeto
3. Copie a **anon public key**
4. Cole no arquivo `.env`:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4️⃣ Criar as Tabelas do Banco

1. No Supabase, vá em **SQL Editor** → **New Query**
2. Copie **TODO** o conteúdo do script SQL do `README.md`
3. Cole no editor
4. Clique em **RUN** ▶️
5. Aguarde a confirmação "Success"

### 5️⃣ Criar Primeiro Usuário Admin

#### Opção A: Via Dashboard (Recomendado)

**Passo 1**: Criar usuário no Auth
1. Vá em **Authentication** → **Users**
2. Clique em **Add User**
3. Preencha:
   - **Email**: admin@sistema.com
   - **Password**: Senha123!
   - **Auto Confirm User**: ✅ Marque esta opção
4. Clique em **Create User**
5. **COPIE o UUID** que aparece (exemplo: `a1b2c3d4-...`)

**Passo 2**: Adicionar na tabela usuarios
1. Vá em **SQL Editor** → **New Query**
2. Cole e adapte:

```sql
INSERT INTO usuarios (id, nome, email, perfil, perfil_academico)
VALUES (
  'uuid-copiado-do-passo-1',
  'Administrador do Sistema',
  'admin@sistema.com',
  'administrador',
  'Não Informado'
);
```

3. Clique em **RUN** ▶️

#### Opção B: Via SQL Direto

```sql
-- Crie um UUID manualmente
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@sistema.com',
  crypt('SuaSenhaAqui', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
) RETURNING id;

-- Use o UUID retornado acima
INSERT INTO usuarios (id, nome, email, perfil)
VALUES (
  'uuid-retornado-acima',
  'Admin Sistema',
  'admin@sistema.com',
  'administrador'
);
```

### 6️⃣ Configurar Auth (Opcional mas recomendado)

1. Vá em **Authentication** → **URL Configuration**
2. Configure:
   - **Site URL**: `http://localhost:5173` (desenvolvimento)
   - **Redirect URLs**: Adicione:
     - `http://localhost:5173/**`
     - Sua URL de produção (quando fazer deploy)

### 7️⃣ Iniciar o Sistema

```bash
npm run dev
```

Acesse: `http://localhost:5173`

### 8️⃣ Primeiro Login

1. Abra o sistema no navegador
2. Clique em "Entrar"
3. Use as credenciais do admin criado:
   - **Email**: admin@sistema.com
   - **Senha**: A senha que você definiu
4. ✅ Você deve ser redirecionado para o Dashboard!

---

## 🎉 Pronto!

Seu sistema está funcionando! Agora você pode:

- ✅ Criar eventos
- ✅ Gerenciar inscritos
- ✅ Gerar certificados
- ✅ Tudo mais!

---

## 🔍 Verificação de Problemas

### Erro: "Invalid API Key"
- ✅ Verifique se copiou as credenciais corretas
- ✅ Verifique se não há espaços extras no `.env`
- ✅ Reinicie o servidor de desenvolvimento (`Ctrl+C` e `npm run dev`)

### Erro: "User already registered"
- ✅ Use um email diferente
- ✅ Ou delete o usuário existente no Supabase

### Erro ao fazer login
- ✅ Verifique se marcou "Auto Confirm User" ao criar o usuário
- ✅ Verifique se o email e senha estão corretos
- ✅ Veja os logs do console do navegador (F12)

### Página em branco
- ✅ Abra o console do navegador (F12) e veja os erros
- ✅ Verifique se as variáveis de ambiente estão corretas
- ✅ Verifique se o Supabase está online

### "Failed to fetch" ou erros de rede
- ✅ Verifique sua conexão com internet
- ✅ Verifique se o Supabase está online (status.supabase.com)
- ✅ Verifique as configurações de CORS no Supabase

---

## 📱 Testando Funcionalidades

### Teste 1: Criar um Evento
1. Login como admin
2. Vá em "Gerenciar Eventos" → "Novo Evento"
3. Preencha os dados
4. Salve como "Publicado"
5. ✅ Deve aparecer na lista

### Teste 2: Criar um Participante
1. Faça logout
2. Clique em "Cadastrar"
3. Preencha os dados
4. Faça login com a nova conta
5. ✅ Deve ver a área do participante

### Teste 3: Inscrever-se em Evento
1. Como participante, vá na home
2. Veja um evento publicado
3. Clique em "Inscrever-se"
4. ✅ Deve aparecer em "Meus Eventos"

### Teste 4: Aprovar Inscrição
1. Login como admin
2. Vá em "Gerenciar Eventos"
3. Clique em "Ver Inscritos" no evento
4. Aprove a inscrição do participante
5. ✅ Status deve mudar

### Teste 5: Gerar Certificado
1. Como admin, na lista de inscritos
2. Registre presenças suficientes
3. Clique em "Gerar Certificado"
4. ✅ Certificado deve ser criado

### Teste 6: Baixar Certificado
1. Login como participante
2. Vá em "Meus Eventos"
3. Clique em "Baixar Certificado"
4. ✅ PDF deve ser gerado

---

## 🎯 Próximos Passos

- [ ] Explore todas as funcionalidades
- [ ] Configure um domínio personalizado (produção)
- [ ] Configure email notifications no Supabase
- [ ] Faça backup regular do banco de dados
- [ ] Configure CI/CD para deploys automáticos

---

## 📚 Documentação Adicional

- **README.md** - Documentação completa
- **COMO_FUNCIONAM_CERTIFICADOS.md** - Sistema de certificados
- **RESUMO_IMPLEMENTACAO.md** - Detalhes técnicos

---

## 💬 Precisa de Ajuda?

- 📖 Leia a documentação completa no README.md
- 🐛 Abra uma issue no GitHub
- 📧 Entre em contato com o suporte

---

**✨ Boa sorte com seu sistema de eventos! ✨**
