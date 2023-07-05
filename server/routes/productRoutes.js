import { Router } from "express";
import auth, { restrictTo } from "../middlewares/auth.js";
import {
  addImagesToProduct,
  createProduct,
  deleteImageFromProduct,
  deleteProduct,
  getAllProduct,
  getProductById,
  getStats,
  updateProductDetails,
} from "../controllers/productController.js";
// import catchAsync from "../utils/catchAsync.js";
const router = Router();
router
  .route("/")
  .post(auth, restrictTo("admin"), createProduct)
  .get(getAllProduct);
router
  .route("/:id")
  .get(getProductById)
  .post(auth, restrictTo("admin"), updateProductDetails)
  .delete(auth, restrictTo("admin"), deleteProduct);
router
  .route("/add-product-images/:id")
  .patch(auth, restrictTo("admin"), addImagesToProduct);
router
  .route("/delete-image/:productId/:imageId")
  .delete(auth, restrictTo("admin"), deleteImageFromProduct);

router.route("/stats/:type").get(getStats);
export default router;
