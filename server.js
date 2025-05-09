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

  // Display the updated data on the server side (to verify it's working)
  console.log("Updated Data on Server:", mqttData);
});

// Add HTTP endpoint to serve the MQTT data
app.get("/status", (req, res) => {
  // Send the latest MQTT data as JSON
  res.json(mqttData);
});

// Add a simple HTML endpoint to display the data
app.get("/", (req, res) => {
  // Render a simple HTML page with the current MQTT data
  res.send(`
    <html>
      <head>
        <title>MQTT Data</title>
      </head>
      <body>
        <h1>Latest MQTT Data</h1>
        <p><strong>Temperature:</strong> ${mqttData.temperature || "N/A"}</p>
        <p><strong>Humidity:</strong> ${mqttData.humidity || "N/A"}</p>
        <p><strong>Light:</strong> ${mqttData.light || "N/A"}</p>
        <p><strong>Soil Moisture:</strong> ${mqttData.moisture || "N/A"}</p>
        <p><em>Data is updated in real-time via MQTT messages!</em></p>
      </body>
    </html>
  `);
});

// Start HTTP server
server.listen(port, () => {
  console.log(`🚀 Proxy server running at http://localhost:${port}`);
  console.log(`You can access the status page at http://localhost:${port}`);
});
