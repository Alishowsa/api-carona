# 🚗 Carona Universitária Inteligente

---

# 📌 Sobre o Projeto

API REST desenvolvida em Node.js para gerenciamento de caronas universitárias entre estudantes.

O sistema permite que estudantes universitários ofereçam e encontrem caronas de forma prática, segura e organizada.

A aplicação possui autenticação JWT, gerenciamento de usuários, CRUD completo de caronas e sistema de solicitações de vagas.

O projeto está sendo desenvolvido com foco em arquitetura back-end, segurança, relacionamentos no banco de dados e regras reais de negócio.

---

# 🚀 Tecnologias Utilizadas

- Node.js
- Express
- MySQL
- JWT (JSON Web Token)
- bcryptjs
- dotenv

---

# 📂 Estrutura do Projeto

```bash
api-carona/
│
├── controllers/
├── routes/
├── middlewares/
├── database/
├── models/
├── config/
├── .gitignore
├── server.js
└── package.json
```

---

# 🔐 Funcionalidades

## 👤 Usuários

- Cadastro de usuários
- Login autenticado
- Senhas criptografadas com bcrypt
- Geração de token JWT
- Middleware de autenticação
- Proteção de rotas privadas

---

## 🚗 Caronas

- Criar carona
- Listar caronas
- Buscar carona por ID
- Atualizar carona
- Remover carona
- Rotas protegidas com JWT
- Associação da carona ao motorista logado
- Apenas o dono pode editar/deletar sua carona

---

## 👥 Solicitações

- Solicitar vaga em carona
- Impedir solicitação duplicada
- Impedir solicitar vaga na própria carona
- Aceitar solicitação
- Recusar solicitação
- Controle automático de vagas disponíveis
- Status da solicitação:
  - pendente
  - aceita
  - recusada

---

# ⚙️ Instalação

Entre na pasta do projeto:

```bash
cd api-carona
```

Instale as dependências:

```bash
npm install
```

---

# 🔑 Configuração do .env

Crie um arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=carona_db
DB_PORT=3306

JWT_SECRET=sua_chave_secreta
```

---

# ▶️ Executar Projeto

```bash
node server.js
```

ou com nodemon:

```bash
npx nodemon server.js
```

---

# 🧱 Estrutura do Banco de Dados

## 👤 usuarios

```sql
id
nome
email
senha
```

---

## 🚗 caronas

```sql
id
motorista_id
origem
destino
horario
vagas
created_at
```

---

## 👥 solicitacoes

```sql
id
carona_id
passageiro_id
status
created_at
```

---

# 📡 Endpoints

## 👤 Usuários

| Método | Rota | Descrição |
|---|---|---|
| POST | /usuarios | Cadastro |
| POST | /usuarios/login | Login |

---

## 🚗 Caronas

| Método | Rota | Descrição |
|---|---|---|
| GET | /caronas | Listar caronas |
| GET | /caronas/:id | Buscar carona por ID |
| POST | /caronas | Criar carona |
| PUT | /caronas/:id | Atualizar carona |
| DELETE | /caronas/:id | Remover carona |

---

## 👥 Solicitações

| Método | Rota | Descrição |
|---|---|---|
| POST | /solicitacoes/:carona_id | Solicitar vaga |
| PUT | /solicitacoes/:id/aceitar | Aceitar solicitação |
| PUT | /solicitacoes/:id/recusar | Recusar solicitação |

---

# 🔒 Autenticação

As rotas privadas utilizam autenticação JWT.

Exemplo de header:

```txt
Authorization: Bearer SEU_TOKEN
```

---

# 🧠 Fluxo do Sistema

```txt
Usuário cria conta
↓
Faz login
↓
Recebe token JWT
↓
Cria carona
↓
Outro usuário solicita vaga
↓
Solicitação fica pendente
↓
Motorista aceita ou recusa
↓
Sistema atualiza vagas automaticamente
```

---

# 📌 Futuras Melhorias

- Integração com OpenStreetMap
- Sistema de rotas e paradas
- Geolocalização
- Avaliação de usuários
- Sistema de pagamentos
- Histórico de viagens
- Caronas recorrentes
- Cálculo automático de distância
- Front-end em React
- Deploy na nuvem

---

# 👨‍💻 Desenvolvedor

 Alisson Sousa 🚀
