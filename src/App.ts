import express from "express";
import productsRouter from "./routes/ProductRoutes";
import ordersRouter from "./routes/OrderRoutes";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

app.get("/", (_req, res) => {
  res.json({ message: "Order Management API (TypeScript, in-memory). See /products and /orders" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
