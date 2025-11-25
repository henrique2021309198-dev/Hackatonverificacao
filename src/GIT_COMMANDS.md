# 📝 Comandos Git - Quick Reference

Guia rápido para subir o projeto no GitHub.

---

## 🚀 Primeira vez (Novo Repositório)

### **1. Criar Repositório no GitHub**
1. Acesse: https://github.com/new
2. Nome: `sistema-eventos-academicos` (ou o que preferir)
3. Descrição: Sistema de gerenciamento de eventos acadêmicos
4. Público ou Privado: Escolha conforme necessário
5. **NÃO** marque "Add a README file"
6. Clique em "Create repository"

### **2. Inicializar e Subir**

```bash
# 1. Navegue até a pasta do projeto
cd /caminho/do/projeto

# 2. Inicialize o repositório Git (se ainda não foi)
git init

# 3. Adicione todos os arquivos
git add .

# 4. Faça o primeiro commit
git commit -m "feat: implementação completa do sistema de eventos acadêmicos

- Sistema de autenticação e autorização
- Gerenciamento completo de eventos
- Sistema de inscrições e pagamentos PIX
- Sistema de certificados com tokens únicos
- Área administrativa e do usuário
- Documentação completa"

# 5. Renomeie a branch para main (se necessário)
git branch -M main

# 6. Adicione o repositório remoto
git remote add origin https://github.com/SEU-USUARIO/sistema-eventos-academicos.git

# 7. Suba para o GitHub
git push -u origin main
```

---

## 🔄 Atualizações Futuras

### **Fazer Mudanças e Subir**

```bash
# 1. Verificar status
git status

# 2. Adicionar arquivos modificados
git add .
# Ou arquivos específicos:
git add arquivo1.tsx arquivo2.tsx

# 3. Commit com mensagem descritiva
git commit -m "tipo: descrição curta"

# Exemplos de tipos:
# feat: nova funcionalidade
# fix: correção de bug
# docs: mudanças na documentação
# style: formatação, espaços, etc
# refactor: refatoração de código
# test: adicionar testes
# chore: tarefas de manutenção

# 4. Subir para o GitHub
git push
```

### **Exemplos de Mensagens de Commit**

```bash
# Nova funcionalidade
git commit -m "feat(events): adiciona filtro por data de eventos"

# Correção de bug
git commit -m "fix(certificate): corrige erro na geração de QR code"

# Atualização de documentação
git commit -m "docs(readme): atualiza instruções de instalação"

# Refatoração
git commit -m "refactor(auth): melhora lógica de autenticação"

# Estilo/formatação
git commit -m "style(components): ajusta indentação e espaçamento"
```

---

## 🌿 Trabalhando com Branches

### **Criar Nova Feature**

```bash
# 1. Criar e mudar para nova branch
git checkout -b feature/nova-funcionalidade

# 2. Fazer mudanças e commits
git add .
git commit -m "feat: adiciona nova funcionalidade"

# 3. Subir branch para o GitHub
git push -u origin feature/nova-funcionalidade

# 4. No GitHub, criar Pull Request
# 5. Após aprovação, fazer merge
# 6. Voltar para main e atualizar
git checkout main
git pull origin main

# 7. Deletar branch local (opcional)
git branch -d feature/nova-funcionalidade
```

---

## 📥 Baixar Mudanças

### **Atualizar Repositório Local**

```bash
# Baixar e aplicar mudanças
git pull

# Ou, se preferir ver antes:
git fetch
git log origin/main
git merge origin/main
```

---

## 🔍 Comandos Úteis

### **Ver Status**
```bash
# Ver arquivos modificados
git status

# Ver histórico de commits
git log

# Ver histórico resumido
git log --oneline

# Ver mudanças não commitadas
git diff
```

### **Desfazer Mudanças**
```bash
# Descartar mudanças em um arquivo
git checkout -- arquivo.tsx

# Descartar todas as mudanças não commitadas
git reset --hard

# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Desfazer último commit (descarta mudanças)
git reset --hard HEAD~1
```

### **Branches**
```bash
# Listar branches
git branch

# Criar branch
git branch nome-da-branch

# Mudar para branch
git checkout nome-da-branch

# Criar e mudar para branch
git checkout -b nome-da-branch

# Deletar branch local
git branch -d nome-da-branch

# Deletar branch remota
git push origin --delete nome-da-branch
```

---

## ⚙️ Configuração Inicial

### **Configurar Nome e Email**

```bash
# Configurar nome
git config --global user.name "Seu Nome"

# Configurar email
git config --global user.email "seu@email.com"

# Verificar configuração
git config --list
```

---

## 🔐 Autenticação GitHub

### **Opção 1: HTTPS com Personal Access Token**

1. **Gerar Token:**
   - GitHub → Settings → Developer settings → Personal access tokens → Generate new token
   - Selecione: `repo` (full control)
   - Copie o token gerado

2. **Usar Token:**
   ```bash
   # Ao fazer push, use o token como senha
   git push
   # Username: seu-usuario
   # Password: cole-o-token-aqui
   ```

### **Opção 2: SSH**

```bash
# 1. Gerar chave SSH
ssh-keygen -t ed25519 -C "seu@email.com"

# 2. Copiar chave pública
cat ~/.ssh/id_ed25519.pub

# 3. Adicionar no GitHub:
# GitHub → Settings → SSH and GPG keys → New SSH key → Cole a chave

# 4. Testar conexão
ssh -T git@github.com

# 5. Usar URL SSH
git remote set-url origin git@github.com:SEU-USUARIO/sistema-eventos-academicos.git
```

---

## 📦 .gitignore

Certifique-se de que seu `.gitignore` está configurado corretamente:

```gitignore
# Dependências
node_modules/

# Ambiente
.env
.env.local

# Build
dist/
build/

# Logs
*.log

# Editor
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

---

## 🆘 Problemas Comuns

### **"Permission denied"**
```bash
# Verifique autenticação
# Use SSH ou Personal Access Token
```

### **"fatal: remote origin already exists"**
```bash
# Remova e adicione novamente
git remote remove origin
git remote add origin URL-DO-REPO
```

### **"Your branch is behind"**
```bash
# Baixe mudanças primeiro
git pull
# Depois suba suas mudanças
git push
```

### **"Merge conflicts"**
```bash
# Resolva conflitos nos arquivos
# Depois:
git add .
git commit -m "fix: resolve merge conflicts"
git push
```

---

## 📋 Checklist Antes do Push

Antes de subir para o GitHub, verifique:

- [ ] `.env` está no `.gitignore`
- [ ] `node_modules/` está no `.gitignore`
- [ ] Código está funcionando localmente
- [ ] Commit messages são descritivas
- [ ] README.md está atualizado
- [ ] Sem senhas ou chaves no código

---

## 🎯 Comandos Essenciais

```bash
# Status do repositório
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "mensagem"

# Subir para GitHub
git push

# Baixar do GitHub
git pull

# Ver histórico
git log --oneline

# Criar branch
git checkout -b nome-branch

# Voltar para main
git checkout main
```

---

## 📚 Recursos Adicionais

- **GitHub Docs**: https://docs.github.com
- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf
- **Conventional Commits**: https://www.conventionalcommits.org/

---

**✨ Pronto para subir seu projeto no GitHub! ✨**
