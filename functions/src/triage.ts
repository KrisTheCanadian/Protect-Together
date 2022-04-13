import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {sendNotificationHelper, UserNotification} from "./notifications";


const db = admin.firestore();

// to be called when adding new doctor or add new slots and when I close a case
export const dispatchDoctor = functions.https.onCall( (_data)=> {
  // get doctor with available slots
  const medicalId = _data.medicalID;
  const doctorRef = db.doc(`users/${medicalId}`);

  // check for patients in need of doctor and assign to doctor id
  return db.collection("users")
      .where("role", "==", "patient")
      .where("assignedDoctor", "==", "requestedDoctor")
      .orderBy("score", "desc").limit(_data.availableSlots).get()
      .then((querySnap) => {
        const batch = db.batch();
        // assign patients
        querySnap.docs.forEach((doc)=>{
          batch.update(doc.ref, "assignedDoctor", _data.medicalID);
          batch.update(doc.ref, "doctorName", `${_data.firstName} ${_data.lastName}`);
        });
        batch.commit().then(()=>{
          const numberUpdated = querySnap.docs.length;
          const plural = numberUpdated > 1 ? "s" : "";
          // send message with number of patients assigned
          const message: UserNotification = {
            title: `New Patient${plural}`,
            message: "Your patient list has been updated",
            date: admin.firestore.Timestamp.now(),
            read: false,
            conversationID: null,
          };
          sendNotificationHelper(medicalId, message);
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
    const availableDoc = availableDoctorRef.data();
    return userSnap.ref
        .update({assignedDoctor: availableDoc.UID, doctorName: `${availableDoc.firstName} ${availableDoc.lastName}`}).then(()=>{
          // send notification to doctor
          const message: UserNotification = {
            title: "New Patient",
            message: `${userSnap.data()?.firstName} has been assigned to you`,
            date: admin.firestore.Timestamp.now(),
            read: false,
            conversationID: null,
          };
          sendNotificationHelper(availableDoc.UID, message);

          // send notification to doctor
          const patientMessage: UserNotification = {
            title: "New Doctor",
            message: `Dr. ${availableDoc.lastName} has been assigned to you`,
            date: admin.firestore.Timestamp.now(),
            read: false,
            conversationID: null,
          };
          if (userId) {
            sendNotificationHelper(userId, patientMessage);
          }

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

export const closePatientFile = functions.https.onCall(async (_data) => {
  const userId = _data.userId;
  const userRef = db.doc(`users/${userId}`);
  const userSnap = await userRef.get();
  const FieldValue = admin.firestore.FieldValue;

  return userSnap.ref.update({
    disableBook: true,
    score: FieldValue.delete(),
    basePoints: FieldValue.delete(),
    assignedDoctor: FieldValue.delete(),
    doctorName: FieldValue.delete(),
  });
});
