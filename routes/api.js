const express = require("express");
const router = express.Router();

const { mqttData } = require("../mqtt/mqttClient");

// /api/status route serving MQTT data JSON
router.get("/status", (req, res) => {
  res.json(mqttData);
});

module.exports = router;
