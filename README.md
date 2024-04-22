# Amazon BestSellers

Este projeto busca os 3 produtos mais vendidos da página de best-sales da Amazon, armazena e disponibiliza para consumo através de API.

Para fazer isso foram utilizados node, typescript, puppeteer, serverless framework e recursos do Tier gratuito da AWS, que são o alvo desse estudo/desafio.

Tecnologias utilizadas:

- AWS Lambda
  - Utilizado para computação - processamento das requisições, salvamento e recuperação de dados no Banco de Dados.
- AWS DynamoDB
  - Banco de dados utilizado para armazenar os produtos.
- AWS ApiGateway
  - Utilizado para expor o acesso às Lambdas, criando rotas HTTP públicas, permitindo gerenciar políticas de acesso.
 
desenho de arquitetura inicial: 

![Desenho de arquitetura](https://github.com/knzt/bestsellers-serverless-api/blob/main/docs/arquitetura.jpeg)

## Estrutura

Para facilitar revisão e manutenção, por ser um projeto pequeno, foi decidida a utilização de um MonoRepo, onde tanto o Scraper que é executado localmente, quanto o Framework Serverless estão no mesmo repositório e partilham dependencias comuns de desenvolvimento, como Linter e Formatter.

Os arquivos e suas responsabilidades estão dispostos da seguinte forma:

```
│   README.md
│   package.json
└───api/
│   │   handler.ts        // Funções Lambda para computação
│   │   serverless.yml    // Configuração do Framework Serverless
│   │   event.json        // Parametro utilizado para buscar produto localmente
│   │   products.json     // Arquivo resultado após executar o Scraper
└───scraper/
    │   scraper.ts        // Responsável por buscar os produtos na Amazon
    └───entities/
    |   |   product.ts    // Modelagem do objeto Produto
```

## API Reference

URL Base:

- https://b0vp2k74xl.execute-api.us-east-1.amazonaws.com/dev/

#### Buscar Todos

```http
  GET /bestsellers
```

**Resposta**

```json
{
  "message": "Success",
  "data": [
    {
      "title": "Nome do produto",
      "price": 10.34,
      "rate": 4.5,
      "url": "https://amazon.com.br/...",
      "date": "2024-04-21T20:03:08.210Z"
    }
  ]
}
```

#### Buscar Produto por ID

```http
  GET /bestsellers/${id}
```

| Parameter | Type     | Description                    |
| :-------- | :------- | :----------------------------- |
| `id`      | `string` | **Obrigatório**. ID do Produto |

**Resposta**

```json
{
  "message": "Success",
  "product": {
    "title": "Nome do produto",
    "price": 10.34,
    "rate": 4.5,
    "url": "https://amazon.com.br/...",
    "date": "2024-04-21T20:03:08.210Z"
  }
}
```

## Instalação

- Instale as dependencias com Npm

- Caso não tenha o ts-node instalado globalmente, será necessário substituir as referências do comando pelo caminho absoluto:

```bash
  ./node_modules/.bin/ts-node
```
  
- no diretório raiz do projeto, usando o script Bash:
 
```bash
  ./install_dependencies.sh
```
- ou manualmente:
```bash
  cd bestsellers-serverless-api
  npm install
```

## Executando o Scraper

no diretório raiz do projeto, usando o script Bash:

- use o comando:

```bash
  ./run_scraper.sh
```
-Em caso de timeout, tente novamente após um minuto.
A instrução acima, caso o script seja executado sem erro, vai substituir o arquivo 'api/products.json' por um novo, com os dados retornados do scraper.

uma alternativa ao script, é executar o scraper manualmente.

- na raiz do projeto use o comando:

```bash
  npm run dev
```
- Copie os dados impressos no console, e colar no arquivo 'api/products.json'

## Executando as funções lambdas

Certifique-se que suas credenciais da aws estejam configuradas, e de que o productjs.json existe

- navegue até o diretório api

```bash
  cd api
```
- faça o deploy das funções definidas no arquivo serverless.yml

```bash
  npm run deploy
```

- invoque as funções:

```bash
  npm run invoke <functionName>
```
As funções ta,bém podem ser testadas localmente

```bash
  npm run local <functionName>
```

E no caso da função getProductByID, que requer o uso o api gateway para obter o parâmetro via id, pode usar o id fornecido no arquivo event.json

```bash
  npm run local <functionName> -p event.json
```

## Screenshots
Screenshot da tela de produtos no momento em que foi feito o scraper dos produtos disponíveis na url comartilhada nesse repositório:

![Screenshot da tela de produtos no momento em que foi feito o scraper dos produtos disponíveis na url comartilhada nesse repositório](https://github.com/knzt/bestsellers-serverless-api/blob/main/docs/scraped_page.jpeg)

Screenshot da tabela do dynamoDB com os produtos retornados do scraper:
![Screenshot da tabela do dynamoDB com os produtos retornados do scraper](https://github.com/knzt/bestsellers-serverless-api/blob/main/docs/table.png)

## Authors

- [Hellen Santos](https://www.github.com/knzt)
