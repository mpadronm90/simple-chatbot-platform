/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

admin.initializeApp();

const corsHandler = cors({origin: true});

export const setCustomClaims = functions.https.onRequest((request, response) => {
  return corsHandler(request, response, async () => {
    if (request.method !== "POST") {
      response.status(405).send("Method Not Allowed");
      return;
    }

    const {uid, customClaims} = request.body;

    if (!uid || typeof uid !== "string" || !customClaims || typeof customClaims !== "object") {
      response.status(400).send("Invalid request parameters");
      return;
    }

    try {
      await admin.auth().setCustomUserClaims(uid, customClaims);
      response.status(200).send({message: "Custom claims set successfully"});
    } catch (error) {
      console.error("Error setting custom claims:", error);
      response.status(500).send("Internal server error");
    }
  });
});

export const verifyCustomClaims = functions.https.onCall((data, context) => {
  return new Promise((resolve, reject) => {
    if (!context.auth) {
      reject(new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      ));
      return;
    }

    const {uid} = data;

    if (typeof uid !== "string") {
      reject(new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with a valid uid string."
      ));
      return;
    }

    admin.auth().getUser(uid)
      .then((userRecord) => {
        console.log("User claims:", userRecord.customClaims);
        resolve(userRecord.customClaims);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        reject(new functions.https.HttpsError(
          "internal",
          "Error fetching user data"
        ));
      });
  });
});
