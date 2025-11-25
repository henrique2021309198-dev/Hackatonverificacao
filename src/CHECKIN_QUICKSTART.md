# ⚡ CHECK-IN - QUICK START

## 🚀 USO RÁPIDO

### **1. Gerar QR Code**
```
https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=evento-123
```
Substitua `123` pelo ID do seu evento!

### **2. Usuário Fazer Check-in**
1. Login no sistema
2. Meus Eventos → Em Andamento
3. Botão "Check-in" 📱
4. Escanear QR Code
5. ✅ Pronto!

---

## 📋 CRIAR EVENTO DE TESTE

```sql
INSERT INTO eventos (nome, descricao, data_inicio, duracao_horas, 
  limite_faltas_percentual, valor_evento, texto_certificado, 
  perfil_academico_foco, local, capacidade_maxima, 
  vagas_disponiveis, categoria)
VALUES (
  'Teste Check-in',
  'Evento para testar',
  NOW() - INTERVAL '1 hour',  -- Começou há 1h
  8,  -- Duração 8h
  0.25, 0, 'Certificado', 'todos',
  'Online', 50, 50, 'Workshop'
) RETURNING id;
```

---

## 🔍 VERIFICAR CHECK-IN

```sql
-- Ver check-ins
SELECT 
    u.nome,
    e.nome as evento,
    pd.data_registro,
    pd.sessao_nome
FROM presencas_detalhes pd
JOIN participacoes p ON pd.participacao_id = p.id
JOIN auth.users u ON p.usuario_id = u.id
JOIN eventos e ON p.evento_id = e.id
ORDER BY pd.data_registro DESC;
```

---

## ✅ FORMATO QR CODE

Aceito qualquer um:
- `evento-123`
- `123`
- `evento-123-sessao-manha`

---

## 📚 DOCS COMPLETAS

- `/CHECKIN_BACKEND_IMPLEMENTADO.md` - Resumo técnico
- `/TESTAR_CHECKIN_COMPLETO.md` - Guia de testes
- `/COMO_GERAR_QRCODES.md` - Geração de QR Codes

---

## 🐛 PROBLEMAS COMUNS

**"QR Code inválido"**  
→ QR Code deve conter o ID do evento

**"Já fez check-in hoje"**  
→ Só pode fazer 1x por dia

**"Não está inscrito"**  
→ Fazer inscrição primeiro

**"Câmera não abre"**  
→ Permitir acesso nas configurações

---

✅ **SISTEMA 100% FUNCIONAL!**
