# Construção

O projeto foi feito usando o framework **Next** para a criação do front-end, juntamente com a biblioteca **Shadcn** que contém os componentes do front-end pré-prontos.
Para construir o back-end foi utilizado o **PHP** para a comunicação com o banco de dados.

# Como funciona a comunicação?

O front-end faz a requisição para o servidor embutido do PHP, que por sua vez faz a comunicação com o banco de dados.
A cada 1 segundo o front-end faz uma requisição para o servidor para atualizar as informações do banco de dados.
O front-end faz um cálculo para calcular a **média de registros inseridos no banco de dados no intervalo de 1 segundo.** <- *Irei Mudar*

# Como rodar o projeto?

1. Você precisa ter o **Node.js** instalado na sua máquina, além de ter o **PHP** instalado, ambos nas versões mais recentes.
2. Verifique se a **base de dados** está configurada corretamente na sua máquina, ou seja, os nomes das tabelas e colunas estão corretos - Vou adicionar um arquivo .sql para facilitar a instalação da base.
3. Mude o arquivo `./server/index.php` e coloque as informações de conexão com o banco de dados, tais como seu usuário e senha - na linha 21 em `./server/index.php`.
4. No diretório **root** do projeto, rode o comando `npm install` para instalar as dependências do projeto,em seguida rode o comando `npm run dev` para iniciar o servidor NodeJS.
5. Em seguida, ainda no diretório root, execute `cd .\server\` para acessar o diretório do servidor PHP, e rode o comando `php -S localhost:8080` para iniciar o servidor PHP.