const express = require("express");
const router = express.Router();

const { mqttData } = require("../mqtt/mqttClient");
const { getPlantsByUserId } = require("../firebase/plant");
const { checkPlantConditions } = require("../utils/plantStatusChecker");


const registeredUIDs = new Set();

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

  registeredUIDs.add(uid);
  console.log("✅ UID registered and stored:", uid);
  console.log("📋 Current UIDs:", Array.from(registeredUIDs)); // For debug

  res.json({ message: "UID stored in memory" });
});


router.get("/uids", (req, res) => {
  res.json({ uids: Array.from(registeredUIDs) });
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
