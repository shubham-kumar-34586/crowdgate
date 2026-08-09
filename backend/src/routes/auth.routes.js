import express from "express";
import authController from "../controllers/auth.controller.js";
import authValidator from "../validators/auth.validator.js";

const router = express.Router();

router.post(
    "/register",
    authValidator.validateRegister,
    authController.register
);

router.post(
    "/login",
    authValidator.validateLogin,
    authController.login
);

export default router;