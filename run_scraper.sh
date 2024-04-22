#!/bin/bash

API_DIR="./api"

# Executa o scraper e salva a saída em um novo arquivo JSON temporário
echo "Running scraper..."
ts-node ./scraper/scraper.ts > temp_products.json

# Verifica se o scraper foi bem-sucedido e se o arquivo não está vazio
if [ $? -eq 0 ] && [ -s temp_products.json ]; then
    echo "Scraper executed successfully and output is not empty."

    # Verifica se o conteúdo do arquivo JSON é válido e não apenas um array vazio
    if grep -q '\[\]' temp_products.json; then
        echo "Output is an empty array, not updating the products.json."
        rm temp_products.json
    else
        # Move o arquivo temporário para substituir o products.json no diretório API
        mv temp_products.json "$API_DIR/products.json"
        echo "Updated products.json successfully."
    fi
else
    echo "Failed to execute scraper or output is empty."
    # Remove o arquivo temporário se existir
    [ -f temp_products.json ] && rm temp_products.json
fi
