/**
 * Serviço de integração com Supabase
 * 
 * Este arquivo contém todas as funções necessárias para integração com o Supabase.
 * Integrado com o banco de dados real conforme schema fornecido.
 */

import { supabase, supabaseAdmin } from '../lib/supabaseClient';
import type {
  Usuario,
  Evento,
  Participacao,
  Certificado,
  ParticipacaoComEvento,
  ParticipacaoComUsuario,
  LoginCredentials,
  SignupData,
  DashboardStats,
  CreateEventData,
  User,
  Event,
  Registration,
} from '../types';

// ==================== FUNÇÕES DE MAPEAMENTO ====================
// Converte tipos do banco para tipos legados usados nos componentes

function mapUsuarioToUser(usuario: Usuario): User {
  return {
    id: usuario.id,
    nomeCompleto: usuario.nome,
    email: usuario.email,
    cpf: '', // Não existe no novo schema
    instituicao: '', // Não existe no novo schema
    role: usuario.perfil === 'administrador' ? 'admin' : 'user',
    criadoEm: usuario.criado_em,
  };
}

function mapEventoToEvent(evento: Evento): Event {
  const dataFim = new Date(evento.data_inicio);
  dataFim.setHours(dataFim.getHours() + evento.duracao_horas);
  
  return {
    id: evento.id.toString(),
    nome: evento.nome,
    categoria: 'Workshop', // Placeholder - não existe no novo schema
    descricao: evento.descricao,
    dataInicio: evento.data_inicio,
    dataFim: dataFim.toISOString(),
    local: 'A definir', // Não existe no novo schema
    capacidadeMaxima: 100, // Não existe no novo schema
    vagas: 50, // Não existe no novo schema
    gratuito: evento.valor_evento === 0,
    valor: evento.valor_evento > 0 ? evento.valor_evento : undefined,
    imagemCapa: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    status: 'Publicado',
    organizadorId: '1', // Não existe no novo schema
    criadoEm: evento.data_inicio,
    atualizadoEm: evento.data_inicio,
  };
}

function mapParticipacaoToRegistration(
  participacao: Participacao,
  evento?: Evento
): Registration {
  return {
    id: participacao.id.toString(),
    eventoId: participacao.evento_id.toString(),
    usuarioId: participacao.usuario_id,
    dataInscricao: participacao.inscrito_em,
    statusPagamento: 
      participacao.pagamento_status === 'confirmado' ? 'Confirmado' :
      participacao.pagamento_status === 'pendente' ? 'Pendente' : 'Cancelado',
    valorPago: evento?.valor_evento,
    certificadoEmitido: participacao.is_aprovado,
    certificadoUrl: undefined,
  };
}

// ==================== AUTENTICAÇÃO ====================

