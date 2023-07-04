import { Router } from "express";
import auth from "./../middlewares/auth.js";
import {
  createOrder,
  getMyOrders,
  getMyOrderById,
  detailedOrderData,
} from "../controllers/OrderController.js";
const router = Router();
router.route("/").post(auth, createOrder).get(auth, getMyOrders);
router.route("/get-my-orders").get(auth, getMyOrders);
router.route("/detail/:orderId").get(auth, getMyOrderById);
router.route("/order/items-detail/:orderId").get(auth, detailedOrderData);
export default router;
