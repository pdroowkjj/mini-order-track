# Mini Order Track

Aplicação simples de acompanhamento de pedidos. Um usuário se cadastra, faz login,
e cria/lista/atualiza pedidos (status: recebido, em preparo, saiu para entrega,
entregue, cancelado).

Isso não é um sistema em produção. Este README existe para
deixar claro o que foi feito, por que foi feito assim, e o que eu mudaria se isso
fosse virar um sistema real.

## Stack

- Backend: Java 21, Spring Boot, Spring Security (JWT stateless), Spring Data JPA
- Banco: SQLite (arquivo local `orders.db`)
- Frontend: React 19 + TypeScript, Vite, React Router, Tailwind

## Rodando localmente

Backend:

```
cd orders-api
./mvnw spring-boot:run
```

Frontend:

```
cd orders-web
npm install
npm run dev
```

O frontend espera a API em `http://localhost:8080` (ver `orders-web/.env.example`).
CORS já está liberado para `http://localhost:5173`.

## O que existe hoje

- Cadastro/login com JWT, senha com BCrypt
- CRUD de pedidos (criar, listar, buscar por id, atualizar status)
- Rotas privadas no front (redireciona pra login se não autenticado)

Vale citar algumas simplificações assumidas de propósito, pra manter o escopo pequeno:

- `Order` guarda `customerName`, `deliveryAddress` e `items` como campos soltos na
  própria tabela, em vez de referenciar `Customer`, `Address` e uma tabela de itens.
  Funciona para o volume de dados desse "projeto", mas quebra em produção
  (sem histórico de cliente, sem reaproveitar endereço, `items` é uma string
  concatenada em vez de linhas de pedido).
- Não há paginação: `GET /api/orders` devolve a tabela inteira.
- SQLite com um arquivo local, sem migrations versionadas.

## O que eu faria diferente em produção

Esta seção é o motivo desse README existir: mostrar que as escolhas acima foram
conscientes e que dá pra argumentar sobre elas, não que eu não sei que existem.

### Paginação

Hoje o endpoint de listagem não pagina nada. Em um sistema real eu escolheria entre
duas abordagens dependendo da demanda:

