#!/bin/bash

# Garante que o script seja interrompido se ocorrer qualquer erro
set -e

# Função para instalar dependências usando npm
install_deps() {
    echo "Instalando dependências em $1..."
    cd "$1" || exit
    npm install
    cd - || exit
}

# Instalar dependências na raiz do projeto
echo "Instalando dependências na raiz do projeto..."
npm install

# Instalar dependências nos subdiretórios
install_deps "./api"
install_deps "./scraper"

echo "Instalação das dependências completada com sucesso."
