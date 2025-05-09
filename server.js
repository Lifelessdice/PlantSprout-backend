const mqtt = require("mqtt");
const express = require("express");
const http = require("http");

// Setup Express server
const app = express();
const server = http.createServer(app);
const port = 5000;

// Store MQTT data
let mqttData = {
  temperature: null,
  humidity: null,
  light: null,
  moisture: null,
};

// MQTT client setup
const mqttClient = mqtt.connect("mqtt://broker.hivemq.com:1883");

mqttClient.on("connect", function () {
  console.log("✅ Connected to HiveMQ");

  const topics = [
    "CROWmium/rtl8720dn/temperature",
    "CROWmium/rtl8720dn/humidity",
    "CROWmium/rtl8720dn/light",
    "CROWmium/rtl8720dn/moisture",
  ];

  topics.forEach((topic) => {
    mqttClient.subscribe(topic, function (err) {
      if (err) {
        console.log(`❌ Subscription error on ${topic}:`, err);
      } else {
        console.log(`📡 Subscribed to ${topic}`);
      }
    });
  });
});

mqttClient.on("message", function (topic, message) {
  // Update the relevant data when a message is received
  console.log(`📩 Message received:`);
  console.log(`  ➤ Topic: ${topic}`);
  console.log(`  ➤ Payload: ${message.toString()}`);

  switch (topic) {
    case "CROWmium/rtl8720dn/temperature":
      mqttData.temperature = message.toString();
      break;
    case "CROWmium/rtl8720dn/humidity":
      mqttData.humidity = message.toString();
      break;
    case "CROWmium/rtl8720dn/light":
      mqttData.light = message.toString();
      break;
    case "CROWmium/rtl8720dn/moisture":
      mqttData.moisture = message.toString();
      break;
    default:
      break;
  }
});

mqttClient.on("error", function (err) {
  console.log("⚠️ MQTT connection error:", err);
});

// Add HTTP endpoint to serve the MQTT data
app.get("/status", (req, res) => {
  res.json(mqttData); // Send the latest MQTT data as JSON
});

// Start HTTP server
server.listen(port, () => {
  console.log(`🚀 Proxy server running at https://mqtt-proxy-server.onrender.com`);
});
