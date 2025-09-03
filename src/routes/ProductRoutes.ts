import express from "express";
import { addProduct, getAllProducts } from "../controller/ProductController";

const router = express.Router();

/**
 * POST /products
 * Body: { name, price, description }
 */
router.post("/", addProduct);

/**
 * GET /products
 */
router.get("/", getAllProducts);

export default router;
