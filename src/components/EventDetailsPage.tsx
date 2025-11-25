import { ArrowLeft, Calendar, MapPin, Users, Clock, DollarSign, Share2, Bookmark } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Event } from '../types';

interface EventDetailsPageProps {
  event: Event;
  onBack: () => void;
  onRegister: (eventId: string) => void;
  isRegistered?: boolean;
}

export function EventDetailsPage({
  event,
  onBack,
  onRegister,
  isRegistered = false,
}: EventDetailsPageProps) {
  const vagasDisponiveis = event.vagas;
  const percentualVagas = (vagasDisponiveis / event.capacidadeMaxima) * 100;
  const inscritos = event.capacidadeMaxima - vagasDisponiveis;

  const dataInicio = new Date(event.dataInicio);
  const dataFim = new Date(event.dataFim);
  const duracaoDias = Math.ceil(
    (dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Verificar se o evento já terminou
  const now = new Date();
  const eventoTerminou = dataFim < now;

  return (
    <div className="space-y-6">
      {/* Botão Voltar */}
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="size-4" />
        Voltar para eventos
      </Button>

      {/* Imagem de Capa */}
      <div className="relative h-64 overflow-hidden rounded-lg md:h-96">
        <ImageWithFallback
          src={event.imagemCapa || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80'}
          alt={event.nome}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {eventoTerminou && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge className="bg-red-600 text-white text-lg px-6 py-3">
              Evento Encerrado
            </Badge>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <Badge className="mb-2 bg-white/20 backdrop-blur-sm">
            {event.categoria}
          </Badge>
          <h1 className="text-3xl md:text-4xl">{event.nome}</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conteúdo Principal */}
        <div className="space-y-6 lg:col-span-2">
          {/* Sobre o Evento */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl text-gray-900">Sobre o Evento</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {event.descricao}
              </p>
            </CardContent>
          </Card>

          {/* Informações Detalhadas */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl text-gray-900">Informações</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Calendar className="size-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Data de Início</p>
                    <p className="text-gray-900">
                      {dataInicio.toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {dataInicio.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="size-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Data de Término</p>
                    <p className="text-gray-900">
                      {dataFim.toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {dataFim.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="size-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Duração</p>
                    <p className="text-gray-900">
                      {duracaoDias === 1 ? '1 dia' : `${duracaoDias} dias`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Local</p>
                    <p className="text-gray-900">{event.local}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organizador (placeholder) */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl text-gray-900">Organizador</h2>
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-blue-100">
                  <Users className="size-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-900">Coordenação de Eventos</p>
                  <p className="text-sm text-gray-600">organizacao@eventosacad.com.br</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Card de Inscrição */}
        <div className="space-y-4">
          <Card className="sticky top-20">
            <CardContent className="p-6 space-y-4">
              {/* Preço */}
              <div>
                {event.gratuito ? (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600 text-lg px-4 py-2">Gratuito</Badge>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600">Valor da Inscrição</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl text-gray-900">
                        R$ {event.valor?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Vagas */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Vagas Disponíveis</span>
                  <span className="text-gray-900">
                    {vagasDisponiveis} de {event.capacidadeMaxima}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${100 - percentualVagas}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">{inscritos} pessoas já inscritas</p>
              </div>

              <Separator />

              {/* Botão de Inscrição */}
              {isRegistered ? (
                <Button className="w-full" variant="outline" disabled>
                  Você já está inscrito
                </Button>
              ) : vagasDisponiveis === 0 ? (
                <Button className="w-full" variant="outline" disabled>
                  Vagas Esgotadas
                </Button>
              ) : eventoTerminou ? (
                <Button className="w-full" variant="outline" disabled>
                  Evento Encerrado
                </Button>
              ) : (
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => onRegister(event.id)}
                >
                  {event.gratuito ? 'Inscrever-se Gratuitamente' : 'Inscrever-se e Pagar'}
                </Button>
              )}

              {/* Ações Secundárias */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <Bookmark className="size-4" />
                  Salvar
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Share2 className="size-4" />
                  Compartilhar
                </Button>
              </div>

              {/* Informações Adicionais */}
              <div className="space-y-2 rounded-lg bg-blue-50 p-4 text-sm">
                <p className="text-blue-900">
                  ✓ Certificado de participação
                </p>
                <p className="text-blue-900">
                  ✓ Material do evento incluído
                </p>
                {!event.gratuito && (
                  <p className="text-blue-900">
                    ✓ Pagamento seguro via cartão
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}