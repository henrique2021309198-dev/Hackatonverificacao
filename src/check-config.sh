#!/bin/bash

echo "🔍 Verificando configuração de SPA..."
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador
ISSUES=0

# Verificar arquivos
echo "📁 Verificando arquivos de configuração:"

if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✅ vercel.json encontrado${NC}"
else
    echo -e "${RED}❌ vercel.json NÃO encontrado${NC}"
    ISSUES=$((ISSUES+1))
fi

if [ -f "netlify.toml" ]; then
    echo -e "${GREEN}✅ netlify.toml encontrado${NC}"
else
    echo -e "${RED}❌ netlify.toml NÃO encontrado${NC}"
    ISSUES=$((ISSUES+1))
fi

if [ -f "public/_redirects" ]; then
    echo -e "${GREEN}✅ public/_redirects encontrado${NC}"
else
    echo -e "${RED}❌ public/_redirects NÃO encontrado${NC}"
    ISSUES=$((ISSUES+1))
fi

if [ -f "public/.htaccess" ]; then
    echo -e "${GREEN}✅ public/.htaccess encontrado${NC}"
else
    echo -e "${RED}❌ public/.htaccess NÃO encontrado${NC}"
    ISSUES=$((ISSUES+1))
fi

echo ""
echo "📋 Verificando arquivos essenciais:"

if [ -f "index.html" ]; then
    echo -e "${GREEN}✅ index.html encontrado${NC}"
else
    echo -e "${RED}❌ index.html NÃO encontrado${NC}"
    ISSUES=$((ISSUES+1))
fi

if [ -f "src/main.tsx" ]; then
    echo -e "${GREEN}✅ src/main.tsx encontrado${NC}"
else
    echo -e "${RED}❌ src/main.tsx NÃO encontrado${NC}"
    ISSUES=$((ISSUES+1))
fi

if [ -f "vite.config.ts" ]; then
    echo -e "${GREEN}✅ vite.config.ts encontrado${NC}"
else
    echo -e "${RED}❌ vite.config.ts NÃO encontrado${NC}"
    ISSUES=$((ISSUES+1))
fi

if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ package.json encontrado${NC}"
else
    echo -e "${RED}❌ package.json NÃO encontrado${NC}"
    ISSUES=$((ISSUES+1))
fi

echo ""
echo "🔐 Verificando variáveis de ambiente:"

if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env encontrado${NC}"
    if grep -q "VITE_SUPABASE_URL" .env; then
        echo -e "${GREEN}  ✅ VITE_SUPABASE_URL configurada${NC}"
    else
        echo -e "${YELLOW}  ⚠️  VITE_SUPABASE_URL não encontrada${NC}"
    fi
    if grep -q "VITE_SUPABASE_ANON_KEY" .env; then
        echo -e "${GREEN}  ✅ VITE_SUPABASE_ANON_KEY configurada${NC}"
    else
        echo -e "${YELLOW}  ⚠️  VITE_SUPABASE_ANON_KEY não encontrada${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .env não encontrado (crie baseado em .env.example)${NC}"
fi

echo ""
echo "📊 Resultado:"
echo ""

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}🎉 Tudo OK! Pronto para deploy.${NC}"
    echo ""
    echo "Execute:"
    echo "  git add ."
    echo "  git commit -m \"fix: configuração SPA rewrites\""
    echo "  git push"
else
    echo -e "${RED}❌ Encontrados $ISSUES problemas.${NC}"
    echo ""
    echo "Execute novamente os scripts de correção."
fi

echo ""
