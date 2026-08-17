import authService from "../services/auth.service.js";
import { sendSuccess } from "../utils/apiResponse.js";


const register = async (req, res, next) => {

    try {

        const newUser =
            await authService.register(req.body);

        const {
            password_hash,
            ...safeUser
        } = newUser;

        sendSuccess(
            res,
            safeUser,
            "User registered successfully",
            201
        );

    } catch (error) {
        next(error);
    }
};


const login = async (req, res, next) => {

    try {

        const result =
            await authService.login(req.body);

        sendSuccess(
            res,
            result,
            "Login successful",
            200
        );

    } catch (error) {
        next(error);
    }
};


const refresh = async (req, res, next) => {

    try {

        const result =
            await authService.refresh(
                req.body.refreshToken
            );

        sendSuccess(
            res,
            result,
            "Access token refreshed successfully",
            200
        );

    } catch (error) {
        next(error);
    }
};


const logout = async (req, res, next) => {

    try {

        await authService.logout(
            req.body.refreshToken
        );

        sendSuccess(
            res,
            null,
            "Logout successful",
            200
        );

    } catch (error) {
        next(error);
    }
};


const getMe = async (req, res, next) => {

    try {

        const user =
            await authService.getCurrentUser(
                req.user.userId
            );

        sendSuccess(
            res,
            user,
            "Current user fetched successfully",
            200
        );

    } catch (error) {
        next(error);
    }
};


export default {
    register,
    login,
    refresh,
    logout,
    getMe
};