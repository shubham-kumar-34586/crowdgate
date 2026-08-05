import { sendSuccess } from "../utils/apiResponse.js";

const getHealth = (req, res) => {
    sendSuccess(
        res,
        {
            status: "healthy",
            timestamp: new Date().toISOString(),
        },
        "CrowdGate API is running"
    );
};

export default getHealth;