export async function signUp(data: SignupData): Promise<{ user: User; error: null } | { user: null; error: string }> {
  try {
    console.log('Iniciando cadastro:', { email: data.email, nome: data.nome });
    
    // Verificar se o email já existe
    const { data: existingUsers, error: checkError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', data.email);
    
    if (existingUsers && existingUsers.length > 0) {
      return { 
        user: null, 
        error: 'Este email já está cadastrado. Tente fazer login ou use outro email.' 
      };
    }
    
    // 1. Criar usuário no Supabase Auth com email já confirmado
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.senha,
      options: {
        emailRedirectTo: undefined,
        data: {
          full_name: data.nome,
          perfil_academico: data.perfil_academico || 'Não Informado',
        },
      },
    });

    if (authError) {
      console.error('Erro no signup (Auth):', authError);
      
      // Tratamento específico para rate limit
      if (authError.message.includes('after') && authError.message.includes('seconds')) {
        const match = authError.message.match(/(\d+)\s+seconds/);
        const seconds = match ? match[1] : '60';
        return { 
          user: null, 
          error: `Por favor, aguarde ${seconds} segundos antes de tentar criar outra conta. Isso é uma medida de segurança.` 
        };
      }
      
      // Tratamento para email já cadastrado
      if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
        return { 
          user: null, 
          error: 'Este email já está cadastrado. Tente fazer login ou use outro email.' 
        };
      }
      
      // Outros erros
      return { user: null, error: `Erro ao criar conta: ${authError.message}` };
    }

    if (!authData.user) {
      console.error('Auth não retornou usuário');
      return { user: null, error: 'Erro ao criar usuário' };
    }

    console.log('Usuário criado no Auth:', authData.user.id);

    // 2. Aguardar o trigger executar e tentar buscar o usuário várias vezes
    let usuario: Usuario | null = null;
    let attempts = 0;
    const maxAttempts = 5;
    
    while (!usuario && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 500 * (attempts + 1)));
      
      console.log(`Tentativa ${attempts + 1}/${maxAttempts} de buscar usuário na tabela usuarios...`);
      
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (userError) {
        console.error(`Erro na tentativa ${attempts + 1}:`, userError);
      }

      if (userData) {
        console.log('Usuário encontrado na tabela usuarios:', userData);
        usuario = userData;
        break;
      }
      
      attempts++;
    }

    // 3. Se o trigger falhou, criar manualmente o registro na tabela usuarios
    if (!usuario) {
      console.warn('⚠️ Trigger não executou após 5 tentativas, criando registro manualmente...');
      
      const { data: newUser, error: insertError } = await supabase
        .from('usuarios')
        .insert({
          id: authData.user.id,
          nome: data.nome,
          email: data.email,
          perfil: 'participante',
          perfil_academico: data.perfil_academico || 'Não Informado',
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Erro ao criar registro de usuário manualmente:', insertError);
        console.error('Detalhes do erro:', {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
        });
        
        // Tratamento específico para erro de RLS (política de segurança)
        if (insertError.code === '42501' || insertError.message.includes('row-level security')) {
          console.error('');
          console.error('🚨 AÇÃO NECESSÁRIA:');
          console.error('O banco de dados está bloqueando a criação de usuários.');
          console.error('Você precisa executar o script SQL para adicionar as políticas de segurança.');
          console.error('');
          console.error('📋 INSTRUÇÕES:');
          console.error('1. Abra: https://app.supabase.com → Seu Projeto');
          console.error('2. Vá em: SQL Editor → New Query');
          console.error('3. Cole o conteúdo de: /supabase-fix-auth.sql');
          console.error('4. Clique em: RUN (ou Ctrl+Enter)');
          console.error('5. Teste criar um usuário novamente');
          console.error('');
          console.error('📖 Documentação completa: /EXECUTE_AGORA.md');
          console.error('');
          
          return { 
            user: null, 
            error: '⚠️ Configuração do banco de dados incompleta. Por favor, execute o script /supabase-fix-auth.sql no SQL Editor do Supabase. Veja as instruções no console (F12).' 
          };
        }
        
        // Tentar deletar o usuário do Auth (limpeza)
        try {
          await supabase.auth.admin.deleteUser(authData.user.id);
          console.log('Usuário removido do Auth após falha na criação do perfil');
        } catch (cleanupError) {
          console.error('Erro ao limpar usuário do Auth:', cleanupError);
        }
        
        return { 
          user: null, 
          error: 'Erro ao criar perfil de usuário. Verifique as permissões do banco de dados.' 
        };
      }

      console.log('✅ Usuário criado manualmente na tabela usuarios:', newUser);
      usuario = newUser;
    }

    if (!usuario) {
      console.error('❌ Falha completa: usuário não foi criado na tabela usuarios');
      return { user: null, error: 'Erro ao criar perfil de usuário' };
    }

    console.log('✅ Cadastro concluído com sucesso!');
    return { user: mapUsuarioToUser(usuario), error: null };
  } catch (err) {
    console.error('❌ Erro inesperado no signup:', err);
    return { user: null, error: 'Erro inesperado ao criar conta. Verifique sua conexão.' };
  }
}

