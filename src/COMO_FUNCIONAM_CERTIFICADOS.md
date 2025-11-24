# 🎓 SISTEMA DE CERTIFICADOS - GUIA COMPLETO

## 📋 VISÃO GERAL

O sistema agora gera certificados em PDF automaticamente quando o usuário clica em "Baixar Certificado". Os certificados são criados dinamicamente com informações reais do evento e do participante.

---

## 🎨 DESIGN DO CERTIFICADO

### **Layout:**
- **Formato:** A4 Paisagem (297mm x 210mm)
- **Orientação:** Horizontal
- **Margens:** 10mm com borda dupla decorativa

### **Elementos Visuais:**
```
┌────────────────────────────────────────────┐
│  ╔══════════════════════════════════════╗  │
│  ║                                      ║  │
│  ║         CERTIFICADO                  ║  │
│  ║       DE PARTICIPAÇÃO                ║  │
│  ║       ─────────────                  ║  │
│  ║                                      ║  │
│  ║   Certificamos que                   ║  │
│  ║   JOÃO SILVA                         ║  │
│  ║   ────────────────                   ║  │
│  ║   participou do evento               ║  │
│  ║   Workshop de IA                     ║  │
│  ║   realizado em 01 de janeiro de 2025 ║  │
│  ║   com carga horária de 20 horas      ║  │
│  ║                                      ║  │
│  ║                                      ║  │
│  ║   Emitido em: 15 de janeiro de 2025  ║  │
│  ║   ─────────────────────              ║  │
│  ║   Coordenação de Eventos             ║  │
│  ║                                      ║  │
│  ║   Sistema de Eventos Acadêmicos      ║  │
│  ╚══════════════════════════════════════╝  │
└────────────────────────────────────────────┘
```

### **Cores:**
- **Azul Principal:** #2962FF (41, 98, 255)
- **Texto Principal:** #000000 (preto)
- **Texto Secundário:** #3C3C3C (cinza escuro)
- **Texto Detalhes:** #787878 (cinza médio)

### **Tipografia:**
- **Título "CERTIFICADO":** Helvetica Bold, 40pt
- **Subtítulo:** Helvetica Normal, 14pt
- **Nome do Participante:** Helvetica Bold, 22pt, MAIÚSCULAS
- **Nome do Evento:** Helvetica Bold, 16pt, Azul
- **Corpo do texto:** Helvetica Normal, 11-12pt

---

## 🔧 ARQUITETURA DO SISTEMA

### **Arquivos Criados:**

#### **1. `/components/CertificateGenerator.tsx`**
- Função principal: `generateCertificate(data)`
- Responsável por criar o PDF usando jsPDF
- Renderiza todos os elementos visuais
- Faz o download automático

#### **2. `/services/certificates.ts`**
- Função: `downloadCertificate(registration, user)`
- Validações antes de gerar:
  - Evento já finalizou?
  - Pagamento confirmado?
  - Dados completos?
- Chama o gerador de PDF

#### **3. Atualização no `/App.tsx`**
- Função: `handleDownloadCertificate(registrationId)`
- Integra o serviço de certificados
- Mostra mensagens de sucesso/erro

#### **4. Atualização no `/components/MyEventsPage.tsx`**
- Função: `canDownloadCertificate(registration)`
- Controla visibilidade do botão
- Remove verificação de `certificadoEmitido`

---

## ✅ REGRAS DE NEGÓCIO

### **Quando o certificado ESTÁ disponível:**
1. ✅ Evento já terminou (`data_fim` < agora)
2. ✅ Pagamento confirmado OU evento gratuito
3. ✅ Usuário inscrito no evento

### **Quando o certificado NÃO está disponível:**
1. ❌ Evento ainda não terminou
2. ❌ Pagamento pendente (para eventos pagos)
3. ❌ Usuário não inscrito

---

## 📊 DADOS DO CERTIFICADO

### **Informações Incluídas:**

```typescript
{
  participantName: string;      // Nome completo do participante
  eventName: string;            // Nome do evento
  eventStartDate: string;       // Data de início (ISO 8601)
  eventEndDate: string;         // Data de término (ISO 8601)
  totalHours: number;           // Carga horária total
  attendedHours: number;        // Horas de presença
  approvalDate?: string;        // Data de aprovação/inscrição
}
```

### **Exemplo de Dados:**
```typescript
{
  participantName: "João Silva",
  eventName: "Workshop de Inteligência Artificial",
  eventStartDate: "2025-01-01T09:00:00.000Z",
  eventEndDate: "2025-01-05T18:00:00.000Z",
  totalHours: 20,
  attendedHours: 20,
  approvalDate: "2024-12-15T10:30:00.000Z"
}
```

