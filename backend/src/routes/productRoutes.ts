import express, { Router } from "express";
import {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  testRoute,
  buyProduct,
  getAllPurchasesByAllUsers,
  getUserPurchasedProducts,
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
router.get("/product/bought-by-user", getAllPurchasesByAllUsers);
router.get("/product/checkout", getUserPurchasedProducts);

export default router;
