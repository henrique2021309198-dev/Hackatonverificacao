import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, AlertCircle, Keyboard } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';

interface QRCodeScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  eventoNome: string;
}

export function QRCodeScanner({ onScan, onClose, eventoNome }: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const videoElementId = 'qr-reader';
  const hasTriedCamera = useRef(false);

  useEffect(() => {
    // Tentar iniciar scanner automaticamente apenas uma vez
    if (!hasTriedCamera.current) {
      hasTriedCamera.current = true;
      requestCameraPermission();
    }

    return () => {
      stopScanner();
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      // Primeiro, solicitar permissão usando navigator.mediaDevices
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Permissão concedida! Parar o stream de teste
      stream.getTracks().forEach(track => track.stop());
      
      // Agora iniciar o scanner
      await startScanner();
    } catch (err: any) {
      console.error('Erro ao solicitar permissão de câmera:', err);
      handleCameraError(err);
    }
  };

  const handleCameraError = (err: any) => {
    if (err.name === 'NotAllowedError' || err.message?.includes('Permission denied')) {
      setPermissionDenied(true);
      setError('Permissão de câmera negada. Você pode usar a entrada manual abaixo ou permitir acesso à câmera.');
      setShowManualInput(true);
    } else if (err.name === 'NotFoundError') {
      setError('Nenhuma câmera encontrada. Use a entrada manual abaixo.');
      setShowManualInput(true);
    } else if (err.name === 'NotReadableError') {
      setError('Câmera está sendo usada por outro aplicativo. Use a entrada manual ou feche outros aplicativos.');
      setShowManualInput(true);
    } else {
      setError('Erro ao acessar câmera. Use a entrada manual abaixo.');
      setShowManualInput(true);
    }
  };

  const startScanner = async () => {
    try {
      setError(null);
      
      // Criar instância do scanner
      const html5QrCode = new Html5Qrcode(videoElementId);
      scannerRef.current = html5QrCode;

      // Configurações do scanner
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      // Iniciar scanner com câmera traseira
      await html5QrCode.start(
        { facingMode: 'environment' }, // Câmera traseira
        config,
        (decodedText) => {
          // QR Code detectado!
          console.log('✅ QR Code detectado:', decodedText);
          onScan(decodedText);
          stopScanner();
        },
        (errorMessage) => {
          // Erro de leitura (normal enquanto procura QR code)
          // Não fazer nada aqui para evitar poluir o console
        }
      );

      setIsScanning(true);
      setPermissionDenied(false);
    } catch (err: any) {
      console.error('Erro ao iniciar scanner:', err);
      handleCameraError(err);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error('Erro ao parar scanner:', err);
      }
    }
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  const handleManualInput = () => {
    if (manualCode) {
      onScan(manualCode);
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="size-5 text-blue-600" />
              <h2 className="text-xl text-gray-900">Fazer Check-in</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="size-8 p-0"
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Evento */}
          <div className="mb-4 rounded-lg bg-blue-50 p-3">
            <p className="text-sm text-gray-600">Evento:</p>
            <p className="text-gray-900">{eventoNome}</p>
          </div>

          {/* Scanner Area */}
          <div className="mb-4">
            <div
              id={videoElementId}
              className="overflow-hidden rounded-lg border-2 border-gray-200"
              style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}
            />
          </div>

          {/* Instruções */}
          {isScanning && !error && (
            <Alert className="mb-4">
              <Camera className="size-4" />
              <AlertDescription>
                Aponte a câmera para o QR Code do evento para fazer check-in
              </AlertDescription>
            </Alert>
          )}

          {/* Erro */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Ações */}
          <div className="flex gap-2">
            {permissionDenied && (
              <Button
                onClick={startScanner}
                className="flex-1"
              >
                Tentar Novamente
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>

          {/* Dica */}
          {!showManualInput && (
            <p className="mt-4 text-center text-xs text-gray-500">
              💡 Dica: Mantenha o QR Code bem iluminado e estável
            </p>
          )}

          {/* Separador */}
          {showManualInput && (
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">ou</span>
              </div>
            </div>
          )}

          {/* Entrada Manual */}
          {showManualInput && (
            <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Keyboard className="size-5 text-blue-600" />
                <p className="font-medium text-gray-900">Entrada Manual</p>
              </div>
              <p className="mb-3 text-sm text-gray-600">
                Insira o código do QR Code manualmente:
              </p>
              <div className="flex gap-2">
                <Input
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Ex: evento-123"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleManualInput();
                    }
                  }}
                />
                <Button
                  onClick={handleManualInput}
                  disabled={!manualCode}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Confirmar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}