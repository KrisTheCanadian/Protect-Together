import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

// add new doctor, add new slots and when I close a case
export const dispatchDoctor = functions.https.onCall( (_data)=> {
  // get doctor with available slots
  const medicalId = _data.medicalID;
  const doctorRef = db.doc(`users/${medicalId}`);

  // check for patients in need of doctor and assign to doctor id
  db.collection("users")
      .where("role", "==", "patient")
      .where("assignedDoctor", "==", "requestedDoctor")
      .orderBy("score", "desc").limit(_data.availableSlots).get()
      .then((querySnap) => {
        const batch = db.batch();
        // assign patients
        querySnap.docs.forEach((doc)=>{
          batch.update(doc.ref, "assignedDoctor", _data.medicalID);
        });
        batch.commit().then(()=>{
          // adjust doctor slots
          const newFilledSlots = _data.filledSlots + querySnap.docs.length;
          const newAvailableSlots = _data.availableSlots - querySnap.docs.length;
          return doctorRef.update({availableSlots: newAvailableSlots, filledSlots: newFilledSlots});
        });
      });
});


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
          const newfilledSlots = availableDoctorRef.data().filledSlots +1;
          const newAvailableSlots = availableDoctorRef.data().patientSlots - newfilledSlots;
          return availableDoctorRef.ref
              .update({
                availableSlots: newAvailableSlots,
                filledSlots: newfilledSlots});
        });
  } else {
    return null;
  }
});