---

## 🚀 COMO USAR

### **1. Para Usuários do Sistema:**

```
1. Faça login no sistema
2. Vá em: "Meus Eventos"
3. Encontre eventos na aba: "Concluídos"
4. Clique em: "Baixar Certificado" 🎓
5. O PDF será gerado e baixado automaticamente
```

### **2. Nome do Arquivo:**

```
certificado-{nome-do-evento}-{nome-do-participante}.pdf

Exemplo:
certificado-workshop-de-inteligencia-artificial-joao-silva.pdf
```

---

## 💻 COMO FUNCIONA O CÓDIGO

### **Fluxo Completo:**

```
Usuário clica "Baixar Certificado"
         ↓
handleDownloadCertificate(registrationId)
         ↓
Busca dados da inscrição
         ↓
Chama downloadCertificate(registration, user)
         ↓
Valida: evento terminou? pagamento ok?
         ↓
Calcula carga horária
         ↓
Chama generateCertificate(data)
         ↓
jsPDF cria o documento
         ↓
Adiciona bordas, título, textos
         ↓
Formata datas para pt-BR
         ↓
Adiciona informações do participante
         ↓
Adiciona assinatura
         ↓
doc.save(filename) → DOWNLOAD! 📥
```

### **Código da Função Principal:**

```typescript
// App.tsx
const handleDownloadCertificate = async (registrationId: string) => {
  const registration = registrations.find((r) => r.id === registrationId);
  
  if (!registration || !user) {
    toast.error('Erro ao buscar dados do certificado.');
    return;
  }

  const { downloadCertificate } = await import('./services/certificates');
  const result = await downloadCertificate(registration, user);

  if (result.success) {
    toast.success('Certificado gerado com sucesso!');
  } else {
    toast.error(result.error || 'Erro ao gerar certificado.');
  }
};
```

---

## 🎨 PERSONALIZAR O CERTIFICADO

### **Mudar Cores:**

```typescript
// CertificateGenerator.tsx - Linha ~30

// Borda
doc.setDrawColor(41, 98, 255); // Azul
// Mudar para: doc.setDrawColor(220, 38, 38); // Vermelho

// Título
doc.setTextColor(41, 98, 255); // Azul
// Mudar para: doc.setTextColor(34, 197, 94); // Verde
```

### **Mudar Tamanhos de Fonte:**

```typescript
// Título
doc.setFontSize(40); // Atual
// Mudar para: doc.setFontSize(50); // Maior

// Nome do participante
doc.setFontSize(22); // Atual
// Mudar para: doc.setFontSize(28); // Maior
```

### **Adicionar Logo:**

```typescript
// Após linha 40 em CertificateGenerator.tsx

// Adicionar imagem (PNG/JPG)
const logoUrl = 'https://seu-site.com/logo.png';
doc.addImage(logoUrl, 'PNG', 20, 20, 40, 40);
```

### **Mudar Texto do Certificado:**

```typescript
// Linha ~90
doc.text('Certificamos que', centerX, currentY, { align: 'center' });

// Mudar para:
doc.text('O Instituto certifica que', centerX, currentY, { align: 'center' });
```

### **Adicionar Assinatura Digital:**

```typescript
// Após linha 180

// Adicionar imagem da assinatura
const assinaturaUrl = 'https://seu-site.com/assinatura.png';
doc.addImage(assinaturaUrl, 'PNG', centerX - 30, signatureY - 20, 60, 15);
```

---

## 🔍 TROUBLESHOOTING

### **❌ Problema: "jsPDF is not defined"**

**Causa:** A biblioteca jsPDF não foi instalada.

**Solução:** A biblioteca já está incluída via importação:
```typescript
import { jsPDF } from 'jspdf';
```

Se der erro, verifique se está importando corretamente.

---

### **❌ Problema: Botão "Baixar Certificado" não aparece**

**Causa:** O evento ainda não terminou ou pagamento não foi confirmado.

**Verificar no banco:**
```sql
SELECT 
    e.nome,
    e.data_inicio + (e.duracao_horas || ' hours')::interval as data_fim,
    NOW() as agora,
    CASE 
        WHEN e.data_inicio + (e.duracao_horas || ' hours')::interval < NOW()
        THEN 'Finalizado ✅'
        ELSE 'Em andamento ⏳'
    END as status,
    p.pagamento_status
FROM participacoes p
JOIN eventos e ON p.evento_id = e.id
JOIN auth.users u ON p.usuario_id = u.id
WHERE u.email = 'seu-email@exemplo.com';
```

