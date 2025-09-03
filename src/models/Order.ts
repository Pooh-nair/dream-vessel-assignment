import { OrderStatus } from "../generated/prisma";

export interface Order {
  id: string;
  productIds: string[];
  createdAt: string; // ISO
  status: OrderStatus;
  // store deliveryDate as ISO string for reproducibility
  deliveryDate: string;
  // optional: store deliveredAt when marked delivered
  deliveredAt?: string;
}