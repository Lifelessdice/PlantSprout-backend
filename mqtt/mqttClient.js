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
  console.log("Connected to HiveMQ");

  const topics = [
    "CROWmium/rtl8720dn/temperature",
    "CROWmium/rtl8720dn/humidity",
    "CROWmium/rtl8720dn/light",
    "CROWmium/rtl8720dn/moisture",
  ];

  topics.forEach((topic) => {
    mqttClient.subscribe(topic, function (err) {
      if (err) {
        console.log(`Subscription error on ${topic}:`, err);
      } else {
        console.log(`Subscribed to ${topic}`);
      }
    });
  });
});

mqttClient.on("message", function (topic, message) {
  // Update the relevant data when a message is received
  console.log(`Message received:`);
  console.log(`Topic: ${topic}`);
  console.log(`Payload: ${message.toString()}`);

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

module.exports = {
  mqttClient,
  mqttData,
};