**Corrigir:**
```sql
-- Se evento precisa estar no passado
UPDATE eventos 
SET data_inicio = NOW() - INTERVAL '20 days'
WHERE id = SEU_EVENTO_ID;

-- Se pagamento está pendente
UPDATE participacoes 
SET pagamento_status = 'confirmado'
WHERE id = SUA_PARTICIPACAO_ID;
```

---

### **❌ Problema: Certificado gera mas está em branco**

**Causa:** Dados não estão sendo passados corretamente.

**Debug:**
```typescript
// Em certificates.ts, adicione antes de generateCertificate():
console.log('Dados do certificado:', {
  participantName: user.nomeCompleto,
  eventName: registration.evento.nome,
  // ... outros dados
});
```

---

### **❌ Problema: Datas aparecem erradas**

**Causa:** Problema de timezone.

**Solução:** A função `formatDate()` já ajusta para timezone local:
```typescript
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return localDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}
```

---

### **❌ Problema: Texto do evento muito longo sai do certificado**

**Solução:** O código já quebra texto longo:
```typescript
const maxWidth = pageWidth - 60;
const eventLines = doc.splitTextToSize(eventName, maxWidth);
eventLines.forEach((line: string) => {
  doc.text(line, centerX, currentY, { align: 'center' });
  currentY += lineHeight;
});
```

Se ainda sair, diminua o tamanho da fonte.

---

## 📈 MELHORIAS FUTURAS

### **1. Integrar com Banco de Dados (presencas_detalhes)**

Atualmente, o sistema assume 100% de presença. Para usar dados reais:

```typescript
// Em certificates.ts

// Buscar presença real do banco
const { data: presencaData } = await supabase
  .from('presencas_detalhes')
  .select('horas_presentes')
  .eq('participacao_id', registration.id)
  .single();

const attendedHours = presencaData?.horas_presentes || totalHours;
```

### **2. Adicionar QR Code de Validação**

```typescript
// Instalar: import QRCode from 'qrcode';

// Gerar QR Code
const qrCodeUrl = `https://seu-sistema.com/validar-certificado/${registration.id}`;
const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl);

// Adicionar ao PDF
doc.addImage(qrCodeDataUrl, 'PNG', pageWidth - 40, pageHeight - 40, 30, 30);
```

### **3. Múltiplos Templates**

```typescript
// Diferentes designs por categoria
if (evento.categoria === 'Workshop') {
  generateWorkshopCertificate(data);
} else if (evento.categoria === 'Palestra') {
  generateLectureCertificate(data);
}
```

### **4. Salvar no Supabase Storage**

```typescript
// Salvar PDF no storage para download futuro
const pdfBlob = doc.output('blob');
const fileName = `certificados/${registration.id}.pdf`;

await supabase.storage
  .from('certificados')
  .upload(fileName, pdfBlob);
```

### **5. E-mail Automático**

```typescript
// Enviar certificado por email quando evento terminar
await sendEmailWithCertificate({
  to: user.email,
  subject: 'Seu certificado está disponível!',
  attachment: pdfBlob
});
```

---

## 📚 RECURSOS ADICIONAIS

### **Documentação jsPDF:**
- https://github.com/parallax/jsPDF
- https://artskydj.github.io/jsPDF/docs/

### **Exemplos de Uso:**
```typescript
// Adicionar página
doc.addPage();

// Mudar orientação
doc.setPage(2);

// Adicionar link
doc.textWithLink('Clique aqui', 10, 10, { url: 'https://...' });

// Salvar como Blob em vez de download
const blob = doc.output('blob');

// Gerar Data URL
const dataUrl = doc.output('dataurlstring');
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [x] Criar componente CertificateGenerator
- [x] Criar serviço de certificados
- [x] Integrar com App.tsx
- [x] Atualizar MyEventsPage para mostrar botão
- [x] Adicionar validações (evento finalizado, pagamento ok)
- [x] Formatação de datas em pt-BR
- [x] Design profissional do certificado
- [x] Nome de arquivo sanitizado
- [x] Mensagens de sucesso/erro
- [x] Documentação completa

---

## 🎉 PRONTO PARA USAR!

O sistema de certificados está 100% funcional! 

**Próximos passos:**
1. Execute o script `/CRIAR_EVENTO_FINALIZADO_CERTIFICADO.sql`
2. Faça login com o email configurado
3. Vá em "Meus Eventos" → "Concluídos"
4. Clique em "Baixar Certificado"
5. Veja o PDF sendo gerado! 🎓

---

**Documentação criada em:** 24/11/2025
**Versão:** 1.0
**Status:** ✅ Implementado e funcionando
