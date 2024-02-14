import express from "express";
import { registerController } from "../controllers/registerController";
import { loginController } from "@Odin/controllers/loginController";
import {
  createProductController,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@Odin/controllers/productController";
import { isLogin } from "@Odin/middleware/authentication";

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);
router
  .route("/product/:productId")
  .all(isLogin) // Apply middleware here if needed
  .put(updateProduct)
  .delete(deleteProduct);

router
  .route("/product")
  .all(isLogin)
  .post(createProductController)
  .get(getProducts);

export default router;
