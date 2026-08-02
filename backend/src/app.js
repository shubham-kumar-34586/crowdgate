import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

//Health check route
app.get("/health",(req, res) =>{
    res.status(200).json({
    "success": true,
    "status": "healthy",
    "message": "CrowdGate API is running",
    "timestamp": new Date().toISOString()
    });
});



export default app;