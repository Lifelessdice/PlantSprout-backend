const admin = require("firebase-admin");

// Parse your service account JSON from environment variable
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

// Initialize Firebase Admin SDK with service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Get Firestore instance from admin SDK
const db = admin.firestore();

// Export Firestore instance for use in other files
module.exports = db;
