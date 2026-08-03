const getHealth = (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
        message: "CrowdGate API is running",
        timestamp: new Date().toISOString()
    });
};


export default getHealth;