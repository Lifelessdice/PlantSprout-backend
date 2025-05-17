const express = require("express");
const router = express.Router();

const { mqttData } = require("../mqtt/mqttClient");
const { getPlantsByUserId } = require("../firebase/plant");
const { checkPlantConditions } = require("../utils/plantStatusChecker");


// GET /status — returns raw MQTT data
router.get("/status", (req, res) => {
  res.json(mqttData);
});

// In-memory store for registered UIDs (replace with DB in production)
const registeredUIDs = new Set();

// POST /register-uid — store the UID from frontend
router.post("/register-uid", (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "UID is required" });
  }

  registeredUIDs.add(uid);
  console.log("Registered UID:", uid);

  res.json({ message: "UID registered successfully" });
});

// GET /plants — return plants + status for all registered UIDs
router.get("/plants", async (req, res) => {
  try {
    let allPlants = [];

    // For each registered UID, fetch plants and append with status
    for (const uid of registeredUIDs) {
      const plants = await getPlantsByUserId(uid);
      const plantsWithStatus = plants.map((plant) => ({
        ...plant,
        status: checkPlantConditions(plant, mqttData),
      }));
      allPlants = allPlants.concat(plantsWithStatus);
    }

    res.json(allPlants);
  } catch (error) {
    console.error("❌ Failed to fetch plant data with status:", error);
    res.status(500).json({ error: "Failed to fetch plant data with status" });
  }
});

module.exports = router;
