import { useState, useEffect } from 'react';
import type { Registration, Event } from '../types';
import {
  getRegistrationsByUserId,
  createRegistration as createRegistrationService,
} from '../services/supabase';

/**
 * Hook customizado para gerenciar inscrições
 * 
 * Este hook facilita o gerenciamento de inscrições do usuário.
 * Integrado com Supabase para sincronização em tempo real.
 */
export function useRegistrations(userId?: string) {
  const [registrations, setRegistrations] = useState<(Registration & { evento: Event })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadRegistrations();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadRegistrations = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const data = await getRegistrationsByUserId(userId);
      setRegistrations(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar inscrições');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createRegistration = async (eventoId: number, valorEvento: number) => {
    if (!userId) {
      setError('Usuário não autenticado');
      return null;
    }

    try {
      const { registration, error } = await createRegistrationService(
        eventoId,
        userId,
        valorEvento
      );
      
      if (error) {
        setError(error);
        return null;
      }
      
      // Recarregar para obter dados completos com o evento
      await loadRegistrations();
      return registration;
    } catch (err) {
      setError('Erro ao criar inscrição');
      console.error(err);
      return null;
    }
  };

  const isRegistered = (eventId: string) => {
    return registrations.some((r) => r.eventoId === eventId);
  };

  return {
    registrations,
    loading,
    error,
    loadRegistrations,
    createRegistration,
    isRegistered,
  };
}
