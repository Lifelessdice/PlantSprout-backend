const mqtt = require("mqtt");

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
  console.log(`📨 Message received:`);
  console.log(`Topic: ${topic}`);
  console.log(`Payload: ${message.toString()}`);

  switch (topic) {
    case "CROWmium/rtl8720dn/temperature":
      mqttData.temperature = parseFloat(message.toString());
      break;
    case "CROWmium/rtl8720dn/humidity":
      mqttData.humidity = parseFloat(message.toString());
      break;
    case "CROWmium/rtl8720dn/light":
      mqttData.light = parseFloat(message.toString());
      break;
    case "CROWmium/rtl8720dn/moisture":
      mqttData.moisture = parseFloat(message.toString());
      break;
    default:
      break;
  }

  console.log("🌱 Updated Sensor Data:", mqttData);
});

// ✅ Publish alert function (e.g. "danger")
function publishAlert(message) {
  mqttClient.publish("CROWmium/alert", message, {}, (err) => {
    if (err) {
      console.error(" Failed to publish alert:", err);
    } else {
      console.log(` Published alert: ${message}`);
    }
  });
}

module.exports = {
  mqttClient,
  mqttData,
  publishAlert, // Export so API can use this
};
