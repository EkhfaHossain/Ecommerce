import express, { Router } from "express";
import {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  testRoute,
  buyProduct,
} from "../controller/productsController";

import { authenticateAndAuthorizeMiddleware } from "../middleware/authMiddleWare";

const router: Router = express.Router();

router.get("/test-product", testRoute);
router.get("/products", getAllProducts);
router.get("/products/:id", getSingleProduct);
router.post(
  "/product/create",
  authenticateAndAuthorizeMiddleware,
  createProduct
);
router.put(
  "/product/update/:id",
  authenticateAndAuthorizeMiddleware,
  updateProduct
);
router.delete(
  "/product/delete/:id",
  authenticateAndAuthorizeMiddleware,
  deleteProduct
);
router.post("/product/buy/:id", buyProduct);

export default router;
