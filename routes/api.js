const express = require("express");
const router = express.Router();

const { mqttData } = require("../mqtt/mqttClient");
const { getPlantsByUserId } = require("../firebase/plant");
const { checkPlantConditions } = require("../utils/plantStatusChecker");

let registeredUID = null;

// POST /register-uid — store UID in memory
router.post("/register-uid", (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "UID is required" });
  }

  registeredUID = uid;
  console.log("✅ UID registered and stored:", uid);

  res.json({ message: "UID stored in memory" });
});

// GET /dashboard — returns sensor data + plants + status
router.get("/dashboard", async (req, res) => {
  try {
    if (!registeredUID) {
      return res.status(400).json({ error: "No UID registered" });
    }

    const plants = await getPlantsByUserId(registeredUID);

    const plantsStatusOnly = plants.map((plant) => ({
      plantId: plant.id,
      status: checkPlantConditions(plant, mqttData),
    }));

    res.json({
      sensorData: mqttData,
      plants: plantsStatusOnly,
    });
  } catch (error) {
    console.error("❌ Failed to fetch dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

module.exports = router;
