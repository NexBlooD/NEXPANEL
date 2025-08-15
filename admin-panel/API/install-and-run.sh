#!/bin/bash

echo "======================================"
echo "  Instalador API Perfect World"
echo "======================================"
echo

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado!"
    echo "Por favor, instale o Node.js primeiro:"
    echo "https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado!"
    echo "Por favor, instale o npm primeiro"
    exit 1
fi

echo "✅ npm encontrado: $(npm --version)"
echo

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso!"
    echo
    echo "🚀 Iniciando servidor..."
    echo "Pressione Ctrl+C para parar o servidor"
    echo
    node app.js
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi
