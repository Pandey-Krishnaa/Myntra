import { Router } from "express";
import auth, { restrictTo } from "../middlewares/auth.js";
import {
  createProduct,
  getAllProduct,
  getProductById,
} from "../controllers/productController.js";
const router = Router();
router
  .route("/")
  .post(auth, restrictTo("admin"), createProduct)
  .get(getAllProduct);
router.route("/:id").get(getProductById);

export default router;
