import { useState } from 'react';
import { Search, Calendar, MapPin, Users, DollarSign, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Event, EventCategory } from '../types';

interface UserEventsPageProps {
  events: Event[];
  onEventClick: (eventId: string) => void;
}

const categorias: (EventCategory | 'Todas')[] = [
  'Todas',
  'Semana Acadêmica',
  'Hackathon',
  'Minicurso',
  'Workshop',
  'Palestra',
  'Congresso',
];

export function UserEventsPage({ events, onEventClick }: UserEventsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'Todas'>('Todas');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'paid'>('all');

  const filteredEvents = events.filter((event) => {
    // Filtro de busca
    const matchesSearch =
      event.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.local.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro de categoria
    const matchesCategory =
      selectedCategory === 'Todas' || event.categoria === selectedCategory;

    // Filtro de tipo (gratuito/pago)
    const matchesType =
      filterType === 'all' ||
      (filterType === 'free' && event.gratuito) ||
      (filterType === 'paid' && !event.gratuito);

    // Apenas eventos publicados
    const isPublished = event.status === 'Publicado';

    return matchesSearch && matchesCategory && matchesType && isPublished;
  });

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
        <h1 className="text-4xl mb-2">Eventos Acadêmicos</h1>
        <p className="text-xl text-blue-100">
          Descubra e participe dos melhores eventos acadêmicos
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 size-4 text-gray-400" />
                <Input
                  placeholder="Buscar eventos por nome, descrição ou local..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2 md:w-auto">
                <Filter className="size-4" />
                Filtros Avançados
              </Button>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as EventCategory | 'Todas')}
              >
                <SelectTrigger className="md:w-[200px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterType('all')}
                  className="flex-1"
                >
                  Todos
                </Button>
                <Button
                  variant={filterType === 'free' ? 'default' : 'outline'}
                  onClick={() => setFilterType('free')}
                  className="flex-1"
                >
                  Gratuitos
                </Button>
                <Button
                  variant={filterType === 'paid' ? 'default' : 'outline'}
                  onClick={() => setFilterType('paid')}
                  className="flex-1"
                >
                  Pagos
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contador de Resultados */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredEvents.length} evento(s) encontrado(s)
        </p>
      </div>

      {/* Grid de Eventos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-600">
            <Calendar className="mx-auto mb-4 size-12 text-gray-400" />
            <p>Nenhum evento encontrado com os filtros selecionados.</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
              onClick={() => onEventClick(event.id)}
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={event.imagemCapa || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80'}
                  alt={event.nome}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute right-2 top-2">
                  {event.gratuito ? (
                    <Badge className="bg-green-600">Gratuito</Badge>
                  ) : (
                    <Badge className="bg-blue-600">R$ {event.valor?.toFixed(2)}</Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {event.categoria}
                  </Badge>
                  <h3 className="text-lg text-gray-900 line-clamp-2">{event.nome}</h3>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">{event.descricao}</p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    <span>
                      {new Date(event.dataInicio).toLocaleDateString('pt-BR')} -{' '}
                      {new Date(event.dataFim).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    <span className="line-clamp-1">{event.local}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="size-4" />
                    <span>
                      {event.vagas} vagas disponíveis
                    </span>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
