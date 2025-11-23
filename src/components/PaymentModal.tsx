import { useState } from 'react';
import { CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Separator } from './ui/separator';
import type { Event, PaymentData } from '../types';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  event: Event;
  onConfirmPayment: (paymentData: PaymentData) => void;
}

export function PaymentModal({ open, onClose, event, onConfirmPayment }: PaymentModalProps) {
  const [step, setStep] = useState<'payment' | 'success'>('payment');
  const [paymentData, setPaymentData] = useState<PaymentData>({
    numeroCartao: '',
    nomeCartao: '',
    validade: '',
    cvv: '',
    cpf: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PaymentData, string>>>({});

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // 16 dígitos + 3 espaços
  };

  const formatValidade = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const formatCPF = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      return cleaned
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return value;
  };

  const handleChange = (field: keyof PaymentData, value: string) => {
    let formattedValue = value;

    if (field === 'numeroCartao') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'validade') {
      formattedValue = formatValidade(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    } else if (field === 'cpf') {
      formattedValue = formatCPF(value);
    }

    setPaymentData((prev) => ({ ...prev, [field]: formattedValue }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentData, string>> = {};

    const cardNumberClean = paymentData.numeroCartao.replace(/\s/g, '');
    if (cardNumberClean.length !== 16) {
      newErrors.numeroCartao = 'Número do cartão inválido';
    }

    if (!paymentData.nomeCartao.trim()) {
      newErrors.nomeCartao = 'Nome do titular é obrigatório';
    }

    const validadeClean = paymentData.validade.replace(/\D/g, '');
    if (validadeClean.length !== 4) {
      newErrors.validade = 'Validade inválida';
    }

    if (paymentData.cvv.length < 3) {
      newErrors.cvv = 'CVV inválido';
    }

    const cpfClean = paymentData.cpf.replace(/\D/g, '');
    if (cpfClean.length !== 11) {
      newErrors.cpf = 'CPF inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Simular processamento de pagamento
      setTimeout(() => {
        setStep('success');
        setTimeout(() => {
          onConfirmPayment(paymentData);
          handleClose();
        }, 2000);
      }, 1500);
    }
  };

  const handleClose = () => {
    setStep('payment');
    setPaymentData({
      numeroCartao: '',
      nomeCartao: '',
      validade: '',
      cvv: '',
      cpf: '',
    });
    setErrors({});
    onClose();
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Finalizar Inscrição</DialogTitle>
          <DialogDescription>
            Complete o pagamento para confirmar sua inscrição no evento
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

        {/* Formulário de Pagamento */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numeroCartao">Número do Cartão</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 size-4 text-gray-400" />
              <Input
                id="numeroCartao"
                placeholder="0000 0000 0000 0000"
                value={paymentData.numeroCartao}
                onChange={(e) => handleChange('numeroCartao', e.target.value)}
                className="pl-10"
              />
            </div>
            {errors.numeroCartao && (
              <p className="text-sm text-red-600">{errors.numeroCartao}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomeCartao">Nome do Titular</Label>
            <Input
              id="nomeCartao"
              placeholder="Nome como está no cartão"
              value={paymentData.nomeCartao}
              onChange={(e) => handleChange('nomeCartao', e.target.value.toUpperCase())}
            />
            {errors.nomeCartao && <p className="text-sm text-red-600">{errors.nomeCartao}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="validade">Validade</Label>
              <Input
                id="validade"
                placeholder="MM/AA"
                value={paymentData.validade}
                onChange={(e) => handleChange('validade', e.target.value)}
                maxLength={5}
              />
              {errors.validade && <p className="text-sm text-red-600">{errors.validade}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="password"
                placeholder="123"
                value={paymentData.cvv}
                onChange={(e) => handleChange('cvv', e.target.value)}
                maxLength={4}
              />
              {errors.cvv && <p className="text-sm text-red-600">{errors.cvv}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF do Titular</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              value={paymentData.cpf}
              onChange={(e) => handleChange('cpf', e.target.value)}
              maxLength={14}
            />
            {errors.cpf && <p className="text-sm text-red-600">{errors.cpf}</p>}
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
            <Lock className="size-4" />
            <span>Seus dados estão protegidos com criptografia de ponta a ponta</span>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Confirmar Pagamento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
