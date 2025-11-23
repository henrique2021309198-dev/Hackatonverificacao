import { useState } from 'react';
import { GraduationCap, Mail, Lock, UserCircle, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import type { LoginCredentials, UserRole } from '../types';

interface LoginPageProps {
  onLogin: (credentials: LoginCredentials) => void;
  onSignupClick: () => void;
  onForgotPasswordClick: () => void;
}

export function LoginPage({ onLogin, onSignupClick, onForgotPasswordClick }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<UserRole>('user');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email, senha, tipo: activeTab });
  };

  return (
    <div className="flex min-h-screen">
      {/* Lado esquerdo - Imagem */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-900">
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"
          alt="Campus universitário"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="size-12" />
            <span className="text-4xl">EventosAcad</span>
          </div>
          <h1 className="text-4xl mb-4">Gerencie eventos acadêmicos com facilidade</h1>
          <p className="text-xl text-blue-100">
            Conecte-se com as melhores oportunidades de aprendizado e desenvolvimento.
          </p>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="flex w-full items-center justify-center bg-gray-50 p-8 lg:w-1/2">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4 lg:hidden">
              <GraduationCap className="size-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
            <CardDescription>Entre com suas credenciais para acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as UserRole)}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="user" className="gap-2">
                  <UserCircle className="size-4" />
                  Usuário
                </TabsTrigger>
                <TabsTrigger value="admin" className="gap-2">
                  <Shield className="size-4" />
                  Administrador
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 size-4 text-gray-400" />
                      <Input
                        id="user-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 size-4 text-gray-400" />
                      <Input
                        id="user-password"
                        type="password"
                        placeholder="••••••••"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={onForgotPasswordClick}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Entrar
                  </Button>

                  <div className="text-center text-sm">
                    Não tem uma conta?{' '}
                    <button
                      type="button"
                      onClick={onSignupClick}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Criar conta
                    </button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="admin">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 size-4 text-gray-400" />
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 size-4 text-gray-400" />
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="••••••••"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={onForgotPasswordClick}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Entrar como Admin
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
