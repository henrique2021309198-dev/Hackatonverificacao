# 🚀 Instruções de Deploy - Correção F5

## ⚡ Problema Atual

Site está publicado mas ao apertar **F5** (recarregar página), fica carregando infinitamente.

---

## ✅ Solução Imediata

Já criei todos os arquivos necessários! Você só precisa fazer commit e push:

```bash
# 1. Adicionar arquivos de configuração
git add vercel.json netlify.toml public/_redirects public/.htaccess

# 2. Commit
git commit -m "fix: adiciona configuração de SPA rewrites para resolver problema do F5"

# 3. Push
git push
```

**Aguarde o deploy automático completar (1-2 minutos)**

---

## 📁 Arquivos Criados

Estes arquivos já foram criados automaticamente:

### **Para Vercel** (recomendado)
- ✅ `/vercel.json` - Configura rewrites automáticos

### **Para Netlify**
- ✅ `/netlify.toml` - Configura redirects
- ✅ `/public/_redirects` - Alternativa simples

### **Para Apache/Hospedagem Tradicional**
- ✅ `/public/.htaccess` - Regras de rewrite

---

## 🔍 Como Funciona

### **O Problema:**
1. Você acessa `https://seusite.com/eventos`
2. Aperta F5
3. Navegador pede ao servidor: "me dê o arquivo `/eventos`"
4. Servidor não tem esse arquivo (só tem `index.html`)
5. Servidor retorna 404 ou fica carregando ❌

### **A Solução:**
1. Arquivos de configuração dizem ao servidor:
   - "Para QUALQUER rota, sempre retorne `index.html`"
2. O `index.html` carrega o React
3. React Router detecta a URL e mostra a página correta ✅

---

## 📋 Passo a Passo Completo

### **1. Commit os arquivos** (se ainda não fez)

```bash
git status  # Ver quais arquivos foram modificados

git add .  # Adicionar todos

git commit -m "fix: configuração de SPA rewrites para todos os provedores"

git push
```

### **2. Aguarde deploy**

- **Vercel:** 1-2 minutos
- **Netlify:** 1-3 minutos
- **Outros:** Varia

### **3. Teste**

Após deploy completar:

```
1. Acesse: https://seusite.com
2. Clique em qualquer página (ex: Eventos)
3. Aperte F5
4. ✅ Deve carregar normalmente!
```

---

## ⚙️ Configuração por Provedor

### **🔷 Vercel**

**Arquivo:** `/vercel.json`

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

✅ **Automático!** Só fazer push.

---

### **🟢 Netlify**

**Arquivo:** `/netlify.toml`

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

✅ **Automático!** Só fazer push.

**OU use:** `/public/_redirects`
```
/*    /index.html   200
```

---

### **🌐 Apache**

**Arquivo:** `/public/.htaccess`

Será copiado para `dist/.htaccess` automaticamente no build.

Certifique-se que `mod_rewrite` está habilitado no servidor.

---

## 🧪 Testar Localmente

Antes de fazer deploy, teste:

```bash
# 1. Build
npm run build

# 2. Preview (simula produção)
npm run preview

# 3. Teste
# Acesse: http://localhost:4173/eventos
# Aperte F5
# Deve funcionar!
```

---

## ⚠️ Importante

### **Variáveis de Ambiente**

Certifique-se que configurou no painel do provedor:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica
```

### **Build Settings**

**Vercel/Netlify:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Node Version: 18

---

## 🐛 Ainda não funciona?

### **1. Limpe cache do build**

No painel do Vercel/Netlify:
- Vá em Deployments
- Clique em "Redeploy"
- Marque "Clear cache and redeploy"

### **2. Verifique logs do deploy**

Veja se o build completou sem erros:
- Vercel: Deployments → Clique no deploy → Veja logs
- Netlify: Deploys → Clique no deploy → Veja logs

### **3. Verifique console do navegador**

1. Abra DevTools (F12)
2. Vá em "Console"
3. Recarregue a página
4. Veja se há erros

### **4. Teste diferentes rotas**

```
https://seusite.com/             → F5 → Deve funcionar
https://seusite.com/eventos      → F5 → Deve funcionar
https://seusite.com/admin        → F5 → Deve funcionar
```

---

## 📚 Guia Completo

Para informações detalhadas, leia:

- 📄 **[FIX_F5_RELOAD.md](FIX_F5_RELOAD.md)** - Guia completo do problema
- 🔧 **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Outros problemas
- ✅ **[VERIFICACAO.md](VERIFICACAO.md)** - Checklist completo

---

## ✅ Checklist Final

Após fazer push:

- [ ] Commit dos arquivos de configuração feito
- [ ] Push para o GitHub realizado
- [ ] Deploy automático completou
- [ ] Site abre normalmente
- [ ] F5 na home funciona
- [ ] F5 em `/eventos` funciona
- [ ] F5 em rotas do admin funciona
- [ ] Navegação funciona normalmente
- [ ] Sem erros no console

---

## 🎉 Resumo

**Problema:** F5 causa carregamento infinito  
**Causa:** Servidor não redireciona rotas para index.html  
**Solução:** Arquivos de configuração criados  
**Ação necessária:** Commit e push  

```bash
git add vercel.json netlify.toml public/_redirects public/.htaccess
git commit -m "fix: configuração SPA rewrites"
git push
```

**Tempo:** 2-5 minutos  
**Dificuldade:** Fácil ⭐  

---

**🚀 Faça o push e o problema será resolvido!**
