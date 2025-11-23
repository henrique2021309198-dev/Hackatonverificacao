import { useState, useEffect } from 'react';
import type { Event } from '../types';
import { getAllEvents, createEvent as createEventService, updateEvent as updateEventService, deleteEvent as deleteEventService } from '../services/supabase';

/**
 * Hook customizado para gerenciar eventos
 * 
 * Este hook facilita o gerenciamento de eventos em toda a aplicação.
 * Integrado com Supabase para sincronização em tempo real.
 */
export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar eventos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: any) => {
    try {
      const { event, error } = await createEventService(eventData);
      if (error) {
        setError(error);
        return null;
      }
      // Recarregar eventos para obter lista atualizada
      await loadEvents();
      return event;
    } catch (err) {
      setError('Erro ao criar evento');
      console.error(err);
      return null;
    }
  };

  const updateEvent = async (eventId: string, updates: Partial<Event>) => {
    try {
      const { error } = await updateEventService(eventId, updates);
      if (error) {
        setError(error);
        return;
      }
      // Recarregar eventos para obter lista atualizada
      await loadEvents();
    } catch (err) {
      setError('Erro ao atualizar evento');
      console.error(err);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await deleteEventService(eventId);
      if (error) {
        setError(error);
        return;
      }
      // Recarregar eventos para obter lista atualizada
      await loadEvents();
    } catch (err) {
      setError('Erro ao deletar evento');
      console.error(err);
    }
  };

  return {
    events,
    loading,
    error,
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}