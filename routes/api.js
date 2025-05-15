const express = require("express");
const router = express.Router();
const { mqttData } = require("../mqtt/mqttClient");
const admin = require("../firebase/firebaseAdmin"); // Admin SDK


// Serve MQTT data
router.get("/status", (req, res) => {
  res.json(mqttData);
});

// This endpoint receives the ID token and verifies it
router.post("/verifyUser", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).json({ error: "Missing ID token" });
  }

  try {
    // Verify the token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // Optionally: save or update user in Firestore
    const userRef = admin.firestore().collection("users").doc(uid);
    await userRef.set(
      {
        email,
        lastLogin: new Date(),
      },
      { merge: true } // This won't overwrite existing data
    );

    res.status(200).json({
      success: true,
      message: "User verified and data stored",
      uid,
      email,
    });
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(403).json({ success: false, error: "Invalid token" });
  }
});

module.exports = router;