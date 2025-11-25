# 🎥 RESOLVER PROBLEMAS DE PERMISSÃO DE CÂMERA

## ❌ ERRO: "Permission denied" / "NotAllowedError"

Este erro ocorre quando o navegador bloqueia o acesso à câmera.

---

## ✅ SOLUÇÕES RÁPIDAS

### **Solução 1: Usar HTTPS**

O navegador **exige HTTPS** para acessar câmera em produção!

**Opções:**

#### **A) Usar Ngrok (Desenvolvimento)**
```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta 3000 (ou sua porta)
ngrok http 3000
```

Acesse o link HTTPS gerado: `https://abc123.ngrok.io`

#### **B) Configurar HTTPS Local**
```bash
# Criar certificado SSL local
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Rodar servidor com HTTPS
# (depende do seu framework)
```

#### **C) Usar Localhost**
```
http://localhost:3000
```
✅ Navegadores permitem câmera em `localhost` sem HTTPS!

---

### **Solução 2: Desbloquear Câmera no Navegador**

#### **Google Chrome:**
1. Clique no **🔒 ícone de cadeado** na barra de endereço
2. Procure **"Câmera"**
3. Selecione **"Permitir"**
4. Recarregue a página (F5)

#### **Firefox:**
1. Clique no **🔒 ícone de cadeado** na barra de endereço
2. Clique em **"Conexão Segura"**
3. Vá em **"Mais informações"**
4. Aba **"Permissões"**
5. Desmarque **"Usar padrão"** para Câmera
6. Marque **"Permitir"**
7. Recarregue a página

#### **Safari (iOS/Mac):**
1. Vá em **Configurações** (⚙️)
2. Role até **Safari**
3. Toque em **Câmera**
4. Selecione **"Permitir"**
5. Volte e recarregue o site

#### **Edge:**
1. Clique no **🔒 ícone de cadeado**
2. Clique em **"Permissões para este site"**
3. Câmera → **"Permitir"**
4. Recarregue a página

---

### **Solução 3: Verificar Configurações do Sistema**

#### **Windows:**
1. Abra **Configurações** → **Privacidade**
2. Clique em **Câmera**
3. Ative: **"Permitir aplicativos acessarem câmera"**
4. Ative: **"Permitir aplicativos de desktop acessarem câmera"**
5. Role até navegadores e ative

#### **macOS:**
1. Abra **Preferências do Sistema**
2. Clique em **Segurança e Privacidade**
3. Aba **Privacidade**
4. Selecione **Câmera** na lista
5. Marque seu navegador (Chrome, Safari, etc.)

#### **Android:**
1. Abra **Configurações**
2. **Apps** → Seu navegador
3. **Permissões**
4. Ative **Câmera**

#### **iOS:**
1. Abra **Ajustes**
2. Role até seu navegador (Safari, Chrome)
3. Ative **Câmera**

---

### **Solução 4: Usar Entrada Manual**

Se a câmera não funcionar, o sistema agora tem **entrada manual**!

1. Abra o scanner de QR Code
2. Se aparecer erro de câmera, veja o campo **"Ou insira o código manualmente"**
3. Digite o código (ex: `evento-123`)
4. Clique em **"Confirmar"**
5. ✅ Check-in realizado!

---

## 🔍 DIAGNÓSTICO

### **Verificar se câmera está disponível**

Abra o **Console do navegador** (F12) e cole:

```javascript
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    console.log('✅ Câmera disponível!');
    stream.getTracks().forEach(track => track.stop());
  })
  .catch(err => {
    console.error('❌ Erro:', err.name, err.message);
  });
```

**Resultados possíveis:**

- ✅ **"Câmera disponível"** → Câmera funciona!
- ❌ **"NotAllowedError"** → Permissão negada
- ❌ **"NotFoundError"** → Nenhuma câmera encontrada
- ❌ **"NotReadableError"** → Câmera em uso por outro app
- ❌ **"NotSupportedError"** → Navegador não suporta
- ❌ **"TypeError"** → Site não está em HTTPS

---

## 🌐 REQUISITOS DO NAVEGADOR

### **Navegadores Suportados:**

| Navegador | Versão Mínima | HTTPS Obrigatório? |
|-----------|---------------|---------------------|
| Chrome    | 53+           | ✅ Sim (exceto localhost) |
| Firefox   | 36+           | ✅ Sim (exceto localhost) |
| Safari    | 11+           | ✅ Sim (exceto localhost) |
| Edge      | 79+           | ✅ Sim (exceto localhost) |
| Opera     | 40+           | ✅ Sim (exceto localhost) |

### **Mobile:**

| Dispositivo | Sistema | Suportado? |
|-------------|---------|------------|
| iPhone      | iOS 11+ | ✅ Sim     |
| Android     | 7.0+    | ✅ Sim     |
| iPad        | iOS 11+ | ✅ Sim     |
| Tablets Android | 7.0+ | ✅ Sim  |

