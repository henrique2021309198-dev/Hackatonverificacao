# 🔧 Correção: F5 Causa Carregamento Infinito

## 🐛 Problema

Ao recarregar a página (F5) em qualquer rota do sistema, a página fica carregando infinitamente.

---

## 🎯 Causa

Este é um problema comum em **Single Page Applications (SPAs)** com React Router. 

Quando você acessa `https://seusite.com/eventos` diretamente ou aperta F5:
1. O navegador pede ao servidor o arquivo `/eventos`
2. O servidor não encontra esse arquivo (só existe `index.html`)
3. O servidor retorna erro 404 ou fica carregando
4. O React Router nunca carrega

**Solução:** Configurar o servidor para SEMPRE retornar `index.html`, independente da rota.

---

## ✅ Soluções por Provedor

### **🔷 Vercel**

**Arquivo criado:** `/vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Como aplicar:**
1. O arquivo já está criado na raiz do projeto
2. Faça novo deploy:
   ```bash
   git add vercel.json
   git commit -m "fix: adiciona configuração de rewrites para SPA"
   git push
   ```
3. Vercel detectará automaticamente a configuração

---

### **🟢 Netlify**

**Arquivo criado:** `/netlify.toml`

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**OU usar:** `/public/_redirects`

```
/*    /index.html   200
```

**Como aplicar:**
1. Os arquivos já estão criados
2. Faça novo deploy:
   ```bash
   git add netlify.toml public/_redirects
   git commit -m "fix: adiciona configuração de redirects para SPA"
   git push
   ```
3. Netlify aplicará automaticamente

---

### **🌐 Apache (Hospedagem Tradicional)**

**Arquivo criado:** `/public/.htaccess`

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

**Como aplicar:**
1. O arquivo já está em `/public/.htaccess`
2. Faça build:
   ```bash
   npm run build
   ```
3. O arquivo será copiado para `dist/.htaccess`
4. Faça upload da pasta `dist` para seu servidor
5. Certifique-se que o mod_rewrite está habilitado

---

### **🟦 Nginx**

Se estiver usando Nginx, adicione ao seu `nginx.conf`:

```nginx
server {
  listen 80;
  server_name seusite.com;
  root /var/www/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

### **⚡ Render**

No painel do Render:
1. Vá em **Settings**
2. Em **Redirects/Rewrites**, adicione:
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Status:** `200 (Rewrite)`

---

### **🔵 GitHub Pages**

**Arquivo criado:** `/public/404.html`

Copie o conteúdo de `index.html` para `404.html`:

```bash
cp public/index.html public/404.html
```

Ou crie um script 404 personalizado.

---

## 🚀 Passo a Passo - Solução Rápida

### **1. Identifique seu provedor**

Onde está hospedado?
- Vercel → Use `vercel.json`
- Netlify → Use `netlify.toml` ou `_redirects`
- Apache → Use `.htaccess`
- Nginx → Configure nginx.conf
- Outro → Veja documentação do provedor

### **2. Arquivos já estão criados!**

Todos os arquivos necessários já foram criados automaticamente:
- ✅ `/vercel.json` - Para Vercel
- ✅ `/netlify.toml` - Para Netlify
- ✅ `/public/_redirects` - Para Netlify (alternativo)
- ✅ `/public/.htaccess` - Para Apache

### **3. Faça novo deploy**

```bash
# Adicione os arquivos
git add vercel.json netlify.toml public/_redirects public/.htaccess

# Commit
git commit -m "fix: adiciona configuração de SPA rewrites/redirects"

# Push
git push
```

### **4. Teste**

1. Aguarde o deploy completar
2. Acesse qualquer rota: `https://seusite.com/eventos`
3. Aperte F5
4. ✅ Deve carregar normalmente!

---

## 🔍 Verificação

### **Teste local (antes de fazer deploy)**

```bash
# Build
npm run build

# Preview
npm run preview
```

1. Acesse `http://localhost:4173/eventos`
2. Aperte F5
3. Deve funcionar!

### **Teste em produção**

1. Acesse `https://seusite.com`
2. Navegue até qualquer página
3. Aperte F5 ou copie a URL e abra em nova aba
4. ✅ Deve carregar sem problemas

---

## ⚠️ Importante

### **Para Vercel:**
- O `vercel.json` já configura tudo automaticamente
- Não precisa configurar nada no painel

### **Para Netlify:**
- Use `netlify.toml` (recomendado)
- OU `public/_redirects` (alternativo)
- Não use os dois ao mesmo tempo

### **Para Apache:**
- Certifique-se que `mod_rewrite` está habilitado
- O `.htaccess` deve estar na raiz da pasta `dist`

---

## 🐛 Ainda não funciona?

### **1. Limpe o cache do build**

```bash
rm -rf dist node_modules
npm install
npm run build
```

### **2. Verifique o console do navegador**

1. Abra DevTools (F12)
2. Vá em "Console"
3. Veja se há erros
4. Vá em "Network"
5. Recarregue e veja quais arquivos retornam 404

### **3. Verifique configuração do provedor**

**Vercel:**
- Vá em Settings → General
- Verifique se "Framework Preset" é "Vite"
- Output Directory: `dist`

**Netlify:**
- Vá em Site Settings → Build & Deploy
- Build command: `npm run build`
- Publish directory: `dist`

### **4. Teste com HashRouter (solução temporária)**

Se nada funcionar, edite `App.tsx`:

```tsx
// Antes (BrowserRouter)
import { BrowserRouter as Router } from 'react-router-dom';

// Depois (HashRouter - solução temporária)
import { HashRouter as Router } from 'react-router-dom';
```

**URLs ficarão:** `https://seusite.com/#/eventos`

Isso funciona sem configuração do servidor, mas as URLs ficam menos bonitas.

---

## 📋 Checklist Final

Após aplicar a correção:

- [ ] Arquivo de configuração criado (`vercel.json` ou `netlify.toml`)
- [ ] Commit e push feitos
- [ ] Deploy completado
- [ ] Teste na home: `https://seusite.com` → F5 → ✅ Funciona
- [ ] Teste em rota: `https://seusite.com/eventos` → F5 → ✅ Funciona
- [ ] Teste em rota profunda: `https://seusite.com/admin/eventos` → F5 → ✅ Funciona
- [ ] Sem erros no console
- [ ] Navegação funciona normalmente

---

## 📚 Mais Informações

- **React Router Docs:** https://reactrouter.com/en/main/start/faq#what-is-client-side-routing
- **Vercel SPA Docs:** https://vercel.com/docs/concepts/projects/project-configuration#rewrites
- **Netlify Redirects:** https://docs.netlify.com/routing/redirects/

---

## ✅ Resumo

**Problema:** F5 causa carregamento infinito  
**Causa:** Servidor não redireciona rotas para `index.html`  
**Solução:** Adicionar arquivo de configuração do provedor  
**Status:** ✅ Arquivos criados e prontos para uso  

**Próximo passo:** Fazer commit e push!

```bash
git add .
git commit -m "fix: configuração de SPA rewrites para todos os provedores"
git push
```

**🎉 Problema resolvido!**
