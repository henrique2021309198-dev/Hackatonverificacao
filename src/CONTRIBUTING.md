# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o Sistema de Gerenciamento de Eventos Acadêmicos! Este documento fornece diretrizes para contribuir com o projeto.

---

## 📋 Índice

- [Como Posso Contribuir?](#-como-posso-contribuir)
- [Configurando o Ambiente](#-configurando-o-ambiente)
- [Padrões de Código](#-padrões-de-código)
- [Processo de Pull Request](#-processo-de-pull-request)
- [Reportando Bugs](#-reportando-bugs)
- [Sugerindo Melhorias](#-sugerindo-melhorias)

---

## 🚀 Como Posso Contribuir?

Existem várias formas de contribuir:

### 1. Reportando Bugs
Encontrou um bug? Ajude-nos reportando!

### 2. Sugerindo Melhorias
Tem ideias para novas funcionalidades? Compartilhe!

### 3. Corrigindo Bugs
Veja as issues abertas e ajude a resolver problemas.

### 4. Implementando Funcionalidades
Escolha uma feature do roadmap e implemente.

### 5. Melhorando a Documentação
Documentação clara é essencial. Ajude a melhorar!

### 6. Revisando Pull Requests
Revise código de outros contribuidores.

---

## 🛠️ Configurando o Ambiente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Git
- Conta no Supabase (gratuita)
- Editor de código (recomendado: VS Code)

### Passos

1. **Fork o repositório**
   - Clique em "Fork" no GitHub

2. **Clone seu fork**
   ```bash
   git clone https://github.com/SEU-USUARIO/sistema-eventos-academicos.git
   cd sistema-eventos-academicos
   ```

3. **Adicione o repositório original como upstream**
   ```bash
   git remote add upstream https://github.com/USUARIO-ORIGINAL/sistema-eventos-academicos.git
   ```

4. **Instale as dependências**
   ```bash
   npm install
   ```

5. **Configure o ambiente**
   ```bash
   cp .env.example .env
   # Edite .env com suas credenciais do Supabase
   ```

6. **Configure o banco de dados**
   - Siga o guia em `SETUP.md`

7. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

---

## 📝 Padrões de Código

### Estilo de Código

- **TypeScript**: Todo código deve ser tipado
- **ESLint**: Seguir as regras configuradas
- **Prettier**: Usar formatação automática
- **Convenções de nomenclatura**:
  - Componentes: `PascalCase` (ex: `EventCard.tsx`)
  - Funções: `camelCase` (ex: `getUserById`)
  - Constantes: `UPPER_SNAKE_CASE` (ex: `MAX_EVENTS`)
  - Arquivos utilitários: `camelCase` (ex: `dateUtils.ts`)

### Estrutura de Componentes

```tsx
// Imports
import React from 'react';
import { useState } from 'react';

// Types/Interfaces
interface ComponentProps {
  title: string;
  onSave: () => void;
}

// Component
export function Component({ title, onSave }: ComponentProps) {
  // States
  const [isLoading, setIsLoading] = useState(false);

  // Effects
  useEffect(() => {
    // ...
  }, []);

  // Handlers
  const handleClick = () => {
    // ...
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(escopo): descrição curta

Descrição mais detalhada (opcional)

Footer (opcional)
```

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças na documentação
- `style`: Formatação, ponto e vírgula, etc
- `refactor`: Refatoração de código
- `test`: Adicionar ou corrigir testes
- `chore`: Tarefas de manutenção

**Exemplos:**
```bash
git commit -m "feat(events): adiciona filtro por data"
git commit -m "fix(certificate): corrige geração de QR code"
git commit -m "docs(readme): atualiza instruções de setup"
```

### Branches

- `main`: Código de produção estável
- `develop`: Desenvolvimento ativo
- `feature/nome-da-feature`: Novas funcionalidades
- `fix/nome-do-bug`: Correções de bugs
- `docs/nome-doc`: Atualizações de documentação

**Nomenclatura:**
```bash
feature/add-email-notifications
fix/certificate-download-error
docs/update-setup-guide
```

---

## 🔄 Processo de Pull Request

### 1. Crie uma Branch

```bash
git checkout -b feature/minha-funcionalidade
```

### 2. Faça suas Mudanças

- Escreva código limpo e bem documentado
- Adicione comentários quando necessário
- Mantenha commits pequenos e focados

### 3. Teste suas Mudanças

```bash
npm run dev  # Teste manualmente
npm run build  # Certifique-se que builda
```

### 4. Commit suas Mudanças

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
```

### 5. Atualize sua Branch

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push para seu Fork

```bash
git push origin feature/minha-funcionalidade
```

### 7. Abra um Pull Request

- Vá para o repositório no GitHub
- Clique em "New Pull Request"
- Escolha sua branch
- Preencha o template:

```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Código foi testado localmente
- [ ] Documentação foi atualizada (se necessário)
- [ ] Nenhuma warning no console
- [ ] Build passa sem erros
```

### 8. Aguarde Review

- Responda aos comentários
- Faça as mudanças solicitadas
- Seja paciente e respeitoso

---

## 🐛 Reportando Bugs

### Antes de Reportar

1. **Verifique se já foi reportado**: Busque nas [Issues](https://github.com/usuario/repo/issues)
2. **Verifique se está atualizado**: Teste na versão mais recente
3. **Tente reproduzir**: Certifique-se que o bug é consistente

### Como Reportar

Use o template de issue:

```markdown
## Descrição do Bug
Descrição clara e concisa do bug

## Como Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

## Comportamento Esperado
O que deveria acontecer

## Comportamento Atual
O que está acontecendo

## Screenshots
Se aplicável, adicione screenshots

## Ambiente
- OS: [ex: Windows 10]
- Navegador: [ex: Chrome 120]
- Versão do Node: [ex: 18.17.0]

## Logs
```
Cole logs relevantes aqui
```

## Informações Adicionais
Qualquer outro contexto sobre o problema
```

---

## 💡 Sugerindo Melhorias

### Antes de Sugerir

1. **Verifique o roadmap**: Veja se já está planejado
2. **Busque issues existentes**: Pode já ter sido sugerido
3. **Considere o escopo**: A feature faz sentido para o projeto?

### Como Sugerir

Use o template de feature request:

```markdown
## Descrição da Feature
Descrição clara da funcionalidade desejada

## Problema que Resolve
Que problema esta feature resolve?

## Solução Proposta
Como você imagina que funcionaria?

## Alternativas Consideradas
Quais outras soluções você pensou?

## Informações Adicionais
Mockups, exemplos, referências, etc.
```

---

## ✅ Checklist do Contribuidor

Antes de submeter seu PR, verifique:

### Código
- [ ] Código segue os padrões do projeto
- [ ] TypeScript sem erros de tipo
- [ ] Sem warnings no console
- [ ] Código está comentado quando necessário
- [ ] Nomes de variáveis são descritivos

### Testes
- [ ] Testado manualmente em todos os cenários
- [ ] Testado em diferentes navegadores
- [ ] Testado em mobile/tablet/desktop
- [ ] Build passa sem erros (`npm run build`)

### Documentação
- [ ] README atualizado (se necessário)
- [ ] Comentários no código (se necessário)
- [ ] CHANGELOG atualizado (se feature/fix significativa)

### Git
- [ ] Commits seguem Conventional Commits
- [ ] Branch está atualizada com main
- [ ] Sem conflitos de merge
- [ ] Descrição do PR está clara e completa

---

## 🎯 Áreas que Precisam de Ajuda

Contribuições são especialmente bem-vindas em:

- 🐛 **Correção de bugs reportados**
- 📝 **Melhoria da documentação**
- 🌐 **Tradução/Internacionalização**
- ♿ **Melhorias de acessibilidade**
- 🎨 **Melhorias de UI/UX**
- ⚡ **Otimização de performance**
- 🧪 **Adição de testes**
- 📱 **Melhorias de responsividade**

---

## 📞 Precisa de Ajuda?

- 💬 Abra uma issue com a tag `question`
- 📧 Entre em contato com os mantenedores
- 📖 Leia a documentação completa no README

---

## 🙏 Agradecimentos

Obrigado por contribuir! Toda contribuição, grande ou pequena, é valiosa e apreciada.

---

## 📜 Código de Conduta

### Nosso Compromisso

Estamos comprometidos em fornecer uma experiência acolhedora e inspiradora para todos.

### Comportamentos Esperados

- ✅ Seja respeitoso e inclusivo
- ✅ Aceite críticas construtivas
- ✅ Foque no que é melhor para a comunidade
- ✅ Mostre empatia com outros membros

### Comportamentos Inaceitáveis

- ❌ Linguagem ou imagens sexualizadas
- ❌ Trolling, insultos ou comentários depreciativos
- ❌ Assédio público ou privado
- ❌ Publicar informações privadas de outros

### Aplicação

Violações podem ser reportadas aos mantenedores do projeto. Todas as reclamações serão revisadas e investigadas.

---

**✨ Obrigado por fazer parte deste projeto! ✨**
