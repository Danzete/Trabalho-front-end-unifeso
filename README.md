# Caderno de Vendas — UNIFESO

Sistema de gerenciamento de vendas desenvolvido como trabalho acadêmico de Front-End para a UNIFESO.

O projeto permite cadastrar produtos e clientes, registrar vendas, acompanhar o estoque e visualizar um resumo das vendas realizadas.

## Tecnologias utilizadas

### Front-End
- HTML5
- CSS3
- JavaScript
- React

### Back-End e persistência
- Java 21
- Spring Boot
- Maven
- H2 Database

## Funcionalidades

- **Cadastro de produtos:** nome, preço e quantidade em estoque.
- **Cadastro de clientes:** nome e telefone.
- **Registro de vendas:** associação entre clientes e produtos, com definição da quantidade.
- **Controle de estoque:** baixa automática ao registrar uma venda e devolução ao excluir uma venda.
- **Histórico de vendas:** visualização das vendas registradas.
- **Busca:** pesquisa de vendas por nome do cliente ou produto.
- **Resumo mensal:** exibição do valor total vendido e da quantidade de vendas no mês.
- **Exclusão de registros:** remoção de produtos, clientes e vendas.

## Estrutura do projeto

```text
Trabalho-front-end-unifeso/
│
├── back/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── br/com/caderno/
│   │       │       ├── config/
│   │       │       ├── controllers/
│   │       │       ├── entidades/
│   │       │       ├── repositories/
│   │       │       ├── VendaService.java
│   │       │       └── TratadorDeErros.java
│   │       │
│   │       └── resources/
│   ├── pom.xml
│   └── README.md
│
├── data/
│   └── Banco de dados H2
│
├── app.js
├── index.html
├── styles.css
└── README.md
```

## Como executar o projeto

### 1. Pré-requisitos

- Java JDK 21 ou superior compatível com o projeto.
- Maven 3.9 ou superior.
- Visual Studio Code.
- Extensão Live Server para executar o Front-End.

### 2. Executar o Back-End

Abra o terminal na pasta principal do projeto e execute:

```bash
cd back
mvn spring-boot:run
```

O Spring Boot será iniciado na porta 8080.

### 3. Executar o Front-End

Abra a pasta principal do projeto no Visual Studio Code.

1. Abra o arquivo `index.html`.
2. Clique em **Go Live**, pela extensão Live Server.
3. O Front-End será aberto no navegador, normalmente em:

```text
http://127.0.0.1:5500
```

O Front-End se comunica com o Back-End através de requisições HTTP para:

```text
http://localhost:8080/api
```

Os dois servidores precisam permanecer ativos durante a utilização.

## Banco de dados

O projeto utiliza o H2 Database em modo arquivo, permitindo persistir os dados entre as execuções da aplicação.

**Console do H2:**

http://localhost:8080/h2

**Configuração de conexão:**

```text
JDBC URL: jdbc:h2:file:./data/caderno;AUTO_SERVER=TRUE
Usuário: sa
Senha: (vazia)
```

Na primeira execução, o banco de dados é criado na pasta `data/`, com alguns registros de exemplo.

Para reiniciar o banco de dados do zero, encerre o servidor e apague a pasta `data/`.

## API — Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/produtos` | Lista os produtos |
| POST | `/api/produtos` | Cadastra um produto |
| DELETE | `/api/produtos/{id}` | Exclui um produto |
| GET | `/api/clientes` | Lista os clientes |
| POST | `/api/clientes` | Cadastra um cliente |
| DELETE | `/api/clientes/{id}` | Exclui um cliente |
| GET | `/api/vendas?busca=` | Lista e pesquisa vendas |
| POST | `/api/vendas` | Registra uma venda e baixa o estoque |
| DELETE | `/api/vendas/{id}` | Exclui uma venda e devolve o estoque |
| GET | `/api/vendas/resumo` | Retorna o resumo mensal |

## Objetivo acadêmico

O objetivo do projeto é aplicar os conhecimentos de desenvolvimento Front-End na criação de uma interface funcional para gerenciamento de vendas, trabalhando conceitos de componentes, formulários, manipulação de dados, eventos, integração com API e experiência do usuário.

O Back-End fornece os serviços necessários para o funcionamento da aplicação e a persistência das informações.

---

**Projeto acadêmico — UNIFESO**
