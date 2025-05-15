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
  const authHeader = req.headers.authorization;
  console.log("Authorization header:", authHeader);

  const idToken = authHeader?.split("Bearer ")[1];
  console.log("Extracted ID token:", idToken);

  if (!idToken) {
    return res.status(401).json({ error: "Missing ID token" });
  }

  try {
    const { uid, email } = await verifyIdToken(idToken);
    console.log("User verified:", uid, email);

    res.status(200).json({
      success: true,
      message: "User verified",
      uid,
      email,
    });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(403).json({ success: false, error: err.message });
  }
});

// Get plants from the user.
router.get("/plants", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) return res.status(401).json({ error: "Missing ID token" });

  try {
    const decodedToken = await verifyUserToken(idToken);
    const uid = decodedToken.uid;

    const plants = await getPlantsForUser(uid);
    res.status(200).json({ plants });
  } catch (error) {
    res.status(403).json({ error: "Unauthorized or failed to fetch plants"});
  }
});

module.exports = router;
