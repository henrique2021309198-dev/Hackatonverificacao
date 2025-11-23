import { useState } from 'react';
import { User, Mail, Building, CreditCard, Camera, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import type { User as UserType } from '../types';

interface ProfilePageProps {
  user: UserType;
  onUpdateProfile: (data: Partial<UserType>) => void;
  onChangePassword: () => void;
}

export function ProfilePage({ user, onUpdateProfile, onChangePassword }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nomeCompleto: user.nomeCompleto,
    email: user.email,
    instituicao: user.instituicao,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      nomeCompleto: user.nomeCompleto,
      email: user.email,
      instituicao: user.instituicao,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-gray-900">Meu Perfil</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Card de Avatar */}
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center p-6">
            <div className="relative mb-4">
              <Avatar className="size-32">
                <AvatarImage src={user.fotoPerfil} alt={user.nomeCompleto} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-3xl">
                  {user.nomeCompleto.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full"
                variant="secondary"
              >
                <Camera className="size-4" />
              </Button>
            </div>

            <h2 className="text-xl text-gray-900 text-center mb-1">
              {user.nomeCompleto}
            </h2>
            <p className="text-sm text-gray-600 text-center mb-4">{user.email}</p>

            <div className="w-full space-y-2">
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tipo de Conta</span>
                <span className="text-gray-900">
                  {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Membro desde</span>
                <span className="text-gray-900">
                  {new Date(user.criadoEm).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Pessoais */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize seus dados pessoais e de contato
                </CardDescription>
              </div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Editar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nomeCompleto">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 size-4 text-gray-400" />
                  <Input
                    id="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={(e) =>
                      setFormData({ ...formData, nomeCompleto: e.target.value })
                    }
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 size-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 size-4 text-gray-400" />
                  <Input
                    id="cpf"
                    value={user.cpf}
                    className="pl-10 bg-gray-50"
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-600">CPF não pode ser alterado</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instituicao">Instituição de Ensino</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 size-4 text-gray-400" />
                  <Input
                    id="instituicao"
                    value={formData.instituicao}
                    onChange={(e) =>
                      setFormData({ ...formData, instituicao: e.target.value })
                    }
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="size-4" />
                    Salvar Alterações
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Segurança */}
      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
          <CardDescription>Gerencie a segurança da sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900">Senha</p>
              <p className="text-sm text-gray-600">
                Última alteração: {new Date(user.criadoEm).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <Button variant="outline" onClick={onChangePassword}>
              Alterar Senha
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas (apenas para usuários) */}
      {user.role === 'user' && (
        <Card>
          <CardHeader>
            <CardTitle>Minhas Estatísticas</CardTitle>
            <CardDescription>Resumo da sua participação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-gray-600 mb-1">Eventos Participados</p>
                <p className="text-2xl text-gray-900">12</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-gray-600 mb-1">Certificados Obtidos</p>
                <p className="text-2xl text-gray-900">8</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-gray-600 mb-1">Horas de Aprendizado</p>
                <p className="text-2xl text-gray-900">156h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
