import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import healthRoutes from "./routes/health.routes.js";
import notFound from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Global Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);



app.use(notFound);
app.use(errorHandler);

export default app;