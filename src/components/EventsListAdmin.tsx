import { useState } from 'react';
import { Eye, Pencil, Trash2, Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import type { Event } from '../types';

interface EventsListAdminProps {
  events: Event[];
  onEdit: (eventId: string) => void;
  onDelete: (eventId: string) => void;
  onViewRegistrations: (eventId: string) => void;
}

export function EventsListAdmin({
  events,
  onEdit,
  onDelete,
  onViewRegistrations,
}: EventsListAdminProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const filteredEvents = events.filter(
    (event) =>
      event.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      onDelete(eventToDelete);
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Publicado':
        return 'bg-green-100 text-green-700';
      case 'Rascunho':
        return 'bg-yellow-100 text-yellow-700';
      case 'Cancelado':
        return 'bg-red-100 text-red-700';
      case 'Encerrado':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getVagasColor = (vagas: number, capacidade: number) => {
    const percentual = (vagas / capacidade) * 100;
    if (percentual > 50) return 'text-green-600';
    if (percentual > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-gray-900">Gerenciar Eventos</h1>
        <p className="text-gray-600">Lista de todos os eventos cadastrados</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Eventos</CardTitle>
              <CardDescription>
                Total de {events.length} evento(s) cadastrado(s)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-3 size-4 text-gray-400" />
                <Input
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data de Início</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Inscritos</TableHead>
                  <TableHead>Vagas</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Nenhum evento encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => {
                    const inscritos = event.capacidadeMaxima - event.vagas;
                    return (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.nome}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.categoria}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(event.dataInicio).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{inscritos}</TableCell>
                        <TableCell>
                          <span className={getVagasColor(event.vagas, event.capacidadeMaxima)}>
                            {event.vagas}/{event.capacidadeMaxima}
                          </span>
                        </TableCell>
                        <TableCell>
                          {event.gratuito ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              Gratuito
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              R$ {event.valor?.toFixed(2)}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onViewRegistrations(event.id)}
                              title="Ver inscritos"
                            >
                              <Eye className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(event.id)}
                              title="Editar"
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(event.id)}
                              title="Excluir"
                            >
                              <Trash2 className="size-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita e
              todos os inscritos serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
