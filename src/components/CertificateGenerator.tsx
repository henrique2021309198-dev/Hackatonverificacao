import { jsPDF } from 'jspdf';

interface CertificateData {
  participantName: string;
  eventName: string;
  eventStartDate: string;
  eventEndDate: string;
  totalHours: number;
  attendedHours: number;
  approvalDate?: string;
  validationToken?: string; // Token de validação do certificado
}

/**
 * Gera um certificado em PDF
 */
export function generateCertificate(data: CertificateData): void {
  const {
    participantName,
    eventName,
    eventStartDate,
    eventEndDate,
    totalHours,
    attendedHours,
    approvalDate,
    validationToken,
  } = data;

  // Criar documento PDF em formato paisagem (landscape)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const centerX = pageWidth / 2;

  // ==================== BORDA DECORATIVA ====================
  doc.setDrawColor(41, 98, 255); // Azul
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  doc.setDrawColor(41, 98, 255);
  doc.setLineWidth(0.5);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // ==================== CABEÇALHO ====================
  // Título "CERTIFICADO"
  doc.setFontSize(40);
  doc.setTextColor(41, 98, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICADO', centerX, 40, { align: 'center' });

  // Subtítulo
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('DE PARTICIPAÇÃO', centerX, 50, { align: 'center' });

  // ==================== LINHA DECORATIVA ====================
  doc.setDrawColor(41, 98, 255);
  doc.setLineWidth(0.5);
  doc.line(centerX - 40, 55, centerX + 40, 55);

  // ==================== CORPO DO CERTIFICADO ====================
  const bodyStartY = 70;
  const lineHeight = 8;
  let currentY = bodyStartY;

  // Texto principal
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  doc.text('Certificamos que', centerX, currentY, { align: 'center' });

  currentY += lineHeight + 5;

  // Nome do participante (destaque)
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(participantName.toUpperCase(), centerX, currentY, { align: 'center' });

  // Linha sob o nome
  const nameWidth = doc.getTextWidth(participantName.toUpperCase());
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(centerX - nameWidth / 2 - 5, currentY + 2, centerX + nameWidth / 2 + 5, currentY + 2);

  currentY += lineHeight + 8;

  // Texto de participação
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  doc.text('participou do evento', centerX, currentY, { align: 'center' });

  currentY += lineHeight + 2;

  // Nome do evento (destaque)
  doc.setFontSize(16);
  doc.setTextColor(41, 98, 255);
  doc.setFont('helvetica', 'bold');
  
  // Quebrar texto longo em múltiplas linhas
  const maxWidth = pageWidth - 60;
  const eventLines = doc.splitTextToSize(eventName, maxWidth);
  eventLines.forEach((line: string, index: number) => {
    doc.text(line, centerX, currentY, { align: 'center' });
    if (index < eventLines.length - 1) currentY += lineHeight;
  });

  currentY += lineHeight + 5;

  // Datas
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');

  const startDate = formatDate(eventStartDate);
  const endDate = formatDate(eventEndDate);
  const dateText = startDate === endDate 
    ? `realizado em ${startDate}`
    : `realizado no período de ${startDate} a ${endDate}`;
  
  doc.text(dateText, centerX, currentY, { align: 'center' });

  currentY += lineHeight + 2;

  // Carga horária
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(
    `com carga horária de ${totalHours} horas`,
    centerX,
    currentY,
    { align: 'center' }
  );

  // Se tiver presença menor que 100%, mostrar
  if (attendedHours < totalHours) {
    currentY += lineHeight;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const percentual = Math.round((attendedHours / totalHours) * 100);
    doc.text(
      `(${attendedHours} horas de presença - ${percentual}%)`,
      centerX,
      currentY,
      { align: 'center' }
    );
  }

  // ==================== RODAPÉ ====================
  const footerY = pageHeight - 45; // Ajustado para dar mais espaço

  // Data de emissão
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'italic');
  const issueDate = approvalDate ? formatDate(approvalDate) : formatDate(new Date().toISOString());
  doc.text(`Emitido em: ${issueDate}`, centerX, footerY, { align: 'center' });

  // Linha para assinatura
  const signatureY = footerY + 15;
  const signatureWidth = 60;
  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.3);
  doc.line(centerX - signatureWidth / 2, signatureY, centerX + signatureWidth / 2, signatureY);

  // Texto da assinatura
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Coordenação de Eventos Acadêmicos', centerX, signatureY + 5, { align: 'center' });

  // ==================== TOKEN DE VALIDAÇÃO - DESTACADO ====================
  if (validationToken) {
    const tokenY = pageHeight - 22;
    
    // Caixa de fundo para destacar o token
    doc.setFillColor(240, 245, 255); // Azul muito claro
    doc.setDrawColor(41, 98, 255); // Borda azul
    doc.setLineWidth(0.5);
    const boxWidth = 140;
    const boxHeight = 10;
    doc.roundedRect(centerX - boxWidth / 2, tokenY - 7, boxWidth, boxHeight, 2, 2, 'FD');
    
    // Ícone de verificação (checkmark)
    doc.setFontSize(9);
    doc.setTextColor(41, 98, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('✓', centerX - 65, tokenY - 1.5);
    
    // Label "Código de Validação:"
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'bold');
    doc.text('Código de Validação:', centerX - 60, tokenY - 1.5);
    
    // Token em si (destacado)
    doc.setFontSize(9);
    doc.setTextColor(41, 98, 255); // Azul forte
    doc.setFont('courier', 'bold'); // Fonte monoespaçada para o código
    doc.text(validationToken, centerX + 10, tokenY - 1.5);
  }

  // ==================== RODAPÉ INSTITUCIONAL ====================
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'Sistema de Gerenciamento de Eventos Acadêmicos',
    centerX,
    pageHeight - 10,
    { align: 'center' }
  );

  // Instrução de verificação
  if (validationToken) {
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Verifique a autenticidade em: eventosacademicos.com/verificar',
      centerX,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  // ==================== SALVAR PDF ====================
  const fileName = `certificado-${sanitizeFileName(eventName)}-${sanitizeFileName(participantName)}.pdf`;
  doc.save(fileName);
}

/**
 * Formata data no formato brasileiro
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  // Ajustar para timezone local
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  
  return localDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Sanitiza nome de arquivo removendo caracteres especiais
 */
function sanitizeFileName(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais por hífen
    .replace(/^-+|-+$/g, '') // Remove hífens do início e fim
    .substring(0, 50); // Limita tamanho
}