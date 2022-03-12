import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const requestDoctor = functions.https.onCall(async (_data, context)=>{
  const userId = context.auth?.uid;

  const userRef = db.doc(`users/${userId}`);

  const userSnap = await userRef.get();

  // check for available doctor
  const availableDoctor = await db.collection("users")
      .where("role", "==", "medical")
      .where("availableSlots", ">", 0)
      .orderBy("availableSlots", "desc").limit(1).get()
      .then((doc)=>{
        if (doc.docs[0]) {
          return doc.docs[0].data();
        } else {
          return null;
        }
      });

  // assign user to doctor
  if (availableDoctor) {
    return userSnap.ref
        .update({assignedDoctor: availableDoctor.UID});
  } else {
    return null;
  }
});
