import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

exports.setCustomClaims = functions.https.onCall(async (data, context) => {
  // Check if the request is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }

  const {uid, role, adminId} = data;

  // Set custom claims
  const customClaims = role === "admin" ?
    {role: "admin"} :
    {role: "user", adminId: adminId};
  await admin.auth().setCustomUserClaims(uid, customClaims);

  return {message: `Custom claims set for user ${uid}`};
});
