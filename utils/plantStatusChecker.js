// utils/plantStatusChecker.js
function checkPlantConditions(plant, sensorData) {
  const results = {};

  results.temperature =
    sensorData.temperature < plant.preferredTemperature.min ||
    sensorData.temperature > plant.preferredTemperature.max
      ? "out of range"
      : "ok";

  results.humidity =
    sensorData.humidity < plant.preferredHumidity.min ||
    sensorData.humidity > plant.preferredHumidity.max
      ? "out of range"
      : "ok";

  results.light =
    sensorData.light < plant.preferredLight.min ||
    sensorData.light > plant.preferredLight.max
      ? "out of range"
      : "ok";

  results.soilMoisture =
    sensorData.moisture < plant.preferredSoilMoisture.min ||
    sensorData.moisture > plant.preferredSoilMoisture.max
      ? "out of range"
      : "ok";

  return results;
}

module.exports = { checkPlantConditions };
