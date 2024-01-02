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
  getCheckoutProduct,
  updateProductStatus,
  userOrderDashboard,
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
router.get("/product/checkout/:id", getCheckoutProduct);
router.put("/product/:id/status", updateProductStatus);
router.get("/product/order-dashboard", userOrderDashboard);

export default router;
