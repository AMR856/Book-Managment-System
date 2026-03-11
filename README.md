# Book Management System

A **Book Management System** built with **Node.js**, **TypeScript**, and **Express.js**.
The project follows a **modular, service-based architecture** and uses **Prisma** as the ORM.

---

## Project Status


* Authors module
* Publishers module
* Books module
* Users module

---

## Project Structure

This repo contains both backend and frontend code.

```text
.
├── backend
│   ├── src
│   │   ├── modules
│   │   │   ├── auth
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.model.ts
│   │   │   │   ├── auth.route.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.validations.ts
│   │   │   ├── authors
│   │   │   │   ├── author.controller.ts
│   │   │   │   ├── author.model.ts
│   │   │   │   ├── author.route.ts
│   │   │   │   ├── author.service.ts
│   │   │   │   └── author.validations.ts
│   │   │   ├── books
│   │   │   │   ├── book.controller.ts
│   │   │   │   ├── book.model.ts
│   │   │   │   ├── book.route.ts
│   │   │   │   ├── book.service.ts
│   │   │   │   └── book.validations.ts
│   │   │   ├── orders
│   │   │   │   ├── order.controller.ts
│   │   │   │   ├── order.model.ts
│   │   │   │   ├── order.route.ts
│   │   │   │   ├── order.service.ts
│   │   │   │   └── order.validations.ts
│   │   │   └── publishers
│   │   │       ├── publisher.controller.ts
│   │   │       ├── publisher.model.ts
│   │   │       ├── publisher.route.ts
│   │   │       ├── publisher.service.ts
│   │   │       └── publisher.validations.ts
│   │   ├── config
│   │   │   ├── passport.ts
│   │   │   └── ...
│   │   ├── middlewares
│   │   │   └── validate.ts
│   │   ├── types
│   │   ├── utils
│   │   └── index.ts
│   ├── prisma
│   │   ├── schema.prisma
│   │   └── migrations
│   ├── package.json
│   └── tsconfig.json
├── frontend
│   ├── index.html
│   ├── app.js
│   └── styles.css
└── README.md
```

---

## Tech Stack

* **Node.js**
* **TypeScript**
* **Express.js**
* **Prisma ORM**
* **Joi** (request validation)
* **PostgreSQL**
* **RESTful API design**

---

## Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/book-management-system.git
cd book-management-system
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bookdb"
PORT=3000
```

### 4️⃣ Setup the database

```bash
npx prisma migrate dev
npx prisma generate
```

### 5️⃣ Run the backend

```bash
npm run dev
```

### 6️⃣ Run the frontend

From a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3001 (default Next.js port). The frontend will talk to the backend at http://localhost:5000 by default.

---

## API Routes

### Auth
- `POST /api/auth/register` — register user (returns JWT)
- `POST /api/auth/login` — login (returns JWT)
- `POST /api/auth/logout` — logout (JWT based)
- `GET /api/auth/profile` — get current user (requires Bearer token)
- `GET /api/auth/google` — start Google OAuth
- `GET /api/auth/google/callback` — Google OAuth callback
- `GET /api/auth/logout` — logout (session-based)

### Authors (admin required for create/update/delete)
- `GET /authors` — list all authors
- `GET /authors/:id` — get a specific author
- `POST /authors` — create author
- `PUT /authors/:id` — update author
- `DELETE /authors/:id` — delete author

### Publishers (admin required for create/update/delete)
- `GET /publishers` — list all publishers
- `GET /publishers/:id` — get a specific publisher
- `POST /publishers` — create publisher
- `PUT /publishers/:id` — update publisher
- `DELETE /publishers/:id` — delete publisher

### Books (admin required for create/update/delete)
- `GET /books` — list all books
- `GET /books/:id` — get a specific book
- `POST /books` — create book
- `PUT /books/:id` — update book
- `DELETE /books/:id` — delete book

### Orders (authenticated users)
- `GET /orders` — list current user orders (admin returns all orders)
- `GET /orders/:id` — get order by id
- `POST /orders` — create order (decrements book quantity)
- `DELETE /orders/:id` — delete order