export async function signIn(credentials: LoginCredentials): Promise<{ user: User; error: null } | { user: null; error: string }> {
  try {
    console.log('🔐 Tentando fazer login:', { email: credentials.email, tipo: credentials.tipo });
    
    // 1. Autenticar com Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.senha,
    });

    if (authError) {
      console.error('❌ Erro no login (Auth):', authError);
      
      // Mensagens de erro mais amigáveis
      if (authError.message.includes('Invalid login credentials')) {
        return { 
          user: null, 
          error: 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.' 
        };
      }
      
      if (authError.message.includes('Email not confirmed')) {
        return { 
          user: null, 
          error: 'Por favor, confirme seu email antes de fazer login.' 
        };
      }
      
      return { user: null, error: `Erro ao fazer login: ${authError.message}` };
    }

    if (!authData.user) {
      console.error('❌ Auth não retornou usuário');
      return { user: null, error: 'Email ou senha incorretos.' };
    }

    console.log('✅ Autenticação bem-sucedida. ID do usuário:', authData.user.id);

    // 2. Buscar dados do usuário na tabela usuarios
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError || !usuario) {
      console.error('❌ Erro ao buscar usuário na tabela:', userError);
      return { 
        user: null, 
        error: 'Usuário não encontrado no sistema. Por favor, entre em contato com o suporte.' 
      };
    }

    console.log('✅ Usuário encontrado:', { nome: usuario.nome, perfil: usuario.perfil });

    // O usuário sempre entra com seu perfil real do banco
    // Ignoramos o tipo selecionado na UI (apenas interface)
    console.log('✅ Login bem-sucedido!');
    return { user: mapUsuarioToUser(usuario), error: null };
  } catch (err) {
    console.error('❌ Erro inesperado no login:', err);
    return { user: null, error: 'Erro inesperado ao fazer login. Verifique sua conexão.' };
  }
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Erro ao fazer logout:', error);
  }
}

export async function resetPassword(email: string): Promise<{ error: null } | { error: string }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  return error ? { error: error.message } : { error: null };
}

export async function updatePassword(newPassword: string): Promise<{ error: null } | { error: string }> {
  const { error } = await supabase.auth.updateUser({ 
    password: newPassword 
  });
  
  return error ? { error: error.message } : { error: null };
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) return null;

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error || !usuario) return null;

    return mapUsuarioToUser(usuario);
  } catch (err) {
    console.error('Erro ao buscar usuário atual:', err);
    return null;
  }
}

// ==================== USUÁRIOS ====================

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error || !data) return null;
    
    return mapUsuarioToUser(data);
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    return null;
  }
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<{ error: null } | { error: string }> {
  try {
    const usuarioUpdates: any = {};
    
    if (updates.nomeCompleto) usuarioUpdates.nome = updates.nomeCompleto;
    if (updates.email) usuarioUpdates.email = updates.email;
    
    const { error } = await supabase
      .from('usuarios')
      .update(usuarioUpdates)
      .eq('id', userId);
    
    return error ? { error: error.message } : { error: null };
  } catch (err: any) {
    console.error('Erro ao atualizar usuário:', err);
    return { error: err.message };
  }
}

// ==================== EVENTOS ====================

export async function getAllEvents(): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .order('data_inicio', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar eventos:', error);
      return [];
    }
    
    return (data || []).map(mapEventoToEvent);
  } catch (err) {
    console.error('Erro inesperado ao buscar eventos:', err);
    return [];
  }
}

export async function getEventById(eventId: string): Promise<Event | null> {
  try {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .eq('id', parseInt(eventId))
      .single();
    
    if (error || !data) return null;
    
    return mapEventoToEvent(data);
  } catch (err) {
    console.error('Erro ao buscar evento:', err);
    return null;
  }
}

