import { useState } from 'react';
import { ArrowLeft, Search, Download, Mail, CheckCircle2, XCircle, Clock } from 'lucide-react';
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
import type { Event, Registration, User } from '../types';

interface EventRegistrationsProps {
  event: Event;
  registrations: (Registration & { usuario: User })[];
  onBack: () => void;
}

export function EventRegistrations({
  event,
  registrations,
  onBack,
}: EventRegistrationsProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.usuario.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.usuario.cpf.includes(searchTerm)
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

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'CPF', 'Instituição', 'Data Inscrição', 'Status Pagamento'];
    const rows = filteredRegistrations.map((reg) => [
      reg.usuario.nomeCompleto,
      reg.usuario.email,
      reg.usuario.cpf,
      reg.usuario.instituicao,
      new Date(reg.dataInscricao).toLocaleDateString('pt-BR'),
      reg.statusPagamento,
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
    confirmados: registrations.filter((r) => r.statusPagamento === 'Confirmado').length,
    pendentes: registrations.filter((r) => r.statusPagamento === 'Pendente').length,
    cancelados: registrations.filter((r) => r.statusPagamento === 'Cancelado').length,
  };

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
                  <TableHead>CPF</TableHead>
                  <TableHead>Instituição</TableHead>
                  <TableHead>Data de Inscrição</TableHead>
                  <TableHead>Status Pagamento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
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
                      <TableCell>{reg.usuario.cpf}</TableCell>
                      <TableCell>{reg.usuario.instituicao}</TableCell>
                      <TableCell>
                        {new Date(reg.dataInscricao).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(reg.statusPagamento)}>
                          <span className="flex items-center gap-1">
                            {getPaymentStatusIcon(reg.statusPagamento)}
                            {reg.statusPagamento}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" title="Enviar e-mail">
                          <Mail className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
