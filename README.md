# 🚗 Carona Universitária Inteligente

---

# 📌 Sobre o Projeto

API REST desenvolvida em Node.js para gerenciamento de caronas universitárias entre estudantes.

O sistema permite que estudantes universitários ofereçam e encontrem caronas de forma prática e segura.

A API possui autenticação JWT, gerenciamento de usuários e CRUD completo de caronas.

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

## 🚗 Caronas

- Criar carona
- Listar caronas
- Buscar carona por ID
- Atualizar carona
- Remover carona
- Rotas protegidas com JWT

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
| GET | /caronas/:id | Buscar por ID |
| POST | /caronas | Criar carona |
| PUT | /caronas/:id | Atualizar carona |
| DELETE | /caronas/:id | Deletar carona |

---

# 🔒 Autenticação

As rotas de caronas utilizam autenticação JWT.

Exemplo de header:

```txt
Authorization: Bearer SEU_TOKEN
```

---

# 📌 Futuras Melhorias

- Solicitação de vagas
- Aprovação de passageiros
- Avaliação de usuários
- Integração com mapas
- Front-end em React
- Deploy na nuvem

---

# 👨‍💻 Desenvolvedor

Projeto desenvolvido por Alisson Sousa 🚀