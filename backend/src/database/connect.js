import pool from "./db.js";

const connectDB = async () => {
    try {
        const result = await pool.query("SELECT NOW()");

        console.log("✅ PostgreSQL Connected");
        console.log("🕒 Database Time:", result.rows[0].now);

    } catch (error) {
        console.error("❌ Database Connection Failed");
        console.error(error.message);
        process.exit(1);
    }
};

export default connectDB;