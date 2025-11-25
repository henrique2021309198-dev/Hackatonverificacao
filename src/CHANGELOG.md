# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.0.0] - 2025-11-25

### 🎉 Versão Inicial

Sistema completo de gerenciamento de eventos acadêmicos lançado com as seguintes funcionalidades:

### ✨ Funcionalidades

#### Autenticação
- Sistema de login e cadastro
- Dois níveis de acesso: Participante e Administrador
- Proteção de rotas por perfil
- Integração com Supabase Auth

#### Área do Participante
- Perfil editável com dados pessoais
- Navegação e visualização de eventos publicados
- Sistema de inscrição em eventos
- Pagamento via PIX (QR Code + Copia e Cola)
- "Meus Eventos" com histórico de participações
- Download de certificados em PDF
- Verificação pública de certificados

#### Área do Administrador
- Dashboard com estatísticas em tempo real
- Criação e edição de eventos
- Gerenciamento completo de inscritos
- Aprovação/reprovação de inscrições
- Confirmação de pagamentos
- Registro de presenças (individual e em lote)
- Geração de certificados (individual e em lote)
- Controle de vagas disponíveis

#### Sistema de Eventos
- Configuração de data e duração (em horas)
- Eventos gratuitos ou pagos
- Capacidade máxima e controle de vagas
- Limite de faltas configurável
- Upload de imagens de capa
- Status do evento (Publicado, Rascunho, Cancelado, Encerrado)
- Filtros e busca

#### Sistema de Certificados
- Geração automática de PDFs
- Design profissional e personalizável
- QR Code com token único UUID
- Sistema de verificação pública
- Código de validação para autenticidade
- Sistema de revogação
- Template personalizável por evento

#### Interface
- Design moderno e minimalista
- Totalmente responsivo (Mobile, Tablet, Desktop)
- Paleta de cores profissional
- Componentes shadcn/ui
- Ícones Lucide React
- Toast notifications (Sonner)
- Skeleton loaders

### 🛠️ Tecnologias Utilizadas

**Frontend:**
- React 18
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS v4
- shadcn/ui

**Backend:**
- Supabase (PostgreSQL)
- Supabase Auth
- Row Level Security (RLS)
- Edge Functions

**Bibliotecas:**
- jsPDF (geração de PDFs)
- QRCode.react (QR Codes)
- date-fns (datas)
- Sonner (toasts)
- Lucide React (ícones)

### 🔒 Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) configurado
- Proteção de rotas no frontend
- Validação de permissões por perfil
- Tokens UUID únicos para certificados
- Hashing de senhas (Supabase)

### 📦 Banco de Dados

**Tabelas criadas:**
- `usuarios` - Dados dos usuários
- `eventos` - Informações dos eventos
- `participacoes` - Inscrições e aprovações
- `certificados` - Certificados emitidos
- `presencas_detalhes` - Controle detalhado de presenças

**Recursos:**
- Índices otimizados
- Triggers automáticos
- RLS policies completas
- Foreign keys com ON DELETE CASCADE

### 📝 Documentação

- README.md completo
- SETUP.md com guia passo a passo
- COMO_FUNCIONAM_CERTIFICADOS.md
- RESUMO_IMPLEMENTACAO.md
- .env.example
- LICENSE (MIT)

---

## Como Usar Este Changelog

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

### Tipos de Mudanças

- **Added** (Adicionado) - Para novas funcionalidades
- **Changed** (Modificado) - Para mudanças em funcionalidades existentes
- **Deprecated** (Obsoleto) - Para funcionalidades que serão removidas
- **Removed** (Removido) - Para funcionalidades removidas
- **Fixed** (Corrigido) - Para correção de bugs
- **Security** (Segurança) - Para correções de vulnerabilidades

---

## Roadmap / Próximas Versões

### [1.1.0] - Planejado

#### Adicionado
- Sistema de notificações por email
- Relatórios em PDF para administradores
- Busca avançada de eventos
- Filtros múltiplos na listagem

#### Melhorias
- Performance na listagem de eventos
- Otimização de queries no banco
- Caching de dados frequentes

### [1.2.0] - Planejado

#### Adicionado
- Sistema de avaliação de eventos
- Área para palestrantes
- Upload de materiais do evento
- Sistema de credenciamento com QR Code

### [2.0.0] - Futuro

#### Adicionado
- Multi-idioma (i18n)
- Modo escuro
- Integração com APIs de pagamento automático
- Sistema de relatórios avançados
- Dashboard com gráficos interativos
