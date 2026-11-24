# Caderno de Vendas , trabalho frontend unifeso 

Spring Boot + H2 em modo arquivo. O frontend é servido pelo próprio Spring.



## Como rodar

    mvn spring-boot:run

Abra http://localhost:8080. Na primeira vez, o banco é criado em `data/` com alguns exemplos.

## Banco de dados

Console do H2: http://localhost:8080/h2
URL: `jdbc:h2:file:./data/caderno;AUTO_SERVER=TRUE` | usuário: `sa` | senha: vazia

Para recomeçar do zero, pare o servidor e apague a pasta `data/`.

## API

| Método | Rota | O que faz |
| --- | --- | --- |
| GET / POST | `/api/produtos` | lista / cadastra |
| DELETE | `/api/produtos/{id}` | exclui |
| GET / POST | `/api/clientes` | lista / cadastra |
| DELETE | `/api/clientes/{id}` | exclui |
| GET | `/api/vendas?busca=` | lista, com busca por cliente ou produto |
| POST | `/api/vendas` | registra e baixa o estoque |
| DELETE | `/api/vendas/{id}` | exclui e devolve o estoque |
| GET | `/api/vendas/resumo` | total e número de vendas do mês |

## Estrutura

- `src/main/java/br/com/caderno`: entidades, repositórios, controllers, `VendaService` (regra do estoque) e `TratadorDeErros`
- `src/main/resources/static`: `index.html`, `styles.css`, `app.js`
