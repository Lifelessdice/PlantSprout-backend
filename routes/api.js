const express = require("express");
const router = express.Router();
const { mqttData } = require("../mqtt/mqttClient");
const { verifyIdToken } = require("../firebase/firebase");
const { getPlantsByUserId } = require("../firebase/plants");

// Serve MQTT data
router.get("/status", (req, res) => {
  res.json(mqttData);
});

// Use POST to match your frontend
router.post("/plants", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const idToken = authHeader.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).json({ error: "Missing ID token" });
  }

  try {
    const { uid } = await verifyIdToken(idToken);
    const plants = await getPlantsByUserId(uid);

    console.log(`🌿 Plants for user ${uid}:`);
    console.dir(plants, { depth: null });

    res.json(plants);
  } catch (error) {
    console.error("❌ Failed to fetch plants:", error);
    res.status(500).json({ error: "Failed to fetch plants" });
  }
});

module.exports = router;
