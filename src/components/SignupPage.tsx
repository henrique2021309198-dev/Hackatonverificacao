import { useState } from 'react';
import { GraduationCap, Mail, Lock, User, ArrowLeft, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import type { SignupData, PerfilAcademico } from '../types';

interface SignupPageProps {
  onSignup: (data: SignupData) => void;
  onBackToLogin: () => void;
}

export function SignupPage({ onSignup, onBackToLogin }: SignupPageProps) {
  const [formData, setFormData] = useState<SignupData>({
    nome: '',
    email: '',
    senha: '',
    confirmacaoSenha: '',
    perfil_academico: 'Não Informado',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SignupData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof SignupData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SignupData, string>> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome completo é obrigatório';
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail válido é obrigatório';
    }

    if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (formData.senha !== formData.confirmacaoSenha) {
      newErrors.confirmacaoSenha = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSignup(formData);
      } finally {
        // Aguardar 2 segundos antes de permitir novo submit
        setTimeout(() => setIsSubmitting(false), 2000);
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Lado esquerdo - Imagem */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-900">
        <img
          src="https://images.unsplash.com/photo-1632834380561-d1e05839a33a?w=800&q=80"
          alt="Campus universitário"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="size-12" />
            <span className="text-4xl">EventosAcad</span>
          </div>
          <h1 className="text-4xl mb-4">Junte-se à nossa comunidade acadêmica</h1>
          <p className="text-xl text-blue-100">
            Crie sua conta e tenha acesso aos melhores eventos acadêmicos do país.
          </p>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="flex w-full items-center justify-center bg-gray-50 p-8 lg:w-1/2">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <Button
              variant="ghost"
              onClick={onBackToLogin}
              className="w-fit -ml-2 mb-2"
            >
              <ArrowLeft className="mr-2 size-4" />
              Voltar
            </Button>
            <CardTitle className="text-2xl">Criar conta</CardTitle>
            <CardDescription>Preencha os dados abaixo para se cadastrar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 size-4 text-gray-400" />
                  <Input
                    id="nome"
                    type="text"
                    placeholder="João da Silva"
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.nome && (
                  <p className="text-sm text-red-600">{errors.nome}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 size-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="perfil_academico">Perfil Acadêmico</Label>
                <Select
                  value={formData.perfil_academico}
                  onValueChange={(value) => handleChange('perfil_academico', value as PerfilAcademico)}
                >
                  <SelectTrigger id="perfil_academico">
                    <SelectValue placeholder="Selecione seu perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Não Informado">Não Informado</SelectItem>
                    <SelectItem value="Superior-TSI">Superior - TSI</SelectItem>
                    <SelectItem value="Superior-ADS">Superior - ADS</SelectItem>
                    <SelectItem value="Superior-Outros">Superior - Outros</SelectItem>
                    <SelectItem value="Pós-Graduação">Pós-Graduação</SelectItem>
                    <SelectItem value="Médio">Médio</SelectItem>
                    <SelectItem value="Fundamental">Fundamental</SelectItem>
                  </SelectContent>
                </Select>
                {errors.perfil_academico && (
                  <p className="text-sm text-red-600">{errors.perfil_academico}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 size-4 text-gray-400" />
                  <Input
                    id="senha"
                    type="password"
                    placeholder="••••••••"
                    value={formData.senha}
                    onChange={(e) => handleChange('senha', e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.senha && <p className="text-sm text-red-600">{errors.senha}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmacao">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 size-4 text-gray-400" />
                  <Input
                    id="confirmacao"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmacaoSenha}
                    onChange={(e) => handleChange('confirmacaoSenha', e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.confirmacaoSenha && (
                  <p className="text-sm text-red-600">{errors.confirmacaoSenha}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Ao criar uma conta, você concorda com nossos{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Termos de Uso
                </a>{' '}
                e{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Política de Privacidade
                </a>
                .
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}