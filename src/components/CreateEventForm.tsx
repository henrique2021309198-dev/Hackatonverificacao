import { useState } from 'react';
import { Upload, Calendar as CalendarIcon, MapPin, Users, DollarSign, QrCode } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';
import type { Event, EventCategory, EventStatus } from '../types';

interface CreateEventFormProps {
  onCreateEvent: (event: Partial<Event>) => void;
  onCancel: () => void;
}

const categorias: EventCategory[] = [
  'Semana Acadêmica',
  'Hackathon',
  'Minicurso',
  'Workshop',
  'Palestra',
  'Congresso',
];

export function CreateEventForm({ onCreateEvent, onCancel }: CreateEventFormProps) {
  const [formData, setFormData] = useState<Partial<Event>>({
    nome: '',
    categoria: undefined,
    descricao: '',
    dataInicio: '',
    dataFim: '',
    local: '',
    capacidadeMaxima: 0,
    gratuito: true,
    valor: 0,
    status: 'Publicado',
  });

  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData((prev) => ({ ...prev, imagemCapa: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateEvent({
      ...formData,
      vagas: formData.capacidadeMaxima, // Inicialmente, vagas = capacidade máxima
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-gray-900">Criar Novo Evento</h1>
        <p className="text-gray-600">Preencha as informações do evento</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Evento</CardTitle>
          <CardDescription>
            Preencha todos os campos obrigatórios para criar o evento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome e Categoria */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Evento *</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Workshop de React Avançado"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoria: value as EventCategory })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva os detalhes do evento, objetivos, público-alvo, etc."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={4}
                required
              />
            </div>

            {/* Datas */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data de Início *</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 size-4 text-gray-400" />
                  <Input
                    id="dataInicio"
                    type="datetime-local"
                    value={formData.dataInicio}
                    onChange={(e) =>
                      setFormData({ ...formData, dataInicio: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataFim">Data de Término *</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 size-4 text-gray-400" />
                  <Input
                    id="dataFim"
                    type="datetime-local"
                    value={formData.dataFim}
                    onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Local e Capacidade */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="local">Local *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 size-4 text-gray-400" />
                  <Input
                    id="local"
                    placeholder="Ex: Auditório Central, Campus I"
                    value={formData.local}
                    onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacidade">Capacidade Máxima *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 size-4 text-gray-400" />
                  <Input
                    id="capacidade"
                    type="number"
                    placeholder="Ex: 100"
                    value={formData.capacidadeMaxima || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacidadeMaxima: parseInt(e.target.value) || 0,
                      })
                    }
                    className="pl-10"
                    min={1}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Evento Gratuito/Pago */}
            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Evento Gratuito</Label>
                  <p className="text-sm text-gray-600">
                    Ative se o evento não tiver custo de inscrição
                  </p>
                </div>
                <Switch
                  checked={formData.gratuito}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, gratuito: checked, valor: checked ? 0 : formData.valor })
                  }
                />
              </div>

              {!formData.gratuito && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor da Inscrição (R$) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 size-4 text-gray-400" />
                      <Input
                        id="valor"
                        type="number"
                        placeholder="Ex: 50.00"
                        value={formData.valor || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })
                        }
                        className="pl-10"
                        min={0}
                        step={0.01}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chavePix">Chave PIX para Recebimento *</Label>
                    <div className="relative">
                      <QrCode className="absolute left-3 top-3 size-4 text-gray-400" />
                      <Input
                        id="chavePix"
                        placeholder="CPF, CNPJ, E-mail, Telefone ou Chave Aleatória"
                        value={(formData as any).chavePix || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, chavePix: e.target.value } as any)
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      💡 Esta chave PIX será usada pelos participantes para realizar o pagamento
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status do Evento</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as EventStatus })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Publicado">Publicado</SelectItem>
                  <SelectItem value="Rascunho">Rascunho</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Upload de Imagem */}
            <div className="space-y-2">
              <Label htmlFor="imagem">Imagem de Capa</Label>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Input
                    id="imagem"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                  <Upload className="size-5 text-gray-400" />
                </div>
                {imagePreview && (
                  <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Criar Evento
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}