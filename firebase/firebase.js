// firebase/firebase.js
const { auth } = require("./firebaseAdmin");

async function verifyIdToken(idToken) {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // Just return uid and email, no Firestore updates here
    return { uid, email };
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Invalid ID token");
  }
}

module.exports = { verifyIdToken };
