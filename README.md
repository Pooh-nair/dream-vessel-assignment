# Order Management System (Node.js + Express + TypeScript) - using PgSql Database

Minimal Order Management REST API (prototype). Uses PgSql database to store database.

## Features
- Add & list products
- Place orders (products by ID)
- Dynamic order status and delivery messages (delivery time = 5 days from creation)
- Refund endpoints:
  - Request refund
  - Cancel refund request
  - Initiate refund

## Run locally

1. Clone or copy project
2. Install
```bash
npm install
```
3. Update DB connection string in .env file
4. Migrate DB
```bash
npx prisma migrate dev --name init
npx prisma generate
```
5. Run project
```bash
npm start
```
6. Test Api's
-  Use Postman collection attached with code reposition "E commerce Assignment.postman_collection.json" 
