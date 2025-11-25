# 📱 COMO GERAR QR CODES PARA CHECK-IN

## 🎯 OBJETIVO

Gerar QR Codes que os participantes podem escanear para fazer check-in nos eventos.

---

## 🔑 FORMATO DO QR CODE

O QR Code deve conter o ID do evento no formato:

### **Opção 1: Formato Simples**
```
evento-123
```

### **Opção 2: Formato Completo (Recomendado)**
```
evento-123-sessao-manha
```

### **Opção 3: JSON**
```json
{
  "eventoId": "123",
  "sessao": "Dia 1 - Manhã",
  "timestamp": "2025-11-24T10:00:00Z"
}
```

---

## 🛠️ MÉTODOS PARA GERAR QR CODE

### **Método 1: Sites Online Gratuitos**

#### **QR Code Generator** (Recomendado)
1. Acesse: https://www.qr-code-generator.com/
2. Selecione: "Text"
3. Cole o texto: `evento-123` (substitua 123 pelo ID do seu evento)
4. Clique em "Create QR Code"
5. Baixe a imagem (PNG ou SVG)
6. Imprima ou exiba em tela

#### **QRCode Monkey**
1. Acesse: https://www.qrcode-monkey.com/
2. Cole o texto: `evento-123`
3. Personalize cores e logo (opcional)
4. Baixe em alta resolução
5. Use no evento

#### **GoQR.me**
1. Acesse: https://goqr.me/
2. Cole o texto: `evento-123`
3. Baixe a imagem
4. Pronto!

---

### **Método 2: Google Chrome (Rápido)**

1. Abra o Chrome
2. Digite na barra de endereço: `chrome://dino/`
3. Clique com botão direito → "Criar QR Code para esta página"
4. Ou use: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=evento-123`

---

### **Método 3: API Online (Automático)**

Use a API do QR Server:

```
https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=evento-123
```

**Parâmetros:**
- `size`: Tamanho da imagem (ex: 500x500)
- `data`: Texto do QR Code

**Exemplo para evento ID 123:**
```
https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=evento-123
```

Abra essa URL no navegador e salve a imagem!

---

### **Método 4: Python (Programático)**

```python
import qrcode

# Criar QR Code
evento_id = "123"
data = f"evento-{evento_id}"

qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)

qr.add_data(data)
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save(f"qrcode_evento_{evento_id}.png")

print(f"✅ QR Code gerado: qrcode_evento_{evento_id}.png")
```

**Instalar biblioteca:**
```bash
pip install qrcode[pil]
```

**Executar:**
```bash
python gerar_qrcode.py
```

---

### **Método 5: Node.js (Programático)**

```javascript
const QRCode = require('qrcode');

const eventoId = '123';
const data = `evento-${eventoId}`;

QRCode.toFile(`qrcode_evento_${eventoId}.png`, data, {
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  },
  width: 500
}, (err) => {
  if (err) throw err;
  console.log(`✅ QR Code gerado: qrcode_evento_${eventoId}.png`);
});
```

**Instalar biblioteca:**
```bash
npm install qrcode
```

**Executar:**
```bash
node gerar_qrcode.js
```

---

## 📋 PASSO A PASSO COMPLETO

### **1. Identificar o ID do Evento**

Execute no Supabase SQL Editor:

```sql
SELECT id, nome, data_inicio
FROM eventos
WHERE nome LIKE '%Semana%'
ORDER BY data_inicio DESC;
```

Resultado:
```
 id  | nome                                    | data_inicio
-----+-----------------------------------------+-------------------
 123 | Semana de Tecnologia e Inovação 2025   | 2025-11-21 08:00
