import express, { Router } from "express";
import {
  googleUserRegistration,
  testRoute,
  userLogin,
  userRegistration,
  userPasswordReset,
  userLogOut,
  userProfile,
} from "../controller/userController";

const router: Router = express.Router();

// Test Route
router.get("/", testRoute);

// For user Registration
router.post("/registration", userRegistration);
router.post("/login", userLogin);
router.post("/google-auth", googleUserRegistration);
router.post("/password-reset", userPasswordReset);
router.post("/logout", userLogOut);
router.get("/user-profile", userProfile);

export default router;
