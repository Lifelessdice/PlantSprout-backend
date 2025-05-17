const express = require("express");
const router = express.Router();

const { mqttData } = require("../mqtt/mqttClient");
const { getPlantsByUserId } = require("../firebase/plant");
const { checkPlantConditions } = require("../utils/plantStatusChecker");

let registeredUID = null;

// GET /status — returns raw MQTT data
router.get("/status", (req, res) => {
  res.json(mqttData);
});

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

// GET /plants — fetch plants for the registered UID and log them
router.get("/plants", async (req, res) => {
  try {
    if (!registeredUID) {
      return res.status(400).json({ error: "No UID registered" });
    }

    const plants = await getPlantsByUserId(registeredUID);

    const plantsStatusOnly = plants.map((plant) => ({
      plantId: plant.id,
      status: checkPlantConditions(plant, mqttData),
    }));

    res.json(plantsStatusOnly);
  } catch (error) {
    console.error("❌ Failed to fetch plants or compute status:", error);
    res.status(500).json({ error: "Failed to fetch plants or compute status" });
  }
});


module.exports = router;
