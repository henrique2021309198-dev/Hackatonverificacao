import { generateCertificate } from '../components/CertificateGenerator';
import type { Registration, Event, User } from '../types';

/**
 * Gera e faz download do certificado para uma participação
 */
export async function downloadCertificate(
  registration: Registration & { evento: Event },
  user: User
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validar se o evento já foi concluído
    const eventEndDate = new Date(registration.evento.dataFim);
    const now = new Date();

    if (eventEndDate > now) {
      return {
        success: false,
        error: 'O evento ainda não foi concluído. O certificado estará disponível após o término.',
      };
    }

    // Validar se o usuário foi aprovado
    if (!registration.certificadoEmitido && registration.statusPagamento !== 'confirmado') {
      return {
        success: false,
        error: 'Você não foi aprovado neste evento ou seu pagamento ainda não foi confirmado.',
      };
    }

    // Calcular horas de presença (assumindo 100% se não tiver informação)
    const totalHours = calculateEventDuration(
      registration.evento.dataInicio,
      registration.evento.dataFim
    );
    
    // Por enquanto, assumir 100% de presença
    // TODO: Buscar dados reais de presença do banco de dados
    const attendedHours = totalHours;

    // Buscar ou gerar token de validação do certificado
    let validationToken: string | undefined;
    
    try {
      // Tentar buscar certificado existente do banco
      const { validarCertificado } = await import('../services/supabase');
      
      // Por enquanto, gerar um UUID simples como token
      // Em produção, isso deve ser buscado/gerado no banco de dados
      validationToken = registration.certificadoUrl || generateUUID();
      
      console.log('Token de validação do certificado:', validationToken);
    } catch (error) {
      console.warn('Não foi possível gerar token de validação:', error);
    }

    // Gerar certificado
    generateCertificate({
      participantName: user.nomeCompleto,
      eventName: registration.evento.nome,
      eventStartDate: registration.evento.dataInicio,
      eventEndDate: registration.evento.dataFim,
      totalHours,
      attendedHours,
      approvalDate: registration.dataInscricao,
      validationToken,
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao gerar certificado:', error);
    return {
      success: false,
      error: 'Erro ao gerar certificado. Tente novamente.',
    };
  }
}

/**
 * Gera um UUID v4 simples
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Calcula a duração do evento em horas
 */
function calculateEventDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
  return diffHours > 0 ? diffHours : 1;
}

/**
 * Verifica se o participante está apto a receber certificado
 */
export function canReceiveCertificate(
  registration: Registration & { evento: Event }
): { canReceive: boolean; reason?: string } {
  // Verificar se o evento já foi concluído
  const eventEndDate = new Date(registration.evento.dataFim);
  const now = new Date();

  if (eventEndDate > now) {
    return {
      canReceive: false,
      reason: 'Evento ainda não foi concluído',
    };
  }

  // Verificar se foi aprovado
  if (!registration.certificadoEmitido && registration.statusPagamento !== 'Confirmado') {
    return {
      canReceive: false,
      reason: 'Participante não aprovado ou pagamento pendente',
    };
  }

  return { canReceive: true };
}