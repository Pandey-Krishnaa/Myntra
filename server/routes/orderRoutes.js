import { Router } from "express";
import auth, { restrictTo } from "./../middlewares/auth.js";
import {
  createOrder,
  getMyOrders,
  getMyOrderById,
  detailedOrderData,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/OrderController.js";
const router = Router();
router.route("/").post(auth, createOrder).get(auth, getMyOrders);
router.route("/get-my-orders").get(auth, getMyOrders);
router.route("/detail/:orderId").get(auth, getMyOrderById);
router.route("/order/items-detail/:orderId").get(auth, detailedOrderData);
router.route("/get-all-orders").get(auth, restrictTo("admin"), getAllOrders);
router
  .route("/update-order-status/:orderId")
  .post(auth, restrictTo("admin"), updateOrderStatus);
export default router;
