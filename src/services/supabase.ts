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
  EventCategory,
  EventStatus,
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
    categoria: (evento.categoria as EventCategory) || 'Workshop',
    descricao: evento.descricao,
    dataInicio: evento.data_inicio,
    dataFim: dataFim.toISOString(),
    local: evento.local || 'A definir',
    capacidadeMaxima: evento.capacidade_maxima || 100,
    vagas: evento.vagas_disponiveis ?? 50,
    gratuito: evento.valor_evento === 0,
    valor: evento.valor_evento > 0 ? evento.valor_evento : undefined,
    chavePix: evento.chave_pix || undefined,
    imagemCapa: evento.imagem_capa || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    status: (evento.status as EventStatus) || 'Publicado',
    organizadorId: evento.organizador_id || '1',
    criadoEm: evento.criado_em || evento.data_inicio,
    atualizadoEm: evento.atualizado_em || evento.data_inicio,
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
    statusPagamento: participacao.pagamento_status, // Mantém o status em minúsculo como está no banco
    valorPago: evento?.valor_evento,
    certificadoEmitido: participacao.is_aprovado,
    certificadoUrl: undefined,
    totalPresencas: participacao.numero_presencas, // Mapear campo de presenças
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
    console.log('🔍 getCurrentUser: Iniciando busca...');
    
    const { data: { user: authUser } } = await supabase.auth.getUser();
    console.log('🔍 getCurrentUser: Auth user obtido:', authUser ? authUser.id : 'null');
    
    if (!authUser) {
      console.log('🔍 getCurrentUser: Nenhum usuário autenticado');
      return null;
    }

    console.log('🔍 getCurrentUser: Buscando usuário na tabela usuarios...');
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) {
      console.error('❌ getCurrentUser: Erro ao buscar usuário:', error);
      return null;
    }
    
    if (!usuario) {
      console.error('❌ getCurrentUser: Usuário não encontrado na tabela');
      return null;
    }

    console.log('✅ getCurrentUser: Usuário encontrado:', usuario.nome);
    return mapUsuarioToUser(usuario);
  } catch (err) {
    console.error('❌ getCurrentUser: Erro inesperado:', err);
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
        // Novos campos
        local: eventData.local || 'A definir',
        capacidade_maxima: eventData.capacidade_maxima || 100,
        vagas_disponiveis: eventData.vagas_disponiveis || eventData.capacidade_maxima || 100,
        categoria: eventData.categoria || 'Workshop',
        imagem_capa: eventData.imagem_capa || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
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

    // Verificar vagas disponíveis
    const { data: evento, error: eventoError } = await supabase
      .from('eventos')
      .select('vagas_disponiveis, capacidade_maxima')
      .eq('id', eventoId)
      .single();

    if (eventoError) {
      console.error('Erro ao buscar evento:', eventoError);
      return { registration: null, error: 'Erro ao verificar vagas do evento' };
    }

    if (evento.vagas_disponiveis <= 0) {
      return { registration: null, error: 'Não há mais vagas disponíveis para este evento' };
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

    // Decrementar vagas disponíveis
    const novasVagas = evento.vagas_disponiveis - 1;
    const { error: updateError } = await supabase
      .from('eventos')
      .update({ vagas_disponiveis: novasVagas })
      .eq('id', eventoId);

    if (updateError) {
      console.error('Erro ao atualizar vagas:', updateError);
      // Não retornar erro aqui, a inscrição já foi criada
    }

    console.log(`✅ Inscrição criada! Vagas disponíveis: ${novasVagas}`);
    
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

// ==================== CHECK-IN / PRESENÇA ====================

/**
 * Registra check-in de um participante em um evento
 * @param eventoId ID do evento
 * @param usuarioId ID do usuário
 * @param qrCode Dados do QR Code escaneado
 * @param sessaoNome Nome da sessão atual (opcional)
 * @returns Sucesso ou erro
 */
export async function registerCheckIn(
  eventoId: string,
  usuarioId: string,
  qrCode: string,
  sessaoNome?: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    console.log('📝 Iniciando check-in:', { eventoId, usuarioId, qrCode });

    // 1. Validar formato do QR Code (deve conter o ID do evento)
    const qrCodeLower = qrCode.toLowerCase();
    if (!qrCodeLower.includes(eventoId) && !qrCodeLower.includes(`evento-${eventoId}`)) {
      console.error('❌ QR Code não corresponde ao evento');
      return { 
        success: false, 
        error: 'QR Code inválido para este evento. Escaneie o QR Code correto.' 
      };
    }

    // 2. Buscar evento e validar se está em andamento
    const { data: evento, error: eventoError } = await supabase
      .from('eventos')
      .select('id, nome, data_inicio, duracao_horas')
      .eq('id', parseInt(eventoId))
      .single();

    if (eventoError || !evento) {
      console.error('❌ Evento não encontrado:', eventoError);
      return { success: false, error: 'Evento não encontrado.' };
    }

    // Verificar se evento está em andamento
    const now = new Date();
    const dataInicio = new Date(evento.data_inicio);
    const dataFim = new Date(dataInicio);
    dataFim.setHours(dataFim.getHours() + evento.duracao_horas);

    if (now < dataInicio) {
      return { 
        success: false, 
        error: 'O evento ainda não começou. Check-in indisponível.' 
      };
    }

    if (now > dataFim) {
      return { 
        success: false, 
        error: 'O evento já terminou. Check-in não é mais permitido.' 
      };
    }

    // 3. Buscar participação do usuário no evento
    const { data: participacao, error: participacaoError } = await supabase
      .from('participacoes')
      .select('id, usuario_id, evento_id, numero_presencas, pagamento_status')
      .eq('evento_id', parseInt(eventoId))
      .eq('usuario_id', usuarioId)
      .single();

    if (participacaoError || !participacao) {
      console.error('❌ Participação não encontrada:', participacaoError);
      return { 
        success: false, 
        error: 'Você não está inscrito neste evento. Faça a inscrição primeiro.' 
      };
    }

    // 4. Verificar se pagamento está confirmado (se não for gratuito)
    if (participacao.pagamento_status === 'pendente') {
      return {
        success: false,
        error: 'Seu pagamento ainda está pendente. Confirme o pagamento antes de fazer check-in.'
      };
    }

    // 5. Verificar se já fez check-in hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const { data: checkinsHoje, error: checkinsError } = await supabase
      .from('presencas_detalhes')
      .select('id')
      .eq('participacao_id', participacao.id)
      .gte('data_registro', hoje.toISOString())
      .lt('data_registro', amanha.toISOString());

    if (checkinsError) {
      console.error('⚠️ Erro ao verificar check-ins:', checkinsError);
      // Continuar mesmo com erro na verificação
    }

    if (checkinsHoje && checkinsHoje.length > 0) {
      return {
        success: false,
        error: 'Você já fez check-in hoje neste evento.'
      };
    }

    // 6. Determinar nome da sessão
    const diasDesdeInicio = Math.floor((now.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24));
    const nomeSessao = sessaoNome || `Dia ${diasDesdeInicio + 1} - ${now.getHours() < 12 ? 'Manhã' : now.getHours() < 18 ? 'Tarde' : 'Noite'}`;

    // 7. Inserir registro de presença
    const { data: presenca, error: presencaError } = await supabase
      .from('presencas_detalhes')
      .insert({
        participacao_id: participacao.id,
        data_registro: now.toISOString(),
        sessao_nome: nomeSessao,
        registrado_por: usuarioId,
      })
      .select()
      .single();

    if (presencaError) {
      console.error('❌ Erro ao registrar presença:', presencaError);
      return { 
        success: false, 
        error: 'Erro ao registrar check-in. Tente novamente.' 
      };
    }

    console.log('✅ Presença registrada:', presenca);

    // 8. Atualizar contador de presenças
    const novoNumeroPresencas = participacao.numero_presencas + 1;
    const { error: updateError } = await supabase
      .from('participacoes')
      .update({ numero_presencas: novoNumeroPresencas })
      .eq('id', participacao.id);

    if (updateError) {
      console.error('⚠️ Erro ao atualizar contador:', updateError);
      // Não retornar erro, pois a presença já foi registrada
    }

    console.log(`✅ Check-in realizado! Total de presenças: ${novoNumeroPresencas}`);

    return {
      success: true,
      message: `Check-in realizado com sucesso! Presença ${novoNumeroPresencas} registrada.`
    };

  } catch (err: any) {
    console.error('❌ Erro inesperado ao fazer check-in:', err);
    return { 
      success: false, 
      error: 'Erro inesperado ao processar check-in. Tente novamente.' 
    };
  }
}

/**
 * Busca histórico de check-ins de um participante em um evento
 */
export async function getCheckInHistory(
  eventoId: string,
  usuarioId: string
): Promise<{ checkins: any[]; total: number; error?: string }> {
  try {
    // Buscar participação
    const { data: participacao, error: participacaoError } = await supabase
      .from('participacoes')
      .select('id')
      .eq('evento_id', parseInt(eventoId))
      .eq('usuario_id', usuarioId)
      .single();

    if (participacaoError || !participacao) {
      return { checkins: [], total: 0, error: 'Participação não encontrada.' };
    }

    // Buscar check-ins
    const { data: checkins, error: checkinsError } = await supabase
      .from('presencas_detalhes')
      .select('id, data_registro, sessao_nome')
      .eq('participacao_id', participacao.id)
      .order('data_registro', { ascending: false });

    if (checkinsError) {
      console.error('Erro ao buscar check-ins:', checkinsError);
      return { checkins: [], total: 0, error: checkinsError.message };
    }

    return {
      checkins: checkins || [],
      total: checkins?.length || 0
    };
  } catch (err: any) {
    console.error('Erro ao buscar histórico:', err);
    return { checkins: [], total: 0, error: err.message };
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

// ==================== GERENCIAMENTO DE INSCRIÇÕES (ADMIN) ====================

/**
 * Atualizar status de pagamento de uma inscrição
 */
export async function updatePaymentStatus(
  registrationId: string,
  status: 'confirmado' | 'cancelado'
): Promise<{ error: null } | { error: string }> {
  try {
    console.log(`📝 Atualizando status de pagamento: ${registrationId} para ${status}`);
    
    const { error } = await supabase
      .from('participacoes')
      .update({ pagamento_status: status })
      .eq('id', registrationId);
    
    if (error) {
      console.error('❌ Erro ao atualizar status de pagamento:', error);
      return { error: error.message };
    }
    
    console.log('✅ Status de pagamento atualizado com sucesso');
    return { error: null };
  } catch (err: any) {
    console.error('❌ Erro inesperado ao atualizar pagamento:', err);
    return { error: 'Erro inesperado ao atualizar pagamento' };
  }
}

/**
 * Atualizar total de presenças de um participante manualmente
 */
export async function updateAttendance(
  registrationId: string,
  newCheckInsCount: number
): Promise<{ error: null } | { error: string }> {
  try {
    console.log(`📝 Atualizando presenças: ${registrationId} para ${newCheckInsCount}`);
    
    const { error } = await supabase
      .from('participacoes')
      .update({ total_presencas: newCheckInsCount })
      .eq('id', registrationId);
    
    if (error) {
      console.error('❌ Erro ao atualizar presenças:', error);
      return { error: error.message };
    }
    
    console.log('✅ Presenças atualizadas com sucesso');
    return { error: null };
  } catch (err: any) {
    console.error('❌ Erro inesperado ao atualizar presenças:', err);
    return { error: 'Erro inesperado ao atualizar presenças' };
  }
}