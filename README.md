# 📚 Book Management System (WIP)

A simple **Book Management System** built with **Node.js**, **TypeScript**, and **Express.js**.  
Currently supports **Authors** and **Publishers**, with plans to add **Books** and **Users** soon.

---

## 🚧 Project Status
> ⚙️ **Work in Progress**  
- ✅ Authors module  
- ✅ Publishers module  
- ⏳ Books module *(coming soon)*  
- ⏳ Users module *(coming soon)*  

---

## 🗂️ Folder Structure

```

.
├── author
│   ├── author.controller.ts       # Handles author-related requests
│   ├── author.model.ts            # Author data model (Prisma / ORM)
│   ├── author.route.ts            # Author API routes
│   ├── author.service.ts          # Business logic for authors
│   └── author.validations.ts      # Request validation schema
│
├── publishers
│   ├── publisher.controller.ts    # Handles publisher-related requests
│   ├── publisher.model.ts         # Publisher data model
│   ├── publisher.route.ts         # Publisher API routes
│   ├── publisher.service.ts       # Business logic for publishers
│   └── publisher.validations.ts   # Validation schemas for publishers
│
├── middlewares
│   └── validate.ts                # Validation middleware
│
├── config                         # Configuration (DB, environment, etc.)
├── types
│   ├── authorData.ts              # Author type definitions
│   ├── customError.ts             # Custom error type
│   └── publisherData.ts           # Publisher type definitions
│
├── utils
│   ├── errorHandler.ts            # Centralized error handling
│   └── statusMessages.ts          # Common status / response messages
│
└── index.ts                       # Application entry point

````

---

## 🧩 Tech Stack

- **Node.js**
- **TypeScript**
- **Express.js**
- **Prisma**
- **Joi** *(for validation)*
- **RESTful API Design**

---

## 🚀 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/book-management-system.git
   cd book-management-system
  ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**
   Create a `.env` file with your database credentials, e.g.:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/bookdb"
   PORT=3000
   ```

4. **Run the project**

   ```bash
   npm run dev
   ```

---

## 🧠 Next Steps

* [ ] Add **Books module**
* [ ] Add **Users & Authentication**
* [ ] Integrate database relations between Authors, Books, and Publishers
* [ ] Add pagination, filtering, and search
* [ ] Write unit and integration tests
