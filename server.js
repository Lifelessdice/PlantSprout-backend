import mqtt from "mqtt";
import express from "express";
import http from "http";

// Setup Express server
const app = express();
const server = http.createServer(app);
const port = 5000;

// MQTT client setup
const mqttClient = mqtt.connect("mqtt://broker.hivemq.com:1883");

mqttClient.on("connect", function () {
  console.log("Connected to HiveMQ");
  mqttClient.subscribe("CROWmium/rtl8720dn/temperature", function (err) {
    if (err) {
      console.log("Subscription error:", err);
    } else {
      console.log("Successfully subscribed to temperature topic");
    }
  });

  mqttClient.subscribe("CROWmium/rtl8720dn/humidity", function (err) {
    if (err) {
      console.log("Subscription error:", err);
    } else {
      console.log("Successfully subscribed to humidity topic");
    }
  });

  mqttClient.subscribe("CROWmium/rtl8720dn/light", function (err) {
    if (err) {
      console.log("Subscription error:", err);
    } else {
      console.log("Successfully subscribed to light topic");
    }
  });

  mqttClient.subscribe("CROWmium/rtl8720dn/moisture", function (err) {
    if (err) {
      console.log("Subscription error:", err);
    } else {
      console.log("Successfully subscribed to moisture topic");
    }
  });
});

mqttClient.on("message", function (topic, message) {
  console.log(`📩 Message received:`);
  console.log(`  ➤ Topic: ${topic}`);
  console.log(`  ➤ Payload: ${message.toString()}`);
});

mqttClient.on("error", function (err) {
  console.log("MQTT connection error:", err);
});

// Start HTTP server
server.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