- **Offset pagination** (`LIMIT`/`OFFSET`, com `page`/`size` na query string) é mais
  simples de implementar e o Spring Data já suporta nativamente via `Pageable`.
  Funciona bem quando o usuário navega por número de página (ex: "ir para a página
  5") e o volume de dados é pequeno/médio. O problema é performance em tabelas
  grandes (o banco ainda precisa varrer e descartar as linhas puladas) e
  inconsistência quando linhas são inseridas/removidas entre uma página e outra.
- **Keyset pagination** (a.k.a. seek method: `WHERE created_at < :cursor ORDER BY
created_at DESC LIMIT :size`) é o que eu usaria para a listagem de pedidos em
  produção, porque o caso de uso real é "scroll infinito"/feed cronológico, não
  navegação por página numerada. É mais rápido em tabelas grandes (usa índice, não
  varre o que foi pulado) e não duplica/pula itens quando há inserções concorrentes.
  O custo é a implementação um pouco mais chata (cursor opaco, ordenação estável
  precisa de uma coluna de desempate, ex: `(created_at, id)`).

Ou seja: a escolha não é "qual é melhor" em abstrato, é qual encaixa no padrão de
acesso. Um painel administrativo com paginação numerada pode preferir offset; um
feed/histórico de pedidos por cliente pede keyset.

### Modelagem de dados

Eu desacoplaria as tabelas:

- `Order` deixaria de guardar `customerName`/`deliveryAddress` direto e passaria a
  referenciar `Customer` (com seus próprios endereços) via chave estrangeira.
- `items` (hoje uma string tipo `"item1, item2"`) viraria uma tabela `OrderItem`
  associada a um catálogo de `Product`, com quantidade e preço unitário no momento
  da compra (preço do produto muda, o preço do pedido já fechado não pode mudar
  retroativamente).
- Isso abre espaço pra consultas que hoje são inviáveis (histórico de compras por
  cliente, produto mais vendido, etc.) sem parsear string.

### Banco de dados

SQLite é ótimo pra rodar local sem dependência externa, mas não é a escolha certa
pra produção com múltiplos usuários simultâneos (lock de escrita único no arquivo).
Trocaria por PostgreSQL e adicionaria migrations versionadas (Flyway ou Liquibase)
em vez de `ddl-auto=update`, que é conveniente em dev mas perigoso em produção
(o Hibernate decide o schema sozinho, sem histórico nem revisão).

### Outros pontos que eu endureceria

- Índices explícitos nas colunas usadas em filtro/ordenação (`status`, `created_at`,
  FK de cliente), hoje inexistentes.
- Tratamento de erro mais consistente na API (hoje alguns endpoints devolvem string
  crua em vez de um formato de erro padronizado).
- Testes de integração cobrindo os fluxos de autenticação e autorização (hoje só
  o essencial).
- Refresh token / expiração e revogação de JWT — hoje o token é emitido e não há
  como invalidá-lo antes de expirar.

---

## English

Simple order-tracking app. A user signs up, logs in, and creates/lists/updates
orders (status: received, preparing, out for delivery, delivered, cancelled).

This is not a production system. This README exists to make clear what was built,
why it was built this way, and what I'd change if this had to become a real
system.

### Stack

- Backend: Java 21, Spring Boot, Spring Security (stateless JWT), Spring Data JPA
- Database: SQLite (local file `orders.db`)
- Frontend: React 19 + TypeScript, Vite, React Router, Tailwind

### Running locally

Backend:

```
cd orders-api
./mvnw spring-boot:run
```

Frontend:

```
cd orders-web
npm install
npm run dev
```

The frontend expects the API at `http://localhost:8080` (see
`orders-web/.env.example`). CORS is already open for `http://localhost:5173`.

### What exists today

- Sign up/login with JWT, password hashed with BCrypt
- Order CRUD (create, list, get by id, update status)
- Private routes on the frontend (redirects to login if not authenticated)

Worth calling out a few simplifications taken on purpose, to keep the scope small:

- `Order` stores `customerName`, `deliveryAddress` and `items` as plain columns on
  the table itself, instead of referencing `Customer`, `Address` and an order-items
  table. That's fine for the data volume of a study project, but it breaks down in
  production (no customer history, no address reuse, `items` is a concatenated
  string instead of proper order lines).
- No pagination: `GET /api/orders` returns the whole table.
- SQLite with a local file, no versioned migrations.

### What I'd do differently in production

This section is the whole point of this README: showing that the choices above
were deliberate and that there's an argument behind them, not that I'm unaware
they exist.

#### Pagination

Right now the listing endpoint doesn't paginate at all. In a real system I'd
choose between two approaches depending on the demand:

- **Offset pagination** (`LIMIT`/`OFFSET`, with `page`/`size` in the query string)
  is simpler to implement and Spring Data already supports it natively via
  `Pageable`. It works well when the user navigates by page number (e.g. "go to
  page 5") and the data volume is small/medium. The problem is performance on
  large tables (the database still has to scan and discard the skipped rows) and
  inconsistency when rows are inserted/removed between pages.
- **Keyset pagination** (a.k.a. the seek method: `WHERE created_at < :cursor ORDER
  BY created_at DESC LIMIT :size`) is what I'd use for the order listing in
  production, because the real use case is an infinite scroll/chronological feed,
  not numbered-page navigation. It's faster on large tables (uses an index instead
  of scanning what was skipped) and doesn't duplicate/skip items under concurrent
  inserts. The cost is a slightly more annoying implementation (opaque cursor,
  stable ordering needs a tiebreaker column, e.g. `(created_at, id)`).

In other words: the choice isn't "which is better" in the abstract, it's which
fits the access pattern. An admin panel with numbered pagination might prefer
offset; an order feed/history per customer calls for keyset.

#### Data modeling

I'd decouple the tables:

- `Order` would stop storing `customerName`/`deliveryAddress` directly and would
  reference `Customer` (with its own addresses) via foreign key.
- `items` (today a string like `"item1, item2"`) would become an `OrderItem`
  table linked to a `Product` catalog, with quantity and unit price at the time of
  purchase (product price changes, an already-closed order's price can't change
  retroactively).
- This opens up queries that are unworkable today (purchase history per customer,
  best-selling product, etc.) without parsing a string.

#### Database

SQLite is great for running locally with no external dependency, but it's not the
right choice for production with multiple concurrent users (single write lock on
the file). I'd switch to PostgreSQL and add versioned migrations (Flyway or
Liquibase) instead of `ddl-auto=update`, which is convenient in dev but risky in
production (Hibernate decides the schema on its own, with no history or review).

#### Other things I'd harden

- Explicit indexes on columns used for filtering/sorting (`status`, `created_at`,
  customer FK), none of which exist today.
- More consistent error handling in the API (today some endpoints return a raw
  string instead of a standardized error format).
- Integration tests covering the authentication and authorization flows (today
  only the essentials are covered).
- Refresh token / JWT expiration and revocation — today the token is issued and
  there's no way to invalidate it before it expires.
