import app from "./app.js";
import env from "./config/env.js";
import connectDB from "./database/connect.js";

const startServer = async () => {
    await connectDB();

    app.listen(env.PORT, () => {
        console.log(
            `🚀 CrowdGate Server running on port ${env.PORT} in ${env.NODE_ENV} mode`
        );
    });
};

startServer();