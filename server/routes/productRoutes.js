import { Router } from "express";
import auth, { restrictTo } from "../middlewares/auth.js";
import {
  addImagesToProduct,
  createProduct,
  deleteImageFromProduct,
  deleteProduct,
  getAllProduct,
  getProductById,
  updateProductDetails,
} from "../controllers/productController.js";
const router = Router();
router
  .route("/")
  .post(auth, restrictTo("admin"), createProduct)
  .get(getAllProduct);
router
  .route("/:id")
  .get(getProductById)
  .patch(auth, restrictTo("admin"), updateProductDetails)
  .delete(auth, restrictTo("admin"), deleteProduct);
router
  .route("/add-product-images/:id")
  .patch(auth, restrictTo("admin"), addImagesToProduct);
router
  .route("/delete-image/:productId/:imageId")
  .delete(auth, restrictTo("admin"), deleteImageFromProduct);
export default router;
