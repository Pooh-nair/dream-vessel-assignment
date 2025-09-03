import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addProduct = async (req: Request, res: Response) => {
  const { name, price, description } = req.body;

  if (!name || typeof price !== "number") {
    return res
      .status(400)
      .json({ error: "Missing or invalid fields. 'name' and numeric 'price' required." });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
      },
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product", details: err });
  }
}

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products", details: err });
  }
}