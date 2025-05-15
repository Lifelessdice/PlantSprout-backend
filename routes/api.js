const express = require("express");
const router = express.Router();
const { mqttData } = require("../mqtt/mqttClient");
const { verifyIdToken } = require("../firebase/firebase");

// Serve MQTT data
router.get("/status", (req, res) => {
  res.json(mqttData);
});

// Just return uid + email after token verification
router.post("/verifyUser", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).json({ error: "Missing ID token" });
  }

  try {
    const { uid, email } = await verifyIdToken(idToken);

    res.status(200).json({
      success: true,
      message: "User verified",
      uid,
      email,
    });
  } catch (err) {
    res.status(403).json({ success: false, error: err.message });
  }
});

module.exports = router;
