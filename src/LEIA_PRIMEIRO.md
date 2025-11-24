# 🚀 SISTEMA DE EVENTOS ACADÊMICOS - GUIA RÁPIDO

## ⚡ PROBLEMAS DE LOGIN? LEIA ISTO PRIMEIRO!

Se você está vendo erros como:
- ❌ `Email not confirmed`
- ❌ `Invalid login credentials`
- ❌ `Tipo de usuário incorreto`

**👉 SOLUÇÃO RÁPIDA: Siga estas 3 etapas**

---

## 📋 ETAPA 1: Execute o Script de Correção (2 minutos)

1. **Abra o Supabase:**
   - https://app.supabase.com → Seu Projeto
   - Menu lateral → **SQL Editor** → **New Query**

2. **Cole o conteúdo de `/FIX_EMAIL_CONFIRMACAO.sql`**
   - Abra o arquivo e copie TODO o conteúdo
   - Cole no SQL Editor
   - Clique em **RUN** (Ctrl+Enter)

3. **Aguarde as mensagens de sucesso:**
   ```
   ✅ Usuário teste@exemplo.com criado com sucesso!
   ✅ Admin admin@exemplo.com criado com sucesso!
   ```

**Esse script faz:**
- ✅ Confirma todos os emails existentes
- ✅ Sincroniza usuários entre auth.users e public.usuarios
- ✅ Cria usuário de teste: `teste@exemplo.com` / `senha123`
- ✅ Cria admin: `admin@exemplo.com` / `senha123`

---

## 📋 ETAPA 2: Desabilite Confirmação de Email (1 minuto)

1. **Supabase Dashboard** → **Authentication** → **Providers**
2. Clique em **Email** (para expandir)
3. **Desmarque:** "Enable email confirmations"
4. Clique em **Save**

**Por quê?** Isso evita que novos cadastros precisem confirmar email.

---

## 📋 ETAPA 3: Teste o Login (1 minuto)

1. **Limpe o cache:**
   - F12 → Console → cole:
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

2. **Faça login com:**

   **Participante:**
   - Email: `teste@exemplo.com`
   - Senha: `senha123`
   - Tipo: **Participante**

   **Administrador:**
   - Email: `admin@exemplo.com`
   - Senha: `senha123`
   - Tipo: **Administrador**

3. **Verifique o console (F12):**
   ```
   🔐 Tentando fazer login...
   ✅ Autenticação bem-sucedida...
   ✅ Usuário encontrado...
   ✅ Login bem-sucedido!
   ```

---

## ✅ Pronto! Login Funcionando!

Agora você pode:
- ✅ Fazer login como participante ou admin
- ✅ Criar novos usuários sem confirmação de email
- ✅ Ver logs detalhados no console

---

## 📚 Guias Detalhados

Se ainda houver problemas ou quiser entender melhor:

| Arquivo | Descrição |
|---------|-----------|
| **`/COMO_RESOLVER_ERROS_LOGIN.md`** | 🚨 Guia completo de troubleshooting |
| **`/FIX_EMAIL_CONFIRMACAO.sql`** | ⚡ Script SQL de correção (EXECUTE PRIMEIRO!) |
| **`/DESABILITAR_CONFIRMACAO_EMAIL.md`** | 🔧 Como desabilitar confirmação de email |
| **`/CRIAR_USUARIO_ADMIN.md`** | 👑 Como criar administradores |
| **`/TESTE_LOGIN_RAPIDO.md`** | ⚡ Scripts rápidos para teste |
| **`/SOLUCAO_ERRO_LOGIN.md`** | 🔍 Soluções para erros específicos |
| **`/criar-admin-simples.sql`** | 📝 SQL para transformar usuário em admin |

---

## 🎯 Funcionalidades do Sistema

### **Área do Participante:**
- 📅 Ver e se inscrever em eventos
- 💳 Sistema de pagamento via PIX
- 🎓 Meus Eventos e Certificados
- 👤 Perfil do usuário

### **Área do Administrador:**
- 📊 Dashboard com estatísticas
- ✏️ Criar e gerenciar eventos
- 👥 Gerenciar usuários e inscrições
- ✅ Confirmar pagamentos
- 🎓 Emitir certificados

---

## 🛠️ Tecnologias Utilizadas

- ⚛️ React + TypeScript
- 🎨 Tailwind CSS + Shadcn/ui
- 🗄️ Supabase (Auth + Database)
- 🔐 Row Level Security (RLS)
- 📱 Design Responsivo

---

## 🗂️ Estrutura do Banco de Dados

