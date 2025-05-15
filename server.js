const express = require("express");
const http = require("http");

const db = require("./firebase/firebase");

// Import mqttClient and mqttData from separate file
const { mqttClient, mqttData } = require("./mqtt/mqttClient");

// Setup Express server
const app = express();
const server = http.createServer(app);
const port = 5000;

// New test endpoint
app.get("/firebase-test", async (req, res) => {
  try {
    //Write a test doc
    const docRef = db.collection("test").doc("connection");
    await docRef.set({ message: "Hello from backend!" });

    //Read it back
    const doc = await docRef.get();
    if (doc.exists) {
      res.json({ success: true, data: doc.data() });
    } else {
      res.json({ success: false, message: "No document found" });
    }
  } catch (err) {
    console.error("Firebase test failed", err);
    res.status(500).json({ success: false, error: err.message });
  }
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
