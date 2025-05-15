const express = require("express");
const http = require("http");

const db = require("./firebase/firebase");

// Import mqtt API routes (only /status for now)
const apiRoutes = require("./routes/api");

const app = express();
const server = http.createServer(app);
const port = 5000;

// Firebase test endpoint stays here as-is
app.get("/firebase-test", async (req, res) => {
  try {
    const docRef = db.collection("test").doc("connection");
    await docRef.set({ message: "Hello from backend!" });

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

// Mount MQTT API routes under /api path
app.use("/api", apiRoutes);

// No HTML view routes included anymore

server.listen(port, () => {
  console.log(`🚀 Proxy server running at http://localhost:${port}`);
  console.log(`You can access the MQTT status at http://localhost:${port}/api/status`);
  console.log(`Firebase test endpoint is at http://localhost:${port}/firebase-test`);
});
