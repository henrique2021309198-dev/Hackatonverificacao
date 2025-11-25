import { useState } from 'react';
import { ArrowLeft, Search, Download, Mail, CheckCircle2, XCircle, Clock, UserCheck, Edit } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Label } from './ui/label';
import type { Event, Registration, User } from '../types';

interface EventRegistrationsProps {
  event: Event;
  registrations: (Registration & { usuario: User })[];
  onBack: () => void;
  onUpdatePaymentStatus?: (registrationId: string, status: 'confirmado' | 'cancelado') => void;
  onUpdateAttendance?: (registrationId: string, checkIns: number) => void;
}

export function EventRegistrations({
  event,
  registrations,
  onBack,
  onUpdatePaymentStatus,
  onUpdateAttendance,
}: EventRegistrationsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAttendanceId, setEditingAttendanceId] = useState<string | null>(null);
  const [newCheckInsCount, setNewCheckInsCount] = useState<number>(0);

  // Debug: Verificar dados das inscrições
  console.log('🔍 DEBUG - EventRegistrations:', {
    totalRegistrations: registrations.length,
    statusPagamentos: registrations.map(r => ({ 
      id: r.id, 
      nome: r.usuario.nomeCompleto,
      status: r.statusPagamento 
    }))
  });

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.usuario.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.usuario.cpf?.includes(searchTerm)
  );

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmado':
        return <CheckCircle2 className="size-4 text-green-600" />;
      case 'pendente':
        return <Clock className="size-4 text-yellow-600" />;
      case 'cancelado':
        return <XCircle className="size-4 text-red-600" />;
      case 'nao_requerido':
        return <CheckCircle2 className="size-4 text-green-600" />;
      default:
        return null;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-700';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelado':
        return 'bg-red-100 text-red-700';
      case 'nao_requerido':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'Confirmado';
      case 'pendente':
        return 'Pendente';
      case 'cancelado':
        return 'Cancelado';
      case 'nao_requerido':
        return 'Gratuito';
      default:
        return status;
    }
  };

  const handleApprovePayment = (registrationId: string) => {
    if (onUpdatePaymentStatus) {
      onUpdatePaymentStatus(registrationId, 'confirmado');
    }
  };

  const handleRejectPayment = (registrationId: string) => {
    if (onUpdatePaymentStatus) {
      onUpdatePaymentStatus(registrationId, 'cancelado');
    }
  };

  const handleOpenEditAttendance = (reg: Registration) => {
    setEditingAttendanceId(reg.id);
    setNewCheckInsCount(reg.totalPresencas || 0);
  };

  const handleSaveAttendance = () => {
    if (editingAttendanceId && onUpdateAttendance) {
      onUpdateAttendance(editingAttendanceId, newCheckInsCount);
      setEditingAttendanceId(null);
      setNewCheckInsCount(0);
    }
  };

  const handleCloseAttendanceDialog = () => {
    setEditingAttendanceId(null);
    setNewCheckInsCount(0);
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'CPF', 'Instituição', 'Data Inscrição', 'Status Pagamento', 'Check-ins'];
    const rows = filteredRegistrations.map((reg) => [
      reg.usuario.nomeCompleto,
      reg.usuario.email,
      reg.usuario.cpf || '',
      reg.usuario.instituicao || '',
      new Date(reg.dataInscricao).toLocaleDateString('pt-BR'),
      getPaymentStatusLabel(reg.statusPagamento),
      reg.totalPresencas || 0,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inscritos_${event.nome.replace(/\s+/g, '_')}.csv`;
    link.click();
  };

  const stats = {
    total: registrations.length,
    confirmados: registrations.filter((r) => r.statusPagamento === 'confirmado').length,
    pendentes: registrations.filter((r) => r.statusPagamento === 'pendente').length,
    cancelados: registrations.filter((r) => r.statusPagamento === 'cancelado').length,
  };

  const editingRegistration = registrations.find((r) => r.id === editingAttendanceId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} size="icon">
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-3xl text-gray-900">Inscritos do Evento</h1>
          <p className="text-gray-600">{event.nome}</p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total de Inscritos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.total}</div>
            <p className="text-xs text-gray-600">
              de {event.capacidadeMaxima} vagas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pagamentos Confirmados</CardTitle>
            <CheckCircle2 className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">{stats.confirmados}</div>
            <p className="text-xs text-gray-600">
              {((stats.confirmados / stats.total) * 100 || 0).toFixed(0)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pagamentos Pendentes</CardTitle>
            <Clock className="size-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-yellow-600">{stats.pendentes}</div>
            <p className="text-xs text-gray-600">
              {((stats.pendentes / stats.total) * 100 || 0).toFixed(0)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Cancelamentos</CardTitle>
            <XCircle className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-600">{stats.cancelados}</div>
            <p className="text-xs text-gray-600">
              {((stats.cancelados / stats.total) * 100 || 0).toFixed(0)}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Inscritos */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Lista de Inscritos</CardTitle>
              <CardDescription>
                Total de {filteredRegistrations.length} inscrito(s)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-3 size-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, email ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={exportToCSV} className="gap-2">
                <Download className="size-4" />
                Exportar
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
                  <TableHead>E-mail</TableHead>
                  <TableHead>Data de Inscrição</TableHead>
                  <TableHead>Status Pagamento</TableHead>
                  <TableHead>Check-ins</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum inscrito encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-medium">
                        {reg.usuario.nomeCompleto}
                      </TableCell>
                      <TableCell>{reg.usuario.email}</TableCell>
                      <TableCell>
                        {new Date(reg.dataInscricao).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(reg.statusPagamento)}>
                          <span className="flex items-center gap-1">
                            {getPaymentStatusIcon(reg.statusPagamento)}
                            {getPaymentStatusLabel(reg.statusPagamento)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          <UserCheck className="size-4 text-blue-600" />
                          {reg.totalPresencas || 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Botões de Pagamento */}
                          {reg.statusPagamento === 'pendente' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Aprovar pagamento"
                                onClick={() => handleApprovePayment(reg.id)}
                                className="size-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                              >
                                <CheckCircle2 className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Reprovar pagamento"
                                onClick={() => handleRejectPayment(reg.id)}
                                className="size-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                              >
                                <XCircle className="size-4" />
                              </Button>
                            </>
                          )}
                          
                          {/* Botão Editar Presenças */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Editar presenças"
                            onClick={() => handleOpenEditAttendance(reg)}
                            className="size-8"
                          >
                            <Edit className="size-4" />
                          </Button>
                          
                          {/* Botão E-mail */}
                          <Button variant="ghost" size="icon" title="Enviar e-mail" className="size-8">
                            <Mail className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para Editar Presenças */}
      <Dialog open={!!editingAttendanceId} onOpenChange={handleCloseAttendanceDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Presenças</DialogTitle>
            <DialogDescription>
              Ajuste o número total de check-ins do participante
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Participante</Label>
              <p className="text-sm text-gray-600">{editingRegistration?.usuario.nomeCompleto}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkIns">Total de Check-ins</Label>
              <Input
                id="checkIns"
                type="number"
                min="0"
                value={newCheckInsCount}
                onChange={(e) => setNewCheckInsCount(parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500">
                Valor atual: {editingRegistration?.totalPresencas || 0} check-ins
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseAttendanceDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAttendance} className="bg-blue-600 hover:bg-blue-700">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}