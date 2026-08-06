import authService from "../services/auth.service.js";
import { sendSuccess } from "../utils/apiResponse.js";

const register = async (req, res, next) => {
    try {
        const newUser = await authService.register(req.body);

        sendSuccess(
            res,
            newUser,
            "User registered successfully",
            201
        );

    } catch (error) {
        next(error);
    }
};

export default {
    register,
};



// // Remember

// Controller should only:

// Receive Request
// Call Service
// Return Response

// Nothing else.