import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import healthRoutes from "./routes/health.routes.js";
import notFound from "./middlewares/notFound.middleware.js";


const app = express();

// Global Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/health", healthRoutes);
app.use(notFound);

export default app;