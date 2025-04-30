# Construção

Aplicação full-stack que combina Next/React para o **front-end** e PHP para o **back-end**, visando demonstrar a comunicação em tempo real entre o cliente e o servidor de banco de dados.

## Tecnologias e Dependências

- **Front-end:**
    - Framework: **Next.js**
    - Biblioteca de componentes: **Shadcn**
    - Dependências: **Node.js** (última versão)

- **Back-end:**
    - Linguagem: **PHP**
    - Servidor embutido para testes: `php -S`
    - Conexão com banco de dados relacional (detalhes configuráveis no arquivo `./server/index.php`)

## Funcionamento da Comunicação

O front-end realiza requisições ao servidor PHP a cada 1 segundo para atualizar as informações. Cada requisição aciona:
- A consulta ao banco de dados.
- Um cálculo para determinar a **média de registros inseridos no banco de dados em 1 segundo.** *(Este cálculo pode ser atualizado conforme necessário.)*

## Estrutura do Projeto

- **/ (root)**: Projeto Next.js com o front-end.
- **/server/**: Código PHP responsável pela comunicação com o banco de dados.


## Configuração e Inicialização

1. Certifique-se de instalar as dependências:
     - Front-end: Execute `npm install` na raiz do projeto.
     - Back-end: Configure as informações de conexão ao banco no arquivo `./server/index.php` (ver linha 21).

2. Para iniciar os servidores:
     - Front-end: Execute `npm run dev` na raiz do projeto.
     - Back-end: No diretório `/server/`, rode `php -S localhost:8080`.

3. Configure a base de dados:
     - Verifique a consistência das tabelas e colunas com o arquivo `.sql` fornecido para facilitar a instalação.

## Possíveis Melhorias e Extensões

- **Documentação da API:** Incluir endpoints, parâmetros e exemplos de respostas.
- **Testes e Debug:** Adicionar testes unitários e logs para monitoramento.
- **Variáveis de Ambiente:** Utilizar um arquivo `.env` para gerenciar informações sensíveis como usuário e senha do banco de dados.
- **Contribuição:** Se o projeto for open source, criar um guia de contribuição (README CONTRIBUTING ou similar).
- **Licença:** Incluir informações sobre a licença para o uso e distribuição do projeto.

*Adicionei detalhes sobre a arquitetura, configurações e futuras extensões que podem ajudar tanto na execução quanto na manutenção e expansão do projeto.*
