import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const requestDoctor = functions.https.onCall(async (_data, context)=>{
  const userId = context.auth?.uid;

  const userRef = db.doc(`users/${userId}`);

  const userSnap = await userRef.get();

  // check for available doctor
  const availableDoctorRef = await db.collection("users")
      .where("role", "==", "medical")
      .where("availableSlots", ">", 0)
      .orderBy("availableSlots", "desc").limit(1).get()
      .then((doc)=>{
        if (doc.docs[0]) {
          return doc.docs[0];
        } else {
          return null;
        }
      });

  // assign user to doctor
  if (availableDoctorRef) {
    return userSnap.ref
        .update({assignedDoctor: availableDoctorRef.data().UID}).then(()=>{
          // decrement available Slots
          const newAvailableSlots = availableDoctorRef.data().availableSlots -1;
          return availableDoctorRef.ref
              .update({availableSlots: newAvailableSlots});
        });
  } else {
    return null;
  }
});
