import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { Header } from './components/Header';
import { AdminSidebar } from './components/AdminSidebar';
import { UserNavbar } from './components/UserNavbar';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { CreateEventForm } from './components/CreateEventForm';
import { EventsListAdmin } from './components/EventsListAdmin';
import { EventRegistrations } from './components/EventRegistrations';
import { UserEventsPage } from './components/UserEventsPage';
import { EventDetailsPage } from './components/EventDetailsPage';
import { PaymentModal } from './components/PaymentModal';
import { MyEventsPage } from './components/MyEventsPage';
import { ProfilePage } from './components/ProfilePage';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import type { Event, Registration, User, LoginCredentials, SignupData, PaymentData } from './types';

type AuthPage = 'login' | 'signup' | 'forgot-password';
type AdminSection = 'dashboard' | 'eventos' | 'criar-evento' | 'inscritos' | 'configuracoes';
type UserSection = 'home' | 'meus-eventos' | 'perfil' | 'event-details';

function AppContent() {
  const { user, isAuthenticated, login, logout, updateUser, loading } = useAuth();

  // Estado de autenticação
  const [authPage, setAuthPage] = useState<AuthPage>('login');

  // Estado da área admin
  const [adminSection, setAdminSection] = useState<AdminSection>('dashboard');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Estado da área do usuário
  const [userSection, setUserSection] = useState<UserSection>('home');
  const [selectedUserEventId, setSelectedUserEventId] = useState<string | null>(null);

  // Estado de dados
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<(Registration & { evento: Event })[]>([]);

  // Estado de modais
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [eventToRegister, setEventToRegister] = useState<Event | null>(null);

  // Handlers de autenticação
  const handleLogin = async (credentials: LoginCredentials) => {
    const result = await login(credentials);
    if (result.success) {
      toast.success('Login realizado com sucesso!');
    } else {
      toast.error(result.error || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const handleSignup = async (data: SignupData) => {
    try {
      const { signUp } = await import('./services/supabase');
      const result = await signUp(data);
      
      if (result.error) {
        // Verificar se é erro de RLS (configuração do banco)
        if (result.error.includes('Configuração do banco de dados') || result.error.includes('supabase-fix-auth.sql')) {
          toast.error(result.error, {
            duration: 10000, // 10 segundos
            action: {
              label: 'Abrir Console',
              onClick: () => {
                console.log('');
                console.log('🚨 INSTRUÇÕES PARA CORRIGIR O ERRO:');
                console.log('');
                console.log('1. Abra: https://app.supabase.com → Seu Projeto');
                console.log('2. Vá em: SQL Editor → New Query');
                console.log('3. Cole o conteúdo de: /supabase-fix-auth.sql');
                console.log('4. Clique em: RUN (ou Ctrl+Enter)');
                console.log('5. Teste criar um usuário novamente');
                console.log('');
                console.log('📖 Documentação completa: /EXECUTE_AGORA.md');
                console.log('');
              },
            },
          });
        } else {
          toast.error(result.error);
        }
        return;
      }
      
      toast.success('Conta criada com sucesso! Faça login para continuar.');
      setAuthPage('login');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      const { resetPassword } = await import('./services/supabase');
      const result = await resetPassword(email);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      toast.success('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
      setAuthPage('login');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar e-mail de recuperação');
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.info('Você saiu da sua conta.');
  };

  // Handlers de eventos (Admin)
  const handleCreateEvent = async (eventData: Partial<Event>) => {
    try {
      // Mapear campos do formulário para o formato do banco
      const createData = {
        nome: eventData.nome!,
        descricao: eventData.descricao!,
        data_inicio: eventData.dataInicio!,
        duracao_horas: 
          eventData.dataFim && eventData.dataInicio
            ? Math.round((new Date(eventData.dataFim).getTime() - new Date(eventData.dataInicio).getTime()) / (1000 * 60 * 60))
            : 0,
        limite_faltas_percentual: 25, // Padrão: 25% de faltas permitidas
        chave_pix: null,
        valor_evento: eventData.valor || 0,
        texto_certificado: `Certificamos que {nome_participante} participou do evento {nome_evento} com carga horária de {carga_horaria} horas.`,
        perfil_academico_foco: 'todos',
      };

      const { createEvent } = await import('./services/supabase');
      const { event, error } = await createEvent(createData);

      if (error) {
        toast.error(`Erro ao criar evento: ${error}`);
        return;
      }

      // Atualizar lista local
      if (event) {
        setEvents([event, ...events]);
      }
      
      setAdminSection('eventos');
      toast.success('Evento criado com sucesso no banco de dados!');
    } catch (err) {
      console.error('Erro ao criar evento:', err);
      toast.error('Erro inesperado ao criar evento.');
    }
  };

  const handleEditEvent = (eventId: string) => {
    // TODO: Implementar edição
    toast.info('Funcionalidade de edição em desenvolvimento.');
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { deleteEvent } = await import('./services/supabase');
      const { error } = await deleteEvent(eventId);

      if (error) {
        toast.error(`Erro ao excluir evento: ${error}`);
        return;
      }

      // Atualizar lista local
      setEvents(events.filter((e) => e.id !== eventId));
      toast.success('Evento excluído com sucesso do banco de dados!');
    } catch (err) {
      console.error('Erro ao excluir evento:', err);
      toast.error('Erro inesperado ao excluir evento.');
    }
  };

  const handleViewRegistrations = (eventId: string) => {
    setSelectedEventId(eventId);
    setAdminSection('inscritos');
  };

  // Handlers de inscrição (User)
  const handleRegisterForEvent = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    // Verificar se já está inscrito
    const alreadyRegistered = registrations.some(
      (r) => r.eventoId === eventId && r.usuarioId === user?.id
    );

    if (alreadyRegistered) {
      toast.error('Você já está inscrito neste evento!');
      return;
    }

    if (event.vagas === 0) {
      toast.error('Não há mais vagas disponíveis!');
      return;
    }

    if (event.gratuito) {
      // Inscrição gratuita imediata
      const newRegistration: Registration & { evento: Event } = {
        id: `reg-${Date.now()}`,
        eventoId: eventId,
        usuarioId: user?.id || '1',
        dataInscricao: new Date().toISOString(),
        statusPagamento: 'Confirmado',
        certificadoEmitido: false,
        evento: event,
      };

      setRegistrations([newRegistration, ...registrations]);
      
      // Atualizar vagas
      setEvents(
        events.map((e) => (e.id === eventId ? { ...e, vagas: e.vagas - 1 } : e))
      );

      toast.success('Inscrição realizada com sucesso!');
      setUserSection('meus-eventos');
    } else {
      // Abrir modal de pagamento
      setEventToRegister(event);
      setPaymentModalOpen(true);
    }
  };

  const handleConfirmPayment = (paymentData: PaymentData) => {
    // TODO: Integração com Supabase e gateway de pagamento
    if (!eventToRegister) return;

    const newRegistration: Registration & { evento: Event } = {
      id: `reg-${Date.now()}`,
      eventoId: eventToRegister.id,
      usuarioId: user?.id || '1',
      dataInscricao: new Date().toISOString(),
      statusPagamento: 'Confirmado',
      valorPago: eventToRegister.valor,
      certificadoEmitido: false,
      evento: eventToRegister,
    };

    setRegistrations([newRegistration, ...registrations]);
    
    // Atualizar vagas
    setEvents(
      events.map((e) =>
        e.id === eventToRegister.id ? { ...e, vagas: e.vagas - 1 } : e
      )
    );

    toast.success('Pagamento confirmado! Inscrição realizada com sucesso!');
    setPaymentModalOpen(false);
    setEventToRegister(null);
    setUserSection('meus-eventos');
  };

  const handleDownloadCertificate = (registrationId: string) => {
    // TODO: Integração com Supabase para gerar/baixar certificado
    toast.success('Certificado baixado com sucesso!');
  };

  // Handlers de perfil
  const handleUpdateProfile = (data: Partial<User>) => {
    // TODO: Integração com Supabase
    updateUser(data);
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleChangePassword = (currentPassword: string, newPassword: string) => {
    // TODO: Integração com Supabase
    toast.success('Senha alterada com sucesso!');
  };

  // Navegação de eventos
  const handleEventClick = (eventId: string) => {
    setSelectedUserEventId(eventId);
    setUserSection('event-details');
  };

  const handleBackToEvents = () => {
    setSelectedUserEventId(null);
    setUserSection('home');
  };

  // Carregar eventos do banco de dados quando o usuário fizer login
  useEffect(() => {
    if (isAuthenticated) {
      loadEvents();
    }
  }, [isAuthenticated]);

  const loadEvents = async () => {
    try {
      const { getAllEvents } = await import('./services/supabase');
      const loadedEvents = await getAllEvents();
      setEvents(loadedEvents);
      console.log('✅ Eventos carregados do banco:', loadedEvents.length);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
      toast.error('Erro ao carregar eventos.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 size-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Renderização condicional baseada em autenticação
  if (!isAuthenticated) {
    if (authPage === 'signup') {
      return (
        <SignupPage
          onSignup={handleSignup}
          onBackToLogin={() => setAuthPage('login')}
        />
      );
    }

    if (authPage === 'forgot-password') {
      return (
        <ForgotPasswordPage
          onSubmit={handleForgotPassword}
          onBack={() => setAuthPage('login')}
        />
      );
    }

    return (
      <LoginPage
        onLogin={handleLogin}
        onSignupClick={() => setAuthPage('signup')}
        onForgotPasswordClick={() => setAuthPage('forgot-password')}
      />
    );
  }

  // Área do Administrador
  if (user?.role === 'admin') {
    const selectedEvent = selectedEventId
      ? events.find((e) => e.id === selectedEventId)
      : null;
    const eventRegistrations: Registration[] = []; // TODO: Buscar do Supabase

    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header
          userName={user.nomeCompleto}
          userEmail={user.email}
          userAvatar={user.fotoPerfil}
          onLogout={handleLogout}
          onProfileClick={() => setAdminSection('configuracoes')}
        />
        <div className="flex flex-1">
          <AdminSidebar
            activeSection={adminSection}
            onSectionChange={(section) => setAdminSection(section as AdminSection)}
          />
          <main className="ml-64 flex-1 p-6">
            {adminSection === 'dashboard' && (
              <AdminDashboard stats={{ totalEventos: 0, totalInscritos: 0, receitaTotal: 0, taxaConversao: 0 }} />
            )}
            {adminSection === 'eventos' && (
              <EventsListAdmin
                events={events}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                onViewRegistrations={handleViewRegistrations}
              />
            )}
            {adminSection === 'criar-evento' && (
              <CreateEventForm
                onCreateEvent={handleCreateEvent}
                onCancel={() => setAdminSection('eventos')}
              />
            )}
            {adminSection === 'inscritos' && selectedEvent && (
              <EventRegistrations
                event={selectedEvent}
                registrations={eventRegistrations}
                onBack={() => {
                  setSelectedEventId(null);
                  setAdminSection('eventos');
                }}
              />
            )}
            {adminSection === 'configuracoes' && (
              <ProfilePage
                user={user}
                onUpdateProfile={handleUpdateProfile}
                onChangePassword={() => setChangePasswordModalOpen(true)}
              />
            )}
          </main>
        </div>
        <ChangePasswordModal
          open={changePasswordModalOpen}
          onClose={() => setChangePasswordModalOpen(false)}
          onConfirm={handleChangePassword}
        />
        <Toaster />
      </div>
    );
  }

  // Área do Usuário
  const selectedUserEvent = selectedUserEventId
    ? events.find((e) => e.id === selectedUserEventId)
    : null;
  const userRegistrations = registrations.filter((r) => r.usuarioId === user?.id);
  const isRegisteredForEvent = selectedUserEvent
    ? userRegistrations.some((r) => r.eventoId === selectedUserEvent.id)
    : false;

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        userName={user?.nomeCompleto}
        userEmail={user?.email}
        userAvatar={user?.fotoPerfil}
        onLogout={handleLogout}
        onProfileClick={() => setUserSection('perfil')}
      />
      <UserNavbar
        activeSection={userSection}
        onSectionChange={(section) => setUserSection(section as UserSection)}
      />
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          {userSection === 'home' && (
            <UserEventsPage events={events} onEventClick={handleEventClick} />
          )}
          {userSection === 'event-details' && selectedUserEvent && (
            <EventDetailsPage
              event={selectedUserEvent}
              onBack={handleBackToEvents}
              onRegister={handleRegisterForEvent}
              isRegistered={isRegisteredForEvent}
            />
          )}
          {userSection === 'meus-eventos' && (
            <MyEventsPage
              registrations={userRegistrations}
              onEventClick={handleEventClick}
              onDownloadCertificate={handleDownloadCertificate}
            />
          )}
          {userSection === 'perfil' && (
            <ProfilePage
              user={user}
              onUpdateProfile={handleUpdateProfile}
              onChangePassword={() => setChangePasswordModalOpen(true)}
            />
          )}
        </div>
      </main>
      <Footer />
      {eventToRegister && (
        <PaymentModal
          open={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setEventToRegister(null);
          }}
          event={eventToRegister}
          onConfirmPayment={handleConfirmPayment}
        />
      )}
      <ChangePasswordModal
        open={changePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
        onConfirm={handleChangePassword}
      />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}