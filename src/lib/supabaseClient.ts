/**
 * Cliente Supabase configurado
 * 
 * Este arquivo cria e exporta uma instância singleton do cliente Supabase
 * para ser usada em toda a aplicação.
 */

import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// URL do projeto Supabase
const supabaseUrl = `https://${projectId}.supabase.co`;

console.log('🔧 Inicializando Supabase Client...');
console.log('📍 URL:', supabaseUrl);
console.log('🔑 Anon Key disponível:', publicAnonKey ? 'Sim' : 'Não');

// ==================== SINGLETON - UMA ÚNICA INSTÂNCIA ====================
// Criar apenas UMA instância do cliente Supabase para evitar warnings
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, publicAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
          storageKey: 'sb-auth-token',
        },
      });
      console.log('✅ Supabase Client inicializado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao inicializar Supabase Client:', error);
      throw error;
    }
  }
  return supabaseInstance;
})();

// Cliente admin para operações que requerem service_role (como criar usuários com email confirmado)
// IMPORTANTE: Este cliente só deve ser usado no backend ou para operações específicas de admin
// Usamos uma chave de storage diferente para evitar conflitos
let supabaseAdminInstance: ReturnType<typeof createClient> | null = null;

const getServiceRoleKey = () => {
  // Tenta pegar do environment variables
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_SERVICE_ROLE_KEY) {
    return import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  }
  // Fallback: usar a chave anon (não terá permissões admin, mas não causará erro)
  return publicAnonKey;
};

export const supabaseAdmin = (() => {
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(supabaseUrl, getServiceRoleKey(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
        storageKey: 'sb-admin-auth-token', // Chave diferente!
      },
    });
  }
  return supabaseAdminInstance;
})();

// Tipo para o banco de dados (para type-safety)
export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string;
          nome: string;
          email: string;
          perfil: 'participante' | 'administrador';
          perfil_academico: string;
          criado_em: string;
        };
        Insert: {
          id: string;
          nome: string;
          email: string;
          perfil?: 'participante' | 'administrador';
          perfil_academico?: string;
          criado_em?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          email?: string;
          perfil?: 'participante' | 'administrador';
          perfil_academico?: string;
          criado_em?: string;
        };
      };
      eventos: {
        Row: {
          id: number;
          nome: string;
          descricao: string;
          data_inicio: string;
          duracao_horas: number;
          limite_faltas_percentual: number;
          chave_pix: string | null;
          valor_evento: number;
          texto_certificado: string;
          perfil_academico_foco: string;
        };
        Insert: {
          id?: number;
          nome: string;
          descricao: string;
          data_inicio: string;
          duracao_horas?: number;
          limite_faltas_percentual?: number;
          chave_pix?: string | null;
          valor_evento?: number;
          texto_certificado: string;
          perfil_academico_foco?: string;
        };
        Update: {
          id?: number;
          nome?: string;
          descricao?: string;
          data_inicio?: string;
          duracao_horas?: number;
          limite_faltas_percentual?: number;
          chave_pix?: string | null;
          valor_evento?: number;
          texto_certificado?: string;
          perfil_academico_foco?: string;
        };
      };
      participacoes: {
        Row: {
          id: number;
          usuario_id: string;
          evento_id: number;
          inscrito_em: string;
          pagamento_status: 'nao_requerido' | 'pendente' | 'confirmado';
          numero_presencas: number;
          is_aprovado: boolean;
        };
        Insert: {
          id?: number;
          usuario_id: string;
          evento_id: number;
          inscrito_em?: string;
          pagamento_status?: 'nao_requerido' | 'pendente' | 'confirmado';
          numero_presencas?: number;
          is_aprovado?: boolean;
        };
        Update: {
          id?: number;
          usuario_id?: string;
          evento_id?: number;
          inscrito_em?: string;
          pagamento_status?: 'nao_requerido' | 'pendente' | 'confirmado';
          numero_presencas?: number;
          is_aprovado?: boolean;
        };
      };
      certificados: {
        Row: {
          id: number;
          participacao_id: number;
          codigo_validacao: string;
          data_emissao: string;
          url_pdf: string;
          is_revogado: boolean;
        };
        Insert: {
          id?: number;
          participacao_id: number;
          codigo_validacao?: string;
          data_emissao?: string;
          url_pdf: string;
          is_revogado?: boolean;
        };
        Update: {
          id?: number;
          participacao_id?: number;
          codigo_validacao?: string;
          data_emissao?: string;
          url_pdf?: string;
          is_revogado?: boolean;
        };
      };
      presencas_detalhes: {
        Row: {
          id: number;
          participacao_id: number;
          data_registro: string;
          sessao_nome: string;
          registrado_por: string | null;
        };
        Insert: {
          id?: number;
          participacao_id: number;
          data_registro?: string;
          sessao_nome: string;
          registrado_por?: string | null;
        };
        Update: {
          id?: number;
          participacao_id?: number;
          data_registro?: string;
          sessao_nome?: string;
          registrado_por?: string | null;
        };
      };
    };
  };
};

export default supabase;