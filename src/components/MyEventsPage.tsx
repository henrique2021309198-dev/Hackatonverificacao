import { Calendar, MapPin, Download, CheckCircle2, Clock, XCircle, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Event, Registration } from '../types';

interface MyEventsPageProps {
  registrations: (Registration & { evento: Event })[];
  onEventClick: (eventId: string) => void;
  onDownloadCertificate: (registrationId: string) => void;
}

export function MyEventsPage({
  registrations,
  onEventClick,
  onDownloadCertificate,
}: MyEventsPageProps) {
  const now = new Date();

  // Filtrar eventos por status
  const upcomingEvents = registrations.filter(
    (reg) => new Date(reg.evento.dataInicio) > now
  );
  const pastEvents = registrations.filter((reg) => new Date(reg.evento.dataFim) < now);
  const activeEvents = registrations.filter(
    (reg) =>
      new Date(reg.evento.dataInicio) <= now && new Date(reg.evento.dataFim) >= now
  );

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmado':
        return <CheckCircle2 className="size-4 text-green-600" />;
      case 'Pendente':
        return <Clock className="size-4 text-yellow-600" />;
      case 'Cancelado':
        return <XCircle className="size-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmado':
        return 'bg-green-100 text-green-700';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-700';
      case 'Cancelado':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const canDownloadCertificate = (registration: Registration & { evento: Event }) => {
    // Pode baixar certificado se o evento já passou e o pagamento está confirmado (ou é gratuito)
    const eventEnded = new Date(registration.evento.dataFim) < now;
    const paymentOk =
      registration.evento.gratuito || registration.statusPagamento === 'Confirmado';
    // Não precisa verificar certificadoEmitido - o certificado é gerado on-demand
    return eventEnded && paymentOk;
  };

  const EventCard = ({ registration }: { registration: Registration & { evento: Event } }) => {
    const { evento } = registration;
    const eventEnded = new Date(evento.dataFim) < now;
    const canGetCertificate = canDownloadCertificate(registration);

    return (
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <div className="flex flex-col md:flex-row">
          <div
            className="relative h-48 w-full cursor-pointer md:h-auto md:w-48"
            onClick={() => onEventClick(evento.id)}
          >
            <ImageWithFallback
              src={evento.imagemCapa || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80'}
              alt={evento.nome}
              className="h-full w-full object-cover"
            />
            <div className="absolute right-2 top-2">
              <Badge className="bg-blue-600">{evento.categoria}</Badge>
            </div>
          </div>

          <CardContent className="flex-1 p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div>
                <h3
                  className="text-xl text-gray-900 cursor-pointer hover:text-blue-600 mb-2"
                  onClick={() => onEventClick(evento.id)}
                >
                  {evento.nome}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">{evento.descricao}</p>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="size-4" />
                  <span>
                    {new Date(evento.dataInicio).toLocaleDateString('pt-BR')} -{' '}
                    {new Date(evento.dataFim).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="size-4" />
                  <span className="line-clamp-1">{evento.local}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getPaymentStatusColor(registration.statusPagamento)}>
                  <span className="flex items-center gap-1">
                    {getPaymentStatusIcon(registration.statusPagamento)}
                    Pagamento: {registration.statusPagamento}
                  </span>
                </Badge>

                {evento.gratuito ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Gratuito
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    R$ {evento.valor?.toFixed(2)}
                  </Badge>
                )}

                {eventEnded && (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700">
                    Encerrado
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onEventClick(evento.id)}
                >
                  Ver Detalhes
                </Button>

                {canGetCertificate ? (
                  <Button
                    className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                    onClick={() => onDownloadCertificate(registration.id)}
                  >
                    <Download className="size-4" />
                    Baixar Certificado
                  </Button>
                ) : eventEnded ? (
                  <Button className="flex-1 gap-2" variant="outline" disabled>
                    <Award className="size-4" />
                    Certificado Indisponível
                  </Button>
                ) : null}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-gray-900">Meus Eventos</h1>
        <p className="text-gray-600">Gerencie suas inscrições e certificados</p>
      </div>

      {registrations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="mx-auto mb-4 size-12 text-gray-400" />
            <h3 className="text-xl text-gray-900 mb-2">Nenhuma inscrição ainda</h3>
            <p className="text-gray-600 mb-4">
              Você ainda não se inscreveu em nenhum evento. Explore os eventos disponíveis e
              comece sua jornada de aprendizado!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">
              Próximos ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Em Andamento ({activeEvents.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Concluídos ({pastEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-600">
                  Nenhum evento próximo
                </CardContent>
              </Card>
            ) : (
              upcomingEvents.map((reg) => <EventCard key={reg.id} registration={reg} />)
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeEvents.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-600">
                  Nenhum evento em andamento
                </CardContent>
              </Card>
            ) : (
              activeEvents.map((reg) => <EventCard key={reg.id} registration={reg} />)
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastEvents.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-600">
                  Nenhum evento concluído
                </CardContent>
              </Card>
            ) : (
              pastEvents.map((reg) => <EventCard key={reg.id} registration={reg} />)
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}