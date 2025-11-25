import { useState, useEffect } from 'react';
import { QrCode, Copy, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import type { Event } from '../types';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  event: Event;
  onConfirmPayment: () => void;
}

export function PaymentModal({ open, onClose, event, onConfirmPayment }: PaymentModalProps) {
  const [step, setStep] = useState<'payment' | 'success'>('payment');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos em segundos

  // Timer de expiração
  useEffect(() => {
    if (!open || step !== 'payment') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, step]);

  // Resetar ao abrir
  useEffect(() => {
    if (open) {
      setStep('payment');
      setTimeLeft(600);
      setCopied(false);
    }
  }, [open]);

  const handleCopyPix = () => {
    const chavePix = (event as any).chavePix || 'pix@exemplo.com';
    navigator.clipboard.writeText(chavePix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    setStep('success');
    setTimeout(() => {
      onConfirmPayment();
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setStep('payment');
    setTimeLeft(600);
    setCopied(false);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (step === 'success') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="size-8 text-green-600" />
            </div>
            <h2 className="text-2xl text-gray-900 mb-2">Pagamento Confirmado!</h2>
            <p className="text-gray-600">
              Sua inscrição foi realizada com sucesso. Você receberá um e-mail de confirmação em
              breve.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const chavePix = (event as any).chavePix || 'Chave PIX não configurada';
  const hasPixKey = !!(event as any).chavePix;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Pagamento via PIX</DialogTitle>
          <DialogDescription>
            Escaneie o QR Code ou copie a chave PIX para realizar o pagamento
          </DialogDescription>
        </DialogHeader>

        {/* Resumo do Evento */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="text-sm text-gray-600 mb-1">Evento</h3>
          <p className="text-gray-900 mb-3">{event.nome}</p>
          <Separator className="my-3" />
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total a pagar</span>
            <span className="text-2xl text-gray-900">R$ {event.valor?.toFixed(2)}</span>
          </div>
        </div>

        {/* Aviso de Chave PIX não configurada */}
        {!hasPixKey && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>
              A chave PIX deste evento não foi configurada. Entre em contato com a organização.
            </AlertDescription>
          </Alert>
        )}

        {/* Timer de Expiração */}
        {hasPixKey && (
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            <Clock className="size-4" />
            <span>Tempo restante para pagamento: <strong>{formatTime(timeLeft)}</strong></span>
          </div>
        )}

        {/* QR Code PIX (Placeholder) */}
        {hasPixKey && (
          <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
            <div className="flex size-48 items-center justify-center rounded-lg bg-white p-4 border-2 border-gray-200">
              <QrCode className="size-32 text-gray-400" />
            </div>
            <p className="text-center text-sm text-gray-600">
              📱 Abra o app do seu banco e escaneie o QR Code acima
            </p>
            <p className="text-xs text-gray-500">
              💡 O QR Code deve ser gerado pela instituição financeira com a chave PIX abaixo
            </p>
          </div>
        )}

        {/* Chave PIX para Copiar */}
        {hasPixKey && (
          <div className="space-y-2">
            <h3 className="text-sm text-gray-600">Ou copie a chave PIX:</h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border bg-gray-50 p-3">
                <p className="break-all text-sm text-gray-900">{chavePix}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopyPix}
                className={copied ? 'bg-green-50 border-green-500' : ''}
              >
                {copied ? (
                  <CheckCircle2 className="size-4 text-green-600" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-green-600">✅ Chave PIX copiada!</p>
            )}
          </div>
        )}

        {/* Instruções */}
        {hasPixKey && (
          <div className="rounded-lg bg-blue-50 p-4">
            <h3 className="mb-2 text-sm text-blue-900">📋 Como pagar:</h3>
            <ol className="space-y-1 text-sm text-blue-800">
              <li>1. Abra o app do seu banco</li>
              <li>2. Selecione a opção PIX</li>
              <li>3. Escolha "Pix Copia e Cola" ou escaneie o QR Code</li>
              <li>4. Cole a chave PIX copiada</li>
              <li>5. Verifique o valor: <strong>R$ {event.valor?.toFixed(2)}</strong></li>
              <li>6. Confirme o pagamento</li>
              <li>7. Clique em "Já Paguei" abaixo</li>
            </ol>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
            Cancelar
          </Button>
          {hasPixKey && (
            <Button
              type="button"
              onClick={handleConfirmPayment}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              ✅ Já Paguei
            </Button>
          )}
        </div>

        {/* Aviso */}
        <p className="text-center text-xs text-gray-500">
          ⚠️ Clique em "Já Paguei" somente após confirmar o pagamento no seu banco
        </p>
      </DialogContent>
    </Dialog>
  );
}
