# ✅ Verificação Rápida do Projeto

Execute esta checklist para garantir que tudo está correto.

---

## 📁 Arquivos Essenciais

Execute no terminal:

```bash
# Verificar se todos os arquivos existem
ls -la index.html
ls -la src/main.tsx
ls -la App.tsx
ls -la package.json
ls -la vite.config.ts
ls -la tsconfig.json
ls -la tailwind.config.js
ls -la postcss.config.js
ls -la .env.example
ls -la .gitignore
```

**Todos devem existir!** ✅

---

## 🔧 Configuração

### 1. Variáveis de Ambiente

```bash
# Crie o arquivo .env
cp .env.example .env

# Edite e adicione suas credenciais
nano .env  # ou use seu editor favorito
```

Conteúdo do `.env`:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

### 2. Instalar Dependências

```bash
npm install
```

**Deve completar sem erros!** ✅

### 3. Testar Localmente

```bash
npm run dev
```

**Deve abrir em:** `http://localhost:5173` ✅

### 4. Build de Produção

```bash
npm run build
```

**Deve criar a pasta `dist`** ✅

### 5. Preview do Build

```bash
npm run preview
```

**Deve funcionar sem erros** ✅

---

## 🌐 Deploy

### Opção 1: Vercel

```bash
# Instale o CLI do Vercel
npm i -g vercel

# Faça deploy
vercel
```

**Configurações:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Variáveis de Ambiente no Dashboard:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Opção 2: Netlify

1. Conecte o repositório GitHub
2. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18
3. Adicione variáveis de ambiente

---

## 🗄️ Banco de Dados Supabase

```bash
# No Supabase SQL Editor, execute:
```

1. Criar tabelas (script no README.md)
2. Criar primeiro administrador (instruções no README.md)
3. Testar conexão no site

---

## ✅ Checklist Final

Antes de considerar pronto:

- [ ] `npm install` completa sem erros
- [ ] `npm run dev` funciona localmente
- [ ] Site abre em `http://localhost:5173`
- [ ] `npm run build` completa sem erros
- [ ] Pasta `dist` foi criada
- [ ] `npm run preview` funciona
- [ ] Login funciona
- [ ] Cadastro funciona
- [ ] Banco de dados configurado
- [ ] Primeiro admin criado
- [ ] Deploy realizado com sucesso
- [ ] Site abre no link de produção
- [ ] Variáveis de ambiente configuradas
- [ ] Sem erros no console do navegador

---

## 🐛 Se algo falhar

1. **Veja:** `TROUBLESHOOTING.md`
2. **Console:** Abra F12 e veja erros
3. **Logs:** Verifique logs do Supabase
4. **Rebuild:**
   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   ```

---

## 📊 Resultado Esperado

Após seguir todos os passos:

✅ Site funcionando localmente  
✅ Build sem erros  
✅ Deploy bem-sucedido  
✅ Site acessível via URL pública  
✅ Login e cadastro funcionando  
✅ Conexão com Supabase OK  

---

**🎉 Projeto pronto para uso!**
