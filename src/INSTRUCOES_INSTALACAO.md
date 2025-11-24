# 📦 Instruções de Instalação e Correção

## ✅ Problema Resolvido

O erro ocorreu porque o arquivo `/lib/utils.ts` estava faltando. Agora ele foi criado!

---

## 🚀 Como Resolver e Rodar o Projeto

  ### **PASSO 1: Instalar Dependências**

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

**Ou se preferir usar yarn:**

```bash
yarn install
```

**Ou se preferir usar pnpm:**

```bash
pnpm install
```

---

### **PASSO 2: Limpar o Cache do Vite**

Às vezes o Vite mantém cache antigo. Para limpar:

```bash
# Deletar a pasta node_modules/.vite (se existir)
rm -rf node_modules/.vite

# Ou no Windows:
rmdir /s /q node_modules\.vite
```

---

### **PASSO 3: Reiniciar o Servidor**

Pare o servidor (Ctrl+C) e reinicie:

```bash
npm run dev
```

---

## 📋 O Que Foi Corrigido

### ✅ Arquivos Criados/Corrigidos:

1. **`/lib/utils.ts`** → Função `cn()` para mesclar classes Tailwind
2. **`/package.json`** → Todas as dependências necessárias
3. **`/lib/supabaseClient.ts`** → Cliente Supabase com suporte a admin

---

## 🧪 Verificar se Está Funcionando

Após instalar as dependências e reiniciar, você deve ver:

```
VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

Se ainda houver erros, verifique:

1. **Dependências instaladas?** → `npm install`
2. **Cache limpo?** → Delete `node_modules/.vite`
3. **Servidor reiniciado?** → Pare (Ctrl+C) e rode `npm run dev`

---

## 📦 Dependências Instaladas

O `package.json` inclui:

### **UI & Componentes:**
- Radix UI (todos os componentes primitivos)
- Lucide React (ícones)
- Recharts (gráficos)
- Sonner (toasts/notificações)
- Tailwind CSS v4
- Tailwind Merge + CLSX

### **Backend & Dados:**
- Supabase JS Client
- React + React DOM

### **Dev Tools:**
- TypeScript
- Vite
- PostCSS + Autoprefixer

---

## 🔧 Estrutura de Pastas

```
/
├── lib/
│   ├── supabaseClient.ts  ✅ Cliente Supabase
│   └── utils.ts           ✅ Utilitários (cn function)
├── components/
│   ├── ui/               ✅ Componentes Shadcn
│   ├── figma/            ✅ Componentes auxiliares
│   └── [outros componentes]
├── services/
│   └── supabase.ts       ✅ Funções de integração
├── types/
│   └── index.ts          ✅ Tipos TypeScript
├── styles/
│   └── globals.css       ✅ Estilos globais
├── App.tsx               ✅ Componente principal
└── package.json          ✅ Dependências
```

---

## 🚨 Erros Comuns e Soluções

### **Erro: "Cannot find module"**
**Solução:** 
```bash
npm install
```

### **Erro: "Failed to resolve import"**
**Solução:** 
```bash
rm -rf node_modules/.vite
npm run dev
```

### **Erro: "EADDRINUSE ::1:5173"**
**Solução:** Porta já em uso
```bash
# Matar processo na porta 5173
npx kill-port 5173

# Ou usar outra porta
npm run dev -- --port 3000
```

### **Erro: "Module not found: clsx" ou "tailwind-merge"**
**Solução:** 
```bash
npm install clsx tailwind-merge --save
```

---

## ✅ Checklist Final

Antes de rodar o projeto, verifique:

- [ ] Node.js instalado (v18 ou superior)
- [ ] Dependências instaladas (`npm install`)
- [ ] Cache limpo (delete `node_modules/.vite`)
- [ ] Arquivo `.env.local` configurado (opcional)
- [ ] Servidor Supabase configurado (veja `/CADASTRO_SEM_CONFIRMACAO.md`)

---

## 🎯 Próximos Passos

1. ✅ Instalar dependências
2. ✅ Iniciar o servidor
3. ✅ Configurar Supabase (desabilitar confirmação de email)
4. ✅ Testar cadastro e login
5. ✅ Começar a usar o sistema!

**Agora pode rodar `npm install` e depois `npm run dev`!** 🚀