```

O ID é **123**.

---

### **2. Gerar o QR Code**

Use qualquer método acima com o texto:
```
evento-123
```

---

### **3. Imprimir ou Exibir**

**Para Imprimir:**
- Tamanho: A4 (210x297mm)
- Resolução: 300 DPI
- QR Code: 10x10cm mínimo
- Adicione texto embaixo: "Escaneie para Check-in"

**Para Exibir em Tela:**
- Tamanho: 500x500px mínimo
- Formato: PNG ou SVG
- Contraste alto (preto no branco)

---

### **4. Posicionar no Local do Evento**

- ✅ Entrada principal
- ✅ Recepção
- ✅ Auditório
- ✅ Salas de aula
- ✅ Projetor (primeira slide)

---

## 🎨 DESIGN RECOMENDADO

### **Modelo de Cartaz**

```
╔════════════════════════════════════════╗
║                                        ║
║     SEMANA DE TECNOLOGIA 2025         ║
║                                        ║
║     ┌────────────────────────┐        ║
║     │                        │        ║
║     │     [QR CODE AQUI]     │        ║
║     │                        │        ║
║     └────────────────────────┘        ║
║                                        ║
║   📱 ESCANEIE PARA FAZER CHECK-IN     ║
║                                        ║
║   1. Abra o app do evento             ║
║   2. Vá em "Meus Eventos"             ║
║   3. Clique em "Check-in"             ║
║   4. Escaneie este QR Code            ║
║                                        ║
╚════════════════════════════════════════╝
```

---

## 🔍 VALIDAÇÃO DO QR CODE

### **Testar o QR Code:**

1. Gere o QR Code
2. Abra um leitor de QR Code no celular
3. Escaneie
4. Deve mostrar: `evento-123`

### **Leitores Recomendados:**
- 📱 Câmera nativa do iPhone/Android
- 📱 Google Lens
- 📱 QR Code Reader (app)

---

## 📊 EXEMPLO PRÁTICO

### **Evento: Semana de Tecnologia**

**ID do Evento:** 123

**QR Code a gerar:**
```
evento-123
```

**URL da API:**
```
https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=evento-123
```

**Resultado:**
![QR Code](https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=evento-123)

---

## ✅ CHECKLIST

- [ ] Identificar ID do evento no banco
- [ ] Gerar QR Code com formato correto
- [ ] Testar escaneamento
- [ ] Imprimir em tamanho adequado
- [ ] Posicionar em locais visíveis
- [ ] Testar check-in com participante real
- [ ] Confirmar registro no banco de dados

---

## 🚨 TROUBLESHOOTING

### **"QR Code inválido para este evento"**

**Causa:** O texto do QR Code não contém o ID do evento.

**Solução:** 
- Verifique se o QR Code contém `evento-123`
- Gere novamente com o ID correto
- Formato aceito: `evento-123` ou apenas `123`

---

### **"Você não está inscrito neste evento"**

**Causa:** O usuário não tem participação registrada.

**Solução:**
- Verificar se a inscrição foi feita
- Executar:
```sql
SELECT * FROM participacoes
WHERE usuario_id = 'uuid-do-usuario'
  AND evento_id = 123;
```

---

### **"Você já fez check-in hoje neste evento"**

**Causa:** Check-in já foi registrado hoje.

**Solução:**
- Check-in só pode ser feito 1 vez por dia
- Espere até amanhã ou limpe os registros de teste:
```sql
DELETE FROM presencas_detalhes
WHERE participacao_id IN (
  SELECT id FROM participacoes
  WHERE evento_id = 123
  AND usuario_id = 'uuid-do-usuario'
);
```

---

## 📱 DICA PRO

### **Criar QR Codes Únicos por Sessão**

Para eventos com múltiplas sessões:

```
evento-123-sessao-manha
evento-123-sessao-tarde
evento-123-sessao-noite
```

Isso permite controlar check-ins por período!

---

## 🎉 RESULTADO FINAL

Após seguir este guia:

✅ QR Code gerado corretamente  
✅ Formato validado  
✅ Impresso/exibido no evento  
✅ Participantes podem fazer check-in  
✅ Registros salvos no banco de dados  

---

## 📚 RECURSOS ADICIONAIS

### **APIs de QR Code:**
- QR Server: https://goqr.me/api/
- QRCode Monkey API: https://www.qrcode-monkey.com/api
- Chart.js QR: https://chart.googleapis.com/chart

### **Bibliotecas:**
- Python: `qrcode`, `segno`
- Node.js: `qrcode`, `qrcode-generator`
- React: `qrcode.react`, `react-qr-code`

---

**Criado em:** 24/11/2025  
**Versão:** 1.0  
**Status:** ✅ Pronto para usar!
