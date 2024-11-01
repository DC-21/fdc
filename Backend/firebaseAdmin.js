var admin = require("firebase-admin");
const serviceAccount = require('./farmers-e6344-firebase-adminsdk-1qesg-82e846dfba.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = {admin, db};