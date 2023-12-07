import express, { Router } from "express";
import {
  testRoute,
  userLogin,
  userRegistration,
} from "../controller/userController";

const router: Router = express.Router();

// Test Route
router.get("/", testRoute);

// For user Registration
router.post("/registration", userRegistration);
router.post("/login", userLogin);

export default router;
