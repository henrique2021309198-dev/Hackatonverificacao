// Tipos do sistema de gerenciamento de eventos acadêmicos
// Alinhados com o schema do banco de dados Supabase

// ==================== TIPOS DE ENUM ====================

export type UserRole = 'participante' | 'administrador';

export type PerfilAcademico = 
  | 'Não Informado'
  | 'Superior-TSI'
  | 'Superior-ADS'
  | 'Superior-Outros'
  | 'Médio'
  | 'Fundamental'
  | 'Pós-Graduação';

export type PaymentStatus = 'nao_requerido' | 'pendente' | 'confirmado';

export type EventStatus = 'Publicado' | 'Rascunho' | 'Cancelado' | 'Encerrado';

// ==================== INTERFACES DO BANCO ====================

// Tabela: public.usuarios
export interface usuario {
  id: string; // uuid - referência ao auth.users
  nome: string;
  email: string;
  perfil: UserRole;
  perfil_academico: PerfilAcademico;
  criado_em: string; // timestamptz
}

// Tabela: public.eventos
export interface Evento {
  id: number; // bigint
  nome: string;
  descricao: string;
  data_inicio: string; // timestamptz
  duracao_horas: number; // numeric(5, 2)
  limite_faltas_percentual: number; // numeric(3, 2) - Ex: 0.25 para 25%
  chave_pix?: string | null;
  valor_evento: number; // numeric(10, 2)
  texto_certificado: string; // Template com placeholders
  perfil_academico_foco: string; // 'todos' ou perfil específico
}

// Tabela: public.participacoes
export interface Participacao {
  id: number; // bigint
  usuario_id: string; // uuid
  evento_id: number; // bigint
  inscrito_em: string; // timestamptz
  pagamento_status: PaymentStatus;
  numero_presencas: number;
  is_aprovado: boolean;
}

// Tabela: public.certificados
export interface Certificado {
  id: number; // bigint
  participacao_id: number; // bigint
  codigo_validacao: string; // uuid
  data_emissao: string; // timestamptz
  url_pdf: string;
  is_revogado: boolean;
}

// Tabela: public.presencas_detalhes (Opcional)
export interface PresencaDetalhe {
  id: number; // bigint
  participacao_id: number; // bigint
  data_registro: string; // timestamptz
  sessao_nome: string;
  registrado_por?: string | null; // uuid
}

// ==================== TIPOS COMPOSTOS (JOINS) ====================

export interface ParticipacaoComEvento extends Participacao {
  evento: Evento;
}

export interface ParticipacaoComUsuario extends Participacao {
  usuario: Usuario;
}

export interface CertificadoCompleto extends Certificado {
  participacao: ParticipacaoComEvento & ParticipacaoComUsuario;
}

// ==================== TIPOS PARA FORMULÁRIOS ====================

export interface SignupData {
  nome: string;
  email: string;
  senha: string;
  confirmacaoSenha: string;
  perfil_academico: PerfilAcademico;
}

export interface LoginCredentials {
  email: string;
  senha: string;
  tipo: UserRole;
}

export interface CreateEventData {
  nome: string;
  descricao: string;
  data_inicio: string;
  duracao_horas: number;
  limite_faltas_percentual: number;
  chave_pix?: string | null;
  valor_evento: number;
  texto_certificado: string;
  perfil_academico_foco: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {}

// ==================== TIPOS PARA DASHBOARD ====================

export interface DashboardStats {
  totalEventos: number;
  totalInscritos: number;
  eventosPagos: number;
  receitaTotal: number;
  eventosAtivos: number;
  usuariosCadastrados: number;
}

// ==================== TIPOS PARA PAGAMENTO ====================

export interface PaymentData {
  numeroCartao: string;
  nomeCartao: string;
  validade: string;
  cvv: string;
  cpf: string;
}

// ==================== TIPOS LEGADOS (COMPATIBILIDADE) ====================
// Mantidos para compatibilidade com componentes existentes
// Serão mapeados dos tipos do banco

export type EventCategory = 
  | 'Semana Acadêmica' 
  | 'Hackathon' 
  | 'Minicurso' 
  | 'Workshop'
  | 'Palestra'
  | 'Congresso';

export interface User {
  id: string;
  nomeCompleto: string;
  email: string;
  cpf: string;
  instituicao: string;
  role: 'user' | 'admin';
  fotoPerfil?: string;
  criadoEm: string;
}

export interface Event {
  id: string;
  nome: string;
  categoria: EventCategory;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  local: string;
  capacidadeMaxima: number;
  vagas: number;
  gratuito: boolean;
  valor?: number;
  imagemCapa: string;
  status: EventStatus;
  organizadorId: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Registration {
  id: string;
  eventoId: string;
  usuarioId: string;
  dataInscricao: string;
  statusPagamento: 'Pendente' | 'Confirmado' | 'Cancelado';
  valorPago?: number;
  certificadoEmitido: boolean;
  certificadoUrl?: string;
}
