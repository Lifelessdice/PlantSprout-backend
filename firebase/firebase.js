const admin = require("./firebaseAdmin"); // already initialized with credentials
const auth = admin.auth();

async function verifyIdToken(idToken) {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    return { uid, email };
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Invalid ID token");
  }
}

module.exports = { verifyIdToken };
