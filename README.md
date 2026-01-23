# 📚 Book Management System

A **Book Management System** built with **Node.js**, **TypeScript**, and **Express.js**.
The project follows a **modular, service-based architecture** and uses **Prisma** as the ORM.

---

## 🚧 Project Status


* ✅ Authors module
* ✅ Publishers module
* ✅ Books module
* ✅ Users module

---

## 🗂️ Folder Structure

```text
.
├── author
│   ├── author.controller.ts       # Handles author-related HTTP requests
│   ├── author.model.ts            # Author Prisma model helpers
│   ├── author.route.ts            # Author API routes
│   ├── author.service.ts          # Business logic for authors
│   └── author.validations.ts      # Joi validation schemas
│
├── publishers
│   ├── publisher.controller.ts    # Handles publisher-related HTTP requests
│   ├── publisher.model.ts         # Publisher Prisma model helpers
│   ├── publisher.route.ts         # Publisher API routes
│   ├── publisher.service.ts       # Business logic for publishers
│   └── publisher.validations.ts   # Joi validation schemas
│
├── books
│   ├── books.controller.ts        # Handles book-related HTTP requests
│   ├── books.model.ts             # Book Prisma model helpers
│   ├── books.route.ts             # Book API routes
│   ├── books.service.ts           # Business logic for books
│   └── books.validations.ts       # Joi validation schemas
│
├── middlewares
│   └── validate.ts                # Request validation middleware
│
├── config
│   ├── prisma.ts                  # Prisma client setup
│   ├── passport.ts                # Google OAuth configuration
│
├── types
│   ├── authorData.ts              # Author type definitions
│   ├── publisherData.ts           # Publisher type definitions
│   ├── bookData.ts                # Book type definitions
│   ├── userData.ts                # User type definitions
│   └── customError.ts             # Custom error class
│
├── utils
│   ├── errorHandler.ts            # Centralized error handling middleware
│   └── statusMessages.ts          # Common response/status messages
│
├── views
│   └── google-auth-test.ejs       # Google OAuth test page
│
├── prisma
│   ├── schema.prisma              # Prisma schema
│   └── migrations                # Database migrations
│
├── index.ts                       # Application entry point
└── README.md
```

---

## 🧩 Tech Stack

* **Node.js**
* **TypeScript**
* **Express.js**
* **Prisma ORM**
* **Joi** (request validation)
* **PostgreSQL**
* **RESTful API design**

---

## 🚀 Setup Instructions

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

### 5️⃣ Run the project

```bash
npm run dev
```

---

## 📌 Notes

* Each module follows **Controller → Service → Model** separation.
* Validation is handled using **Joi** and a centralized middleware.
* Errors are normalized via a custom `CustomError` class and global error handler.
* Designed to scale easily with new modules (Users, Auth, Roles, etc.).
