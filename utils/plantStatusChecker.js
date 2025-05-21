// utils/plantStatusChecker.js

function checkPlantConditions(plant, sensorData) {
  const results = {};

  const check = (value, preferred) => {
    if (preferred?.min != null && value < preferred.min) return "low";
    if (preferred?.max != null && value > preferred.max) return "high";
    return "ok";
  };

  results.temperature = check(sensorData.temperature, plant.preferredTemperature);
  results.humidity = check(sensorData.humidity, plant.preferredHumidity);
  results.light = check(sensorData.light, plant.preferredLight);
  results.soilMoisture = check(sensorData.moisture, plant.preferredSoilMoisture);

  return results;
}

module.exports = { checkPlantConditions };