### **Tabelas:**
- `usuarios` - Dados dos usuários (participantes e admins)
- `eventos` - Eventos acadêmicos
- `participacoes` - Inscrições em eventos
- `certificados` - Certificados emitidos
- `presencas_detalhes` - Controle de presença

### **Perfis de Usuário:**
- `participante` - Usuário normal
- `administrador` - Usuário com acesso administrativo

**IMPORTANTE:** Use `'administrador'` (completo), não "adm" ou "admin"!

---

## 🔐 Segurança

O sistema utiliza:
- ✅ Supabase Auth para autenticação
- ✅ Row Level Security (RLS) para controle de acesso
- ✅ Políticas de segurança por perfil
- ✅ Email confirmado automaticamente (desenvolvimento)
- ⚠️ Para produção: habilitar confirmação de email + SMTP

---

## 🚀 Como Executar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone [seu-repo]
   cd [pasta-do-projeto]
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o Supabase:**
   - Crie um projeto no Supabase
   - Copie as credenciais para `/utils/supabase/info.tsx`
   - Execute o script SQL de setup

4. **Execute o projeto:**
   ```bash
   npm run dev
   ```

5. **Acesse:**
   - http://localhost:5173 (ou a porta mostrada)

---

## 📝 Tarefas Comuns

### **Criar um Administrador:**
```sql
UPDATE public.usuarios
SET perfil = 'administrador'
WHERE email = 'seuemail@exemplo.com';
```

### **Resetar Senha:**
```sql
UPDATE auth.users
SET encrypted_password = crypt('senha123', gen_salt('bf'))
WHERE email = 'seuemail@exemplo.com';
```

### **Confirmar Email:**
```sql
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'seuemail@exemplo.com';
```

### **Ver Todos os Usuários:**
```sql
SELECT u.nome, u.email, u.perfil,
  CASE WHEN au.email_confirmed_at IS NOT NULL 
    THEN '✅' ELSE '❌' END as confirmado
FROM public.usuarios u
JOIN auth.users au ON u.id = au.id
ORDER BY u.criado_em DESC;
```

---

## 🆘 Suporte

**Problemas comuns já resolvidos:**
- ✅ Multiple GoTrueClient instances
- ✅ Email not confirmed
- ✅ Invalid login credentials
- ✅ Tipo de usuário incorreto
- ✅ Usuários órfãos (auth.users sem public.usuarios)

**Se encontrar um problema novo:**
1. Verifique o console do navegador (F12)
2. Procure os logs com 🔐, ✅, ❌
3. Consulte `/COMO_RESOLVER_ERROS_LOGIN.md`
4. Execute `/FIX_EMAIL_CONFIRMACAO.sql`

---

## 📅 Próximas Features

- [ ] Upload de imagens para eventos
- [ ] Geração automática de certificados em PDF
- [ ] Sistema de notificações
- [ ] QR Code para check-in
- [ ] Exportação de relatórios
- [ ] Integração com Google Calendar

---

## 🎯 Status do Projeto

- ✅ Sistema de autenticação funcionando
- ✅ CRUD de eventos completo
- ✅ Sistema de inscrições
- ✅ Dashboard administrativo
- ✅ Perfil do usuário
- ✅ Design responsivo
- ⚠️ Geração de certificados (em desenvolvimento)
- ⚠️ Pagamentos PIX (em desenvolvimento)

---

## 🔥 ATENÇÃO: Problemas Conhecidos

### **1. Email not confirmed**
**Status:** ✅ RESOLVIDO
**Solução:** Execute `/FIX_EMAIL_CONFIRMACAO.sql`

### **2. Invalid login credentials**
**Status:** ✅ RESOLVIDO
**Solução:** Execute `/FIX_EMAIL_CONFIRMACAO.sql`

### **3. Multiple GoTrueClient**
**Status:** ✅ RESOLVIDO
**Solução:** Implementado singleton pattern

---

## ✅ Checklist Antes de Começar

- [ ] Executei `/FIX_EMAIL_CONFIRMACAO.sql` no Supabase
- [ ] Desabilitei confirmação de email no Dashboard
- [ ] Limpei o cache do navegador
- [ ] Testei login com `teste@exemplo.com` / `senha123`
- [ ] Testei login com `admin@exemplo.com` / `senha123`
- [ ] Vi os logs de sucesso no console (F12)
- [ ] Li este arquivo completamente 😊

---

**Pronto! Você está preparado para usar o sistema! 🎉**

**Dúvidas? Consulte os guias na pasta raiz do projeto!**
