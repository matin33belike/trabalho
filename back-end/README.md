# 📋 Gerenciador de Tarefas — Back-end

Back-end RESTful para gerenciamento de tarefas, desenvolvido com **Node.js**, **Express** e **Prisma ORM**, utilizando dois bancos de dados **PostgreSQL** com separação de responsabilidades.

---

## 🏗️ Arquitetura do Projeto

```
task-manager/
├── prisma/
│   ├── schema.main.prisma       # Schema do banco principal (tarefas)
│   └── schema.logs.prisma       # Schema do banco de logs
├── src/
│   ├── prisma/
│   │   ├── mainClient.js        # Cliente Prisma → banco principal
│   │   └── logsClient.js        # Cliente Prisma → banco de logs
│   ├── controllers/
│   │   └── tarefaController.js  # Tratamento de requisições HTTP
│   ├── services/
│   │   ├── tarefaService.js     # Lógica de negócio das tarefas
│   │   └── logService.js        # Lógica de registro de logs
│   ├── routes/
│   │   └── tarefaRoutes.js      # Definição dos endpoints
│   ├── app.js                   # Configuração do Express
│   └── server.js                # Ponto de entrada
├── .env.example                 # Modelo de variáveis de ambiente
└── package.json
```

---

## 🗄️ Dois Bancos de Dados — Separação de Responsabilidades

| Banco | Variável | Finalidade |
|---|---|---|
| **Principal** | `DATABASE_MAIN_URL` | Armazena as tarefas (dados de negócio) |
| **Logs** | `DATABASE_LOGS_URL` | Registra ações do sistema (auditoria) |

**Por que dois bancos?**
- **Isolamento**: uma falha no banco de logs não afeta as operações principais.
- **Escalabilidade**: cada banco pode ser escalado, otimizado ou migrado de forma independente.
- **Auditoria**: o banco de logs mantém histórico imutável de ações sem poluir os dados principais.

---

## ⚙️ Configuração e Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm

### Passo a passo

**1. Clone e instale as dependências**
```bash
git clone <repo-url>
cd task-manager
npm install
```

**2. Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o .env com suas credenciais PostgreSQL
```

**3. Crie os dois bancos no PostgreSQL**
```sql
CREATE DATABASE taskmanager_main;
CREATE DATABASE taskmanager_logs;
```

**4. Gere os Prisma Clients**
```bash
npm run prisma:generate
```

**5. Execute as migrations**
```bash
npm run prisma:migrate
```

**6. Inicie o servidor**
```bash
# Desenvolvimento (hot reload)
npm run dev

# Produção
npm start
```

---

## 🔌 Endpoints da API

Base URL: `http://localhost:3000`

### `POST /tarefas` — Criar tarefa
```json
// Body
{
  "titulo": "Estudar Prisma ORM",
  "descricao": "Ler a documentação oficial",
  "dataLimite": "2024-12-31T23:59:00.000Z"
}

// Resposta 201
{
  "id": "uuid-gerado",
  "titulo": "Estudar Prisma ORM",
  "descricao": "Ler a documentação oficial",
  "concluida": false,
  "dataCriacao": "2024-10-01T10:00:00.000Z",
  "dataLimite": "2024-12-31T23:59:00.000Z"
}
```

### `GET /tarefas` — Listar tarefas
```json
// Resposta 200
[
  {
    "id": "uuid",
    "titulo": "Estudar Prisma ORM",
    "concluida": false,
    "dataCriacao": "2024-10-01T10:00:00.000Z",
    "dataLimite": null
  }
]
```

### `PUT /tarefas/:id` — Atualizar tarefa
Aceita qualquer combinação dos campos abaixo:
```json
// Body (todos opcionais, mas ao menos um obrigatório)
{
  "titulo": "Novo título",
  "descricao": "Nova descrição",
  "concluida": true,
  "dataLimite": "2024-11-01T00:00:00.000Z"
}

// Resposta 200 → tarefa atualizada
// Resposta 404 → tarefa não encontrada
```

### `DELETE /tarefas/:id` — Remover tarefa
```json
// Resposta 200
{
  "mensagem": "Tarefa removida com sucesso.",
  "tarefa": { ... }
}

// Resposta 404 → tarefa não encontrada
```

---

## 📌 Códigos de Status HTTP

| Código | Situação |
|---|---|
| `200` | Sucesso (listagem, atualização, remoção) |
| `201` | Tarefa criada com sucesso |
| `400` | Dados inválidos ou ausentes |
| `404` | Tarefa não encontrada |
| `500` | Erro interno do servidor |

---

## 🧩 Tecnologias Utilizadas

- **Node.js** — Ambiente de execução
- **Express.js** — Framework HTTP e roteamento
- **Prisma ORM** — Acesso ao banco de dados com type-safety
- **PostgreSQL** — Banco de dados relacional (×2)
- **dotenv** — Gerenciamento de variáveis de ambiente
- **nodemon** — Hot reload em desenvolvimento
