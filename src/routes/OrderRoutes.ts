import express from "express";
import { cancelRefund, getOrderDetails, initiateRefund, placeOrder, requestRefund } from "../controller/OrderController";

const router = express.Router();

/**
 * POST /orders
 */
router.post("/", placeOrder);

/**
 * GET /orders/:orderId
 */
router.get("/:orderId", getOrderDetails);

/**
 * POST /orders/:orderId/refund
 */
router.post("/:orderId/refund", requestRefund);

/**
 * POST /orders/:orderId/refund/cancel
 */
router.post("/:orderId/refund/cancel", cancelRefund);

/**
 * POST /orders/:orderId/refund/initiate
 */
router.post("/:orderId/refund/initiate", initiateRefund);

export default router;
