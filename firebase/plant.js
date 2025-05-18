const { db } = require("./firebaseAdmin");

// Fetch all plants for a given user ID
async function getPlantsByUserId(uid) {
  try {
    // Access the 'plants' collection under the user document
    const plantsRef = db.collection("users").doc(uid).collection("plants");
    const snapshot = await plantsRef.get();

    if (snapshot.empty) {
      return []; // No plants found
    }

    const plants = [];
    snapshot.forEach(doc => {
      plants.push({ id: doc.id, ...doc.data() });  // Spread syntax fixed here too
    });
    

    return plants;
  } catch (error) {
    console.error("Error fetching plants for user:", error);
    throw new Error("Failed to fetch plants");
  }
}

module.exports = { getPlantsByUserId };
