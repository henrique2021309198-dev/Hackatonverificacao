# 🎓 Sistema de Gerenciamento de Eventos Acadêmicos

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)

Sistema web completo para gerenciamento de eventos acadêmicos, com áreas para usuários e administradores, sistema de inscrições, pagamentos via PIX, controle de presenças e geração automática de certificados com tokens de validação.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Requisitos](#-requisitos)
- [Instalação](#-instalação)
- [Configuração do Banco de Dados](#-configuração-do-banco-de-dados)
- [Como Criar um Administrador](#-como-criar-um-administrador)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Usar](#-como-usar)
- [Documentação Adicional](#-documentação-adicional)

---

## 🎯 Sobre o Projeto

Este sistema foi desenvolvido para facilitar o gerenciamento de eventos acadêmicos, oferecendo uma plataforma completa que permite:

- **Para Participantes**: Inscrição em eventos, pagamento via PIX, acompanhamento de presenças e download de certificados
- **Para Administradores**: Criação e gestão de eventos, controle de inscritos, registro de presenças e emissão de certificados
- **Para o Público**: Verificação da autenticidade de certificados através de tokens únicos

O sistema foi construído com foco em **responsividade**, **usabilidade** e **segurança**, seguindo as melhores práticas de desenvolvimento web moderno.

---

## ✨ Funcionalidades

### 🔐 **Autenticação e Autorização**
- Sistema completo de login e cadastro
- Autenticação via Supabase Auth
- Dois níveis de acesso: Participante e Administrador
- Proteção de rotas por perfil

### 📊 **Dashboard Administrativo**
- Estatísticas em tempo real (eventos, inscritos, certificados)
- Visão geral do sistema
- Gráficos e indicadores

### 🎟️ **Gestão de Eventos**
- Criação e edição de eventos
- Upload de imagens de capa (Unsplash integrado)
- Configuração de:
  - Data e duração (em horas)
  - Valor do evento (com suporte a eventos gratuitos)
  - Capacidade máxima e vagas disponíveis
  - Limite de faltas permitido
  - Perfil acadêmico do público-alvo
  - Texto personalizado do certificado
- Status do evento (Publicado, Rascunho, Cancelado, Encerrado)
- Listagem e filtros de eventos

### 💳 **Sistema de Inscrições**
- Inscrição em eventos com validação de vagas
- Pagamento via **PIX** para eventos pagos
- Geração automática de QR Code PIX
- Código Copia e Cola para pagamento
- Status de pagamento (Pendente, Confirmado, Não Requerido)
- Eventos gratuitos não exigem pagamento

### 👥 **Gerenciamento de Inscritos**
- Lista completa de participantes por evento
- Filtros por status de aprovação e pagamento
- Aprovação/reprovação de inscrições
- Registro individual ou em lote de presenças
- Geração individual ou em lote de certificados
- Controle de número de presenças por participante
- Campo de observações para cada inscrição

### 📜 **Sistema de Certificados**
- Geração automática de certificados em PDF
- Design profissional e personalizável
- QR Code com token único de validação
- Código UUID para verificação de autenticidade
- Template de certificado com:
  - Nome do participante
  - Nome do evento
  - Data de realização
  - Carga horária
  - Data de emissão
- Download direto pelo participante
- Sistema de revogação de certificados

### 🛡️ **Verificação de Certificados**
- Página pública para validação de certificados
- Verificação via token UUID ou QR Code
- Exibição de todas as informações do certificado
- Interface visual (card verde para válido, vermelho para inválido/revogado)
- Detecção de certificados revogados

### 👤 **Área do Usuário**
- Perfil editável com dados pessoais
- Perfil acadêmico (TSI, ADS, Pós-Graduação, etc.)
- "Meus Eventos": lista de eventos inscritos
- Download de certificados disponíveis
- Histórico de participações

### 🎨 **Interface Moderna**
- Design profissional e minimalista
- Paleta de cores: Azul escuro, branco, cinza, azul-claro
- Totalmente responsivo (Desktop, Tablet, Mobile)
- Componentes do shadcn/ui
- Ícones do Lucide React
- Feedback visual com toasts (Sonner)
- Skeleton loaders durante carregamento

---

## 🚀 Tecnologias

### **Frontend**
- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **Tailwind CSS v4** - Estilização
- **shadcn/ui** - Componentes UI

### **Bibliotecas UI**
- **Lucide React** - Ícones
- **Sonner** - Toast notifications
- **jsPDF** - Geração de PDFs
- **QRCode.react** - Geração de QR Codes
- **date-fns** - Manipulação de datas

### **Backend**
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Row Level Security (RLS)
  - Edge Functions
  - Storage (para futuras expansões)

---

## 📦 Requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**
- Conta no **Supabase** (gratuita)

---

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/sistema-eventos-academicos.git
cd sistema-eventos-academicos
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui
```

> 💡 **Onde encontrar essas informações:**
> - Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
> - Vá em **Settings** → **API**
> - Copie a **URL** e a **anon/public key**

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O sistema estará disponível em `http://localhost:5173`

---

## 🗄️ Configuração do Banco de Dados

### 1. Acesse o Supabase SQL Editor

No seu projeto Supabase, vá em **SQL Editor** → **New Query**

### 2. Execute o script de criação das tabelas

```sql
-- ==================== TABELA: usuarios ====================
-- Estende auth.users com informações adicionais
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  perfil VARCHAR(50) NOT NULL CHECK (perfil IN ('participante', 'administrador')),
  perfil_academico VARCHAR(100) DEFAULT 'Não Informado',
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== TABELA: eventos ====================
CREATE TABLE eventos (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  data_inicio TIMESTAMPTZ NOT NULL,
  duracao_horas NUMERIC(5,2) NOT NULL,
  limite_faltas_percentual NUMERIC(3,2) DEFAULT 0.25,
  valor_evento NUMERIC(10,2) DEFAULT 0,
  texto_certificado TEXT,
  perfil_academico_foco VARCHAR(100) DEFAULT 'todos',
  local VARCHAR(255),
  capacidade_maxima INTEGER,
  vagas_disponiveis INTEGER,
  imagem_capa TEXT,
  organizador_id UUID REFERENCES usuarios(id),
  status VARCHAR(50) DEFAULT 'Rascunho',
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== TABELA: participacoes ====================
CREATE TABLE participacoes (
  id BIGSERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  evento_id BIGINT REFERENCES eventos(id) ON DELETE CASCADE,
  inscrito_em TIMESTAMPTZ DEFAULT NOW(),
  pagamento_status VARCHAR(50) DEFAULT 'pendente' CHECK (pagamento_status IN ('nao_requerido', 'pendente', 'confirmado')),
  is_aprovado BOOLEAN DEFAULT false,
  numero_presencas INTEGER DEFAULT 0,
  observacoes TEXT,
  UNIQUE(usuario_id, evento_id)
);

-- ==================== TABELA: certificados ====================
CREATE TABLE certificados (
  id BIGSERIAL PRIMARY KEY,
  participacao_id BIGINT REFERENCES participacoes(id) ON DELETE CASCADE,
  codigo_validacao UUID UNIQUE DEFAULT gen_random_uuid(),
  data_emissao TIMESTAMPTZ DEFAULT NOW(),
  url_pdf TEXT NOT NULL,
  is_revogado BOOLEAN DEFAULT false
);

-- ==================== TABELA: presencas_detalhes ====================
-- Opcional: para controle detalhado de presenças por sessão
CREATE TABLE presencas_detalhes (
  id BIGSERIAL PRIMARY KEY,
  participacao_id BIGINT REFERENCES participacoes(id) ON DELETE CASCADE,
  data_registro TIMESTAMPTZ DEFAULT NOW(),
  sessao_nome VARCHAR(255),
  registrado_por UUID REFERENCES usuarios(id)
);

-- ==================== ÍNDICES ====================
CREATE INDEX idx_eventos_organizador ON eventos(organizador_id);
CREATE INDEX idx_eventos_data ON eventos(data_inicio);
CREATE INDEX idx_participacoes_usuario ON participacoes(usuario_id);
CREATE INDEX idx_participacoes_evento ON participacoes(evento_id);
CREATE INDEX idx_certificados_codigo ON certificados(codigo_validacao);

-- ==================== TRIGGER: atualizar timestamp ====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER eventos_updated_at
BEFORE UPDATE ON eventos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ==================== RLS (Row Level Security) ====================
-- Habilitar RLS nas tabelas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE participacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE presencas_detalhes ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios
CREATE POLICY "Usuários podem ver próprio perfil" ON usuarios
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar próprio perfil" ON usuarios
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para eventos (leitura pública)
CREATE POLICY "Eventos publicados são públicos" ON eventos
  FOR SELECT USING (status = 'Publicado' OR organizador_id = auth.uid());

CREATE POLICY "Administradores podem criar eventos" ON eventos
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND perfil = 'administrador')
  );

CREATE POLICY "Organizadores podem editar seus eventos" ON eventos
  FOR UPDATE USING (organizador_id = auth.uid());

CREATE POLICY "Organizadores podem deletar seus eventos" ON eventos
  FOR DELETE USING (organizador_id = auth.uid());

-- Políticas para participacoes
CREATE POLICY "Usuários veem suas próprias participações" ON participacoes
  FOR SELECT USING (usuario_id = auth.uid() OR EXISTS (
    SELECT 1 FROM eventos WHERE id = participacoes.evento_id AND organizador_id = auth.uid()
  ));

CREATE POLICY "Usuários podem se inscrever" ON participacoes
  FOR INSERT WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Organizadores podem gerenciar participações" ON participacoes
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM eventos WHERE id = participacoes.evento_id AND organizador_id = auth.uid()
  ));

-- Políticas para certificados
CREATE POLICY "Usuários veem seus certificados" ON certificados
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM participacoes WHERE id = certificados.participacao_id AND usuario_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM participacoes p 
      JOIN eventos e ON p.evento_id = e.id 
      WHERE p.id = certificados.participacao_id AND e.organizador_id = auth.uid()
    )
  );

CREATE POLICY "Organizadores podem gerar certificados" ON certificados
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM participacoes p
      JOIN eventos e ON p.evento_id = e.id
      WHERE p.id = participacao_id AND e.organizador_id = auth.uid()
    )
  );
```

### 3. Configure o Auth do Supabase

No dashboard do Supabase:

1. Vá em **Authentication** → **Providers**
2. Certifique-se de que **Email** está habilitado
3. Em **Authentication** → **Settings**, configure:
   - **Site URL**: `http://localhost:5173` (desenvolvimento)
   - **Redirect URLs**: Adicione URLs permitidas

---

## 👨‍💼 Como Criar um Administrador

⚠️ **IMPORTANTE**: A criação de administradores deve ser feita **diretamente no banco de dados** por questões de segurança.

### Método 1: Via SQL Editor do Supabase

1. Acesse o **SQL Editor** no Supabase
2. Execute o seguinte script:

```sql
-- Primeiro, crie o usuário no Auth
-- Você pode fazer isso na interface do Supabase em Authentication > Users
-- Ou via SQL (requer permissões de admin):

-- Depois, adicione o registro na tabela usuarios como administrador
INSERT INTO usuarios (id, nome, email, perfil, perfil_academico)
VALUES (
  'uuid-do-usuario-criado-no-auth', -- Substitua pelo ID do auth.users
  'Nome do Administrador',
  'admin@exemplo.com',
  'administrador', -- ⚠️ Importante: use 'administrador'
  'Não Informado'
);
```

### Método 2: Atualizar um usuário existente

Se você já tem um usuário participante e quer torná-lo administrador:

```sql
UPDATE usuarios 
SET perfil = 'administrador'
WHERE email = 'email@usuario.com';
```

### Método 3: Criar via Supabase Dashboard + SQL

**Passo 1**: Crie o usuário no Auth
- Vá em **Authentication** → **Users**
- Clique em **Add User**
- Preencha email e senha
- Clique em **Create User**
- **Copie o UUID** gerado

**Passo 2**: Adicione na tabela usuarios
```sql
INSERT INTO usuarios (id, nome, email, perfil)
VALUES (
  'uuid-copiado-aqui',
  'Admin Sistema',
  'admin@sistema.com',
  'administrador'
);
```

> 💡 **Dica**: O primeiro administrador sempre deve ser criado manualmente. Depois, você pode implementar uma interface administrativa para gerenciar outros admins, se necessário.

---

## 📁 Estrutura do Projeto

```
sistema-eventos-academicos/
├── public/               # Arquivos estáticos
├── src/
│   ├── components/       # Componentes React
│   │   ├── ui/          # Componentes shadcn/ui
│   │   ├── admin/       # Componentes administrativos
│   │   ├── CertificateGenerator.tsx
│   │   ├── EventCard.tsx
│   │   ├── Navigation.tsx
│   │   └── ...
│   ├── lib/             # Utilitários e configurações
│   │   └── supabaseClient.ts
│   ├── pages/           # Páginas da aplicação
│   │   ├── admin/       # Páginas administrativas
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── MyEvents.tsx
│   │   └── ...
│   ├── services/        # Lógica de negócio
│   │   ├── auth.ts
│   │   ├── events.ts
│   │   ├── registrations.ts
│   │   └── ...
│   ├── types/           # Definições TypeScript
│   │   └── index.ts
│   ├── utils/           # Funções auxiliares
│   │   └── supabase/
│   ├── styles/          # Estilos globais
│   │   └── globals.css
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Ponto de entrada
├── supabase/            # Configurações Supabase
│   └── functions/
├── .env                 # Variáveis de ambiente (não commitar!)
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 📖 Como Usar

### Para Participantes

1. **Cadastro e Login**
   - Acesse a página inicial
   - Clique em "Cadastrar" e preencha seus dados
   - Faça login com email e senha

2. **Navegar e Inscrever-se em Eventos**
   - Visualize os eventos disponíveis na página inicial
   - Clique em "Ver Detalhes" para mais informações
   - Clique em "Inscrever-se" no evento desejado

3. **Realizar Pagamento (se aplicável)**
   - Se o evento for pago, você será direcionado para a página de pagamento
   - Escaneie o QR Code PIX ou copie o código Copia e Cola
   - Realize o pagamento no app do seu banco
   - O administrador confirmará o pagamento

4. **Acompanhar Eventos**
   - Acesse "Meus Eventos" no menu
   - Veja seus eventos inscritos e aprovados
   - Acompanhe seu status de presença

5. **Baixar Certificados**
   - Após o evento, se você cumpriu os requisitos de presença
   - Acesse "Meus Eventos"
   - Clique em "Baixar Certificado" no evento correspondente

6. **Verificar Certificados**
   - Acesse "Verificar Certificado" no menu
   - Insira o código UUID do certificado
   - Veja as informações de autenticidade

### Para Administradores

1. **Acessar Dashboard**
   - Faça login com conta de administrador
   - Acesse o Dashboard para ver estatísticas gerais

2. **Criar Evento**
   - Vá em "Gerenciar Eventos" → "Novo Evento"
   - Preencha todas as informações do evento
   - Defina se é gratuito ou pago
   - Configure texto do certificado
   - Salve como Rascunho ou Publique

3. **Gerenciar Inscritos**
   - Acesse "Gerenciar Eventos"
   - Clique em "Ver Inscritos" no evento desejado
   - Aprove/reprove inscrições
   - Confirme pagamentos
   - Registre presenças (individual ou em lote)

4. **Gerar Certificados**
   - Na lista de inscritos de um evento
   - Selecione participantes elegíveis
   - Clique em "Gerar Certificados" (individual ou em lote)
   - Os participantes poderão baixar seus certificados

5. **Visualizar Relatórios**
   - Dashboard mostra métricas em tempo real
   - Total de eventos, inscritos e certificados
   - Estatísticas de pagamentos e aprovações

---

## 📚 Documentação Adicional

- **`/COMO_FUNCIONAM_CERTIFICADOS.md`** - Documentação técnica detalhada do sistema de certificados
- **`/RESUMO_IMPLEMENTACAO.md`** - Resumo técnico de toda a implementação

---

## 🎨 Características de Design

- **Paleta de Cores**:
  - Primário: Azul escuro (`#1e3a8a`)
  - Secundário: Azul claro (`#3b82f6`)
  - Fundo: Branco e tons de cinza
  - Sucesso: Verde
  - Erro: Vermelho

- **Tipografia**: Sistema padrão (sans-serif) com hierarquia clara
- **Responsividade**: Breakpoints para mobile (< 768px), tablet (768px - 1024px) e desktop (> 1024px)
- **Acessibilidade**: Contrastes adequados, labels em formulários, feedback visual

---

## 🔒 Segurança

- ✅ Autenticação via Supabase Auth
- ✅ Row Level Security (RLS) no banco de dados
- ✅ Proteção de rotas no frontend
- ✅ Validação de permissões por perfil
- ✅ Tokens UUID únicos para certificados
- ✅ Hashing de senhas (gerenciado pelo Supabase)

---

## 🚧 Melhorias Futuras

- [ ] Sistema de notificações por email
- [ ] Relatórios em PDF para administradores
- [ ] Sistema de avaliação de eventos
- [ ] Upload de materiais do evento
- [ ] Integração com APIs de pagamento automático
- [ ] Área para palestrantes
- [ ] Sistema de credenciamento com QR Code
- [ ] Multi-idioma (i18n)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abrir um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ para facilitar a gestão de eventos acadêmicos.

---

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a documentação adicional em `/COMO_FUNCIONAM_CERTIFICADOS.md`
2. Consulte os logs do navegador (F12 → Console)
3. Verifique os logs do Supabase (Database → Logs)
4. Abra uma issue no GitHub

---

**⭐ Se este projeto foi útil para você, considere dar uma estrela no GitHub!**