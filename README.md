# RepFinalProjXastre
Repositório final do aplicativo desktop desenvolvido na matéria de PI-5. A ideia por trás do aplicativo é criar uma interface para integrar alunos e empresas, para asssim facilitar o processo de criação e inscrição em vagas de emprego.

## Descrição
O aplicativo poderá ser acessado por três tipos de usuários distintos. O primeiro tipo de usuário são as empresas. Esses podem criar vagas de empregos para os alunos interessados, além de cursos de treinamento para essas vagas.<br>A empresa ainda pode criar esses treinamentos, além de quizes ao final do curso no qual os alunos deverão obter uma nota mínima para se aplicar na vaga de emprego.<br>O segundo tipo de usuário são os alunos, que poderão acessar os treinamentos, realizar os quizes necessários para a conclusão do treinamento e, caso obtiver a nota necessária no quiz, se inscrever em uma vaga de emprego.<br>Por fim, existem os admnistradores, que podem visualizar treinamentos e vagas criadas, além de alunos inscritos nas vagas de emprego.

## Linguagens utilizadas
* Java Script
* Html
* Css

## Objetivo
Tendo em vista que o código faz parte de um projeto de faculdade, nosso objetivo foi agrupar nossos conhecimentos prévios com aqueles aprendidos em sala de aula na disciplina de Projeto de Aplicativos, para que assim pudessemos desenvolver este aplicativo.

## Banco de Dados
Ao decorrer do deselvolvimento do nosso aplicativo, foram utilizados dois tipos de banco de dados, o relacional e o não relacional. Para o banco de dados relacional foi utilizado o MySql, já para o não relacional, fizemos uso do MongoDB. Os bancos de dados já foram hospedados fazendo uso da plataforma Railway. Portanto, para rodar a aplicação não é necessário criar localmente um banco de dados.

## Passos Para Inicialização
### Plataformas
É necessário ter a Visual Studio Code instalado em seu computador para abrir os arquivos e rodar o programa.
### Node.js
O programa faz uso do node.js para sua execução, portanto é necessário ter certeza de que o software está instalado em seu dispositivo. Para instalar:
* Acesse o site "nodejs.org" em seu navegador;
* Assim que acessar o site, escolha a versão mais recente e a instale em seu dispositivo.
### Electron
O programa utiliza um framework chamado electron para criar uma janela de aplicação no computador baseada em html. Para baixá-lo, basta acessar o terminal no seu VsCode e inserir o comando: 
```
npm install --save-dev electron
```
### Pacotes e Dependências
O código usa diversos pacotes e dependências que são necessárias para rodar o código. As dependências utilizadas foram:
* axios
* bcrypt
* jwtotoken
* express
* mysql2
* mongodb
* dotenv<br>
Para baixá-las, basta aprir o terminal no VsCode e inserir o comando abaixo, seguido pelo nome da dependência:
```
npm install 
```

## Rodando o aplicativo
Tendo seguido todos os passos apresentados nos passos para inicialização acima, o programa já está pronto para ser executado. Para executar o programa, deve-se criar dois terminais no VsCode. Um dos terminais terá como objetivo realizar a conexão com o banco de dados para que os dados inseridos na aplicação sejam salvos no banco. Já o segundo terminal é aquele responsável por abrir a janela da aplicação.<br>No primeiro terminal, insira os comandos: 
```
cd backend
```
```
node main.js
```
Sendo assim, a conexão com o banco de dados já foi estabelecida. Agora, para abrir a aplicação, basta inserir no segundo terminal os seguintes comandos:
```
cd frontend
```
```
npm run start
```

## Autores
* Tiago Rodrigues Mattar
* Lucas Lopes Leme
* Gabriel Struciatti Garcia
* Cauê Exposito Obici
* Ricardo Percario de Souza Ribeiro
