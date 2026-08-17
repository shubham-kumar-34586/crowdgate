import express from "express";

import authController from "../controllers/auth.controller.js";
import authValidator from "../validators/auth.validator.js";
import authenticate from "../middlewares/auth.middleware.js";


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


router.post(
    "/refresh",
    authController.refresh
);


router.post(
    "/logout",
    authController.logout
);


router.get(
    "/me",
    authenticate,
    authController.getMe
);


export default router;