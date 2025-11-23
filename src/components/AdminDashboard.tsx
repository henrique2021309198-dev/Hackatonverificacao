import { Calendar, Users, DollarSign, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import type { DashboardStats } from '../types';

interface AdminDashboardProps {
  stats: DashboardStats;
}

const monthlyData = [
  { mes: 'Jan', eventos: 12, inscritos: 245 },
  { mes: 'Fev', eventos: 15, inscritos: 298 },
  { mes: 'Mar', eventos: 18, inscritos: 356 },
  { mes: 'Abr', eventos: 22, inscritos: 445 },
  { mes: 'Mai', eventos: 25, inscritos: 512 },
  { mes: 'Jun', eventos: 28, inscritos: 589 },
];

const categoryData = [
  { nome: 'Workshop', valor: 35, cor: '#3b82f6' },
  { nome: 'Semana Acadêmica', valor: 25, cor: '#06b6d4' },
  { nome: 'Hackathon', valor: 20, cor: '#8b5cf6' },
  { nome: 'Minicurso', valor: 15, cor: '#10b981' },
  { nome: 'Palestra', valor: 5, cor: '#f59e0b' },
];

const recentEvents = [
  { nome: 'Workshop de React', data: '2024-12-15', inscritos: 45, status: 'Ativo' },
  { nome: 'Hackathon de IA', data: '2024-12-20', inscritos: 89, status: 'Ativo' },
  { nome: 'Semana de Eng. Software', data: '2025-01-10', inscritos: 156, status: 'Publicado' },
  { nome: 'Minicurso Python', data: '2024-12-18', inscritos: 67, status: 'Ativo' },
];

export function AdminDashboard({ stats }: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de eventos</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total de Eventos</CardTitle>
            <Calendar className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalEventos}</div>
            <p className="text-xs text-gray-600">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total de Inscritos</CardTitle>
            <Users className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalInscritos}</div>
            <p className="text-xs text-gray-600">+25% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Receita Total</CardTitle>
            <DollarSign className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">R$ {stats.receitaTotal.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-gray-600">+18% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Eventos Ativos</CardTitle>
            <CheckCircle2 className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.eventosAtivos}</div>
            <p className="text-xs text-gray-600">Em andamento no momento</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Crescimento Mensal</CardTitle>
            <CardDescription>Eventos e inscrições ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="eventos"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Eventos"
                />
                <Line
                  type="monotone"
                  dataKey="inscritos"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Inscritos"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eventos por Categoria</CardTitle>
            <CardDescription>Distribuição de tipos de eventos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, valor }) => `${nome}: ${valor}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Eventos Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos Recentes</CardTitle>
          <CardDescription>Últimos eventos criados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">{event.nome}</p>
                  <p className="text-sm text-gray-600">
                    Data: {new Date(event.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Inscritos</p>
                    <p className="font-medium">{event.inscritos}</p>
                  </div>
                  <div className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                    {event.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
