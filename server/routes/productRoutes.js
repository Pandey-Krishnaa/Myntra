import { Router } from "express";
import auth, { restrictTo } from "../middlewares/auth.js";
import { createProduct } from "../controllers/productController.js";
const router = Router();
router.route("/").post(auth, restrictTo("admin"), createProduct);

export default router;