export async function createEvent(eventData: Partial<CreateEventData>): Promise<{ event: Event; error: null } | { event: null; error: string }> {
  try {
    console.log('📝 Criando evento com dados:', eventData);
    
    const { data, error } = await supabase
      .from('eventos')
      .insert({
        nome: eventData.nome!,
        descricao: eventData.descricao!,
        data_inicio: eventData.data_inicio!,
        duracao_horas: eventData.duracao_horas || 0,
        limite_faltas_percentual: eventData.limite_faltas_percentual || 0,
        chave_pix: eventData.chave_pix || null,
        valor_evento: eventData.valor_evento || 0,
        texto_certificado: eventData.texto_certificado!,
        perfil_academico_foco: eventData.perfil_academico_foco || 'todos',
        // NÃO especificar ID - deixar o banco gerar automaticamente
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao criar evento:', error);
      
      // Se for erro de duplicate key, dar uma mensagem mais clara
      if (error.code === '23505') {
        return { 
          event: null, 
          error: 'Erro ao gerar ID do evento. Tente novamente em alguns segundos.' 
        };
      }
      
      return { event: null, error: error.message };
    }
    
    console.log('✅ Evento criado no banco:', data);
    return { event: mapEventoToEvent(data), error: null };
  } catch (err: any) {
    console.error('❌ Erro inesperado ao criar evento:', err);
    return { event: null, error: err.message };
  }
}

export async function updateEvent(eventId: string, updates: Partial<CreateEventData>): Promise<{ error: null } | { error: string }> {
  try {
    const { error } = await supabase
      .from('eventos')
      .update(updates)
      .eq('id', parseInt(eventId));
    
    return error ? { error: error.message } : { error: null };
  } catch (err: any) {
    console.error('Erro ao atualizar evento:', err);
    return { error: err.message };
  }
}

export async function deleteEvent(eventId: string): Promise<{ error: null } | { error: string }> {
  try {
    const { error } = await supabase
      .from('eventos')
      .delete()
      .eq('id', parseInt(eventId));
    
    return error ? { error: error.message } : { error: null };
  } catch (err: any) {
    console.error('Erro ao deletar evento:', err);
    return { error: err.message };
  }
}

// ==================== INSCRIÇÕES/PARTICIPAÇÕES ====================

export async function getRegistrationsByUserId(userId: string): Promise<(Registration & { evento: Event })[]> {
  try {
    const { data, error } = await supabase
      .from('participacoes')
      .select('*, eventos(*)')
      .eq('usuario_id', userId)
      .order('inscrito_em', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar participações:', error);
      return [];
    }
    
    return (data || []).map((p: any) => ({
      ...mapParticipacaoToRegistration(p, p.eventos),
      evento: mapEventoToEvent(p.eventos),
    }));
  } catch (err) {
    console.error('Erro inesperado ao buscar participações:', err);
    return [];
  }
}

export async function getRegistrationsByEventId(eventId: string): Promise<(Registration & { usuario: User })[]> {
  try {
    const { data, error } = await supabase
      .from('participacoes')
      .select('*, usuarios(*)')
      .eq('evento_id', parseInt(eventId))
      .order('inscrito_em', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar inscritos:', error);
      return [];
    }
    
    return (data || []).map((p: any) => ({
      ...mapParticipacaoToRegistration(p),
      usuario: mapUsuarioToUser(p.usuarios),
    }));
  } catch (err) {
    console.error('Erro inesperado ao buscar inscritos:', err);
    return [];
  }
}

export async function createRegistration(
  eventoId: number,
  usuarioId: string,
  valorEvento: number
): Promise<{ registration: Registration; error: null } | { registration: null; error: string }> {
  try {
    // Verificar se já existe inscrição
    const { data: existing } = await supabase
      .from('participacoes')
      .select('id')
      .eq('evento_id', eventoId)
      .eq('usuario_id', usuarioId)
      .single();

    if (existing) {
      return { registration: null, error: 'Você já está inscrito neste evento' };
    }

    // Criar nova participação
    const { data, error } = await supabase
      .from('participacoes')
      .insert({
        evento_id: eventoId,
        usuario_id: usuarioId,
        pagamento_status: valorEvento > 0 ? 'pendente' : 'nao_requerido',
        numero_presencas: 0,
        is_aprovado: false,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar participação:', error);
      return { registration: null, error: error.message };
    }
    
    return { 
      registration: mapParticipacaoToRegistration(data),
      error: null 
    };
  } catch (err: any) {
    console.error('Erro inesperado ao criar participação:', err);
    return { registration: null, error: err.message };
  }
}

export async function updateRegistrationPaymentStatus(
  registrationId: string,
  status: 'pendente' | 'confirmado' | 'nao_requerido'
): Promise<{ error: null } | { error: string }> {
  try {
    const { error } = await supabase
      .from('participacoes')
      .update({ pagamento_status: status })
      .eq('id', parseInt(registrationId));
    
    return error ? { error: error.message } : { error: null };
  } catch (err: any) {
    console.error('Erro ao atualizar status de pagamento:', err);
    return { error: err.message };
  }
}

// ==================== CERTIFICADOS ====================

export async function getCertificadosByUserId(userId: string): Promise<Certificado[]> {
  try {
    const { data, error } = await supabase
      .from('certificados')
      .select('*, participacoes!inner(*, eventos(*), usuarios(*))')
      .eq('participacoes.usuario_id', userId)
      .eq('is_revogado', false);
    
    if (error) {
      console.error('Erro ao buscar certificados:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Erro inesperado ao buscar certificados:', err);
    return [];
  }
}

export async function validarCertificado(codigoValidacao: string): Promise<Certificado | null> {
  try {
    const { data, error } = await supabase
      .from('certificados')
      .select('*, participacoes(*, eventos(*), usuarios(*))')
      .eq('codigo_validacao', codigoValidacao)
      .eq('is_revogado', false)
      .single();
    
    if (error || !data) return null;
    
    return data;
  } catch (err) {
    console.error('Erro ao validar certificado:', err);
    return null;
  }
}

// ==================== DASHBOARD STATS ====================

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      { data: eventos, error: eventosError },
      { data: participacoes, error: participacoesError },
      { data: usuarios, error: usuariosError },
    ] = await Promise.all([
      supabase.from('eventos').select('id, valor_evento'),
      supabase.from('participacoes').select('id, evento_id, pagamento_status'),
      supabase.from('usuarios').select('id'),
    ]);

    if (eventosError || participacoesError || usuariosError) {
      console.error('Erro ao buscar estatísticas');
      return {
        totalEventos: 0,
        totalInscritos: 0,
        eventosPagos: 0,
        receitaTotal: 0,
        eventosAtivos: 0,
        usuariosCadastrados: 0,
      };
    }

    const eventosPagos = eventos?.filter(e => e.valor_evento > 0).length || 0;
    const participacoesConfirmadas = participacoes?.filter(p => p.pagamento_status === 'confirmado') || [];
    
    // Calcular receita total
    const receitaTotal = participacoesConfirmadas.reduce((sum, p) => {
      const evento = eventos?.find(e => e.id === p.evento_id);
      return sum + (evento?.valor_evento || 0);
    }, 0);

    return {
      totalEventos: eventos?.length || 0,
      totalInscritos: participacoes?.length || 0,
      eventosPagos,
      receitaTotal,
      eventosAtivos: eventos?.length || 0,
      usuariosCadastrados: usuarios?.length || 0,
    };
  } catch (err) {
    console.error('Erro inesperado ao buscar estatísticas:', err);
    return {
      totalEventos: 0,
      totalInscritos: 0,
      eventosPagos: 0,
      receitaTotal: 0,
      eventosAtivos: 0,
      usuariosCadastrados: 0,
    };
  }
}

// ==================== UPLOAD DE ARQUIVOS ====================

export async function uploadEventImage(file: File): Promise<{ url: string; error: null } | { url: null; error: string }> {
  // TODO: Implementar com Supabase Storage quando necessário
  return { url: URL.createObjectURL(file), error: null };
}

export async function uploadUserAvatar(file: File, userId: string): Promise<{ url: string; error: null } | { url: null; error: string }> {
  // TODO: Implementar com Supabase Storage quando necessário
  return { url: URL.createObjectURL(file), error: null };
}