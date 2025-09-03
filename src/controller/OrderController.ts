import e, { Request, Response } from "express";
import { addDaysISO, daysBetweenDates, formatDateISOToYMD } from "../util";
import { PrismaClient } from "@prisma/client";
import { OrderStatus } from "../generated/prisma";

const DELIVERY_DAYS = 5;
const prisma = new PrismaClient();

export const placeOrder = async (req: Request, res: Response) => {
  const { products: productIds } = req.body;
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res
      .status(400)
      .json({ error: "Provide 'products' as a non-empty array of product IDs." });
  }

  const createdAt = new Date();
  const deliveryDate = addDaysISO(createdAt.toISOString(), DELIVERY_DAYS);

  const order = await prisma.order.create({
    data: {
      deliveryDate: new Date(deliveryDate),
      status: OrderStatus.OrderPlaced as any,
      items: {
        create: productIds.map((pid: string) => ({ productId: pid })),
      },
    },
    include: { items: true },
  });

  const daysLeft = daysBetweenDates(new Date().toISOString(), deliveryDate);

  const message =
    daysLeft > 0
      ? `Order will be delivered in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`
      : daysLeft === 0
      ? "Order will be delivered today"
      : `Delivered on ${formatDateISOToYMD(order.deliveryDate.toISOString())}`;

  res.status(201).json({
    orderId: order.id,
    status: order.status,
    message,
  });
}

export const getOrderDetails = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) return res.status(404).json({ error: "Order not found" });

  // refund states take priority
  if (
    order.status ===  OrderStatus.RefundRequested ||
    order.status === OrderStatus.RefundInitiated ||
    order.status === OrderStatus.RefundCancelled
  ) {
    const msg =
      order.status === OrderStatus.RefundRequested
        ? "Refund request has been submitted"
        : order.status === OrderStatus.RefundInitiated
        ? "Refund has been initiated"
        : "Refund request has been cancelled";

    return res.json({ orderId: order.id, status: order.status, message: msg });
  }

  // compute delivery status
  const daysLeft = daysBetweenDates(
    new Date().toISOString(),
    order.deliveryDate.toISOString()
  );

  let message: string;

  if (daysLeft > 0) {
    message = `Order will be delivered in ${daysLeft} day${
      daysLeft > 1 ? "s" : ""
    }`;
  } else if (daysLeft === 0) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.OutForDelivery },
    });
    message = "Order will be delivered today";
  } else {
    if (order.status !== OrderStatus.Delivered) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.Delivered,
          deliveredAt: new Date(),
        },
      });
    }
    message = `Delivered on ${formatDateISOToYMD(
      (order.deliveredAt ?? order.deliveryDate).toISOString()
    )}`;
  }

  res.json({ orderId: order.id, status: order.status, message });
}

export const requestRefund = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.RefundRequested },
  });

  res.json({
    orderId: order.id,
    status: order.status,
    message: "Refund request has been submitted",
  });
}

export const cancelRefund = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.RefundCancelled },
  });

  res.json({
    orderId: order.id,
    status: order.status,
    message: "Refund request has been cancelled",
  });
}

export const initiateRefund = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.RefundInitiated },
  });

  res.json({
    orderId: order.id,
    status: order.status,
    message: "Refund has been initiated",
  });
}