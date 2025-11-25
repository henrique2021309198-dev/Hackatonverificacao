# 🔧 Troubleshooting - Problemas Comuns

## ❌ Site não carrega no publish

### **Problema 1: Página em branco**

**Causa:** Arquivos essenciais faltando ou configuração incorreta.

**Solução:**
1. Verifique se todos os arquivos essenciais existem:
   - ✅ `/index.html`
   - ✅ `/src/main.tsx`
   - ✅ `/vite.config.ts`
   - ✅ `/tsconfig.json`
   - ✅ `/package.json`

2. Verifique as variáveis de ambiente:
   ```bash
   # Crie o arquivo .env baseado no .env.example
   cp .env.example .env
   # Adicione suas credenciais do Supabase
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Teste localmente antes de fazer deploy:
   ```bash
   npm run dev
   ```

### **Problema 2: Erro de build**

**Causa:** Dependências faltando ou versão do Node incorreta.

**Solução:**
1. Use Node.js 18 ou superior:
   ```bash
   node --version  # Deve ser >= 18
   ```

2. Limpe e reinstale dependências:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Tente o build:
   ```bash
   npm run build
   ```

### **Problema 3: Variáveis de ambiente não funcionam**

**Causa:** Variáveis não estão prefixadas com `VITE_`.

**Solução:**
No Vite, todas as variáveis de ambiente devem começar com `VITE_`:

```env
# ✅ CORRETO
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...

# ❌ ERRADO
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
```

### **Problema 4: Imports não encontrados**

**Causa:** Paths incorretos ou arquivos na estrutura errada.

**Solução:**
Estrutura correta:
```
/
├── index.html
├── src/
│   └── main.tsx
├── App.tsx
├── components/
├── styles/
├── package.json
└── vite.config.ts
```

### **Problema 5: CSS não carrega**

**Causa:** Import do globals.css incorreto.

**Solução:**
No `/src/main.tsx`, use:
```tsx
import '../styles/globals.css';  // ✅ CORRETO
```

Não use:
```tsx
import './styles/globals.css';   // ❌ ERRADO
```

### **Problema 6: Deploy no Vercel/Netlify falha**

**Solução:**

**Para Vercel:**
1. Build Command: `npm run build`
2. Output Directory: `dist`
3. Install Command: `npm install`
4. Node Version: 18.x

**Para Netlify:**
1. Build Command: `npm run build`
2. Publish Directory: `dist`
3. Node Version: 18

Adicione variáveis de ambiente no dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### **Problema 7: Erros TypeScript**

**Solução:**
1. Verifique se o `tsconfig.json` existe
2. Execute:
   ```bash
   npm run build
   ```
3. Corrija os erros apontados

---

## 🔍 Checklist de Deploy

Antes de fazer deploy, verifique:

- [ ] `npm run build` passa sem erros
- [ ] `npm run preview` funciona localmente
- [ ] Variáveis de ambiente configuradas
- [ ] `.env` não está commitado (está no `.gitignore`)
- [ ] Todas as dependências no `package.json`
- [ ] Node.js versão >= 18
- [ ] Banco de dados Supabase configurado
- [ ] Primeiro administrador criado

---

## 📞 Ainda com problemas?

1. Abra o console do navegador (F12)
2. Veja os erros no console
3. Verifique a aba Network
4. Verifique os logs do Supabase
5. Abra uma issue no GitHub com:
   - Mensagem de erro completa
   - Print do console
   - Passos para reproduzir

---

## 🚀 Comandos Úteis

```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json dist
npm install

# Testar localmente
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Ver versão do Node
node --version

# Ver versão do npm
npm --version
```
