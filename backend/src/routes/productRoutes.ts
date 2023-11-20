import express, { Router } from "express";
import {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  testRoute,
} from "../controller/productsController";

const router: Router = express.Router();

// Test Route
router.get("/", testRoute);

// For Getting all the Products
router.get("/products", getAllProducts);

// For Getting Single Product
router.get("/products/:id", getSingleProduct);

// For Creating Product
router.post("/product/create", createProduct);

// For Updating Product
router.put("/product/update/:id", updateProduct);

// For Deleting Product
router.delete("/product/delete/:id", deleteProduct);

export default router;
