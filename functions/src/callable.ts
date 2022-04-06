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
          batch.update(doc.ref, "doctorName", `${_data.firstName} ${_data.lastName}`);
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
    const availableDoc = availableDoctorRef.data();
    return userSnap.ref
        .update({assignedDoctor: availableDoc.UID, doctorName: `${availableDoc.firstName} ${_data.lastName}`}).then(()=>{
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

// send Notification to user
export const sendNotification = functions.https.onCall(async (_data) => {
  // get doctor with available slots
  const message: UserNotification = {
    title: _data.title,
    message: _data.message,
    date: admin.firestore.Timestamp.now(),
    read: false,
    conversationID: null,
  };
  const userId = _data.userId;
  const userRef = db.doc(`users/${userId}`);
  const userSnap = await userRef.get();

  return userSnap.ref.update({
    notifications: admin.firestore.FieldValue.arrayUnion(message),
  });
});

interface UserNotification {
  title: string;
  message: string;
  date: admin.firestore.Timestamp;
  read: boolean;
}


// send notification if user is marked as unread in conversation
export const sendNotificationForConversation = functions.https.onCall(async (_data) => {
  // get doctor with available slots
  const message: UserNotification = {
    conversationID: _data.conversationID,
    title: _data.title,
    message: _data.message,
    date: admin.firestore.Timestamp.now(),
    read: false,
  };
  const recipientID = _data.recipientID;
  const conversationID = _data.conversationID;

  // allow 2 seconds for user to mark as read
  await delay(2000);

  // check to see if user is unread in conversation
  const conversationRef = db.doc(`chats/${conversationID}`);
  const conversationDoc = await conversationRef.get();
  const conversation = conversationDoc.data();
  if (conversation && conversation.unreadUserIds && conversation.unreadUserIds.includes(recipientID)) {
    // filter out notifications that already exist for conversation
    const userRef = db.doc(`users/${recipientID}`);
    const recipientDoc = await userRef.get();
    const recipient = recipientDoc.data();
    let notifications: UserNotification[] = [];
    if (recipient && recipient.notifications) {
      // remove notifications for same conversationID
      notifications = recipient.notifications.filter((n: UserNotification) => n.conversationID !== conversationID);
    }

    // send notification
    return userRef.update({
      notifications: [...notifications, message],
    });
  }
  // or do nothing if not unread
  return null;
});

interface UserNotification {
  title: string;
  message: string;
  date: admin.firestore.Timestamp;
  read: boolean;
  conversationID: string | null;
}

// time is in milliseconds
const delay = (time:number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res("VALUE TO RESOLVE");
    }, time);
  });
};


// get availabilities from doctor

export const getDoctorAvailabilities = functions.https.onCall(async (_data, context)=>{
  const userID = context.auth?.uid;
  const userRef = db.doc(`users/${userID}`);
  const user = (await userRef.get()).data();
  if (user) {
    const doctorId = user.assignedDoctor;
    const doctorRef = db.doc(`users/${doctorId}`);
    const doctor = (await doctorRef.get()).data();
    if (doctor) {
      return doctor.availabilities;
    } else {
      return null;
    }
  } else {
    return null;
  }
});

// get appointments from doctor

export const bookAppointment = functions.https.onCall(async (_data, context)=>{
  const userID = context.auth?.uid;
  const appointment = {
    uid: userID,
    date: admin.firestore.Timestamp.fromDate(new Date(_data.appointmentDate)),
  };
  const userRef = db.doc(`users/${userID}`);
  const user = (await userRef.get()).data();
  if (user) {
    const doctorId = user.assignedDoctor;
    const appointmentRef = db.doc(`appointments/${doctorId}`);

    // check if already booked
    const appointmentData = await (await appointmentRef.get()).data();
    const existingAppointment = appointmentData && appointmentData.appointments
        .filter((bookedAppointment: { date: admin.firestore.Timestamp; })=> bookedAppointment.date == appointment.date).length !== 0;

    // if it doesn't exist save it
    if (!existingAppointment) {
      return await appointmentRef.set({
        appointments: admin.firestore.FieldValue.arrayUnion(appointment),
      }, {merge: true});
    } else {
      throw new Error("Appointment already taken, please select another");
    }
  } else {
    throw new Error("Error booking appointment");
  }
});

export const enablePatientAppointment = functions.https.onCall(async (_data) => {
  const userId = _data.userId;
  const userRef = db.doc(`users/${userId}`);
  const userSnap = await userRef.get();

  return userSnap.ref.update({
    disableBook: false,
  });
});

