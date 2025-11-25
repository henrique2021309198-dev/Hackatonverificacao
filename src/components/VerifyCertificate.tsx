import { useState } from 'react';
import { Search, CheckCircle2, XCircle, Shield, Calendar, User, Award, FileText, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface VerifyCertificateProps {
  onVerify?: (token: string) => Promise<any>;
}

export function VerifyCertificate({ onVerify }: VerifyCertificateProps) {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [certificateData, setCertificateData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!token.trim()) {
      setError('Por favor, insira um código de validação.');
      return;
    }

    setLoading(true);
    setError(null);
    setCertificateData(null);

    try {
      const { validarCertificado } = await import('../services/supabase');
      const result = await validarCertificado(token.trim());

      if (result) {
        setCertificateData(result);
      } else {
        setError('Certificado não encontrado ou inválido. Verifique o código e tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao verificar certificado:', err);
      setError('Erro ao verificar certificado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl text-gray-900">Verificar Certificado</h1>
        <p className="text-gray-600 mt-2">
          Insira o código de validação do certificado para verificar sua autenticidade
        </p>
      </div>

      {/* Card de Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5 text-blue-600" />
            Validação de Certificado
          </CardTitle>
          <CardDescription>
            O código de validação é um identificador único (UUID) presente em cada certificado emitido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Ex: 550e8400-e29b-41d4-a716-446655440000"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Digite ou cole o código de validação completo
              </p>
            </div>
            <Button
              onClick={handleVerify}
              disabled={loading || !token.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Verificando...
                </>
              ) : (
                <>
                  <Search className="size-4 mr-2" />
                  Verificar
                </>
              )}
            </Button>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Resultado da Verificação */}
      {certificateData && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="size-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-green-900">Certificado Válido</CardTitle>
                <CardDescription className="text-green-700">
                  Este certificado é autêntico e foi emitido pela plataforma
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informações do Certificado */}
            <div className="rounded-lg border border-green-200 bg-white p-4 space-y-4">
              <div className="flex items-start gap-3">
                <Award className="size-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Código de Validação</p>
                  <p className="font-mono text-sm break-all">{certificateData.codigo_validacao}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <User className="size-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Participante</p>
                  <p className="text-lg">{certificateData.participacoes?.usuarios?.nome || 'Nome não disponível'}</p>
                  <p className="text-sm text-gray-600">{certificateData.participacoes?.usuarios?.email || ''}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <FileText className="size-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Evento</p>
                  <p className="text-lg">{certificateData.participacoes?.eventos?.nome || 'Evento não disponível'}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="size-3" />
                      Início: {certificateData.participacoes?.eventos?.data_inicio 
                        ? formatDate(certificateData.participacoes.eventos.data_inicio)
                        : 'Data não disponível'}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      Duração: {certificateData.participacoes?.eventos?.duracao_horas || 0}h
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Calendar className="size-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Data de Emissão</p>
                  <p className="text-lg">{formatDate(certificateData.data_emissao)}</p>
                </div>
              </div>

              {/* Informações de Presença */}
              {certificateData.participacoes && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Frequência</p>
                      <p className="text-lg">
                        {certificateData.participacoes.numero_presencas || 0} check-ins registrados
                      </p>
                      <Badge className="mt-2 bg-green-100 text-green-700 hover:bg-green-200">
                        Participação Aprovada
                      </Badge>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Botão de Download */}
            {certificateData.url_pdf && (
              <div className="flex justify-center">
                <Button
                  asChild
                  variant="outline"
                  className="gap-2"
                >
                  <a
                    href={certificateData.url_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="size-4" />
                    Visualizar Certificado PDF
                  </a>
                </Button>
              </div>
            )}

            {/* Informações de Segurança */}
            <Alert>
              <AlertCircle className="size-4" />
              <AlertDescription className="text-sm">
                <strong>Sobre a validação:</strong> Este certificado foi verificado em tempo real 
                no banco de dados oficial. O código de validação é único e não pode ser duplicado.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Informações de Ajuda */}
      {!certificateData && !error && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Como funciona a verificação?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs shrink-0">
                1
              </div>
              <p>
                <strong>Localize o código:</strong> O código de validação está impresso no certificado, 
                geralmente no rodapé ou canto inferior.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs shrink-0">
                2
              </div>
              <p>
                <strong>Insira o código:</strong> Cole ou digite o código completo no campo acima. 
                O formato é um UUID (ex: 550e8400-e29b-41d4-a716-446655440000).
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs shrink-0">
                3
              </div>
              <p>
                <strong>Verifique os dados:</strong> Após a validação, todas as informações do certificado 
                serão exibidas, incluindo nome do participante, evento e data de emissão.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