---

## 🔧 TROUBLESHOOTING AVANÇADO

### **Problema: "Câmera não abre mesmo com permissão"**

**Solução:**
1. Feche outras abas/apps usando câmera
2. Reinicie o navegador
3. Teste em modo anônimo/privado
4. Limpe cache e cookies
5. Atualize o navegador

### **Problema: "QR Code não detecta"**

**Soluções:**
- Aumentar iluminação
- Limpar lente da câmera
- Aproximar/afastar QR Code
- Usar QR Code maior (500x500px)
- Aumentar contraste do QR Code
- Usar entrada manual

### **Problema: "Erro em localhost"**

**Verifique:**
- URL é `http://localhost:3000` (não `http://127.0.0.1`)
- Navegador permite câmera em localhost
- Porta correta

### **Problema: "Erro em produção"**

**Verifique:**
- Site usa **HTTPS** (obrigatório!)
- Certificado SSL válido
- Permissões do navegador
- Permissões do sistema operacional

---

## 🎯 MELHORIAS IMPLEMENTADAS

O sistema agora tem:

1. ✅ **Solicitação de permissão prévia** - Pede permissão antes de iniciar scanner
2. ✅ **Entrada manual** - Alternativa se câmera não funcionar
3. ✅ **Mensagens de erro claras** - Usuário sabe o que fazer
4. ✅ **Botão "Tentar Novamente"** - Fácil de retentar
5. ✅ **Tratamento robusto de erros** - Não quebra o sistema

---

## 📱 TESTANDO

### **Teste 1: Permissão Concedida**
1. Abra scanner
2. Clique em "Permitir" quando solicitar câmera
3. ✅ Câmera deve abrir

### **Teste 2: Permissão Negada**
1. Abra scanner
2. Clique em "Bloquear" quando solicitar câmera
3. ✅ Deve mostrar entrada manual
4. Digite código manualmente
5. ✅ Check-in deve funcionar

### **Teste 3: Sem Câmera**
1. Desabilite câmera no sistema
2. Abra scanner
3. ✅ Deve mostrar entrada manual
4. Digite código e confirme
5. ✅ Check-in deve funcionar

---

## 📋 CHECKLIST

Para garantir que câmera funciona:

- [ ] Site está em **HTTPS** ou **localhost**
- [ ] Certificado SSL válido (se HTTPS)
- [ ] Navegador atualizado
- [ ] Permissão de câmera concedida no navegador
- [ ] Permissão de câmera concedida no sistema
- [ ] Nenhum outro app usando câmera
- [ ] Câmera funcionando (testar em outro app)
- [ ] JavaScript habilitado
- [ ] Entrada manual disponível como fallback

---

## 🎉 ENTRADA MANUAL (FALLBACK)

### **Como funciona:**

1. Se câmera falhar, campo de entrada aparece
2. Usuário digita código do QR Code
3. Ex: `evento-123`
4. Clica em "Confirmar"
5. ✅ Check-in processado normalmente!

### **Vantagens:**
- ✅ Funciona sem câmera
- ✅ Funciona sem HTTPS
- ✅ Funciona em qualquer dispositivo
- ✅ Rápido e simples
- ✅ Sem dependências

### **Como obter código:**
- Organizador pode informar verbalmente
- Exibir em tela junto ao QR Code
- Enviar por e-mail/SMS
- Mostrar em papel

---

## 📄 EXEMPLO DE SINALIZAÇÃO

### **Cartaz Recomendado:**

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
║   📱 ESCANEIE PARA CHECK-IN           ║
║                                        ║
║   Ou digite o código:                 ║
║   evento-123                          ║
║                                        ║
╚════════════════════════════════════════╝
```

---

## 🆘 SUPORTE

### **Se nada funcionar:**

1. Use **entrada manual**
2. Verifique todos os itens do checklist
3. Teste em outro navegador
4. Teste em outro dispositivo
5. Consulte logs do console (F12)
6. Verifique documentação do navegador

### **Logs Úteis:**

Abra console (F12) e procure:
- ❌ "NotAllowedError" → Permissão negada
- ❌ "NotFoundError" → Câmera não encontrada
- ❌ "NotReadableError" → Câmera em uso
- ❌ "TypeError" → HTTPS necessário

---

## ✅ RESUMO

**Principais causas do erro:**
1. Site não está em HTTPS (exceto localhost)
2. Permissão negada no navegador
3. Permissão negada no sistema operacional
4. Câmera em uso por outro app
5. Navegador desatualizado

**Soluções principais:**
1. ✅ Usar HTTPS ou localhost
2. ✅ Permitir câmera no navegador
3. ✅ Permitir câmera no sistema
4. ✅ Usar entrada manual como fallback
5. ✅ Atualizar navegador

---

**Criado em:** 24/11/2025  
**Versão:** 1.0  
**Status:** ✅ Soluções implementadas!
