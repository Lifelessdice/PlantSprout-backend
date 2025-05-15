const express = require("express");
const http = require("http");
const admin = require("./firebase/firebaseAdmin"); // full SDK instance
const apiRoutes = require("./routes/api");

const app = express();
const server = http.createServer(app);
const port = 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

// Firebase test endpoint
app.get("/firebase-test", async (req, res) => {
  try {
    const db = admin.firestore();
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

// Server start
server.listen(port, () => {
  console.log(`🚀 Proxy server running at http://localhost:${port}`);
  console.log(`📡 MQTT status: http://localhost:${port}/api/status`);
  console.log(`🧪 Firebase test: http://localhost:${port}/firebase-test`);
});
